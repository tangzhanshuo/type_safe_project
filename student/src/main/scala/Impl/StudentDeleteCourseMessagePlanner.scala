package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.{addStudent2Course, deleteStudentFromCourse}
import cats.effect.IO

case class StudentDeleteCourseMessagePlanner(username: String, courseID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteStudentFromCourse(courseID, Some(username))
  }
}
