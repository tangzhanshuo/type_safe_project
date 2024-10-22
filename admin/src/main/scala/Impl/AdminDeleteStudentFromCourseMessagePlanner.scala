package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.deleteStudentFromCourse

case class AdminDeleteStudentFromCourseMessagePlanner(
                                                 courseid: Int,
                                                 studentUsername: String,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteStudentFromCourse(courseid, Some(studentUsername))
  }
}
