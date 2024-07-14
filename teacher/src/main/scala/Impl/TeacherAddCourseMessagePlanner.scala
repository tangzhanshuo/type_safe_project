package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.SqlParameter
import Common.CourseAPI.addCourse
import scala.util.Random
import Common.ApplicationAPI.{createApplication, addApplication}
import io.circe.Json

case class TeacherAddCourseMessagePlanner(usertype: String,
                                          username: String,
                                          courseName: String,
                                          teacherName: String,
                                          capacity: Int,
                                          info: String,
                                          courseHourJson: String,
                                          classroomID: Int,
                                          credits: Int,
                                          kwargsJson: String,
                                          override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val application = createApplication(usertype, username, "TeacherAddCourse")
    application.addInfo("courseName", courseName)
    application.addInfo("teacherName", teacherName)
    application.addInfo("capacity", capacity)
    application.addInfo("info", info)
    application.addInfo("courseHourJson", courseHourJson)
    application.addInfo("classroomID", classroomID)
    application.addInfo("credits", credits)
    application.addInfo("kwargsJson", kwargsJson)
    application.addApprover("admin")
    addApplication(application)
  }
}
