package Impl

import cats.effect.IO
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Classroom

case class AdminGetAvailableClassroomByCapacityHourMessagePlanner(
                                                                   capacity: Int,
                                                                   courseHourJson: String,// JSON represented as String
                                                                   override val planContext: PlanContext
                                                                 ) extends Planner[List[Classroom]] {
  override def plan(using planContext: PlanContext): IO[List[Classroom]] = {
    val courseHour = decode[List[Int]](courseHourJson).getOrElse(Nil)
    getAvailableClassroomByCapacityHour(capacity, courseHour)
  }
}