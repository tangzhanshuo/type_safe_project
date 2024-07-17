package Common.CourseAPI

import Common.API.API
import Common.Object.{CourseWaitingPosition, SqlParameter}
import Global.ServiceCenter.courseServiceCode

case class GetWaitingPositionByStudentUsernameMessage(studentUsername: String) extends API[Option[List[CourseWaitingPosition]]](courseServiceCode)
