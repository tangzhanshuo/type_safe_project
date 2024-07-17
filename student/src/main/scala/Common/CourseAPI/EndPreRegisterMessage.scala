package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class EndPreRegisterMessage(courseid: Int) extends API[String](courseServiceCode)
