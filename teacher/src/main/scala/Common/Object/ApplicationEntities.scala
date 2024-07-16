package Common.Object

import io.circe.generic.semiauto.*
import io.circe.parser.parse
import io.circe.{Decoder, Encoder, HCursor, Json}

import java.util.UUID

case class Application(
                        var applicationID: String,
                        var usertype: String,
                        var username: String,
                        var applicationType: String,
                        var info: String,
                        var approver: List[Approver],
                        var status: String = "pending"
                      ) {
  // Method to add or update a field in the info JSON
  def addInfo(key: String, value: String | Int | Json): Unit = {
    val infoJson = parse(info).getOrElse(Json.obj())
    val jsonValue = value match {
      case s: String => Json.fromString(s)
      case i: Int => Json.fromInt(i)
      case j: Json => j
    }
    val updatedInfo = infoJson.deepMerge(Json.obj((key, jsonValue)))
    this.info = updatedInfo.noSpaces
  }

  // Method to add an approver
  def addApprover(usertype: String, username: String = ""): Unit = {
    val newApprover = Approver(usertype, username)
    this.approver = this.approver :+ newApprover
  }
}

object Application {
  def create(
              usertype: String,
              username: String,
              applicationType: String,
              info: String = "{}",
              approver: List[Approver] = List.empty
            ): Application = {
    Application(
      applicationID = UUID.randomUUID().toString,
      usertype = usertype,
      username = username,
      applicationType = applicationType,
      info = info,
      approver = approver,
      status = "pending"
    )
  }

  implicit val applicationEncoder: Encoder[Application] = deriveEncoder
  implicit val applicationDecoder: Decoder[Application] = deriveDecoder
}

case class Approver(
                     var usertype: String,
                     var username: String = "",
                     var approved: Boolean = false
                   )

object Approver {
  implicit val approverEncoder: Encoder[Approver] = deriveEncoder
  implicit val approverDecoder: Decoder[Approver] = deriveDecoder
}