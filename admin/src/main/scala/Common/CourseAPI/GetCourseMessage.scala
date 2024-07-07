package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import io.circe.Json

case class GetCourseMessage(courseID: Int) extends API[String](courseServiceCode)
