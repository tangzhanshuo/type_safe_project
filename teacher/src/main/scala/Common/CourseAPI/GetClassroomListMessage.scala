package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class GetClassroomListMessage() extends API[List[Classroom]](courseServiceCode)
