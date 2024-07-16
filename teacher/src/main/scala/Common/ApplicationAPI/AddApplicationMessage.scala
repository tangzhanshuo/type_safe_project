package Common.ApplicationAPI

import Common.API.API
import Global.ServiceCenter.applicationServiceCode
import Common.Object.Application

case class AddApplicationMessage(
                                application: Application
                              ) extends API[Application](applicationServiceCode)