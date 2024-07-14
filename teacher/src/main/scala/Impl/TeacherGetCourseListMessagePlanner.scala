package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByTeacherUsername
import Common.DBAPI.writeDB
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json

import scala.util.Random

case class TeacherGetCourseListMessagePlanner(usertype: String,
                                              username: String,
                                              override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getCourseByTeacherUsername(username)
  }
}