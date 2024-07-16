package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{SqlParameter, Application, Approver}
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.{parse, decode}
import io.circe.syntax.*

import java.util.UUID

case class GetApplicationByIDMessagePlanner(
                                             applicationID: String,
                                             override val planContext: PlanContext
                                           ) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    val query = "SELECT * FROM application WHERE applicationID = ?"
    readDBRows(query, List(SqlParameter("string", applicationID))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val cursor = row.hcursor
          val applicationIO = for {
            applicationID <- cursor.get[String]("applicationid").toOption.toRight(new Exception("Missing applicationid"))
            usertype <- cursor.get[String]("usertype").toOption.toRight(new Exception("Missing usertype"))
            username <- cursor.get[String]("username").toOption.toRight(new Exception("Missing username"))
            applicationType <- cursor.get[String]("applicationtype").toOption.toRight(new Exception("Missing applicationtype"))
            info <- cursor.get[String]("info").toOption.toRight(new Exception("Missing info"))
            approverStr <- cursor.get[String]("approver").toOption.toRight(new Exception("Missing approver"))
            approver <- decode[List[Approver]](approverStr).left.map(e => new Exception(s"Invalid JSON for approver: ${e.getMessage}"))
            status <- cursor.get[String]("status").toOption.toRight(new Exception("Missing status"))
          } yield Application(applicationID, usertype, username, applicationType, info, approver, status)

          IO.fromEither(applicationIO)

        case None => IO.raiseError(new NoSuchElementException(s"No applications found with ID: $applicationID"))
      }
    }
  }
}