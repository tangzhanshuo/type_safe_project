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
      case "UserLoginMessage" =>
        IO(decode[UserLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UserLoginMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminAddCourseMessage" =>
        IO(decode[AdminAddCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetCourseMessage" =>
        IO(decode[AdminGetCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetCourseListMessage" =>
        IO(decode[AdminGetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetCourseListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminDeleteCourseMessage" =>
        IO(decode[AdminDeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminDeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminUpdateCourseMessage" =>
        IO(decode[AdminUpdateCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminUpdateCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminAddStudent2CourseMessage" =>
        IO(decode[AdminAddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddStudent2CourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminForceAddStudent2CourseMessage" =>
        IO(decode[AdminForceAddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminForceAddStudent2CourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminDeleteStudentFromCourseMessage" =>
        IO(decode[AdminDeleteStudentFromCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminDeleteStudentFromCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetCourseByStudentUsernameMessage" =>
        IO(decode[AdminGetCourseByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetCourseByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetWaitingPositionByStudentUsernameMessage" =>
        IO(decode[AdminGetWaitingPositionByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetWaitingPositionByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetWaitingCoursesByStudentUsernameMessage" =>
        IO(decode[AdminGetWaitingCoursesByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetWaitingCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminAddClassroomMessage" =>
        IO(decode[AdminAddClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminDeleteClassroomMessage" =>
        IO(decode[AdminDeleteClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminDeleteClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetClassroomMessage" =>
        IO(decode[AdminGetClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetClassroomListMessage" =>
        IO(decode[AdminGetClassroomListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetClassroomListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetAvailableClassroomByCapacityHourMessage" =>
        IO(decode[AdminGetAvailableClassroomByCapacityHourMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetAvailableClassroomByCapacityHourMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminReorderStudentsByCourseIDMessage" =>
        IO(decode[AdminReorderStudentsByCourseIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminReorderStudentsByCourseIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminAddApplicationMessage" =>
        IO(decode[AdminAddApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminAddApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminDeleteApplicationMessage" =>
        IO(decode[AdminDeleteApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminDeleteApplicationMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetApplicationFromIDMessage" =>
        IO(decode[AdminGetApplicationFromIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetApplicationFromApplicantMessage" =>
        IO(decode[AdminGetApplicationFromApplicantMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromApplicantMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminGetApplicationFromApproverMessage" =>
        IO(decode[AdminGetApplicationFromApproverMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminGetApplicationFromApproverMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminApproveApplicationMessage" =>
        IO(decode[AdminApproveApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminApproveApplication")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AdminRejectApplicationMessage" =>
        IO(decode[AdminRejectApplicationMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminRejectApplication")))
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
