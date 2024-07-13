package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}

case class UserValidateTokenMessagePlanner(usertype: String, username: String, token: String, override val planContext: PlanContext) extends Planner[String]:
  private val secretKey = "$5BzEToqzaF!xqahymwn" // Replace with the same secret key used in UserLoginMessagePlanner

  override def plan(using PlanContext): IO[String] = {
    if (usertype.isEmpty || username.isEmpty || token.isEmpty) {
      IO.raiseError(new Exception("Invalid input"))
    } else {
      for {
        tokenValidation <- validateToken(token)
        result <- tokenValidation match {
          case Some((tokenUsername, tokenUsertype))
            if tokenUsername == username && tokenUsertype == usertype =>
            IO.pure("Token is valid and matches the user and usertype")
          case Some(_) =>
            IO.raiseError(new Exception("Token is valid but does not match the provided user or usertype"))
          case None =>
            IO.raiseError(new Exception("Invalid or expired token"))
        }
      } yield result
    }
  }

  private def validateToken(token: String): IO[Option[(String, String)]] = IO {
    JwtCirce.decodeAll(token, secretKey, Seq(JwtAlgorithm.HS256)).toOption.flatMap { case (_, claim, _) =>
      decode[Map[String, String]](claim.content).toOption.flatMap { content =>
        for {
          username <- content.get("username")
          usertype <- content.get("usertype")
        } yield (username, usertype)
      }
    }
  }