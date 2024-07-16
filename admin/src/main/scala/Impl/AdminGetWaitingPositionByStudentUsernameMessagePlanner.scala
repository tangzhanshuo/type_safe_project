package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.CourseWaitingPosition

case class AdminGetWaitingPositionByStudentUsernameMessagePlanner(
                                                                   studentUsername: String,
                                                                   override val planContext: PlanContext
                                                                 ) extends Planner[List[CourseWaitingPosition]] {
  override def plan(using planContext: PlanContext): IO[List[CourseWaitingPosition]] = {
    getWaitingPositionByStudentUsername(studentUsername)
  }
}