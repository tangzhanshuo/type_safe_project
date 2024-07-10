package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode

case class GetApplicationByApproverMessage(
                                usertype: String,
                                username: String,
                              ) extends API[String](applicationServiceCode)