package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.{SqlParameter, Application}
import Common.CourseAPI.deleteCourse
import Common.ApplicationAPI.{addApplication}

case class TeacherDeleteCourseMessagePlanner(usertype: String,
                                          username: String,
                                          courseID: Int,
                                          override val planContext: PlanContext) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    val application = Application.create(usertype, username, "TeacherDeleteCourse")
    application.addInfo("courseID", courseID)
    application.addApprover("admin")
    addApplication(application)
  }
}
