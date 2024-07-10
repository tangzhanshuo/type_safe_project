package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApprover

case class AdminGetApplicationFromApproverMessagePlanner(
                                                          usertype: String,
                                                          username: String,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getApplicationByApprover(usertype, username)
  }
}