package Common.CourseAPI

import Common.API.API
import Common.Object.*
import Global.ServiceCenter.courseServiceCode

case class AddClassroomMessage(
                                classroomid: Int,
                                classroomName: String,
                                capacity: Int,
                                enrolledCourses: Map[Int, List[Int]], // JSON represented as String
                              ) extends API[Classroom](courseServiceCode)