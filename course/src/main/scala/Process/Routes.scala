package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.dsl.io.*

object Routes:
  private def executePlan(messageType: String, str: String): IO[String] =
    messageType match {
      case "AddCourseMessage" =>
        IO(decode[AddCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "DeleteCourseMessage" =>
        IO(decode[DeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetCourseMessage" =>
        IO(decode[GetCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "UpdateCourseMessage" =>
        IO(decode[UpdateCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UpdateCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AddStudent2CourseMessage" =>
        IO(decode[AddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddStudent2CourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }

      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
      println("request received")
      req.as[String].flatMap { executePlan(name, _) }.flatMap(Ok(_))
        .handleErrorWith { e =>
          println(e)
          BadRequest(e.getMessage)
        }
