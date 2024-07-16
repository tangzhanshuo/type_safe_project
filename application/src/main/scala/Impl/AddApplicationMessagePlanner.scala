package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{SqlParameter, Application, Approver}
import java.util.UUID

case class AddApplicationMessagePlanner(
                                         application: Application,
                                         override val planContext: PlanContext
                                       ) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    val infoJsonValidation = parse(application.info).left.map(e => new Exception(s"Invalid JSON for info: ${e.getMessage}"))

    infoJsonValidation match {
      case Right(_) =>
        writeDB(
          s"""
             |INSERT INTO application (
             |  applicationID, usertype, username, applicationType, info, approver, status
             |) VALUES (?, ?, ?, ?, ?, ?, ?)
               """.stripMargin,
          List(
            SqlParameter("string", application.applicationID),
            SqlParameter("string", application.usertype),
            SqlParameter("string", application.username),
            SqlParameter("string", application.applicationType),
            SqlParameter("jsonb", application.info),
            SqlParameter("jsonb", application.approver.asJson.noSpaces),
            SqlParameter("string", application.status)
          )
        ).map(_ => application)

      case Left(error) => IO.raiseError(error)
    }
  }
}