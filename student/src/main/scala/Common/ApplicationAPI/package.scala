package Common

import Common.API.{API, PlanContext, TraceID}
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import org.http4s.client.Client
import io.circe.Json

package object ApplicationAPI {

  def addApplication(usertype: String, username: String, applicationType: String, info: String, approver: String)(using PlanContext): IO[String] =
    AddApplicationMessage(usertype, username, applicationType, info, approver).send

  def getApplicationByID(applicationID: String)(using PlanContext): IO[String] =
    GetApplicationByIDMessage(applicationID).send

  def getApplicationByApprover(usertype: String, username: String)(using PlanContext): IO[String] =
    GetApplicationByApproverMessage(usertype, username).send

  def getApplicationByApplicant(usertype: String, username: String)(using PlanContext): IO[String] =
    GetApplicationByApplicantMessage(usertype, username).send

  def approveApplication(usertype: String, username: String, applicationID: String)(using PlanContext): IO[String] =
    ApproveApplicationMessage(usertype, username, applicationID).send

  def deleteApplication(applicationID: String)(using PlanContext): IO[String] =
    DeleteApplicationMessage(applicationID).send
}
