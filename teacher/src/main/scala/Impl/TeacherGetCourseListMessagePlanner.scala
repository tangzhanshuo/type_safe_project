package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByTeacherUsername
import Common.DBAPI.writeDB
import Common.Object.*
import cats.effect.IO
import io.circe.Json

import scala.util.Random

case class TeacherGetCourseListMessagePlanner(usertype: String,
                                              username: String,
                                              override val planContext: PlanContext) extends Planner[List[Course]] {
  override def plan(using planContext: PlanContext): IO[List[Course]] = {
    getCourseByTeacherUsername(username).flatMap {
      case Some(courses) => IO.pure(courses)
      case None => IO.pure(List.empty[Course])
    }
  }
}
