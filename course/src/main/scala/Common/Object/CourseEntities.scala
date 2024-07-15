package Common.Object

import io.circe.{Decoder, Encoder, HCursor, Json}
import io.circe.generic.semiauto._

case class EnrolledStudent(time: Int, priority: Int, studentUsername: String)
object EnrolledStudent {
  implicit val enrolledStudentEncoder: Encoder[EnrolledStudent] = deriveEncoder
  implicit val enrolledStudentDecoder: Decoder[EnrolledStudent] = deriveDecoder
}

case class AllStudent(time: Int, priority: Int, studentUsername: String)
object AllStudent {
  implicit val allStudentEncoder: Encoder[AllStudent] = deriveEncoder
  implicit val allStudentDecoder: Decoder[AllStudent] = deriveDecoder
}



case class Course(
                   courseid: Int,
                   courseName: String,
                   teacherUsername: String,
                   teacherName: String,
                   capacity: Int,
                   info: String,
                   courseHour: List[Int],
                   classroomid: Int,
                   credits: Int,
                   enrolledStudents: List[EnrolledStudent],
                   allStudents: List[AllStudent]
                 )
object Course {
  implicit val courseEncoder: Encoder[Course] = deriveEncoder
  implicit val courseDecoder: Decoder[Course] = deriveDecoder
}

case class Classroom(
                      classroomid: Int,
                      classroomName: String,
                      capacity: Int,
                      enrolledCourses: Map[Int, List[Int]]
                    )

object Classroom {
  implicit val classroomEncoder: Encoder[Classroom] = deriveEncoder
  implicit val classroomDecoder: Decoder[Classroom] = deriveDecoder
}

case class WaitingCourse(
                          course: Course,
                          waitingPosition: Int
                        )

object WaitingCourse {
  implicit val waitingCourseEncoder: Encoder[WaitingCourse] = deriveEncoder
  implicit val waitingCourseDecoder: Decoder[WaitingCourse] = deriveDecoder
}


case class CourseWaitingPosition(
                                  course: Course,
                                  priority: List[Int],
                                  position: Int
                                )

object CourseWaitingPosition {
  implicit val courseWaitingPositionEncoder: Encoder[CourseWaitingPosition] = deriveEncoder
  implicit val courseWaitingPositionDecoder: Decoder[CourseWaitingPosition] = deriveDecoder
}