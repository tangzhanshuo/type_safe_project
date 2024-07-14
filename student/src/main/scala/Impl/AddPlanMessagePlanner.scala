package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddPlanMessagePlanner(
                                  planName: String,
                                  creditsLimitsJson: String,
                                  p1CoursesJson: String,
                                  p2CoursesJson: String,
                                  override val planContext: PlanContext
                                ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    def getNewPlanID: IO[Int] = {
      readDBRows("SELECT MAX(planid) FROM plan", List.empty)
        .map { jsonList =>
          jsonList.headOption
            .flatMap(_.asObject)
            .flatMap(_.values.headOption)
            .flatMap(_.asNumber)
            .flatMap(_.toInt)
            .map(_ + 1)
            .getOrElse(1)
        }
    }

    // Validate the JSON strings by parsing them
    val creditsLimitsValidation = parse(creditsLimitsJson).left.map(e => new Exception(s"Invalid JSON for creditsLimits: ${e.getMessage}"))
    val p1CoursesValidation = parse(p1CoursesJson).left.map(e => new Exception(s"Invalid JSON for p1Courses: ${e.getMessage}"))
    val p2CoursesValidation = parse(p2CoursesJson).left.map(e => new Exception(s"Invalid JSON for p2Courses: ${e.getMessage}"))

    (creditsLimitsValidation, p1CoursesValidation, p2CoursesValidation) match {
      case (Right(_), Right(_), Right(_)) =>
        getNewPlanID.flatMap { newPlanID =>
          val insertQuery = """
            INSERT INTO plan (
              planid,
              planname,
              credits_limits,
              p1courses,
              p2courses
            ) VALUES (?, ?, ?::jsonb, ?::jsonb, ?::jsonb)
            ON CONFLICT (planid) DO NOTHING
          """

          val params = List(
            SqlParameter("int", newPlanID.toString),
            SqlParameter("string", planName),
            SqlParameter("jsonb", creditsLimitsJson),
            SqlParameter("jsonb", p1CoursesJson),
            SqlParameter("jsonb", p2CoursesJson)
          )

          writeDB(insertQuery, params).map(_ => s"Plan $planName successfully added with ID $newPlanID")
        }

      case (Left(creditsLimitsError), _, _) => IO.raiseError(creditsLimitsError)
      case (_, Left(p1CoursesError), _) => IO.raiseError(p1CoursesError)
      case (_, _, Left(p2CoursesError)) => IO.raiseError(p2CoursesError)
    }
  }
}
