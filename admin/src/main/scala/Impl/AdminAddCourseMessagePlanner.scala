package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addCourse
import Common.Object.{EnrolledStudent, AllStudent, Course}
import io.circe.parser.decode
import io.circe.syntax._

case class AdminAddCourseMessagePlanner(
                                         courseName: String,
                                         teacherUsername: String,
                                         teacherName: String,
                                         capacity: Int,
                                         info: String,
                                         courseHour: String, //  represented为 String
                                         classroomid: Int,
                                         credits: Int,
                                         enrolledStudents: String, //  represented为 String
                                         allStudents: String, //  represented为 String
                                         override val planContext: PlanContext
                                       ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    for {
      courseHour <- IO.fromEither(decode[List[Int]](courseHour).left.map(e => new Exception(s"Invalid  for CourseHour: ${e.getMessage}")))
      enrolledStudents <- IO.fromEither(decode[List[EnrolledStudent]](enrolledStudents).left.map(e => new Exception(s"Invalid  for EnrolledStudents: ${e.getMessage}")))
      allStudents <- IO.fromEither(decode[List[AllStudent]](allStudents).left.map(e => new Exception(s"Invalid  for AllStudents: ${e.getMessage}")))
      course <- addCourse(courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits, enrolledStudents, allStudents)
    } yield course
  }
}
