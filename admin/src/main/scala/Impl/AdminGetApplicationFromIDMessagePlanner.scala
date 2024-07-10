package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByID

case class AdminGetApplicationFromIDMessagePlanner(
                                                    applicationID: String,
                                                    override val planContext: PlanContext
                                                  ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getApplicationByID(applicationID)
  }
}