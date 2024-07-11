package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.SqlParameter
import Common.CourseAPI.deleteCourse

case class TeacherDeleteCourseMessagePlanner(usertype: String,
                                          username: String,
                                          password: String,
                                          courseID: Int,
                                          override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    if (usertype != "teacher" && usertype != "admin") {
      IO.pure("No permission")
    }
    else {
      deleteCourse(courseID)}
  }
}
