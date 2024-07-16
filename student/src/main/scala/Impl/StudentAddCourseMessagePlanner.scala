package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.*
import Common.DBAPI._
import io.circe.generic.auto._
import io.circe.parser._
import Common.Object.SqlParameter

case class StudentAddCourseMessagePlanner(username: String, courseID: Int, priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getStudentQuery = "SELECT info FROM student WHERE user_name = ?"
    val getStudentParams = List(SqlParameter("string", username))

    for {
      studentRows <- readDBRows(getStudentQuery, getStudentParams)
      studentRow <- studentRows.headOption match {
        case Some(row) => IO.pure(row)
        case None => IO.raiseError(new Exception(s"Student with username $username not found"))
      }
      infoJson <- IO.fromEither(studentRow.hcursor.get[String]("info").left.map(e => new Exception(s"Failed to get info: ${e.getMessage}")))
      info <- IO.fromEither(parse(infoJson).left.map(e => new Exception(s"Failed to parse info JSON: ${e.getMessage}")))
      planid <- IO.fromEither(info.hcursor.get[Int]("planid").left.map(e => new Exception(s"Failed to get planid from info: ${e.getMessage}")))
      year <- IO.fromEither(info.hcursor.get[Int]("year").left.map(e => new Exception(s"Failed to get year from info: ${e.getMessage}")))
      planPriority <- getPriorityByPlanIDYearCourseID(planid, year, courseID)
      finalPriority = planPriority * 3 + priority.getOrElse(0)
      result <- addStudent2Course(courseID, Some(username), Some(finalPriority))
    } yield result
  }
}