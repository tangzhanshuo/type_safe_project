package Common.Object

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

sealed trait StudentStatus
object StudentStatus {
  case object NotEnrolled extends StudentStatus
  case object Enrolled extends StudentStatus
  case object Waiting extends StudentStatus

  implicit val statusEncoder: Encoder[StudentStatus] = deriveEncoder
  implicit val statusDecoder: Decoder[StudentStatus] = deriveDecoder
}

case class StudentCourse(
                          courseid: Int,
                          courseName: String,
                          teacherName: String,
                          capacity: Int,
                          info: String,
                          courseHour: List[Int],
                          classroomid: Int,
                          credits: Int,
                          enrolledStudentsNumber: Int,
                          allStudentsNumber: Int,
                          status: String,
                          studentStatus: StudentStatus
                        )

object StudentCourse {
  implicit val courseEncoder: Encoder[StudentCourse] = deriveEncoder
  implicit val courseDecoder: Decoder[StudentCourse] = deriveDecoder
}
