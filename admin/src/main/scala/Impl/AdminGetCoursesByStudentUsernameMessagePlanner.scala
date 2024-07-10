package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCoursesByStudentUsername

case class AdminGetCoursesByStudentUsernameMessagePlanner(
                                                 studentUsername: String,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCoursesByStudentUsername(studentUsername)
  }
}
