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
      case "GetCourseListMessage" =>
        IO(decode[GetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseListMessage")))
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
      case "GetCourseByTeacherUsernameMessage" =>
        IO(decode[GetCourseByTeacherUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseByTeacherUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCoursesByStudentUsernameMessage" =>
        IO(decode[GetCoursesByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetWaitingCoursesByStudentUsernameMessage" =>
        IO(decode[GetWaitingCoursesByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "DeleteStudentFromCourseMessage" =>
        IO(decode[DeleteStudentFromCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteStudentFromCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "IsStudentEnrolledMessage" =>
        IO(decode[DeleteStudentFromCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for IsStudentEnrolledMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AddClassroomMessage" =>
        IO(decode[AddClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "DeleteClassroomMessage" =>
        IO(decode[DeleteClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetClassroomMessage" =>
        IO(decode[GetClassroomMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetClassroomMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetClassroomListMessage" =>
        IO(decode[GetClassroomListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetClassroomListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.toString)
          }
      case "GetAvailableClassroomByCapacityHourMessage" =>
        IO(decode[GetAvailableClassroomByCapacityHourMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetAvailableClassroomByCapacityHourMessage")))
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
