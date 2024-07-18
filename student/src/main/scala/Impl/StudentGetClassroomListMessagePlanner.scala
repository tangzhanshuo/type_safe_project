package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{Classroom, Course, SqlParameter, StudentCourse, StudentStatus}
import Common.ServiceUtils.schemaName
import Common.CourseAPI.getClassroomList

case class StudentGetClassroomListMessagePlanner(override val planContext: PlanContext) extends Planner[List[Classroom]] {
  override def plan(using planContext: PlanContext): IO[List[Classroom]] = {
    getClassroomList()
  }
}
