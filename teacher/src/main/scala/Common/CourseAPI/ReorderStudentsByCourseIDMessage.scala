package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import io.circe.Json

case class ReorderStudentsByCourseIDMessage(courseid: Int) extends API[String](courseServiceCode)
