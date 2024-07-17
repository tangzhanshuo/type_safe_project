package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Course

case class AdminGetCourseByCourseIDMessagePlanner(
                                         courseid: Int,
                                         override val planContext: PlanContext
                                       ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    getCourseByCourseID(courseid)
  }
}