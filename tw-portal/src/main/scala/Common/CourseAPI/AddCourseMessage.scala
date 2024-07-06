package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class AddCourseMessage(courseID: Int, courseName: String, teacherUsername: String, teacherName: String, capacity: Int) extends API[String](courseServiceCode)
