package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.forceAddStudent2Course

case class AdminForceAddStudent2CourseMessagePlanner(
                                                 courseid: Int,
                                                 studentUsername: String,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    forceAddStudent2Course(courseid, Some(studentUsername))
  }
}
