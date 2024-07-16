package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import at.favre.lib.crypto.bcrypt.BCrypt

case class UserRegisterMessagePlanner(usertype: String, username: String, password: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    val dbName = usertype.toLowerCase

    // Hash the password using BCrypt
    val hashedPassword = IO {
      val bcrypt = BCrypt.withDefaults()
      bcrypt.hashToString(12, password.toCharArray)
    }

    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${dbName} WHERE user_name = ?)",
      List(SqlParameter("String", username))
    )

    for {
      exists <- checkUserExists
      hashed <- hashedPassword
      result <- if (exists) {
        IO.raiseError(new Exception("User already registered"))
      } else {
        writeDB(s"INSERT INTO ${dbName} (user_name, password, info) VALUES (?, ?, ?)",
          List(SqlParameter("String", username),
               SqlParameter("String", hashed),
               SqlParameter("Jsonb", s"{\"name\": \"${username}\"}")
          ))
      }
    } yield result
  }