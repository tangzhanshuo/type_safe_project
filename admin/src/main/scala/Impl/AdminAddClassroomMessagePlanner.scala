package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addClassroom

case class AdminAddClassroomMessagePlanner(
                                            classroomID: Int,
                                            classroomName: String,
                                            capacity: Int,
                                            enrolledCoursesJson: String, // JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    addClassroom(classroomID, classroomName, capacity, enrolledCoursesJson)
  }
}