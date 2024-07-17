package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.{getCourseByCourseID, getCreditsByStudentUsername}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCreditsMessagePlanner(StudentUsername: String, override val planContext: PlanContext) extends Planner[Int]:
  override def plan(using PlanContext): IO[Int] = {
    getCreditsByStudentUsername(StudentUsername)
  }