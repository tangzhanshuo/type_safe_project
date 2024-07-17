package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.*

case class AdminGetPlanListMessagePlanner(
                                       override val planContext: PlanContext
                                     ) extends Planner[List[Plan]] {
  override def plan(using planContext: PlanContext): IO[List[Plan]] = {
    getPlanList()
  }
}