package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.{decode, parse}
import io.circe.syntax.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    messageType match {
      case "StudentGetCourseListMessage" =>
        IO(decode[StudentGetCourseListMessage](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCourseListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentGetCourseMessage" =>
        IO(decode[StudentGetCourseMessage](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentAddCourseMessage" =>
        IO(decode[StudentAddCourseMessage](str).getOrElse(throw new Exception("Invalid JSON for StudentAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentDeleteCourseMessage" =>
        IO(decode[StudentDeleteCourseMessage](str).getOrElse(throw new Exception("Invalid JSON for StudentDeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentAddApplicationMessage" =>
        IO(decode[StudentAddApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentAddApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentGetApplicationFromApplicantMessage" =>
        IO(decode[StudentGetApplicationFromApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetApplicationFromApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces) // Ensure the response is a JSON string
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
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
