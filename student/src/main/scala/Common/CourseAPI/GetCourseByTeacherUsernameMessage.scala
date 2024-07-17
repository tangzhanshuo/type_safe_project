package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class GetCourseByTeacherUsernameMessage(teacherUsername: String) extends API[Option[List[Course]]](courseServiceCode)
