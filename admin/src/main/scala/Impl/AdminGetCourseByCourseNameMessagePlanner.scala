package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Course

case class AdminGetCourseByCourseNameMessagePlanner(
                                                          courseName: String,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[List[Course]] {
  override def plan(using planContext: PlanContext): IO[List[Course]] = {
    getCourseByCourseName(courseName)
  }
}