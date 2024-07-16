package Common.CourseAPI

import Common.API.{API, PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.*
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*

case class GetPriorityByPlanIDYearCourseIDMessage(
                                                   planid: Int,
                                                   year: Int,
                                                   courseid: Int
                                                 ) extends API[Int](courseServiceCode)