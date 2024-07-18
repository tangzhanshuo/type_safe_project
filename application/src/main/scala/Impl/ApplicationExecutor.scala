package Impl

import cats.effect.IO
import Common.DBAPI.*
import Common.Object.{SqlParameter, EnrolledStudent, AllStudent, Course}
import io.circe.parser.{parse, decode}
import io.circe.{Encoder, Json}
import Common.CourseAPI.{addCourse, forceAddStudent2Course, deleteCourse}
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
      case ("StudentManualSelectCourse", "student") => executeStudentManualSelectCourse(username, info)
      case ("TeacherAddCourse", "teacher") => executeTeacherAddCourse(username, info)
      case ("TeacherDeleteCourse", "teacher") => executeTeacherDeleteCourse(info)
      case (appType, uType) => IO.raiseError(new Exception(s"Unsupported application type or invalid user type: $appType for $uType"))
    }
  }

  private def executeStudentManualSelectCourse(username: String, info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseID <- IO.fromOption(info.hcursor.downField("courseID").as[Int].toOption)(new Exception("courseID not found in info"))
      result <- forceAddStudent2Course(courseID, Some(username))
      _ <- IO.println(s"Student $username force added to course $courseID. Result: $result")
    } yield ()
  }

  private def executeTeacherAddCourse(username: String, info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseName <- IO.fromOption(info.hcursor.downField("courseName").as[String].toOption)(new Exception("courseName not found in info"))
      teacherName <- IO.fromOption(info.hcursor.downField("teacherName").as[String].toOption)(new Exception("teacherName not found in info"))
      capacity <- IO.fromOption(info.hcursor.downField("capacity").as[Int].toOption)(new Exception("capacity not found in info"))
      infoStr <- IO.fromOption(info.hcursor.downField("info").as[String].toOption)(new Exception("info not found in info"))
      courseHourStr <- IO.fromOption(info.hcursor.downField("courseHour").as[String].toOption)(new Exception("courseHour not found in info"))
      courseHour <- IO.fromEither(decode[List[Int]](courseHourStr)).attempt.flatMap {
        case Right(hours) => IO.pure(hours)
        case Left(e) => IO.raiseError(new Exception(s"Failed to parse courseHour as List[Int]: ${e.getMessage}"))
      }
      classroomid <- IO.fromOption(info.hcursor.downField("classroomID").as[Int].toOption)(new Exception("classroomid not found in info"))
      credits <- IO.fromOption(info.hcursor.downField("credits").as[Int].toOption)(new Exception("credits not found in info"))
      course <- addCourse(
        courseName = courseName,
        teacherUsername = username,
        teacherName = teacherName,
        capacity = capacity,
        info = infoStr,
        courseHour = courseHour,
        classroomid = classroomid,
        credits = credits
      )
      _ <- IO.println(s"Course added successfully: ${course.courseName} (ID: ${course.courseid}) by teacher: ${course.teacherName} (Username: ${course.teacherUsername})")
    } yield ()
  }

  private def executeTeacherDeleteCourse(info: Json)(using planContext: PlanContext): IO[Unit] = {
    for {
      courseID <- IO.fromOption(info.hcursor.downField("courseID").as[Int].toOption)(new Exception("courseID not found in info"))
      result <- deleteCourse(courseID)
      _ <- IO.println(s"Course with ID $courseID deleted successfully. Result: $result")
    } yield ()
  }
}