package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddCourseMessagePlanner(
                                    courseID: Int,
                                    courseName: String,
                                    teacherUsername: String,
                                    teacherName: String,
                                    capacity: Int,
                                    info: String,
                                    courseHourJson: String, // JSON represented as String
                                    credits: Int,
                                    enrolledStudentsJson: String, // JSON represented as String
                                    kwargsJson: String, // JSON represented as String
                                    override val planContext: PlanContext
                                  ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)",
      List(SqlParameter("int", courseID.toString))
    )

    checkCourseExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("Course with this ID already exists"))
      } else {
        // Validate the JSON strings by parsing them
        val courseHourValidation = parse(courseHourJson).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
        val enrolledStudentsValidation = parse(enrolledStudentsJson).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
        val kwargsValidation = parse(kwargsJson).left.map(e => new Exception(s"Invalid JSON for kwargs: ${e.getMessage}"))

        (courseHourValidation, enrolledStudentsValidation, kwargsValidation) match {
          case (Right(_), Right(_), Right(_)) =>
            writeDB(s"""
                       |INSERT INTO course (
                       |  courseid, coursename, teacherusername, teachername, capacity, info, coursehour, credits, enrolledstudents, kwargs
                       |) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.stripMargin,
              List(
                SqlParameter("int", courseID.toString),
                SqlParameter("string", courseName),
                SqlParameter("string", teacherUsername),
                SqlParameter("string", teacherName),
                SqlParameter("int", capacity.toString),
                SqlParameter("string", info),
                SqlParameter("json", courseHourJson),
                SqlParameter("int", credits.toString),
                SqlParameter("json", enrolledStudentsJson),
                SqlParameter("json", kwargsJson)
              )
            ).map(_ => s"Course $courseName with ID $courseID successfully added")

          case (Left(courseHourError), _, _) => IO.raiseError(courseHourError)
          case (_, Left(enrolledStudentsError), _) => IO.raiseError(enrolledStudentsError)
          case (_, _, Left(kwargsError)) => IO.raiseError(kwargsError)
        }
      }
    }
  }
}
