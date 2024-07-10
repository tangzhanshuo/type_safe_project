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

case class AddStudent2CourseMessagePlanner(courseID: Int, studentUsername: Option[String], priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseID.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolledstudents, allstudents FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseID.toString))

    val updateStudentsQuery = "UPDATE course SET enrolledstudents = ?, allstudents = ? WHERE courseid = ?"

    // 获取当前时间
    def getCurrentTime: Int = Instant.now.getEpochSecond.toInt

    // 检查课程是否存在
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with ID $courseID does not exist"))
        else IO.pure(())
      )

    // 获取课程信息 (容量，enrolledStudents 列表，和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").toOption.getOrElse("[]")
            val allStudentsJsonString = row.hcursor.get[String]("allstudents").toOption.getOrElse("[]")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents))
          case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
        }
      }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents) =>
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            if (allStudents.exists(_("studentusername").as[String].contains(username))) {
              IO.raiseError(new Exception(s"Student $username is already in the all students list for course $courseID"))
            } else {
              val newStudent = Map(
                "time" -> getCurrentTime.asJson,
                "studentusername" -> username.asJson,
                "priority" -> pri.asJson
              )

              val updatedAllStudents = allStudents :+ newStudent
              val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

              if (enrolledStudents.size >= capacity) {
                // 不添加到 enrolledStudents
                writeDB(updateStudentsQuery, List(
                  SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("int", courseID.toString)
                )).map(_ => s"Student $username added to all students list for course $courseID, but not enrolled due to capacity limit")
              } else {
                val updatedEnrolledStudents = enrolledStudents :+ newStudent
                val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

                writeDB(updateStudentsQuery, List(
                  SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("int", courseID.toString)
                )).map(_ => s"Student $username successfully added to course $courseID")
              }
            }
          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}
