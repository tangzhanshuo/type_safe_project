package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.{Json, JsonObject}

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
              val (updatedApproverJson, wasUpdated) = updateApprover(approverJson)
              println(s"Updated JSON: ${updatedApproverJson.noSpaces}")
              println(s"Was Updated: $wasUpdated")
              if (wasUpdated) {
                val updateQuery = """
                  UPDATE application
                  SET approver = ?
                  WHERE applicationID = ?
                """
                val params = List(
                  SqlParameter("jsonb", updatedApproverJson.noSpaces),
                  SqlParameter("string", applicationID)
                )
                writeDB(updateQuery, params).map { _ =>
                  "Application approved successfully"
                }
              } else {
                IO.pure("No matching approver found to update")
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
        val (updatedApprovers, wasUpdated) = approvers.foldLeft((Vector.empty[Json], false)) {
          case ((acc, true), approver) => (acc :+ approver, true)
          case ((acc, false), approver) =>
            println(s"Checking approver: ${approver.noSpaces}")
            println(s"Matches exactly: ${matchesApproverExactly(approver)}")
            println(s"Matches loosely: ${matchesApproverLoosely(approver)}")
            if (matchesApproverExactly(approver) || matchesApproverLoosely(approver)) {
              (acc :+ updateApproverElement(approver), true)
            } else {
              (acc :+ approver, false)
            }
        }
        (Json.fromValues(updatedApprovers), wasUpdated)
      case None =>
        println("Approver JSON is not an array")
        (approverJson, false)
    }
  }

  private def matchesApproverExactly(approver: Json): Boolean = {
    val cursor = approver.hcursor
    val matchesUsertype = cursor.get[String]("usertype").toOption.contains(usertype)
    val matchesUsername = cursor.get[String]("username").toOption.contains(username)
    val isNotApproved = cursor.get[Boolean]("approved").toOption.contains(false)
    println(s"Exact match - usertype: $matchesUsertype, username: $matchesUsername, not approved: $isNotApproved")
    matchesUsertype && matchesUsername && isNotApproved
  }

  private def matchesApproverLoosely(approver: Json): Boolean = {
    val cursor = approver.hcursor
    val matchesUsertype = cursor.get[String]("usertype").toOption.contains(usertype)
    val hasEmptyUsername = cursor.get[String]("username").toOption.forall(_.isEmpty)
    val isNotApproved = cursor.get[Boolean]("approved").toOption.contains(false)
    println(s"Loose match - usertype: $matchesUsertype, empty username: $hasEmptyUsername, not approved: $isNotApproved")
    matchesUsertype && hasEmptyUsername && isNotApproved
  }

  private def updateApproverElement(approver: Json): Json = {
    val updated = approver.mapObject { obj =>
      obj
        .add("username", Json.fromString(username))
        .add("approved", Json.fromBoolean(true))
    }
    println(s"Updated approver: ${updated.noSpaces}")
    updated
  }
}