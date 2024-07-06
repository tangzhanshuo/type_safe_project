package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode

case class DeleteCourseMessage(courseID: Int) extends API[String](courseServiceCode)
