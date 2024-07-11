package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByStudentUsername
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCourseByUsernameMessage(studentUsername: String, usertype: String, username:String, password:String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    getCourseByStudentUsername(studentUsername)
  }