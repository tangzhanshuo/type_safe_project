package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApplicant
import Common.Object.Application
import cats.effect.IO

case class StudentGetApplicationFromApplicantMessagePlanner(
                                                           usertype: String,
                                                           username: String,
                                                           override val planContext: PlanContext
                                                         ) extends Planner[List[Application]] {
  override def plan(using planContext: PlanContext): IO[List[Application]] = {
    getApplicationByApplicant(usertype, username)
  }
}