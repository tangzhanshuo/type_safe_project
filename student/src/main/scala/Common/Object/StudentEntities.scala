package Common.Object

import io.circe.{Decoder, Encoder, HCursor, Json}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

sealed trait StudentStatus
object StudentStatus {
  case object NotEnrolled extends StudentStatus
  case object Enrolled extends StudentStatus
  case object Waiting extends StudentStatus

  implicit val encodeStudentStatus: Encoder[StudentStatus] = new Encoder[StudentStatus] {
    final def apply(a: StudentStatus): Json = Json.fromString(a.toString)
  }

  implicit val decodeStudentStatus: Decoder[StudentStatus] = new Decoder[StudentStatus] {
    final def apply(c: HCursor): Decoder.Result[StudentStatus] = c.as[String].map {
      case "NotEnrolled" => NotEnrolled
      case "Enrolled" => Enrolled
      case "Waiting" => Waiting
    }
  }
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

case class StudentCourseWaitingPosition(
                                  studentCourse: StudentCourse,
                                  priority: List[Int],
                                  position: Int
                                )

object StudentCourseWaitingPosition {
  implicit val courseWaitingPositionEncoder: Encoder[StudentCourseWaitingPosition] = deriveEncoder
  implicit val courseWaitingPositionDecoder: Decoder[StudentCourseWaitingPosition] = deriveDecoder
}
