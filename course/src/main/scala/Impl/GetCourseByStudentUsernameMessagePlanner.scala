package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{Course, EnrolledStudent, AllStudent, SqlParameter}
import io.circe.Json
import cats.implicits.*

case class GetCourseByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[List[Course]] {
  override def plan(using planContext: PlanContext): IO[List[Course]] = {
    val query = """
      SELECT * FROM course
      WHERE enrolled_students @> ?::jsonb
    """
    val searchJson = Json.obj("studentUsername" -> Json.fromString(studentUsername)).noSpaces
    readDBRows(query, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      if (rows.isEmpty) IO.raiseError(new NoSuchElementException(s"No courses found with student username: $studentUsername"))
      else {
        val coursesIO = rows.map { row =>
          val cursor = row.hcursor
          for {
            courseID <- cursor.get[Int]("courseid").toOption.toRight(new Exception("Missing courseid"))
            courseName <- cursor.get[String]("courseName").toOption.toRight(new Exception("Missing courseName"))
            teacherUsername <- cursor.get[String]("teacherUsername").toOption.toRight(new Exception("Missing teacherUsername"))
            teacherName <- cursor.get[String]("teacherName").toOption.toRight(new Exception("Missing teacherName"))
            capacity <- cursor.get[Int]("capacity").toOption.toRight(new Exception("Missing capacity"))
            info <- cursor.get[String]("info").toOption.toRight(new Exception("Missing info"))
            courseHourStr <- cursor.get[String]("courseHour").toOption.toRight(new Exception("Missing courseHour"))
            courseHour <- decode[List[Int]](courseHourStr).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
            classroomID <- cursor.get[Int]("classroomid").toOption.toRight(new Exception("Missing classroomid"))
            credits <- cursor.get[Int]("credits").toOption.toRight(new Exception("Missing credits"))
            enrolledStudentsStr <- cursor.get[String]("enrolledStudents").toOption.toRight(new Exception("Missing enrolledStudents"))
            enrolledStudents <- decode[List[EnrolledStudent]](enrolledStudentsStr).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
            allStudentsStr <- cursor.get[String]("allStudents").toOption.toRight(new Exception("Missing allStudents"))
            allStudents <- decode[List[AllStudent]](allStudentsStr).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))
            status <- cursor.get[String]("status").toOption.toRight(new Exception("Missing status"))
          } yield Course(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents, status)
        }
        coursesIO.sequence match {
          case Left(error) => IO.raiseError(error)
          case Right(courses) => IO.pure(courses)
        }
      }
    }
  }
}