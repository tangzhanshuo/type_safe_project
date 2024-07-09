package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getAvailableClassroomByCapacityHour

case class AdminGetAvailableClassroomByCapacityHourMessagePlanner(
                                            capacity: Int,
                                            courseHourJson: String,// JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    getAvailableClassroomByCapacityHour(capacity, courseHourJson)
  }
}