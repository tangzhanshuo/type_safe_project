package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{Course, EnrolledStudent, AllStudent, SqlParameter}
import cats.implicits.*

case class GetCourseMessagePlanner(courseid: Int, override val planContext: PlanContext) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    val query = "SELECT * FROM course WHERE courseid = ?"
    readDBRows(query, List(SqlParameter("int", courseid.toString))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val cursor = row.hcursor

          val courseID = cursor.get[Int]("courseid").left.map(e => new Exception("Missing courseid"))
          val courseName = cursor.get[String]("courseName").left.map(e => new Exception("Missing courseName"))
          val teacherUsername = cursor.get[String]("teacherUsername").left.map(e => new Exception("Missing teacherUsername"))
          val teacherName = cursor.get[String]("teacherName").left.map(e => new Exception("Missing teacherName"))
          val capacity = cursor.get[Int]("capacity").left.map(e => new Exception("Missing capacity"))
          val info = cursor.get[String]("info").left.map(e => new Exception("Missing info"))
          val courseHourStr = cursor.get[String]("courseHour").left.map(e => new Exception("Missing courseHour"))
          val courseHour = courseHourStr.flatMap(str => decode[List[Int]](str).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}")))
          val classroomID = cursor.get[Int]("classroomid").left.map(e => new Exception("Missing classroomid"))
          val credits = cursor.get[Int]("credits").left.map(e => new Exception("Missing credits"))
          val enrolledStudentsStr = cursor.get[String]("enrolledStudents").left.map(e => new Exception("Missing enrolledStudents"))
          val enrolledStudents = enrolledStudentsStr.flatMap(str => decode[List[EnrolledStudent]](str).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}")))
          val allStudentsStr = cursor.get[String]("allStudents").left.map(e => new Exception("Missing allStudents"))
          val allStudents = allStudentsStr.flatMap(str => decode[List[AllStudent]](str).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}")))

          (courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents) match {
            case (Right(courseID), Right(courseName), Right(teacherUsername), Right(teacherName), Right(capacity), Right(info), Right(courseHour), Right(classroomID), Right(credits), Right(enrolledStudents), Right(allStudents)) =>
              IO.pure(Course(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents))
            case _ =>
              IO.raiseError(new Exception("Failed to parse course data"))
          }

        case None => IO.raiseError(new NoSuchElementException(s"No course found with courseid: $courseid"))
      }
    }
  }
}
