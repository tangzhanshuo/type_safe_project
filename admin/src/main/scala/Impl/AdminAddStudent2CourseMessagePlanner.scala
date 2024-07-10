package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addStudent2Course

case class AdminAddStudent2CourseMessagePlanner(
                                                 courseID: Int,
                                                 studentUsername: String,
                                                 priority: Int,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    addStudent2Course(courseID, Some(studentUsername), Some(priority))
  }
}
