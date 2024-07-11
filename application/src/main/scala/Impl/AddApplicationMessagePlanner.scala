package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import java.util.UUID

case class AddApplicationMessagePlanner(
                                       usertype: String,
                                       username: String,
                                       applicationType: String,
                                       info: String,
                                       approver: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val infoJsonValidation = parse(info).left.map(e => new Exception(s"Invalid JSON for info: ${e.getMessage}"))
    val approverJsonValidation = parse(approver).left.map(e => new Exception(s"Invalid JSON for approver: ${e.getMessage}"))

    (infoJsonValidation, approverJsonValidation) match {
      case (Right(_), Right(_)) =>
        // Proceed with DB operation if both JSON strings are valid
        val applicationID = UUID.randomUUID().toString
        println(approver)
        writeDB(
          s"""
             |INSERT INTO application (
             |  applicationID, usertype, username, applicationType, info, approver, completed
             |) VALUES (?, ?, ?, ?, ?, ?, ?)
               """.stripMargin,
          List(
            SqlParameter("string", applicationID),
            SqlParameter("string", usertype),
            SqlParameter("string", username),
            SqlParameter("string", applicationType),
            SqlParameter("jsonb", info),
            SqlParameter("jsonb", approver),
            SqlParameter("boolean", "false")
          )
        ).map(_ => applicationID)

      case (Left(error), _) => IO.raiseError(error)
      case (_, Left(error)) => IO.raiseError(error)
    }
  }
}
