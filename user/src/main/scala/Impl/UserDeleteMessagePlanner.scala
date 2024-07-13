package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserDeleteMessagePlanner(usertype: String, username: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = usertype.toLowerCase
    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${dbName} WHERE user_name = ?)",
      List(SqlParameter("String", username))
    )

    checkUserExists.flatMap { exists =>
      if (exists) {
        writeDB(s"DELETE FROM ${dbName} WHERE user_name = ?",
          List(SqlParameter("String", username))
        )
      } else {
        IO.raiseError(new Exception("User not registered"))
      }
    }
  }
}
