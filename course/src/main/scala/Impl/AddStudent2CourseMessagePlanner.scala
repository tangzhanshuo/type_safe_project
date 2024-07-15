package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import java.time.Instant

case class AddStudent2CourseMessagePlanner(courseid: Int, studentUsername: Option[String], priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseid.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolled_students, all_students FROM course WHERE courseid = ?"
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

    // 获取课程信息 (容量，enrolledStudents 列表，和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledStudents").toOption.getOrElse("[]")
            val allStudentsJsonString = row.hcursor.get[String]("allStudents").toOption.getOrElse("[]")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents) =>
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            if (allStudents.exists(_("studentUsername").as[String].contains(username))) {
              IO.raiseError(new Exception(s"Student $username is already in the all students list for course $courseid"))
            } else {
              val newStudent = Map(
                "time" -> getCurrentTime.asJson,
                "studentUsername" -> username.asJson,
                "priority" -> pri.asJson
              )

              val updatedAllStudents = allStudents :+ newStudent
              val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

              if (enrolledStudents.size >= capacity) {
                // 不添加到 enrolledStudents
                writeDB(updateStudentsQuery, List(
                  SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("int", courseid.toString)
                )).map(_ => s"Student $username added to all students list for course $courseid, but not enrolled due to capacity limit")
              } else {
                val updatedEnrolledStudents = enrolledStudents :+ newStudent
                val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

                writeDB(updateStudentsQuery, List(
                  SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("int", courseid.toString)
                )).map(_ => s"Student $username successfully added to course $courseid")
              }
            }
          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}
