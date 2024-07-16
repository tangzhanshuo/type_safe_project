package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.reorderStudentsByCourseID

case class AdminReorderStudentsByCourseIDMessagePlanner (
                                                     courseid: Int,
                                                     override val planContext: PlanContext
                                                   ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    reorderStudentsByCourseID(courseid)
  }
}
