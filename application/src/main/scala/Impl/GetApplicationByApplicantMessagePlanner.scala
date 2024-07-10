package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*

import java.util.UUID

case class GetApplicationByApplicantMessagePlanner(
                                       usertype: String,
                                       username: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM application WHERE usertype = ? AND username = ?"
    readDBRows(query, List(SqlParameter("string", usertype), SqlParameter("string", username))).map { rows =>
      if (rows.isEmpty) throw new NoSuchElementException(s"No application found")
      else rows.asJson.noSpaces
    }
  }
}