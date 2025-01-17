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
      case "TeacherAddCourseMessage" =>
        IO(decode[TeacherAddCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "TeacherDeleteCourseMessage" =>
        IO(decode[TeacherDeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherDeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "TeacherGetCourseListMessage" =>
        IO(decode[TeacherGetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherGetCourseListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "TeacherGetCourseMessage" =>
        IO(decode[TeacherGetCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "TeacherEndPreRegisterMessage" =>
        IO(decode[TeacherEndPreRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherEndPreRegisterMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "TeacherApproveApplicationMessage" =>
        IO(decode[TeacherApproveApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherApproveApplication")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "TeacherDeleteApplicationMessage" =>
        IO(decode[TeacherDeleteApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherDeleteApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "TeacherGetApplicationFromApplicantMessage" =>
        IO(decode[TeacherGetApplicationFromApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherGetApplicationFromApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "TeacherGetApplicationFromApproverMessage" =>
        IO(decode[TeacherGetApplicationFromApproverMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for TeacherGetApplicationFromApproverMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
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
