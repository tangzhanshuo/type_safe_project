package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class GetCourseByCourseNameMessage(courseName: String) extends API[Option[List[Course]]](courseServiceCode)