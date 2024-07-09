package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetCoursesByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM course WHERE enrolledstudents @> ?::jsonb"
    readDBRows(query, List(SqlParameter("json", s"""["$studentUsername"]"""))).map { rows =>
      rows match {
        case Nil => throw new NoSuchElementException(s"No courses found with student username: $studentUsername")
        case _ => rows.asJson.noSpaces
      }
    }
  }
}
