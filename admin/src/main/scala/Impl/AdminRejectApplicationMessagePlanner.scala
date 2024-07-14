package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.rejectApplication
import cats.effect.IO

case class AdminRejectApplicationMessagePlanner(
                                           usertype: String,
                                           username: String,
                                           applicationID: String,
                                           override val planContext: PlanContext
                                         ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    rejectApplication(usertype, username, applicationID)
  }
}