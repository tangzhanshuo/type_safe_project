package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode
import Common.Object.Application

case class GetApplicationByApproverMessage(
                                usertype: String,
                                username: String,
                              ) extends API[List[Application]](applicationServiceCode)