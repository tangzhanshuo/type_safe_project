package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import Common.CourseAPI.getCourseList

case class StudentGetCourseListMessagePlanner(usertype: String, username:String, password:String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
      getCourseList()
  }