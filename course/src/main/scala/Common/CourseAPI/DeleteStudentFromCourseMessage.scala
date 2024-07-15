package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class DeleteStudentFromCourseMessage(courseid: Int, studentUsername: Option[String]) extends API[String](courseServiceCode)
