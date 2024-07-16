package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserSetInfoMessagePlanner(usertype: String, username: String, info: Json, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = usertype.toLowerCase

    // Check if the user exists
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${dbName} WHERE user_name = ?)",
      List(SqlParameter("String", username))
    )

    for {
      exists <- checkUserExists
      result <- if (exists) {
        writeDB(s"UPDATE ${dbName} SET info = ?::jsonb WHERE user_name = ?",
          List(
            SqlParameter("String", info.noSpaces),
            SqlParameter("String", username)
          )
        )
      } else {
        IO.raiseError(new Exception("User not registered"))
      }
    } yield result
  }
}