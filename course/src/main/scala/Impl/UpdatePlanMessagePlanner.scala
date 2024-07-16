package Impl

import cats.effect.IO
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object._

case class UpdatePlanMessagePlanner(
                                     planid: Int,
                                     planName: Option[String],
                                     creditsLimits: Option[Map[Int, CreditsLimits]],
                                     priority: Option[Map[Int, Map[Int, Int]]],
                                     override val planContext: PlanContext
                                   ) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    val getCurrentPlanQuery = "SELECT * FROM plan WHERE planid = ?"
    val getCurrentPlanParams = List(SqlParameter("int", planid.toString))

    val updatePlanQuery = "UPDATE plan SET %s WHERE planid = ?"

    readDBRows(getCurrentPlanQuery, getCurrentPlanParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentPlan) =>
          val cursor = currentPlan.hcursor

          val updatedPlanName = planName.orElse(cursor.get[String]("plan_name").toOption)
          val updatedCreditsLimits = creditsLimits.orElse(
            for {
              creditsLimitsStr <- cursor.get[String]("credits_limits").toOption
              decodedCreditsLimits <- decode[Map[Int, CreditsLimits]](creditsLimitsStr).toOption
            } yield decodedCreditsLimits
          )

          val updatedPriority = priority.orElse(
            for {
              priorityStr <- cursor.get[String]("priority").toOption
              decodedPriority <- decode[Map[Int, Map[Int, Int]]](priorityStr).toOption
            } yield decodedPriority
          )

          // Validate the JSON strings by parsing them
          val creditsLimitsValidation = updatedCreditsLimits.map(limits => parse(limits.asJson.noSpaces).left.map(e => new Exception(s"Invalid JSON for creditsLimits: ${e.getMessage}"))).sequence
          val priorityValidation = updatedPriority.map(p => parse(p.asJson.noSpaces).left.map(e => new Exception(s"Invalid JSON for priority: ${e.getMessage}"))).sequence

          (creditsLimitsValidation, priorityValidation) match {
            case (Right(_), Right(_)) =>
              val updates = List(
                updatedPlanName.map(_ => "plan_name = ?"),
                updatedCreditsLimits.map(_ => "credits_limits = ?::jsonb"),
                updatedPriority.map(_ => "priority = ?::jsonb")
              ).flatten.mkString(", ")

              val params = List(
                updatedPlanName.map(SqlParameter("string", _)),
                updatedCreditsLimits.map(limits => SqlParameter("jsonb", limits.asJson.noSpaces)),
                updatedPriority.map(p => SqlParameter("jsonb", p.asJson.noSpaces)),
                Some(SqlParameter("int", planid.toString))
              ).flatten

              writeDB(updatePlanQuery.format(updates), params).flatMap { _ =>
                val selectQuery = "SELECT * FROM plan WHERE planid = ?"
                val selectParams = List(SqlParameter("int", planid.toString))

                readDBRows(selectQuery, selectParams).flatMap { rows =>
                  rows.headOption match {
                    case Some(row) =>
                      IO.fromEither(row.as[Plan].left.map(e => new Exception(s"Failed to parse Plan: ${e.getMessage}")))
                    case None => IO.raiseError(new Exception(s"Plan with ID $planid not found after update"))
                  }
                }
              }

            case (Left(creditsLimitsError), _) => IO.raiseError(new Exception(s"Invalid JSON for creditsLimits: ${creditsLimitsError.getMessage}"))
            case (_, Left(priorityError)) => IO.raiseError(new Exception(s"Invalid JSON for priority: ${priorityError.getMessage}"))
          }

        case None => IO.raiseError(new Exception(s"Plan with ID $planid not found"))
      }
    }
  }
}
