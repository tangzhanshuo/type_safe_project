package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class GetCoursesByTeacherUsernameMessage(teacherUsername: String) extends API[String](courseServiceCode)
