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

    val updateStudentsQuery = "UPDATE course SET enrolledstudents = ? WHERE courseid = ?"

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
        // 根据 priority 对 allStudents 进行排序
        val sortedAllStudents = allStudents.sortBy(_("priority").as[Int].getOrElse(Int.MaxValue))

        // 如果 allStudents 数量超过 capacity 并且有大量相同 priority 的学生，需要随机抽样
        val finalEnrolledStudents = if (sortedAllStudents.size > capacity) {
          val selectedStudents = sortedAllStudents.take(capacity)
          val remainingStudents = sortedAllStudents.drop(capacity)

          // 找到最后一个被选中的 priority
          val lastSelectedPriority = selectedStudents.lastOption.flatMap(_("priority").as[Int].toOption).getOrElse(Int.MaxValue)
          val samePriorityStudents = remainingStudents.filter(_("priority").as[Int].contains(lastSelectedPriority))

          // 随机抽样
          val randomSample = Random.shuffle(samePriorityStudents).take(capacity - selectedStudents.count(_("priority").as[Int].contains(lastSelectedPriority)))

          // 更新 enrolledStudents
          (selectedStudents ++ randomSample).take(capacity)
        } else {
          sortedAllStudents
        }

        val finalEnrolledStudentsJsonString = finalEnrolledStudents.asJson.noSpaces

        writeDB(updateStudentsQuery, List(
          SqlParameter("jsonb", finalEnrolledStudentsJsonString),
          SqlParameter("int", courseID.toString)
        )).map(_ => s"Students reordered and enrolled for course $courseID")
      }
    }
  }
}
