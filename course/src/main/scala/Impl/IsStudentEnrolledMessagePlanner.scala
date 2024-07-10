package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class IsStudentEnrolledMessagePlanner(courseID: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[Boolean] {
  override def plan(using planContext: PlanContext): IO[Boolean] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseID.toString))

    val getEnrolledStudentsQuery = "SELECT enrolledstudents FROM course WHERE courseid = ?"
    val getEnrolledStudentsParams = List(SqlParameter("int", courseID.toString))

    // Check if the course exists
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with ID $courseID does not exist"))
        else IO.pure(())
      )

    // Get the enrolled students list
    val enrolledStudentsIO = readDBRows(getEnrolledStudentsQuery, getEnrolledStudentsParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").toOption.orElse(Some("[]")).get
            val enrolledStudentsJson = parse(enrolledStudentsJsonString).getOrElse(Json.arr())
            val enrolledStudents = enrolledStudentsJson.as[List[Map[String, Json]]].getOrElse(Nil)
            IO.pure(enrolledStudents)
          case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
        }
      }

    // Check if the student is enrolled
    courseExistsIO.flatMap { _ =>
      enrolledStudentsIO.flatMap { enrolledStudents =>
        studentUsername match {
          case Some(username) =>
            IO.pure(enrolledStudents.exists(_("studentusername").as[String].contains(username)))
          case None => IO.raiseError(new Exception("Student username must be provided"))
        }
      }
    }
  }
}
