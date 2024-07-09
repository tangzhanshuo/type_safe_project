package Common.CourseAPI

import Common.API.API
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import io.circe.Json

case class GetCourseListMessage() extends API[String](courseServiceCode)
