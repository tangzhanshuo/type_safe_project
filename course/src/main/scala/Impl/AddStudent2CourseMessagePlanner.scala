package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Course, EnrolledStudent, AllStudent}
import java.time.Instant
import cats.implicits._

case class AddStudent2CourseMessagePlanner(courseid: Int, studentUsername: Option[String], priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseid.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolled_students, all_students, course_hour, status FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val getStudentCoursesQuery = "SELECT * FROM course WHERE all_students @> ?::jsonb"
    val getStudentCoursesParams = (username: String) => List(SqlParameter("string", s"""[{"studentUsername":"$username"}]"""))

    val updateStudentsQuery = "UPDATE course SET enrolled_students = ?, all_students = ?, status = ? WHERE courseid = ?"

    def getCurrentTime: Int = Instant.now.getEpochSecond.toInt

    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with id $courseid does not exist"))
        else IO.pure(())
      )

    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val cursor = row.hcursor
            val capacity = cursor.get[Int]("capacity").getOrElse(0)
            val courseHourStr = cursor.get[String]("courseHour").left.map(e => new Exception("Missing courseHour"))
            val courseHour = courseHourStr.flatMap(str => decode[List[Int]](str).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))).getOrElse(Nil)
            val enrolledStudentsJsonString = cursor.get[String]("enrolledStudents").getOrElse("[]")
            val allStudentsJsonString = cursor.get[String]("allStudents").getOrElse("[]")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[AllStudent]]).getOrElse(Nil)
            val status = cursor.get[String]("status").getOrElse("unknown")
            IO.pure((capacity, enrolledStudents, allStudents, courseHour, status))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    def checkTimeConflict(newCourseHours: List[Int], studentCourses: List[Course]): Boolean = {
      studentCourses.exists { course =>
        newCourseHours.exists(course.courseHour.contains)
      }
    }

    def getStudentCourses(username: String): IO[List[Course]] = {
      readDBRows(getStudentCoursesQuery, getStudentCoursesParams(username)).flatMap { rows =>
        if (rows.nonEmpty) {
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
          coursesIO.sequence.fold(IO.raiseError, IO.pure)
        } else {
          IO.pure(Nil)
        }
      }
    }

    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents, courseHour, status) =>
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            if (allStudents.exists(_.studentUsername == username)) {
              IO.raiseError(new Exception(s"Student $username is already in the all students list for course $courseid"))
            } else {
              getStudentCourses(username).flatMap { studentCourses =>
                if (checkTimeConflict(courseHour, studentCourses)) {
                  IO.raiseError(new Exception(s"Student $username has a time conflict with another course"))
                } else {
                  val newStudent = AllStudent(time = getCurrentTime, priority = pri, studentUsername = username)
                  val updatedAllStudents = allStudents :+ newStudent
                  val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

                  status match {
                    case "preregister" =>
                      writeDB(updateStudentsQuery, List(
                        SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
                        SqlParameter("jsonb", updatedAllStudentsJsonString),
                        SqlParameter("string", status),
                        SqlParameter("int", courseid.toString)
                      )).map(_ => s"Student $username added to all students list for course $courseid (preregister)")

                    case "open" =>
                      val newEnrolledStudent = EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username)
                      val updatedEnrolledStudents = enrolledStudents :+ newEnrolledStudent
                      val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces
                      val newStatus = if (updatedEnrolledStudents.size >= capacity) "closed" else "open"

                      writeDB(updateStudentsQuery, List(
                        SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                        SqlParameter("jsonb", updatedAllStudentsJsonString),
                        SqlParameter("string", newStatus),
                        SqlParameter("int", courseid.toString)
                      )).map(_ => s"Student $username added to course $courseid. New status: $newStatus")

                    case _ =>
                      IO.raiseError(new Exception(s"Cannot add student. Course status is $status"))
                  }
                }
              }
            }
          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}