package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserRegisterMessagePlanner(usertype: String, username: String, password: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = usertype.toLowerCase
    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${dbName}.user_name WHERE user_name = ?)",
        List(SqlParameter("String", username))
      )

    checkUserExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("already registered"))
      } else {
        writeDB(s"INSERT INTO ${dbName}.user_name (user_name, password) VALUES (?, ?)",
          List(SqlParameter("String", username),
               SqlParameter("String", password)
          ))
      }
    }
  }

