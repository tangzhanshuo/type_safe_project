package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode

case class AddApplicationMessage(
                                usertype: String,
                                username: String,
                                applicationType: String,
                                info: String,
                                approver: String
                              ) extends API[String](applicationServiceCode)