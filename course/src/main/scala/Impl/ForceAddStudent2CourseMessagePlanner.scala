package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Course, EnrolledStudent, AllStudent}
import java.time.Instant
import cats.implicits._

case class ForceAddStudent2CourseMessagePlanner(courseid: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val priority = Some(10)
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseid.toString))

    val getCourseInfoQuery = "SELECT enrolled_students, all_students FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val updateStudentsQuery = "UPDATE course SET enrolled_students = ?, all_students = ? WHERE courseid = ?"

    // 获取当前时间
    def getCurrentTime: Int = Instant.now.getEpochSecond.toInt

    // 检查课程是否存在
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with id $courseid does not exist"))
        else IO.pure(())
      )

    // 获取课程信息 (enrolledStudents 列表，和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val cursor = row.hcursor
            val enrolledStudentsJsonString = cursor.get[String]("enrolledStudents").getOrElse("[]")
            val allStudentsJsonString = cursor.get[String]("allStudents").getOrElse("[]")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[AllStudent]]).getOrElse(Nil)
            IO.pure((enrolledStudents, allStudents))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (enrolledStudents, allStudents) =>
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            val isEnrolled = enrolledStudents.exists(_.studentUsername == username)
            val isAllStudent = allStudents.exists(_.studentUsername == username)

            if (isEnrolled) {
              IO.pure(s"Student $username is already enrolled in course $courseid")
            } else if (isAllStudent) {
              val updatedEnrolledStudents = enrolledStudents :+ EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username)
              val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

              writeDB(updateStudentsQuery, List(
                SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                SqlParameter("jsonb", allStudents.asJson.noSpaces),
                SqlParameter("int", courseid.toString)
              )).map(_ => s"Student $username successfully added to enrolled students in course $courseid")
            } else {
              val newStudent = AllStudent(time = getCurrentTime, priority = pri, studentUsername = username)
              val updatedAllStudents = allStudents :+ newStudent
              val updatedEnrolledStudents = enrolledStudents :+ EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username)
              val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces
              val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

              writeDB(updateStudentsQuery, List(
                SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                SqlParameter("jsonb", updatedAllStudentsJsonString),
                SqlParameter("int", courseid.toString)
              )).map(_ => s"Student $username successfully registered and added to course $courseid")
            }

          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}
