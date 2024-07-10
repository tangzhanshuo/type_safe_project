package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*

import java.util.UUID

case class GetApplicationByApproverMessagePlanner(
                                       usertype: String,
                                       username: String,
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query = s"""
                   |SELECT * FROM application WHERE EXISTS (
                   |  SELECT 1 FROM jsonb_array_elements(approver) AS elem
                   |  WHERE elem->>'usertype' = ? AND
                   |         (elem->>'username' = '' OR elem->>'username' = ?)
                   |);
         """.stripMargin
    readDBRows(query, List(SqlParameter("string", usertype), SqlParameter("string", username))).map { rows =>
      if (rows.isEmpty) throw new NoSuchElementException(s"No application found")
      else rows.asJson.noSpaces
    }
  }
}