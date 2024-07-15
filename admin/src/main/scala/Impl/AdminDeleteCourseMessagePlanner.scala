package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.deleteCourse

case class AdminDeleteCourseMessagePlanner(
                                            courseid: Int,
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteCourse(courseid)
  }
}
