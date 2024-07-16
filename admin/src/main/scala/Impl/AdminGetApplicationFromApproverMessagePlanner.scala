package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApprover
import Common.Object.Application

case class AdminGetApplicationFromApproverMessagePlanner(
                                                          usertype: String,
                                                          username: String,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[List[Application]] {
  override def plan(using planContext: PlanContext): IO[List[Application]] = {
    getApplicationByApprover(usertype, username)
  }
}