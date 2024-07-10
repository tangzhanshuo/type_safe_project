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
      case "UserLoginMessage" =>
        IO(decode[UserLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserLoginMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminAddCourseMessage" =>
        IO(decode[AdminAddCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminGetCourseMessage" =>
        IO(decode[AdminGetCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces) // Ensure the response is a JSON string
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
          }
      case "AdminGetCourseListMessage" =>
        IO(decode[AdminGetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces) // Ensure the response is a JSON string
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
          }
      case "AdminDeleteCourseMessage" =>
        IO(decode[AdminDeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminUpdateCourseMessage" =>
        IO(decode[AdminUpdateCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminAddStudent2CourseMessage" =>
        IO(decode[AdminAddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminDeleteStudentFromCourseMessage" =>
        IO(decode[AdminDeleteStudentFromCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminAddClassroomMessage" =>
        IO(decode[AdminAddClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminDeleteClassroomMessage" =>
        IO(decode[AdminDeleteClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AdminGetClassroomMessage" =>
        IO(decode[AdminGetClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces)
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
          }
      case "AdminGetClassroomListMessage" =>
        IO(decode[AdminGetClassroomListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetClassroomListMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces)
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
          }
      case "AdminGetAvailableClassroomByCapacityHourMessage" =>
        IO(decode[AdminGetAvailableClassroomByCapacityHourMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetAvailableClassroomByCapacityHourMessage")))
          .flatMap { m =>
            m.fullPlan.flatMap { jsonString =>
              parse(jsonString) match {
                case Right(json) => IO.pure(json.noSpaces)
                case Left(error) => IO.raiseError(new Exception(s"Failed to parse JSON: ${error.getMessage}"))
              }
            }
          }
      case "AdminAddApplicationMessage" =>
        IO(decode[AdminAddApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "AdminDeleteApplicationMessage" =>
        IO(decode[AdminDeleteApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminDeleteApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "AdminGetApplicationFromIDMessage" =>
        IO(decode[AdminGetApplicationFromIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "AdminGetApplicationFromApplicantMessage" =>
        IO(decode[AdminGetApplicationFromApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "AdminGetApplicationFromApproverMessage" =>
        IO(decode[AdminGetApplicationFromApproverMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromApproverMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }

      case "AdminApproveApplicationMessage" =>
        IO(decode[AdminApproveApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminApproveApplication")))
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
