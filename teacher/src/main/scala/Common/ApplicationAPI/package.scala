package Common

import Common.API.{API, PlanContext, TraceID}
import Common.Object.{SqlParameter, Application, Approver}
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import org.http4s.client.Client
import io.circe.{Json, parser}

package object ApplicationAPI {

  // Modified addApplication function
  def addApplication(application: Application)(using PlanContext): IO[String] =
    AddApplicationMessage(application).send

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