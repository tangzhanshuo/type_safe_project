package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserUpdateMessagePlanner(userType: String, userName: String, password: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = userType.toLowerCase
    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${dbName}.user_name WHERE user_name = ?)",
      List(SqlParameter("String", userName))
    )

    checkUserExists.flatMap { exists =>
      if (exists) {
        writeDB(s"UPDATE ${dbName}.user_name SET password = ? WHERE user_name = ?",
          List(
            SqlParameter("String", password),
            SqlParameter("String", userName)
          )
        )
      } else {
        IO.raiseError(new Exception("User not registered"))
      }
    }
  }
}
