package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.CourseAPI.UpdateCourseMessage

case class UpdateCourseMessagePlanner(
                                       courseID: Int,
                                       courseName: Option[String],
                                       teacherUsername: Option[String],
                                       teacherName: Option[String],
                                       capacity: Option[Int],
                                       info: Option[String],
                                       courseHourJson: Option[String], // JSON represented as String
                                       credits: Option[Int],
                                       enrolledStudentsJson: Option[String], // JSON represented as String
                                       kwargsJson: Option[String], // JSON represented as String
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCurrentCourseQuery = "SELECT * FROM course WHERE courseid = ?"
    val getCurrentCourseParams = List(SqlParameter("int", courseID.toString))

    val updateCourseQuery = "UPDATE course SET %s WHERE courseid = ?"

    readDBRows(getCurrentCourseQuery, getCurrentCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentCourse) =>
          val existingCourse = currentCourse.hcursor

          val updatedCourseName = courseName.getOrElse(existingCourse.get[String]("coursename").getOrElse(""))
          val updatedTeacherUsername = teacherUsername.getOrElse(existingCourse.get[String]("teacherusername").getOrElse(""))
          val updatedTeacherName = teacherName.getOrElse(existingCourse.get[String]("teachername").getOrElse(""))
          val updatedCapacity = capacity.getOrElse(existingCourse.get[Int]("capacity").getOrElse(0))
          val updatedInfo = info.getOrElse(existingCourse.get[String]("info").getOrElse(""))
          val updatedCourseHourJson = courseHourJson.getOrElse(existingCourse.get[String]("coursehour").getOrElse("[]"))
          val updatedCredits = credits.getOrElse(existingCourse.get[Int]("credits").getOrElse(0))
          val updatedEnrolledStudentsJson = enrolledStudentsJson.getOrElse(existingCourse.get[String]("enrolledstudents").getOrElse("[]"))
          val updatedKwargsJson = kwargsJson.getOrElse(existingCourse.get[String]("kwargs").getOrElse("{}"))

          // Validate the JSON strings by parsing them
          val courseHourValidation = parse(updatedCourseHourJson).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
          val enrolledStudentsValidation = parse(updatedEnrolledStudentsJson).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
          val kwargsValidation = parse(updatedKwargsJson).left.map(e => new Exception(s"Invalid JSON for kwargs: ${e.getMessage}"))

          (courseHourValidation, enrolledStudentsValidation, kwargsValidation) match {
            case (Right(_), Right(_), Right(_)) =>
              val updates = List(
                Some("coursename = ?"),
                Some("teacherusername = ?"),
                Some("teachername = ?"),
                Some("capacity = ?"),
                Some("info = ?"),
                Some("coursehour = ?"),
                Some("credits = ?"),
                Some("enrolledstudents = ?"),
                Some("kwargs = ?")
              ).flatten.mkString(", ")

              val params = List(
                SqlParameter("string", updatedCourseName),
                SqlParameter("string", updatedTeacherUsername),
                SqlParameter("string", updatedTeacherName),
                SqlParameter("int", updatedCapacity.toString),
                SqlParameter("string", updatedInfo),
                SqlParameter("json", updatedCourseHourJson),
                SqlParameter("int", updatedCredits.toString),
                SqlParameter("json", updatedEnrolledStudentsJson),
                SqlParameter("json", updatedKwargsJson),
                SqlParameter("int", courseID.toString)
              )

              writeDB(updateCourseQuery.format(updates), params).map(_ => s"Course with ID $courseID successfully updated")

            case (Left(courseHourError), _, _) => IO.raiseError(courseHourError)
            case (_, Left(enrolledStudentsError), _) => IO.raiseError(enrolledStudentsError)
            case (_, _, Left(kwargsError)) => IO.raiseError(kwargsError)
          }

        case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
      }
    }
  }
}
