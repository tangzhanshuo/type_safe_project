package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*

import java.util.UUID

case class DeleteApplicationMessagePlanner(
                                       applicationID: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    writeDB("DELETE FROM application WHERE applicationID = ?", List(SqlParameter("string", applicationID))
    ).map(_ => applicationID)
  }
}
