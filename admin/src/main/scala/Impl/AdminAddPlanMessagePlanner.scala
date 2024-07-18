package Impl

import Common.API.{PlanContext, Planner}
import Common.Object.{Plan, CreditsLimits}
import cats.effect.IO
import io.circe.generic.auto.*
import Common.CourseAPI.*
import io.circe.syntax.*
import io.circe.parser.decode

case class AdminAddPlanMessagePlanner(
                                       planid: Int,
                                       planName: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    val defaultPriority: Map[Int, Map[Int, Int]] = AdminAddPlanMessagePlanner.defaultPriority
    val defaultCreditsLimits: Map[Int, CreditsLimits] = AdminAddPlanMessagePlanner.defaultCreditsLimits

    val plan = Plan(
      planid = planid,
      planName = planName,
      creditsLimits = defaultCreditsLimits,
      priority = defaultPriority
    )
    addPlan(plan).map(_ => plan)
  }

  object AdminAddPlanMessagePlanner {
    val defaultPriority: Map[Int, Map[Int, Int]] = Map.empty[Int, Map[Int, Int]]
    val defaultCreditsLimits: Map[Int, CreditsLimits] = Map(
      1 -> CreditsLimits(6, 26),
      2 -> CreditsLimits(6, 26),
      3 -> CreditsLimits(6, 30),
      4 -> CreditsLimits(6, 114514)
    )
  }
}
