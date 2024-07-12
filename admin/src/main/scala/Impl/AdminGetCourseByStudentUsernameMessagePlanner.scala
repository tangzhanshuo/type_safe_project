package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByStudentUsername

case class AdminGetCourseByStudentUsernameMessagePlanner(
                                                 studentUsername: String,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCourseByStudentUsername(studentUsername)
  }
}
