package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class AddStudent2CourseMessage(courseID: Int, studentUsername: Option[String]) extends API[String](courseServiceCode)
