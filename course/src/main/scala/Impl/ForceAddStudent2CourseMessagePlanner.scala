package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Course, EnrolledStudent}
import java.time.Instant
import cats.implicits._

case class ForceAddStudent2CourseMessagePlanner(courseid: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val priority = Some(10)
    val getCourseInfoQuery = "SELECT enrolled_students, all_students, status, capacity FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val updateCourseQuery = "UPDATE course SET enrolled_students = ?, all_students = ?, capacity = ?, status = ? WHERE courseid = ?"

    def getCurrentTime: Int = Instant.now.getEpochSecond.toInt

    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val cursor = row.hcursor
            val enrolledStudentsJsonString = cursor.get[String]("enrolledStudents").getOrElse("[]")
            val allStudentsJsonString = cursor.get[String]("allStudents").getOrElse("[]")
            val status = cursor.get[String]("status").getOrElse("")
            val capacity = cursor.get[Int]("capacity").getOrElse(0)
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
            IO.pure((enrolledStudents, allStudents, status, capacity))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    courseInfoIO.flatMap { case (enrolledStudents, allStudents, status, capacity) =>
      if (status == "preregister") {
        IO.raiseError(new Exception(s"Cannot force add student. Course status is preregister"))
      } else {
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            val isEnrolled = enrolledStudents.exists(_.studentUsername == username)
            val isAllStudent = allStudents.exists(_.studentUsername == username)

            if (isEnrolled) {
              IO.pure(s"Student $username is already enrolled in course $courseid")
            } else {
              val newStudent = EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username)
              val updatedAllStudents = if (isAllStudent) allStudents else allStudents :+ newStudent
              val updatedEnrolledStudents = enrolledStudents :+ EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username)

              val newCapacity = math.max(capacity, updatedEnrolledStudents.size)
              val newStatus = if (updatedEnrolledStudents.size == newCapacity) "closed" else "open"

              val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces
              val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

              writeDB(updateCourseQuery, List(
                SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                SqlParameter("jsonb", updatedAllStudentsJsonString),
                SqlParameter("int", newCapacity.toString),
                SqlParameter("string", newStatus),
                SqlParameter("int", courseid.toString)
              )).map(_ =>
                if (isAllStudent)
                  s"Student $username successfully added to enrolled students in course $courseid. New capacity: $newCapacity, New status: $newStatus"
                else
                  s"Student $username successfully registered and added to course $courseid. New capacity: $newCapacity, New status: $newStatus"
              )
            }

          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}