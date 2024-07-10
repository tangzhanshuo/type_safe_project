package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode

case class DeleteApplicationMessage(
                                applicationID: String
                              ) extends API[String](applicationServiceCode)