package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.*

case class AdminGetPlanMessagePlanner(
                                         planid: Int,
                                         override val planContext: PlanContext
                                       ) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    getPlan(planid)
  }
}