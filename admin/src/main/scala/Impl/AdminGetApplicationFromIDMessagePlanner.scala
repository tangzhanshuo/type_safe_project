package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByID
import Common.Object.Application

case class AdminGetApplicationFromIDMessagePlanner(
                                                    applicationID: String,
                                                    override val planContext: PlanContext
                                                  ) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    getApplicationByID(applicationID)
  }
}