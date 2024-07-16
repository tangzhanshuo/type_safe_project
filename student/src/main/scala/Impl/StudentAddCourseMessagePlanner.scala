package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.*
import Common.DBAPI._
import io.circe.generic.auto._
import Common.Object.SqlParameter

case class StudentAddCourseMessagePlanner(username: String, courseID: Int, priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getStudentQuery = "SELECT planid, year FROM student WHERE user_name = ?"
    val getStudentParams = List(SqlParameter("string", username))

    for {
      studentRows <- readDBRows(getStudentQuery, getStudentParams)
      studentRow <- studentRows.headOption match {
        case Some(row) => IO.pure(row)
        case None => IO.raiseError(new Exception(s"Student with username $username not found"))
      }
      planid <- IO.fromEither(studentRow.hcursor.get[Int]("planid").left.map(e => new Exception(s"Failed to get planid: ${e.getMessage}")))
      year <- IO.fromEither(studentRow.hcursor.get[Int]("year").left.map(e => new Exception(s"Failed to get year: ${e.getMessage}")))
      planPriority <- getPriorityByPlanIDYearCourseID(planid, year, courseID)
      finalPriority = planPriority * 3 + priority.getOrElse(0)
      result <- addStudent2Course(courseID, Some(username), Some(finalPriority))
    } yield result
  }
}
