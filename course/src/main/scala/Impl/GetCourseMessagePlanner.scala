package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetCourseMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM course WHERE course_ID = ?"
    readDBRows(query, List(SqlParameter("int", courseID.toString))).map { rows =>
      rows.headOption match {
        case Some(row) => row.noSpaces
        case None => throw new NoSuchElementException(s"No course found with course_ID: $courseID")
      }
    }
  }
}
