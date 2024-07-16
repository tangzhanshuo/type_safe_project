package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import io.circe.Json
import io.circe.parser.parse


case class DeleteStudentFromCourseMessagePlanner(courseid: Int, studentUsername: Option[String], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseid.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolled_students, all_students FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val updateStudentsQuery = "UPDATE course SET enrolled_students = ?, all_students = ? WHERE courseid = ?"

    // 检查课程是否存在
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with id $courseid does not exist"))
        else IO.pure(())
      )

    // 获取课程信息 (enrolledStudents 列表 和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledStudents").toOption.orElse(Some("[]")).get
            val allStudentsJsonString = row.hcursor.get[String]("allStudents").toOption.orElse(Some("[]")).get
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents) =>
        studentUsername match {
          case Some(username) =>
            val studentInAll = allStudents.find(_("studentUsername").as[String].contains(username))
            val studentInEnrolled = enrolledStudents.find(_("studentUsername").as[String].contains(username))

            studentInAll match {
              case None => IO.raiseError(new Exception(s"Student $username is not in the all students list for course $courseid"))
              case Some(_) =>
                // 删除学生
                val updatedAllStudents = allStudents.filterNot(_("studentUsername").as[String].contains(username))
                val updatedEnrolledStudents = studentInEnrolled match {
                  case None => enrolledStudents
                  case Some(_) => enrolledStudents.filterNot(_("studentUsername").as[String].contains(username))
                }

                // 检查并补充 enrolledStudents
                val additionalStudents = updatedAllStudents.filterNot(student =>
                  updatedEnrolledStudents.exists(_("studentUsername") == student("studentUsername"))
                ).flatMap { student =>
                  student("time").as[Int].toOption.map(time => (time, student))
                }.sortBy(_._1).map(_._2)

                val finalEnrolledStudents = updatedEnrolledStudents ++ additionalStudents.take(capacity - updatedEnrolledStudents.size)
                val finalEnrolledStudentsJsonString = finalEnrolledStudents.asJson.noSpaces
                val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

                writeDB(updateStudentsQuery, List(
                  SqlParameter("jsonb", finalEnrolledStudentsJsonString),
                  SqlParameter("jsonb", updatedAllStudentsJsonString),
                  SqlParameter("int", courseid.toString)
                )).map(_ => s"Student $username successfully removed from course $courseid")
            }
          case None => IO.raiseError(new Exception("Student username must be provided"))
        }
      }
    }
  }
}
