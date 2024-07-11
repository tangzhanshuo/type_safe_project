package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.deleteApplication

case class AdminDeleteApplicationMessagePlanner(
                                                 usertype: String,
                                                 username: String,
                                                 applicationID: String,
                                                 override val planContext: PlanContext
                                               ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteApplication(usertype, username, applicationID)
  }
}