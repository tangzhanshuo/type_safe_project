package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.Json
import io.circe.parser.parse
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter

case class GetWaitingCoursesByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val queryAllStudents = """
      SELECT * FROM course 
      WHERE allstudents @> ?::jsonb
    """
    val searchJson = Json.obj("studentusername" -> Json.fromString(studentUsername)).noSpaces

    readDBRows(queryAllStudents, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      val waitingCoursesWithPosition = rows.flatMap { row =>
        val capacity = row.hcursor.get[Int]("capacity").getOrElse(0)
        val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").getOrElse("[]")
        val allStudentsJsonString = row.hcursor.get[String]("allstudents").getOrElse("[]")
        val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
        val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)

        // 检查学生是否在enrolledstudents中
        val isEnrolled = enrolledStudents.exists(_("studentusername").as[String].contains(studentUsername))
        if (!isEnrolled) {
          // 按time字段排序
          val sortedAllStudents = allStudents.sortBy(_("time").as[Int].getOrElse(Int.MaxValue))
          // 找到学生在allstudents中的位置
          val positionInAllStudents = sortedAllStudents.indexWhere(_("studentusername").as[String].contains(studentUsername))
          if (positionInAllStudents >= 0) {
            // 计算等待位置
            val waitingPosition = positionInAllStudents - capacity
            Some((row, waitingPosition))
          } else {
            None
          }
        } else {
          None
        }
      }

      waitingCoursesWithPosition match {
        case Nil => IO.raiseError(new NoSuchElementException(s"No waiting courses found with student username: $studentUsername"))
        case _ =>
          // 将结果转化为包含课程信息和等待位置的JSON对象列表
          val result = waitingCoursesWithPosition.map { case (row, waitingPosition) =>
            Json.obj(
              "course" -> row.asJson,
              "waitingPosition" -> Json.fromInt(waitingPosition)
            )
          }
          IO.pure(result.asJson.noSpaces)
      }
    }
  }
}
