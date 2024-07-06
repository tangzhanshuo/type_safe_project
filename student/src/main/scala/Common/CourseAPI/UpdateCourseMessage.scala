package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class UpdateCourseMessage(courseID: Int, courseName: Option[String], teacherUsername: Option[String], teacherName: Option[String], capacity: Option[Int]) extends API[String](courseServiceCode)
