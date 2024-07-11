package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addStudent2Course

case class StudentAddCourseMessagePlanner(username: String, courseID: Int, priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    addStudent2Course(courseID, Some(username), priority)
  }
}
