package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class GetAvailableClassroomByCapacityHourMessage(capacity: Int, courseHourJson: String) extends API[String](courseServiceCode)
