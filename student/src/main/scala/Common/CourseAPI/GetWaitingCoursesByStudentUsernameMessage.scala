package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class GetWaitingCoursesByStudentUsernameMessage(studentUsername: String) extends API[Option[List[WaitingCourse]]](courseServiceCode)
