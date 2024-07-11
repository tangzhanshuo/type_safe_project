package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.{Json, JsonObject}
import Impl.ApplicationExecutor.executeApplication

case class ApproveApplicationMessagePlanner(
                                             applicationID: String,
                                             usertype: String,
                                             username: String,
                                             override val planContext: PlanContext
                                           ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val selectRowQuery = """
      SELECT approver
      FROM application
      WHERE applicationID = ?
    """

    readDBRows(selectRowQuery, List(SqlParameter("string", applicationID))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          parse(row.noSpaces).flatMap { json =>
            println(s"Parsed JSON: ${json.noSpaces}")
            json.hcursor.get[String]("approver").flatMap(parse)
          } match {
            case Right(approverJson) =>
              updateApprover(approverJson) match {
                case (updatedApproverJson, true) =>
                  println(s"Updated JSON: ${updatedApproverJson.noSpaces}")
                  val updateQuery = """
                    UPDATE application
                    SET approver = ?
                    WHERE applicationID = ?
                  """
                  val params = List(
                    SqlParameter("jsonb", updatedApproverJson.noSpaces),
                    SqlParameter("string", applicationID)
                  )
                  writeDB(updateQuery, params).flatMap { _ =>
                    if (checkAllApproved(updatedApproverJson)) {
                      executeApplication(applicationID).map(_ => "Application approved and executed successfully")
                    } else {
                      IO.pure("Application approved successfully")
                    }
                  }
                case (_, false) =>
                  IO.pure("No update performed: Either already approved or no matching approver found")
              }
            case Left(error) => IO.raiseError(new Exception(s"Error processing JSON: ${error.getMessage}"))
          }
        case None => IO.raiseError(new Exception(s"Application with ID $applicationID not found"))
      }
    }
  }

  private def updateApprover(approverJson: Json): (Json, Boolean) = {
    approverJson.asArray match {
      case Some(approvers) =>
        println(s"Approvers: ${approvers.map(_.noSpaces).mkString(", ")}")
        if (approvers.exists(alreadyApproved)) {
          println("User has already approved")
          (approverJson, false)
        } else {
          val matchingApprover = approvers.find(matchesApproverExactly)
            .orElse(approvers.find(matchesApproverLoosely))

          matchingApprover match {
            case Some(approver) =>
              val updatedApprovers = approvers.map { a =>
                if (a == approver) updateApproverElement(a) else a
              }
              (Json.fromValues(updatedApprovers), true)
            case None =>
              println("No matching approver found")
              (approverJson, false)
          }
        }
      case None =>
        println("Approver JSON is not an array")
        (approverJson, false)
    }
  }

  private def alreadyApproved(approver: Json): Boolean = {
    val cursor = approver.hcursor
    cursor.get[String]("usertype").toOption.contains(usertype) &&
      cursor.get[String]("username").toOption.contains(username) &&
      cursor.get[Boolean]("approved").toOption.contains(true)
  }

  private def matchesApproverExactly(approver: Json): Boolean = {
    val cursor = approver.hcursor
    cursor.get[String]("usertype").toOption.contains(usertype) &&
      cursor.get[String]("username").toOption.contains(username) &&
      cursor.get[Boolean]("approved").toOption.contains(false)
  }

  private def matchesApproverLoosely(approver: Json): Boolean = {
    val cursor = approver.hcursor
    cursor.get[String]("usertype").toOption.contains(usertype) &&
      cursor.get[String]("username").toOption.exists(_.isEmpty) &&
      cursor.get[Boolean]("approved").toOption.contains(false)
  }

  private def updateApproverElement(approver: Json): Json = {
    approver.mapObject { obj =>
      obj
        .add("username", Json.fromString(username))
        .add("approved", Json.fromBoolean(true))
    }
  }

  private def checkAllApproved(approverJson: Json): Boolean = {
    approverJson.asArray.exists { approvers =>
      approvers.forall { approver =>
        approver.hcursor.get[Boolean]("approved").getOrElse(false)
      }
    }
  }
}