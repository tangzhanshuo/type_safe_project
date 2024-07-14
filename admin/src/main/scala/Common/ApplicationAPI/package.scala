package Common

import Common.API.{API, PlanContext, TraceID}
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import org.http4s.client.Client
import io.circe.{Json, parser}

package object ApplicationAPI {

  class Application(
                     var usertype: String,
                     var username: String,
                     var applicationType: String,
                     var info: Json,
                     var approver: Json
                   ) {
    // Method to add or update a field in the info JSON
    def addInfo(key: String, value: String | Int | Json): Unit = {
      val jsonValue = value match {
        case s: String => Json.fromString(s)
        case i: Int => Json.fromInt(i)
        case j: Json => j
      }
      info = info.deepMerge(Json.obj((key, jsonValue)))
    }

    // Method to add or update a field in the approver JSON
    def addApprover(usertype: String, username: String = ""): Unit = {
      val approverObj = Json.obj(
        ("usertype", Json.fromString(usertype)),
        ("username", Json.fromString(username)),
        ("approved", Json.fromBoolean(false))
      )

      approver = approver.asArray match {
        case Some(arr) => Json.arr(arr :+ approverObj: _*)
        case None => Json.arr(approverObj)
      }
    }
  }

  // Helper function to create an Application with string JSON
  def createApplication(
                         usertype: String,
                         username: String,
                         applicationType: String,
                         infoJson: String = "{}",
                         approverJson: String = "[]"
                       ): Application = {
    val info = parser.parse(infoJson).getOrElse(Json.obj())
    val approver = parser.parse(approverJson).getOrElse(Json.arr())
    new Application(usertype, username, applicationType, info, approver)
  }

  // Modified addApplication function
  def addApplication(application: Application)(using PlanContext): IO[String] =
    AddApplicationMessage(
      application.usertype,
      application.username,
      application.applicationType,
      application.info.noSpaces,
      application.approver.noSpaces
    ).send

  def getApplicationByID(applicationID: String)(using PlanContext): IO[String] =
    GetApplicationByIDMessage(applicationID).send

  def getApplicationByApprover(usertype: String, username: String)(using PlanContext): IO[String] =
    GetApplicationByApproverMessage(usertype, username).send

  def getApplicationByApplicant(usertype: String, username: String)(using PlanContext): IO[String] =
    GetApplicationByApplicantMessage(usertype, username).send

  def approveApplication(usertype: String, username: String, applicationID: String)(using PlanContext): IO[String] =
    ApproveApplicationMessage(usertype, username, applicationID).send

  def rejectApplication(usertype: String, username: String, applicationID: String)(using PlanContext): IO[String] =
    RejectApplicationMessage(usertype, username, applicationID).send

  def deleteApplication(usertype: String, username: String, applicationID: String)(using PlanContext): IO[String] =
    DeleteApplicationMessage(usertype, username, applicationID).send
}