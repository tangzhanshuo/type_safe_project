package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.{getCourseByCourseID}
import Common.DBAPI.writeDB
import Common.Object.*
import cats.effect.IO
import io.circe.Json

import scala.util.Random

case class TeacherGetCourseMessagePlanner(
                                          courseID: Int,
                                          override val planContext: PlanContext) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    getCourseByCourseID(courseID)
  }
}
