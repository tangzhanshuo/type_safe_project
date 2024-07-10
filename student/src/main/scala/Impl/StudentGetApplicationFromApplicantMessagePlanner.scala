package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApplicant
import cats.effect.IO

case class StudentGetApplicationFromApplicantMessagePlanner(
                                                           usertype: String,
                                                           username: String,
                                                           override val planContext: PlanContext
                                                         ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getApplicationByApplicant(usertype, username)
  }
}