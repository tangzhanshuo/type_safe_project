package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetCourseByTeacherUsernameMessagePlanner(teacherUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM course WHERE teacherusername = ?"
    readDBRows(query, List(SqlParameter("string", teacherUsername))).map { rows =>
      if (rows.nonEmpty) {
        rows.asJson.noSpaces
      } else {
        throw new NoSuchElementException(s"No courses found with teacherusername: $teacherUsername")
      }
    }
  }
}
