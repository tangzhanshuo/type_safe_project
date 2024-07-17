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
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "DeleteCourseMessage" =>
        IO(decode[DeleteCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCourseByCourseIDMessage" =>
        IO(decode[GetCourseByCourseIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseByCourseIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCourseListMessage" =>
        IO(decode[GetCourseListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "UpdateCourseMessage" =>
        IO(decode[UpdateCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UpdateCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AddStudent2CourseMessage" =>
        IO(decode[AddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddStudent2CourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "ForceAddStudent2CourseMessage" =>
        IO(decode[ForceAddStudent2CourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ForceAddStudent2CourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCourseByCourseNameMessage" =>
        IO(decode[GetCourseByCourseNameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseByCourseNameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCourseByTeacherUsernameMessage" =>
        IO(decode[GetCourseByTeacherUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseByTeacherUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCourseByStudentUsernameMessage" =>
        IO(decode[GetCourseByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCourseByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetAllCoursesByStudentUsernameMessage" =>
        IO(decode[GetAllCoursesByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetWaitingPositionByStudentUsernameMessage" =>
        IO(decode[GetWaitingPositionByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetWaitingCoursesByStudentUsernameMessage" =>
        IO(decode[GetWaitingCoursesByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetCreditsByStudentUsernameMessage" =>
        IO(decode[GetCreditsByStudentUsernameMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetCoursesByStudentUsernameMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "DeleteStudentFromCourseMessage" =>
        IO(decode[DeleteStudentFromCourseMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for DeleteStudentFromCourseMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "IsStudentEnrolledMessage" =>
        IO(decode[IsStudentEnrolledMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for IsStudentEnrolledMessage")))
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
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetClassroomListMessage" =>
        IO(decode[GetClassroomListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetClassroomListMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetAvailableClassroomByCapacityHourMessage" =>
        IO(decode[GetAvailableClassroomByCapacityHourMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetAvailableClassroomByCapacityHourMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "ReorderStudentsByCourseIDMessage" =>
        IO(decode[ReorderStudentsByCourseIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetAvailableClassroomByCapacityHourMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "AddPlanMessage" =>
        IO(decode[AddPlanMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddPlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "UpdatePlanMessage" =>
        IO(decode[UpdatePlanMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for UpdatePlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetPriorityByPlanIDYearCourseIDMessage" =>
        IO(decode[GetPriorityByPlanIDYearCourseIDMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetPriorityByPlanIDYearCourseIDMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetPlanMessage" =>
        IO(decode[GetPlanMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetPlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "GetPlanListMessage" =>
        IO(decode[GetPlanListMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetPlanMessage")))
          .flatMap { m =>
            m.fullPlan.map(_.asJson.noSpaces)
          }
      case "UpdateCoursePriorityMessage"=>
        IO(decode[UpdateCoursePriorityMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for GetPlanMessage")))
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
