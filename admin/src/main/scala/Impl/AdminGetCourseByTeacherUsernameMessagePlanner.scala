package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Course

case class AdminGetCourseByTeacherUsernameMessagePlanner(
                                                          teacherUsername: String,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[List[Course]] {
  override def plan(using planContext: PlanContext): IO[List[Course]] = {
    getCourseByTeacherUsername(teacherUsername).flatMap {
      case Some(courses) => IO.pure(courses)
      case None => IO.pure(List.empty[Course])
    }
  }
}

