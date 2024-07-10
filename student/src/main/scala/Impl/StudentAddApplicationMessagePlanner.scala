package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.addApplication
import cats.effect.IO

case class StudentAddApplicationMessagePlanner(
                                              usertype: String,
                                              username: String,
                                              applicationType: String,
                                              info: String,
                                              approver: String,
                                              override val planContext: PlanContext
                                            ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    addApplication(usertype, username, applicationType, info, approver)
  }
}