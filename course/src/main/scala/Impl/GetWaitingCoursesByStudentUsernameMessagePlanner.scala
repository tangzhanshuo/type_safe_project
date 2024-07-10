package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.SqlParameter
import io.circe.Json

case class GetWaitingCoursesByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val queryAllStudents = """
      SELECT * FROM course 
      WHERE allstudents @> ?::jsonb
    """
    val searchJson = Json.obj("studentusername" -> Json.fromString(studentUsername)).noSpaces

    readDBRows(queryAllStudents, List(SqlParameter("jsonb", s"[$searchJson]"))).flatMap { rows =>
      val waitingCourses = rows.filterNot { row =>
        val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledstudents").getOrElse("[]")
        val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
        enrolledStudents.exists(_("studentusername").as[String].contains(studentUsername))
      }

      waitingCourses match {
        case Nil => IO.raiseError(new NoSuchElementException(s"No waiting courses found with student username: $studentUsername"))
        case _ => IO.pure(waitingCourses.asJson.noSpaces)
      }
    }
  }
}
