package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.Json
import io.circe.parser.parse
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class GetWaitingPositionByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCoursesQuery = "SELECT * FROM course"
    val getCoursesParams = List.empty[SqlParameter]

    readDBRows(getCoursesQuery, getCoursesParams).flatMap { rows =>
      if (rows.isEmpty) IO.raiseError(new NoSuchElementException("No courses found"))
      else {
        val result = rows.flatMap { row =>
          val courseID = row.hcursor.get[Int]("courseid").getOrElse(0)
          val capacity = row.hcursor.get[Int]("capacity").getOrElse(0)
          val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").getOrElse("[]")
          val allStudentsJsonString = row.hcursor.get[String]("allstudents").getOrElse("[]")
          val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
          val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)

          // 检查学生是否在enrolledstudents中但在allstudents中
          val isEnrolled = enrolledStudents.exists(_("studentusername").as[String].contains(studentUsername))
          val isInAllStudents = allStudents.exists(_("studentusername").as[String].contains(studentUsername))

          if (!isEnrolled && isInAllStudents) {
            // 计算等待列表中该学生的位置
            val waitingList = allStudents.filterNot(student => enrolledStudents.exists(_("studentusername") == student("studentusername")))
            val position = waitingList.indexWhere(_("studentusername").as[String].contains(studentUsername))

            // 计算优先级统计
            val priorityCounts = waitingList.groupBy(_("priority").as[Int].getOrElse(0)).mapValues(_.size).toMap
            val priorityList = (0 to 8).map(priorityCounts.getOrElse(_, 0))

            Some(courseID.toString -> Json.obj(
              "priority" -> priorityList.asJson,
              "position" -> Json.fromInt(position)
            ))
          } else {
            None
          }
        }.toMap

        if (result.isEmpty) IO.raiseError(new NoSuchElementException(s"No waiting courses found with student username: $studentUsername"))
        else IO.pure(Json.obj(result.toSeq: _*).noSpaces)
      }
    }
  }
}
