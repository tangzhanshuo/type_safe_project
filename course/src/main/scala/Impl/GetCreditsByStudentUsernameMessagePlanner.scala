package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetCreditsByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[Int] {
  override def plan(using planContext: PlanContext): IO[Int] = {
    val query = """
      SELECT credits, all_students FROM course 
      WHERE all_students @> ?::jsonb
    """
    val searchJson = Json.obj("studentUsername" -> Json.fromString(studentUsername)).noSpaces

    readDBRows(query, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      val totalCredits = rows.foldLeft(0) { (acc, row) =>
        val credits = row.hcursor.get[Int]("credits").getOrElse(0)
        acc + credits
      }
      IO.pure(totalCredits)
    }
  }
}
