package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourse

case class AdminGetCourseMessagePlanner(
                                         courseID: Int,
                                         override val planContext: PlanContext
                                       ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCourse(courseID)
  }
}
