package Common.CourseAPI

import Common.API.API
import Common.Object.{Course, EnrolledStudent}
import Global.ServiceCenter.courseServiceCode
import io.circe.generic.semiauto.*
import io.circe.{Decoder, Encoder}

case class AddCourseMessage(
                             courseName: String,
                             teacherUsername: String,
                             teacherName: String,
                             capacity: Int,
                             info: String,
                             courseHour: List[Int],
                             classroomid: Int,
                             credits: Int
                           ) extends API[Course](courseServiceCode)

