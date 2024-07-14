package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode

case class RejectApplicationMessage(
                                usertype: String,
                                username: String,
                                applicationID: String
                              ) extends API[String](applicationServiceCode)