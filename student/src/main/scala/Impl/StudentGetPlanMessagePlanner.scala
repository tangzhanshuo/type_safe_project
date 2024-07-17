package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import Common.DBAPI._
import io.circe.generic.auto._
import io.circe.parser._
import Common.Object.SqlParameter

case class StudentGetPlanMessagePlanner(
                                         username: String,
                                         override val planContext: PlanContext
                                       ) extends Planner[io.circe.Json] {
  override def plan(using planContext: PlanContext): IO[io.circe.Json] = {
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

      plan <- getPlan(planid)

      creditsLimit <- IO.fromEither(plan.creditsLimits.get(year).toRight(new Exception(s"Failed to get credits limits for year $year")))
      priority <- IO.fromEither(plan.priority.get(year).toRight(new Exception(s"Failed to get priority for year $year")))

      resultJson = io.circe.Json.obj(
        "planid" -> plan.planid.asJson,
        "planName" -> plan.planName.asJson,
        "creditsLimits" -> io.circe.Json.obj(
          year.toString -> creditsLimit.asJson
        ),
        "priority" -> io.circe.Json.obj(
          year.toString -> priority.asJson
        )
      )
    } yield resultJson
  }
}
