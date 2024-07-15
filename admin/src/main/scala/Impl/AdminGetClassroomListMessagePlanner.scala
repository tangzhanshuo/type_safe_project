package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Classroom

case class AdminGetClassroomListMessagePlanner(
                                                override val planContext: PlanContext
                                              ) extends Planner[List[Classroom]] {
  override def plan(using planContext: PlanContext): IO[List[Classroom]] = {
    getClassroomList()
  }
}