package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByStudentUsername
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCourseByUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[Option[List[Course]]]:
  override def plan(using PlanContext): IO[Option[List[Course]]] = {
    getCourseByStudentUsername(studentUsername)
  }