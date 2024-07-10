package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*

import java.util.UUID

case class GetApplicationByIDMessagePlanner(
                                       applicationID: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM application WHERE applicationID = ?"
    readDBRows(query, List(SqlParameter("string", applicationID))).map { rows =>
      rows.headOption match {
        case Some(row) => row.noSpaces
        case None => throw new NoSuchElementException(s"No applications found with ID: $applicationID")
      }
    }
  }
}
