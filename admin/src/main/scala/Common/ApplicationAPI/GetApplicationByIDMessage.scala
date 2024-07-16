package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode
import Common.Object.Application

case class GetApplicationByIDMessage(
                                applicationID: String
                              ) extends API[Application](applicationServiceCode)