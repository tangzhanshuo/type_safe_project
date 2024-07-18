package Impl

import Common.API.{PlanContext, Planner}
import Common.ApplicationAPI.getApplicationByApprover
import Common.Object.Application
import cats.effect.IO

case class TeacherGetApplicationFromApproverMessagePlanner(
                                                          usertype: String,
                                                          username: String,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[List[Application]] {
  override def plan(using planContext: PlanContext): IO[List[Application]] = {
    getApplicationByApprover(usertype, username)
  }
}