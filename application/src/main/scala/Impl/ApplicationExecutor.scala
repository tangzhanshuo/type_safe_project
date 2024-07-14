package Impl

import cats.effect.IO
import Common.DBAPI.*
import Common.Object.SqlParameter
import io.circe.parser.parse
import io.circe.{Encoder, Json}
import Common.CourseAPI.{addCourse, addStudent2Course, deleteCourse}
import Common.API.PlanContext

object ApplicationExecutor {

  def executeApplication(applicationID: String)(using encoder: Encoder[ReadDBRowsMessage], planContext: PlanContext): IO[Unit] = {
    val selectQuery = """
      SELECT usertype, username, applicationtype, info
      FROM application
      WHERE applicationID = ?
    """

    val params = List(SqlParameter("string", applicationID))

    readDBRows(selectQuery, params).flatMap {
      case row :: Nil => // We expect only one row
        for {
          usertype <- IO.fromOption(row.hcursor.get[String]("usertype").toOption)(new Exception("usertype not found"))
          username <- IO.fromOption(row.hcursor.get[String]("username").toOption)(new Exception("username not found"))
          applicationType <- IO.fromOption(row.hcursor.get[String]("applicationtype").toOption)(new Exception("applicationtype not found"))
          infoString <- IO.fromOption(row.hcursor.get[String]("info").toOption)(new Exception("info not found"))
          info <- IO.fromEither(parse(infoString)).attempt.flatMap {
            case Right(json) => IO.pure(json)
            case Left(e) => IO.raiseError(new Exception(s"Failed to parse info as JSON: ${e.getMessage}"))
          }
          _ <- executeBasedOnType(applicationType, usertype, username, info)
        } yield ()
      case Nil => IO.raiseError(new Exception(s"No application found with ID: $applicationID"))
      case _ => IO.raiseError(new Exception(s"Multiple applications found with ID: $applicationID"))
    }
  }

  private def executeBasedOnType(applicationType: String, usertype: String, username: String, info: Json)(using planContext: PlanContext): IO[Unit] = {
    (applicationType, usertype.toLowerCase) match {
      case ("StudentAdd2Course", "student") => executeStudentAdd2Course(username, info)
      case ("TeacherAddCourse", "teacher") => executeTeacherAddCourse(username, info)
      case ("TeacherDeleteCourse", "teacher") => executeTeacherDeleteCourse(info)
      case (appType, uType) => IO.raiseError(new Exception(s"Unsupported application type or invalid user type: $appType for $uType"))
    }
  }

  private def executeStudentAdd2Course(username: String, info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseID <- IO.fromOption(info.hcursor.downField("courseID").as[Int].toOption)(new Exception("courseID not found in info"))
      priority <- info.hcursor.downField("priority").as[Int].toOption match {
        case Some(value) => IO.pure(Some(value))
        case None => IO.pure(None)  // priority is optional, so we use None if it's not provided
      }
      _ <- addStudent2Course(courseID, Some(username), priority)
      priorityStr = priority.map(p => s" with priority $p").getOrElse("")
      _ <- IO.println(s"Student $username added to course $courseID$priorityStr")
    } yield ()
  }

  private def executeTeacherAddCourse(username: String, info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseName <- IO.fromOption(info.hcursor.downField("courseName").as[String].toOption)(new Exception("courseName not found in info"))
      teacherName <- IO.fromOption(info.hcursor.downField("teacherName").as[String].toOption)(new Exception("teacherName not found in info"))
      capacity <- IO.fromOption(info.hcursor.downField("capacity").as[Int].toOption)(new Exception("capacity not found in info"))
      infoStr <- IO.fromOption(info.hcursor.downField("info").as[String].toOption)(new Exception("info not found in info"))
      courseHourJson <- IO.fromOption(info.hcursor.downField("courseHourJson").as[String].toOption)(new Exception("courseHourJson not found in info"))
      classroomID <- IO.fromOption(info.hcursor.downField("classroomID").as[Int].toOption)(new Exception("classroomID not found in info"))
      credits <- IO.fromOption(info.hcursor.downField("credits").as[Int].toOption)(new Exception("credits not found in info"))
      enrolledStudentsJson <- IO.pure("[]") // Start with an empty array for new course
      allStudentsJson <- IO.pure("[]") // Start with an empty array for new course
      courseID <- addCourse(
        courseName = courseName,
        teacherUsername = username,
        teacherName = teacherName,
        capacity = capacity,
        info = infoStr,
        courseHourJson = courseHourJson,
        classroomID = classroomID,
        credits = credits,
        enrolledStudentsJson = enrolledStudentsJson,
        allStudentsJson = allStudentsJson
      )
      _ <- IO.println(s"Course added successfully: $courseName (ID: $courseID) by teacher: $teacherName (Username: $username)")
    } yield ()
  }

  private def executeTeacherDeleteCourse(info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseID <- IO.fromOption(info.hcursor.downField("courseID").as[Int].toOption)(new Exception("courseID not found in info"))
      _ <- deleteCourse(courseID)
      _ <- IO.println(s"Course with ID $courseID deleted successfully")
    } yield ()
  }
}