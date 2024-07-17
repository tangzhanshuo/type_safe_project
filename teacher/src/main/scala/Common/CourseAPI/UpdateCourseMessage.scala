package Common.CourseAPI

import Common.API.API
import Common.Object.{AllStudent, Course, EnrolledStudent}
import Global.ServiceCenter.courseServiceCode

case class UpdateCourseMessage(
                                courseid: Int,
                                courseName: Option[String],
                                teacherUsername: Option[String],
                                teacherName: Option[String],
                                capacity: Option[Int],
                                info: Option[String],
                                courseHours: Option[List[Int]], // 直接使用 List[Int] 类型
                                classroomid: Option[Int],
                                credits: Option[Int],
                              ) extends API[Course](courseServiceCode)
