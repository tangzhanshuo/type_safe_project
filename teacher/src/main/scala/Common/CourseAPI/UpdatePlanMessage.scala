package Common.CourseAPI

import Common.API.{API, PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.*
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*

case class UpdatePlanMessage(
                              planid: Int,
                              planName: Option[String],
                              creditsLimits: Option[Map[Int, CreditsLimits]],
                              priority: Option[Map[Int, Map[Int, Int]]]
                            ) extends API[Plan](courseServiceCode)