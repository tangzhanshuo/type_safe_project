package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.deleteClassroom

case class AdminDeleteClassroomMessagePlanner(
                                            classroomid: Int, // JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteClassroom(classroomid)
  }
}