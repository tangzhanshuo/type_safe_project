package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.{addApplication}
import Common.Object.Application

case class AdminAddApplicationMessagePlanner(
                                              usertype: String,
                                              username: String,
                                              applicationType: String,
                                              info: String,
                                              approver: String,
                                              override val planContext: PlanContext
                                            ) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    val application = Application.create(usertype, username, "a")
    addApplication(application)
  }
}