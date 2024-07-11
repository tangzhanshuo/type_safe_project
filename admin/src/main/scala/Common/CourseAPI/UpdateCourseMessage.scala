package Common.CourseAPI

import Common.API.API
import Global.ServiceCenter.courseServiceCode

case class UpdateCourseMessage(
                                courseID: Int,
                                courseName: Option[String],
                                teacherUsername: Option[String],
                                teacherName: Option[String],
                                capacity: Option[Int],
                                info: Option[String],
                                courseHourJson: Option[String], // JSON represented as String
                                classroomID: Option[Int],
                                credits: Option[Int],
                                enrolledStudentsJson: Option[String], // JSON represented as String
                                allStudentsJson: Option[String] // JSON represented as String
                              ) extends API[String](courseServiceCode)
