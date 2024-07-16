package Common.Object

import io.circe.generic.semiauto.*
import io.circe.{Decoder, Encoder, HCursor, Json}

case class CreditsLimits(min: Int, max: Int)
object CreditsLimits {
  implicit val creditLimitsEncoder: Encoder[CreditsLimits] = deriveEncoder
  implicit val creditLimitsDecoder: Decoder[CreditsLimits] = deriveDecoder
}

case class Plan(
                 planid: Int,
                 planName: String,
                 creditsLimits: Map[Int, CreditsLimits],
                 priority: Map[Int, Map[Int, Int]]
               )
object Plan {
  implicit val planEncoder: Encoder[Plan] = deriveEncoder
  implicit val planDecoder: Decoder[Plan] = deriveDecoder
}
