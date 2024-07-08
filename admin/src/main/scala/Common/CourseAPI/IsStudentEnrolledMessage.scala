package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class IsStudentEnrolledMessage(courseID: Int, studentUsername: Option[String]) extends API[Boolean](courseServiceCode)
