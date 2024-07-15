package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class GetAvailableClassroomByCapacityHourMessage(capacity: Int, courseHour: List[Int]) extends API[List[Classroom]](courseServiceCode)
