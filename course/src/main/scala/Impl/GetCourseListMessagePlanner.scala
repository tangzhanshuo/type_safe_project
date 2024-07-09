package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import io.circe.syntax.*

case class GetCourseListMessagePlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = "SELECT * FROM course ORDER BY courseid"
    readDBRows(query, List()).map { rows =>
      if (rows.isEmpty) throw new NoSuchElementException(s"No courses found")
      else rows.asJson.noSpaces
    }
  }
}
