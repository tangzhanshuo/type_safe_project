package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{SqlParameter, Course, EnrolledStudent, AllStudent}
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import cats.implicits.*

case class GetCourseListMessagePlanner(override val planContext: PlanContext) extends Planner[Option[List[Course]]] {
  override def plan(using planContext: PlanContext): IO[Option[List[Course]]] = {
    val query = "SELECT * FROM course ORDER BY courseid"
    readDBRows(query, List()).flatMap { rows =>
      if (rows.isEmpty) IO.pure(None)
      else {
        val coursesIO = rows.map { row =>
          val cursor = row.hcursor
          for {
            courseID <- cursor.get[Int]("courseid").toOption.toRight(new Exception("Missing courseid"))
            courseName <- cursor.get[String]("courseName").toOption.toRight(new Exception("Missing course_name"))
            teacherUsername <- cursor.get[String]("teacherUsername").toOption.toRight(new Exception("Missing teacher_username"))
            teacherName <- cursor.get[String]("teacherName").toOption.toRight(new Exception("Missing teacher_name"))
            capacity <- cursor.get[Int]("capacity").toOption.toRight(new Exception("Missing capacity"))
            info <- cursor.get[String]("info").toOption.toRight(new Exception("Missing info"))
            courseHourStr <- cursor.get[String]("courseHour").toOption.toRight(new Exception("Missing course_hour"))
            courseHour <- decode[List[Int]](courseHourStr).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
            classroomID <- cursor.get[Int]("classroomid").toOption.toRight(new Exception("Missing classroomid"))
            credits <- cursor.get[Int]("credits").toOption.toRight(new Exception("Missing credits"))
            enrolledStudentsStr <- cursor.get[String]("enrolledStudents").toOption.toRight(new Exception("Missing enrolled_students"))
            enrolledStudents <- decode[List[EnrolledStudent]](enrolledStudentsStr).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
            allStudentsStr <- cursor.get[String]("allStudents").toOption.toRight(new Exception("Missing all_students"))
            allStudents <- decode[List[AllStudent]](allStudentsStr).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))
            status <- cursor.get[String]("status").toOption.toRight(new Exception("Missing status"))
          } yield Course(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents, status)
        }
        coursesIO.sequence match {
          case Left(error) => IO.raiseError(error)
          case Right(courses) => IO.pure(Some(courses))
        }
      }
    }
  }
}
