package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import scala.util.Random

case class ReorderStudentsByCourseIDMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseID.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolledstudents, allstudents FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseID.toString))

    val updateStudentsQuery = "UPDATE course SET enrolledstudents = ?, allstudents = ? WHERE courseid = ?"

    // 检查课程是否存在
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with ID $courseID does not exist"))
        else IO.pure(())
      )

    // 获取课程信息 (capacity, enrolledStudents 列表 和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val capacity = row.hcursor.get[Int]("capacity").toOption.getOrElse(0)
            val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").toOption.orElse(Some("[]")).get
            val allStudentsJsonString = row.hcursor.get[String]("allstudents").toOption.orElse(Some("[]")).get
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents))
          case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
        }
      }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, _, allStudents) =>
        // 根据 priority 将 allStudents 划分成不同的列表
        val groupedByPriority = allStudents.groupBy(_("priority").as[Int].getOrElse(Int.MaxValue))

        // 对每个列表进行随机排序
        val sortedAndShuffled = groupedByPriority.toList.sortBy(_._1).flatMap { case (_, students) =>
          Random.shuffle(students)
        }

        // 更新 time
        val updatedAllStudents = sortedAndShuffled.zipWithIndex.map { case (student, index) =>
          student + ("time" -> Json.fromInt(index))
        }

        // 从排序后的列表中取出前 capacity 个学生作为 enrolledStudents
        val finalEnrolledStudents = updatedAllStudents.take(capacity)
        val finalEnrolledStudentsJsonString = finalEnrolledStudents.asJson.noSpaces
        val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

        // 更新数据库
        writeDB(updateStudentsQuery, List(
          SqlParameter("jsonb", finalEnrolledStudentsJsonString),
          SqlParameter("jsonb", updatedAllStudentsJsonString),
          SqlParameter("int", courseID.toString)
        )).map(_ => s"Students reordered and enrolled for course $courseID")
      }
    }
  }
}
