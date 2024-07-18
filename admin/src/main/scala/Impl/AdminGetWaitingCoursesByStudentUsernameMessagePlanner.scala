package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.WaitingCourse

case class AdminGetWaitingCoursesByStudentUsernameMessagePlanner(
                                                                  studentUsername: String,
                                                                  override val planContext: PlanContext
                                                                ) extends Planner[List[WaitingCourse]] {
  override def plan(using planContext: PlanContext): IO[List[WaitingCourse]] = {
    getWaitingCoursesByStudentUsername(studentUsername).flatMap {
      case Some(courses) => IO.pure(courses)
      case None => IO.pure(List.empty[WaitingCourse])
    }
  }
}
