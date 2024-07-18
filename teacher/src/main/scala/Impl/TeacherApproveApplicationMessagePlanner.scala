package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.approveApplication
import cats.effect.IO

case class TeacherApproveApplicationMessagePlanner(
                                           usertype: String,
                                           username: String,
                                           applicationID: String,
                                           override val planContext: PlanContext
                                         ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    approveApplication(usertype, username, applicationID)
  }
}