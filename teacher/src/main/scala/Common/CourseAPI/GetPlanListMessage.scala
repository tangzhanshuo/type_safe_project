package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode
import io.circe.Json

case class GetPlanListMessage() extends API[List[Plan]](courseServiceCode)
