package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApplicant

case class AdminGetApplicationFromApplicantMessagePlanner(
                                                           usertype: String,
                                                           username: String,
                                                           override val planContext: PlanContext
                                                         ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getApplicationByApplicant(usertype, username)
  }
}