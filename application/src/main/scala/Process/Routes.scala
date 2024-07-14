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
      case "AddApplicationMessage" =>
        IO(decode[AddApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "GetApplicationByIDMessage" =>
        IO(decode[GetApplicationByIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetApplicationByIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "GetApplicationByApproverMessage" =>
        IO(decode[GetApplicationByApproverMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetApplicationByApproverMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "GetApplicationByApplicantMessage" =>
        IO(decode[GetApplicationByApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetApplicationByApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "ApproveApplicationMessage" =>
        IO(decode[ApproveApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ApproveApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "RejectApplicationMessage" =>
        IO(decode[RejectApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RejectApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "DeleteApplicationMessage" =>
        IO(decode[DeleteApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
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
