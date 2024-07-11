package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.deleteApplication
import cats.effect.IO

case class StudentDeleteApplicationMessagePlanner(
                                              usertype: String,
                                              username: String,
                                              applicationID: String,
                                              override val planContext: PlanContext
                                            ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    deleteApplication(usertype, username, applicationID)
  }
}