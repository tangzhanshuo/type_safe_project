package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.SqlParameter
import Common.CourseAPI.{addCourse, getCourse}

case class UserGetCourseMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCourse(courseID)
  }
}