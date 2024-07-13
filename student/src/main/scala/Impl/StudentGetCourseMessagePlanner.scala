package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourse
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCourseMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
      getCourse(courseID)
  }