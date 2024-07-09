package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseList

case class AdminGetCourseListMessagePlanner(
                                         override val planContext: PlanContext
                                       ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCourseList()
  }
}