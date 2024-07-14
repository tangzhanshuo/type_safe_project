package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.{Json, JsonObject}

case class RejectApplicationMessagePlanner(
                                            applicationID: String,
                                            usertype: String,
                                            username: String,
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val selectRowQuery = """
      SELECT approver, status
      FROM application
      WHERE applicationID = ?
    """

    readDBRows(selectRowQuery, List(SqlParameter("string", applicationID))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          parse(row.noSpaces).flatMap { json =>
            println(s"Parsed JSON: ${json.noSpaces}")
            for {
              approverJson <- json.hcursor.get[String]("approver").flatMap(parse)
              status <- json.hcursor.get[String]("status")
            } yield (approverJson, status)
          } match {
            case Right((approverJson, status)) =>
              if (status != "pending") {
                IO.pure(s"Cannot reject application. Current status: $status")
              } else {
                findMatchingApprover(approverJson) match {
                  case true =>
                    val updateStatusQuery =
                      """
                        UPDATE application
                        SET status = ?
                        WHERE applicationID = ?
                      """
                    val updateStatusParams = List(
                      SqlParameter("string", "rejected"),
                      SqlParameter("string", applicationID)
                    )
                    writeDB(updateStatusQuery, updateStatusParams).map(_ =>
                      "Application rejected successfully"
                    )
                  case false =>
                    IO.pure("No update performed: No matching approver found")
                }
              }
            case Left(error) => IO.raiseError(new Exception(s"Error processing JSON: ${error.getMessage}"))
          }
        case None => IO.raiseError(new Exception(s"Application with ID $applicationID not found"))
      }
    }
  }

  private def findMatchingApprover(approverJson: Json): Boolean = {
    approverJson.asArray match {
      case Some(approvers) =>
        println(s"Approvers: ${approvers.map(_.noSpaces).mkString(", ")}")
        approvers.exists(matchesApproverExactly) || approvers.exists(matchesApproverLoosely)
      case None =>
        println("Approver JSON is not an array")
        false
    }
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
}