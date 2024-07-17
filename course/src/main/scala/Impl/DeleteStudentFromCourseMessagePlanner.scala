package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import io.circe.Json
import io.circe.parser.parse

case class DeleteStudentFromCourseMessagePlanner(courseid: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCourseInfoQuery = "SELECT capacity, enrolled_students, all_students, status FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val updateCourseQuery = "UPDATE course SET enrolled_students = ?, all_students = ?, status = ? WHERE courseid = ?"

    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledStudents").toOption.orElse(Some("[]")).get
            val allStudentsJsonString = row.hcursor.get[String]("allStudents").toOption.orElse(Some("[]")).get
            val status = row.hcursor.get[String]("status").toOption.getOrElse("")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents, status))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents, status) =>
      studentUsername match {
        case Some(username) =>
          val studentInAll = allStudents.find(_("studentUsername").as[String].contains(username))
          val studentInEnrolled = enrolledStudents.find(_("studentUsername").as[String].contains(username))

          studentInAll match {
            case None => IO.raiseError(new Exception(s"Student $username is not in the all students list for course $courseid"))
            case Some(_) =>
              val updatedAllStudents = allStudents.filterNot(_("studentUsername").as[String].contains(username))

              if (status == "preregister") {
                val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces
                writeDB(updateCourseQuery, List(
                  SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("string", status),
                  SqlParameter("int", courseid.toString)
                )).map(_ => s"Student $username successfully removed from all students list for course $courseid")
              } else {
                val updatedEnrolledStudents = enrolledStudents.filterNot(_("studentUsername").as[String].contains(username))

                val additionalStudents = updatedAllStudents.filterNot(student =>
                  updatedEnrolledStudents.exists(_("studentUsername") == student("studentUsername"))
                ).flatMap { student =>
                  student("time").as[Int].toOption.map(time => (time, student))
                }.sortBy(_._1).map(_._2)

                val finalEnrolledStudents = updatedEnrolledStudents ++ additionalStudents.take(capacity - updatedEnrolledStudents.size)
                val finalEnrolledStudentsJsonString = finalEnrolledStudents.asJson.noSpaces
                val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

                val newStatus = if (finalEnrolledStudents.size < capacity) "open" else status

                writeDB(updateCourseQuery, List(
                  SqlParameter("jsonb", finalEnrolledStudentsJsonString),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("string", newStatus),
                  SqlParameter("int", courseid.toString)
                )).map(_ => s"Student $username successfully removed from course $courseid. New status: $newStatus")
              }
          }
        case None => IO.raiseError(new Exception("Student username must be provided"))
      }
    }
  }
}