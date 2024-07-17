package Common.CourseAPI

import Common.API.API
import Common.Object._
import Global.ServiceCenter.courseServiceCode
import io.circe.Json

case class GetPlanMessage(planid: Int) extends API[Plan](courseServiceCode)
