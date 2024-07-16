package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserGetInfoMessagePlanner(usertype: String, username: String, override val planContext: PlanContext) extends Planner[Json]:
  override def plan(using planContext: PlanContext): IO[Json] = {
    val dbName = usertype.toLowerCase

    // Query to get the "info" column for the specified user
    val getUserInfo = readDBJson(
      s"SELECT info FROM ${dbName} WHERE user_name = ?",
      List(SqlParameter("String", username))
    )

    getUserInfo.flatMap {
      case json if json.isNull => IO.raiseError(new Exception(s"User not found: $username"))
      case json => IO.pure(json)
    }.handleErrorWith { error =>
      IO.raiseError(new Exception(s"Error fetching user info for $username: ${error.getMessage}"))
    }
  }