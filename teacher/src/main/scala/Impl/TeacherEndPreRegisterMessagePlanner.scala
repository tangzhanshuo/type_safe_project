package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.{endPreRegister, getCourseByCourseID}
import Common.DBAPI.writeDB
import Common.Object.*
import cats.effect.IO
import io.circe.Json

import scala.util.Random

case class TeacherEndPreRegisterMessagePlanner(
                                          courseID: Int,
                                          override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    endPreRegister(courseID)
  }
}
