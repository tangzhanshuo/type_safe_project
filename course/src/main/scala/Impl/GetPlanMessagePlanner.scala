package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object._
import cats.implicits._

case class GetPlanMessagePlanner(planid: Int, override val planContext: PlanContext) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    val query = "SELECT * FROM plan WHERE planid = ?"
    readDBRows(query, List(SqlParameter("int", planid.toString))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val cursor = row.hcursor

          val planID = cursor.get[Int]("planid").left.map(e => new Exception("Missing planid"))
          val planName = cursor.get[String]("planName").left.map(e => new Exception("Missing planName"))

          val creditsLimitsStr = cursor.get[String]("creditsLimits").left.map(e => new Exception("Missing creditsLimits"))
          val creditsLimits = creditsLimitsStr.flatMap(str => decode[Map[Int, CreditsLimits]](str).left.map(e => new Exception(s"Invalid JSON for creditsLimits: ${e.getMessage}")))

          val priorityStr = cursor.get[String]("priority").left.map(e => new Exception("Missing priority"))
          val priority = priorityStr.flatMap(str => decode[Map[Int, Map[Int, Int]]](str).left.map(e => new Exception(s"Invalid JSON for priority: ${e.getMessage}")))

          (planID, planName, creditsLimits, priority) match {
            case (Right(planID), Right(planName), Right(creditsLimits), Right(priority)) =>
              IO.pure(Plan(planID, planName, creditsLimits, priority))
            case _ =>
              IO.raiseError(new Exception("Failed to parse plan data"))
          }

        case None => IO.raiseError(new NoSuchElementException(s"No plan found with planid: $planid"))
      }
    }
  }
}
