package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserLoginMessagePlanner(usertype: String, username:String, password:String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    if (usertype.isEmpty || username.isEmpty || password.isEmpty) {
      IO.pure("Invalid user")
    } else {
      val dbName = usertype.toLowerCase
      readDBRows(
        s"SELECT user_name FROM ${dbName}.user_name WHERE user_name = ? AND password = ?",
        List(SqlParameter("String", username), SqlParameter("String", password))
      ).map {
        case Nil => "Invalid user"
        case _ => "Valid user"
      }
    }
  }

