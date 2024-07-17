package Common.CourseAPI

import Common.API.API
import Common.Object.{EnrolledStudent, AllStudent, Course}
import Global.ServiceCenter.courseServiceCode
import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder}

case class AddCourseMessage(
                             courseName: String,
                             teacherUsername: String,
                             teacherName: String,
                             capacity: Int,
                             info: String,
                             courseHour: List[Int],
                             classroomid: Int,
                             credits: Int,
                           ) extends API[Course](courseServiceCode)

