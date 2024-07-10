package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getClassroom

case class AdminGetClassroomMessagePlanner(
                                         classroomID: Int,
                                         override val planContext: PlanContext
                                       ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getClassroom(classroomID)
  }
}
