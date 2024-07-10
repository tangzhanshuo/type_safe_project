package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode

case class GetApplicationByApplicantMessage(
                                usertype: String,
                                username: String,
                              ) extends API[String](applicationServiceCode)