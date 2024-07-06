package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    messageType match {
      case "UserLoginMessage" =>
        IO(decode[UserLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserLoginMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserRegisterMessage" =>
        IO(decode[UserRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserRegisterMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserDeleteMessage" =>
        IO(decode[UserDeleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserDeleteMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserUpdateMessage" =>
        IO(decode[UserUpdateMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserUpdateMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UserFindMessage" =>
        IO(decode[UserFindMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserFindMessage")))
          .flatMap { m =>
            m.fullPlan.map { password =>
              Map("password" -> password).asJson.noSpaces
            }
          }
      case "UserJokeMessage" =>
        IO(decode[UserJokeMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserJokeMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
        println("request received")
        req.as[String].flatMap{executePlan(name, _)}.flatMap(Ok(_))
        .handleErrorWith{e =>
          println(e)
          BadRequest(e.getMessage)
        }
