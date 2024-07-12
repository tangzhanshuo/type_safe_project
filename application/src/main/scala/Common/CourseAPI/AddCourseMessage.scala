package Common.CourseAPI

import Common.API.API
import Global.ServiceCenter.courseServiceCode

case class AddCourseMessage(
                             courseID: Int,
                             courseName: String,
                             teacherUsername: String,
                             teacherName: String,
                             capacity: Int,
                             info: String,
                             courseHourJson: String, // JSON represented as String
                             classroomID: Int,
                             credits: Int,
                             enrolledStudentsJson: String, // JSON represented as String
                             allStudentsJson: String // JSON represented as String
                           ) extends API[String](courseServiceCode)
