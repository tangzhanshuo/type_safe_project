package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.parser.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import at.favre.lib.crypto.bcrypt.BCrypt
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}
import java.time.Instant

case class UserLoginMessagePlanner(usertype: String, username: String, password: String, override val planContext: PlanContext) extends Planner[String]:
  private val secretKey = "$5BzEToqzaF!xqahymwn" // Replace with a secure, environment-specific secret key
  private val tokenExpirationInSeconds = 3600 // 1 hour

  override def plan(using PlanContext): IO[String] = {
    if (usertype.isEmpty || username.isEmpty || password.isEmpty) {
      IO.raiseError(new Exception("Invalid input"))
    } else {
      val dbName = usertype.toLowerCase
      for {
        userOpt <- readDBRows(
          s"SELECT user_name, password FROM ${dbName} WHERE user_name = ?",
          List(SqlParameter("String", username))
        ).map(_.headOption)
        result <- userOpt match {
          case Some(userJson) =>
            for {
              storedHash <- IO.fromEither(userJson.hcursor.downField("password").as[String])
              passwordMatches = BCrypt.verifyer().verify(password.toCharArray, storedHash)
              result <- if (passwordMatches.verified) {
                generateToken(username, usertype).map(token => s"Valid user. Token: $token")
              } else {
                IO.raiseError(new Exception("Invalid credentials"))
              }
            } yield result
          case None => IO.raiseError(new Exception("User not found"))
        }
      } yield result
    }
  }

  private def generateToken(username: String, usertype: String): IO[String] = IO {
    val claim = JwtClaim(
      expiration = Some(Instant.now.plusSeconds(tokenExpirationInSeconds).getEpochSecond),
      issuedAt = Some(Instant.now.getEpochSecond),
      content = Map("username" -> username, "usertype" -> usertype).asJson.noSpaces
    )
    JwtCirce.encode(claim, secretKey, JwtAlgorithm.HS256)
  }