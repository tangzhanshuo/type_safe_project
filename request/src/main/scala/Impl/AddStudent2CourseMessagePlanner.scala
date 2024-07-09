package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddStudent2CourseMessagePlanner(courseID: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseID.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolledstudents FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseID.toString))

    val updateEnrolledStudentsQuery = "UPDATE course SET enrolledstudents = ? WHERE courseid = ?"

    // Check if the course exists
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with ID $courseID does not exist"))
        else IO.pure(())
      )

    // Get the course info (capacity and enrolledStudents list)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").toOption.getOrElse("[]")
            val enrolledStudentsJson = parse(enrolledStudentsJsonString).getOrElse(Json.arr())
            val enrolledStudents = enrolledStudentsJson.as[List[String]].getOrElse(Nil)
            IO.pure((capacity, enrolledStudents))
          case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
        }
      }

    // Combine the checks and update
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents) =>
        studentUsername match {
          case Some(username) =>
            if (enrolledStudents.contains(username)) {
              IO.raiseError(new Exception(s"Student $username is already enrolled in course $courseID"))
            } else if (enrolledStudents.size >= capacity) {
              IO.raiseError(new Exception(s"Course $courseID has reached its capacity of $capacity students"))
            } else {
              val updatedEnrolledStudents = enrolledStudents :+ username
              val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces
              writeDB(updateEnrolledStudentsQuery, List(SqlParameter("jsonb", updatedEnrolledStudentsJsonString), SqlParameter("int", courseID.toString)))
                .map(_ => s"Student $username successfully added to course $courseID")
            }
          case None => IO.raiseError(new Exception("Student username must be provided"))
        }
      }
    }
  }
}
