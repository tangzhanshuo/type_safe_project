package Common.ApplicationAPI

import Common.API.API
import Common.Object.Application
import Global.ServiceCenter.applicationServiceCode

case class GetApplicationByApplicantMessage(
                                usertype: String,
                                username: String,
                              ) extends API[List[Application]](applicationServiceCode)