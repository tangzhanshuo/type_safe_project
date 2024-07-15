package Impl

import cats.effect.IO
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import Common.Object.{EnrolledStudent, AllStudent, Course}
import io.circe.generic.auto._

case class AdminUpdateCourseMessagePlanner(
                                            courseid: Int,
                                            courseName: Option[String],
                                            teacherUsername: Option[String],
                                            teacherName: Option[String],
                                            capacity: Option[Int],
                                            info: Option[String],
                                            courseHourJson: Option[String], // JSON represented as String
                                            classroomid: Option[Int],
                                            credits: Option[Int],
                                            enrolledStudentsJson: Option[String], // JSON represented as String
                                            allStudentsJson: Option[String], // JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    val courseHours = courseHourJson.flatMap(json => decode[List[Int]](json).toOption)
    println(courseHours)
    val enrolledStudents = enrolledStudentsJson.flatMap(json => decode[List[EnrolledStudent]](json).toOption)
    val allStudents = allStudentsJson.flatMap(json => decode[List[AllStudent]](json).toOption)
    updateCourse(courseid, courseName, teacherUsername, teacherName, capacity, info, courseHours, classroomid, credits, enrolledStudents, allStudents)
  }
}
