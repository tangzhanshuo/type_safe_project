package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, EnrolledStudent}

case class EndPreRegisterMessagePlanner(courseid: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCourseQuery = "SELECT * FROM course WHERE courseid = ?"
    val getCourseParams = List(SqlParameter("int", courseid.toString))

    val updateCourseQuery = "UPDATE course SET enrolled_students = ?, status = ? WHERE courseid = ?"

    readDBRows(getCourseQuery, getCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentCourse) =>
          val cursor = currentCourse.hcursor

          for {
            status <- IO.fromEither(cursor.get[String]("status").toOption.toRight(new Exception("Missing status")))
            _ <- if (status != "preregister") IO.raiseError(new Exception(s"Course status is not preregister. Current status: $status")) else IO.unit

            courseName <- IO.fromEither(cursor.get[String]("courseName").toOption.toRight(new Exception("Missing courseName")))
            capacity <- IO.fromEither(cursor.get[Int]("capacity").toOption.toRight(new Exception("Missing capacity")))
            allStudentsStr <- IO.fromEither(cursor.get[String]("allStudents").toOption.toRight(new Exception("Missing allStudents")))
            allStudents <- IO.fromEither(decode[List[EnrolledStudent]](allStudentsStr).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}")))

            sortedAllStudents = allStudents.sortBy(_.time)
            newEnrolledStudents = sortedAllStudents.take(capacity).map(s => EnrolledStudent(s.time, s.priority, s.studentUsername))
            newStatus = if (newEnrolledStudents.size == capacity) "closed" else "open"

            newEnrolledStudentsJson = newEnrolledStudents.asJson.noSpaces

            _ <- writeDB(updateCourseQuery, List(
              SqlParameter("jsonb", newEnrolledStudentsJson),
              SqlParameter("string", newStatus),
              SqlParameter("int", courseid.toString)
            ))

            operationStatus = s"Pre-registration ended for course '$courseName' (ID: $courseid). " +
              s"New status: $newStatus. " +
              s"Enrolled students: ${newEnrolledStudents.size}/${allStudents.size}."

          } yield operationStatus

        case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
      }
    }
  }
}