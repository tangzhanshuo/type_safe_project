package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{Plan, SqlParameter}
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*

case class AddPlanMessagePlanner(
                                  plan: Plan,
                                  override val planContext: PlanContext
                                ) extends Planner[Plan] {

  override def plan(using planContext: PlanContext): IO[Plan] = {
    val checkQuery = "SELECT COUNT(*) FROM plan WHERE planid = ?"
    val checkParams = List(SqlParameter("int", plan.planid.toString))

    val insertQuery = """
      INSERT INTO plan (
        planid,
        plan_name,
        credits_limits,
        priority
      ) VALUES (?, ?, ?::jsonb, ?::jsonb)
    """

    val insertParams = List(
      SqlParameter("int", plan.planid.toString),
      SqlParameter("string", plan.planName),
      SqlParameter("jsonb", plan.creditsLimits.asJson.noSpaces),
      SqlParameter("jsonb", plan.priority.asJson.noSpaces)
    )

    val selectQuery = "SELECT * FROM plan WHERE planid = ?"
    val selectParams = List(SqlParameter("int", plan.planid.toString))

    for {
      // Check if plan with the same planid already exists
      existingPlans <- readDBRows(checkQuery, checkParams)
      planCount = existingPlans.headOption.flatMap(_.asNumber).flatMap(_.toInt).getOrElse(0)
      _ <- if (planCount > 0) {
        IO.raiseError(new Exception(s"Plan with ID ${plan.planid} already exists"))
      } else {
        // Insert the new plan
        writeDB(insertQuery, insertParams)
      }
      // Retrieve and return the inserted plan
      insertedPlans <- readDBRows(selectQuery, selectParams)
      plan <- insertedPlans.headOption match {
        case Some(row) => IO.fromEither(row.as[Plan].left.map(e => new Exception(s"Failed to parse Plan: ${e.getMessage}")))
        case None => IO.raiseError(new Exception(s"Plan with ID ${plan.planid} not found after insertion"))
      }
    } yield plan
  }
}
