package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import Common.CourseAPI.getCourseList

case class StudentGetCourseListMessagePlanner(override val planContext: PlanContext) extends Planner[Option[List[Course]]]:
  override def plan(using PlanContext): IO[Option[List[Course]]] = {
      getCourseList()
  }