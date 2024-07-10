package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.approveApplication

case class AdminApproveApplicationMessagePlanner(
                                           usertype: String,
                                           username: String,
                                           applicationID: String,
                                           override val planContext: PlanContext
                                         ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    approveApplication(usertype, username, applicationID)
  }
}