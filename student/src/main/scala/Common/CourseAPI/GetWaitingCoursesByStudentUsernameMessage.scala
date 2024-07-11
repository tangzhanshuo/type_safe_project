package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class GetWaitingCourseByStudentUsernameMessage(studentUsername: String) extends API[String](courseServiceCode)
