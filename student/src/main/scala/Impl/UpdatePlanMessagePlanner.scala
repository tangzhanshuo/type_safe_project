package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class UpdatePlanMessagePlanner(
                                     planID: Int,
                                     planName: Option[String],
                                     creditsLimitsJson: Option[String],
                                     p1CoursesJson: Option[String],
                                     p2CoursesJson: Option[String],
                                     override val planContext: PlanContext
                                   ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCurrentPlanQuery = "SELECT * FROM plan WHERE planid = ?"
    val getCurrentPlanParams = List(SqlParameter("int", planID.toString))

    val updatePlanQuery = "UPDATE plan SET %s WHERE planid = ?"

    readDBRows(getCurrentPlanQuery, getCurrentPlanParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentPlan) =>
          val existingPlan = currentPlan.hcursor

          val updatedPlanName = planName.orElse(existingPlan.get[String]("planname").toOption).getOrElse("")
          val updatedCreditsLimitsJson = creditsLimitsJson.orElse(existingPlan.get[String]("credits_limits").toOption).getOrElse("[]")
          val updatedP1CoursesJson = p1CoursesJson.orElse(existingPlan.get[String]("p1courses").toOption).getOrElse("[]")
          val updatedP2CoursesJson = p2CoursesJson.orElse(existingPlan.get[String]("p2courses").toOption).getOrElse("[]")

          // Validate the JSON strings by parsing them
          val creditsLimitsValidation = parse(updatedCreditsLimitsJson).left.map(e => new Exception(s"Invalid JSON for creditsLimits: ${e.getMessage}"))
          val p1CoursesValidation = parse(updatedP1CoursesJson).left.map(e => new Exception(s"Invalid JSON for p1Courses: ${e.getMessage}"))
          val p2CoursesValidation = parse(updatedP2CoursesJson).left.map(e => new Exception(s"Invalid JSON for p2Courses: ${e.getMessage}"))

          (creditsLimitsValidation, p1CoursesValidation, p2CoursesValidation) match {
            case (Right(_), Right(_), Right(_)) =>
              val updates = List(
                Some("planname = ?"),
                Some("credits_limits = ?::jsonb"),
                Some("p1courses = ?::jsonb"),
                Some("p2courses = ?::jsonb")
              ).flatten.mkString(", ")

              val params = List(
                SqlParameter("string", updatedPlanName),
                SqlParameter("jsonb", updatedCreditsLimitsJson),
                SqlParameter("jsonb", updatedP1CoursesJson),
                SqlParameter("jsonb", updatedP2CoursesJson),
                SqlParameter("int", planID.toString)
              )

              writeDB(updatePlanQuery.format(updates), params).map(_ => s"Plan with ID $planID successfully updated")

            case (Left(creditsLimitsError), _, _) => IO.raiseError(creditsLimitsError)
            case (_, Left(p1CoursesError), _) => IO.raiseError(p1CoursesError)
            case (_, _, Left(p2CoursesError)) => IO.raiseError(p2CoursesError)
          }

        case None => IO.raiseError(new Exception(s"Plan with ID $planID not found"))
      }
    }
  }
}
