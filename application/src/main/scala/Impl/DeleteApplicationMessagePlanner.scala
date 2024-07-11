package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.{Json, JsonObject}
import io.circe.syntax.*

import java.util.UUID

case class DeleteApplicationMessagePlanner(
                                            usertype: String,
                                            username: String,
                                            applicationID: String,
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    if (usertype == "admin") {
      // If usertype is admin, delete without checking username
      writeDB("DELETE FROM application WHERE applicationID = ?",
        List(SqlParameter("string", applicationID)))
        .map(_ => applicationID)
    } else {
      // For non-admin users, check if the application belongs to them before deleting
      for {
        // First, check if the application exists and belongs to the user
        checkResult <- readDBRows(
          """
          SELECT COUNT(*) as count 
          FROM application 
          WHERE applicationID = ? AND usertype = ? AND username = ?
          """,
          List(
            SqlParameter("string", applicationID),
            SqlParameter("string", usertype),
            SqlParameter("string", username)
          )
        )
        count <- IO.fromOption(checkResult.headOption.flatMap(json => json.hcursor.get[Int]("count").toOption))(
          new Exception("Failed to retrieve count from database")
        )
        result <- if (count > 0) {
          // If the application exists and belongs to the user, delete it
          writeDB("DELETE FROM application WHERE applicationID = ?",
            List(SqlParameter("string", applicationID)))
            .map(_ => applicationID)
        } else {
          // If the application doesn't exist or doesn't belong to the user, return an error
          IO.raiseError(new Exception("Application not found or you don't have permission to delete it"))
        }
      } yield result
    }
  }
}