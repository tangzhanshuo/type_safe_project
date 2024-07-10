package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class GetClassroomListMessage() extends API[String](courseServiceCode)
