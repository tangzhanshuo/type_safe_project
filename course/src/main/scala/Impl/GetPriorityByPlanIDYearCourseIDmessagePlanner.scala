package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Plan}

case class GetPriorityByPlanIDYearCourseIDMessagePlanner(
                                                          planid: Int,
                                                          year: Int,
                                                          courseid: Int,
                                                          override val planContext: PlanContext
                                                        ) extends Planner[Int] {
  override def plan(using planContext: PlanContext): IO[Int] = {
    val getPlanQuery = "SELECT priority FROM plan WHERE planid = ?"
    val getPlanParams = List(SqlParameter("int", planid.toString))

    readDBRows(getPlanQuery, getPlanParams).flatMap { rows =>
      rows.headOption match {
        case Some(planRow) =>
          val cursor = planRow.hcursor
          cursor.get[String]("priority") match {
            case Right(priorityJsonStr) =>
              decode[Map[Int, Map[Int, Int]]](priorityJsonStr) match {
                case Right(priorityMap) =>
                  priorityMap.get(year) match {
                    case Some(yearMap) =>
                      yearMap.get(courseid) match {
                        case Some(priority) => IO.pure(priority)
                        case None => IO.pure(0) // courseid does not exist
                      }
                    case None => IO.pure(0) // year does not exist
                  }
                case Left(_) => IO.pure(0) // priority JSON parsing error
              }
            case Left(_) => IO.pure(0) // priority field not found
          }
        case None => IO.pure(0) // planid does not exist
      }
    }
  }
}
