package Global

import Global.GlobalVariables.serviceCode
import cats.effect.IO
import com.comcast.ip4s.Port
import org.http4s.Uri

object ServiceCenter {
  val projectName: String = "APP"

  val dbManagerServiceCode = "A000001"
  val portalServiceCode    = "A000002"
  val userServiceCode      = "A000003"
  val studentServiceCode   = "A000004"
  val teacherServiceCode   = "A000005"
  val adminServiceCode     = "A000006"
  val courseServiceCode    = "A000007"

  val fullNameMap: Map[String, String] = Map(
    dbManagerServiceCode ->  "DB_Manager",
    portalServiceCode    ->  "Portal",
    userServiceCode      ->  "User_Accounts",
    studentServiceCode   ->  "Student",
    teacherServiceCode   ->  "Teacher",
    adminServiceCode     ->  "Admin",
    courseServiceCode    ->  "Course"
  )

  val address: Map[String, String] = Map(
    "DB-Manager" ->     "127.0.0.1:10001",
    "Portal" ->         "127.0.0.1:10002",
    "User" ->           "127.0.0.1:10003",
    "Student" ->        "127.0.0.1:10004",
    "Teacher" ->        "127.0.0.1:10005",
    "Admin" ->          "127.0.0.1:10006",
    "Course" ->         "127.0.0.1:10007"
  )
}
