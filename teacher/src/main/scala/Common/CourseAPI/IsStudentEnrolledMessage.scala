package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class IsStudentEnrolledMessage(courseid: Int, studentUsername: Option[String]) extends API[Boolean](courseServiceCode)
