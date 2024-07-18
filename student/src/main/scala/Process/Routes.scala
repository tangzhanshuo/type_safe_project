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
        IO(decode[StudentGetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCourseListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentGetCourseMessage" =>
        IO(decode[StudentGetCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentAddCourseMessage" =>
        IO(decode[StudentAddCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentDeleteCourseMessage" =>
        IO(decode[StudentDeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentDeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentAddApplicationMessage" =>
        IO(decode[StudentAddApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentAddApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentDeleteApplicationMessage" =>
        IO(decode[StudentDeleteApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentDeleteApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentGetCourseByUsernameMessage" =>
        IO(decode[StudentGetCourseByUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCourseByUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentGetAllCoursesByUsernameMessage" =>
        IO(decode[StudentGetAllCoursesByUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetAllCoursesByUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentGetApplicationFromApplicantMessage" =>
        IO(decode[StudentGetApplicationFromApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetApplicationFromApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "StudentManualSelectCourseMessage" =>
        IO(decode[StudentManualSelectCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentManualSelectCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentGetCreditsMessage" =>
        IO(decode[StudentGetCreditsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetCreditsMessage")))
        .flatMap { m =>
          m.fullPlan.map(_.asJson.toString)
        }
      case "StudentGetPlanMessage" =>
        IO(decode[StudentGetPlanMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetPlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentGetWaitingPositionMessage" =>
        IO(decode[StudentGetWaitingPositionMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetPlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "StudentGetClassroomListMessage" =>
        IO(decode[StudentGetClassroomListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for StudentGetPlanMessage")))
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
