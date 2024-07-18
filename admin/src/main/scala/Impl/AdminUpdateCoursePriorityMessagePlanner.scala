package Impl

import cats.effect.IO
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import Common.Object.Plan
import io.circe.generic.auto._

case class AdminUpdateCoursePriorityMessagePlanner(
                                                    planid: Int,
                                                    year: Int,
                                                    courseid: Int,
                                                    priority: Int,
                                                    override val planContext: PlanContext
                                                  ) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    updateCoursePriority(planid, year, courseid, priority)
  }
}
