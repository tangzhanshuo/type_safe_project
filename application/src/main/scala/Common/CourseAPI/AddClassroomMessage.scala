package Common.CourseAPI

import Common.API.API
import Global.ServiceCenter.courseServiceCode

case class AddClassroomMessage(
                                classroomID: Int,
                                classroomName: String,
                                enrolledCoursesJson: String, // JSON represented as String
                              ) extends API[String](courseServiceCode)