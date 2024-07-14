package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetCreditsByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = """
      SELECT credits, allstudents FROM course 
      WHERE allstudents @> ?::jsonb
    """
    val searchJson = Json.obj("studentusername" -> Json.fromString(studentUsername)).noSpaces

    readDBRows(query, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      val totalCredits = rows.foldLeft(0) { (acc, row) =>
        val credits = row.hcursor.get[Int]("credits").getOrElse(0)
        acc + credits
      }
      IO.pure(totalCredits.toString)
    }
  }
}
