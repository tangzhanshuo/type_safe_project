package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class UserFindMessagePlanner(usertype: String, username: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = usertype.toLowerCase
    // Query to find the user's password
    val findPasswordQuery = s"SELECT password FROM ${dbName} WHERE user_name = ?"

    // Execute the query to get the password
    readDBString(findPasswordQuery, List(SqlParameter("String", username))).flatMap {
      case password if password.nonEmpty => IO.pure(password)
      case _ => IO.raiseError(new Exception("User not found"))
    }
  }
}
