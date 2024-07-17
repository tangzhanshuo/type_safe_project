package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.Json
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{SqlParameter, Course, WaitingCourse, EnrolledStudent, AllStudent}
import cats.implicits.*

case class GetWaitingCoursesByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[List[WaitingCourse]] {
  override def plan(using planContext: PlanContext): IO[List[WaitingCourse]] = {
    val queryAllStudents = """
      SELECT * FROM course
      WHERE all_students @> ?::jsonb
    """
    val searchJson = Json.obj("studentUsername" -> Json.fromString(studentUsername)).noSpaces

    readDBRows(queryAllStudents, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      val waitingCoursesWithPosition = rows.flatMap { row =>
        val cursor = row.hcursor
        for {
          capacity <- cursor.get[Int]("capacity").toOption
          enrolledStudentsStr <- cursor.get[String]("enrolledStudents").toOption
          allStudentsStr <- cursor.get[String]("allStudents").toOption
          enrolledStudents <- decode[List[EnrolledStudent]](enrolledStudentsStr).toOption
          allStudents <- decode[List[AllStudent]](allStudentsStr).toOption
          courseID <- cursor.get[Int]("courseid").toOption
          courseName <- cursor.get[String]("courseName").toOption
          teacherUsername <- cursor.get[String]("teacherUsername").toOption
          teacherName <- cursor.get[String]("teacherName").toOption
          info <- cursor.get[String]("info").toOption
          courseHourStr <- cursor.get[String]("courseHour").toOption
          courseHour <- decode[List[Int]](courseHourStr).toOption
          classroomID <- cursor.get[Int]("classroomid").toOption
          credits <- cursor.get[Int]("credits").toOption
          status <- cursor.get[String]("status").toOption
        } yield {
          val isEnrolled = enrolledStudents.exists(_.studentUsername == studentUsername)
          if (!isEnrolled && status != "preregister") {
            val sortedAllStudents = allStudents.sortBy(_.time)
            val positionInAllStudents = sortedAllStudents.indexWhere(_.studentUsername == studentUsername)
            if (positionInAllStudents >= 0) {
              val waitingPosition = positionInAllStudents - capacity
              Some(WaitingCourse(
                Course(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents, status),
                waitingPosition
              ))
            } else {
              None
            }
          } else {
            None
          }
        }
      }.flatten

      if (waitingCoursesWithPosition.isEmpty) {
        IO.raiseError(new NoSuchElementException(s"No waiting courses found with student username: $studentUsername"))
      } else {
        IO.pure(waitingCoursesWithPosition)
      }
    }
  }
}