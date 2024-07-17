package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object._
import cats.implicits._

case class UpdateCoursePriorityMessagePlanner(planid: Int, year: Int, courseid: Int, priority: Int, override val planContext: PlanContext) extends Planner[Plan] {
  override def plan(using planContext: PlanContext): IO[Plan] = {
    val getPlanQuery = "SELECT * FROM plan WHERE planid = ?"
    val updatePlanQuery = "UPDATE plan SET priority = ? WHERE planid = ?"

    // 获取当前 Plan
    val planIO = readDBRows(getPlanQuery, List(SqlParameter("int", planid.toString))).flatMap { rows =>
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

    // 更新 Plan 的优先级
    planIO.flatMap { plan =>
      val updatedPriority = plan.priority.updatedWith(year) {
        case Some(yearMap) => Some(yearMap.updated(courseid, priority))
        case None => Some(Map(courseid -> priority))
      }

      val updatedPlan = plan.copy(priority = updatedPriority)

      // 将更新后的 Plan 写回数据库
      writeDB(updatePlanQuery, List(
        SqlParameter("jsonb", updatedPlan.priority.asJson.noSpaces),
        SqlParameter("int", planid.toString)
      )).map(_ => updatedPlan)
    }
  }
}
