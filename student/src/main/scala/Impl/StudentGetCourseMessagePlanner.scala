package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByCourseID
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCourseMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[Course]:
  override def plan(using PlanContext): IO[Course] = {
      getCourseByCourseID(courseID)
  }