package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.{SqlParameter, Application}
import Common.CourseAPI.addCourse
import scala.util.Random
import Common.ApplicationAPI.{addApplication}
import io.circe.{Json, Encoder}
import io.circe.syntax._

case class TeacherAddCourseMessagePlanner(usertype: String,
                                          username: String,
                                          courseName: String,
                                          teacherName: String,
                                          capacity: Int,
                                          info: String,
                                          courseHour: List[Int],
                                          classroomID: Int,
                                          credits: Int,
                                          override val planContext: PlanContext) extends Planner[Application] {
  override def plan(using planContext: PlanContext): IO[Application] = {
    val application = Application.create(usertype, username, "TeacherAddCourse")
    application.addInfo("courseName", courseName)
    application.addInfo("teacherName", teacherName)
    application.addInfo("capacity", capacity)
    application.addInfo("info", info)
    application.addInfo("courseHour", courseHour.asJson.noSpaces)
    application.addInfo("classroomID", classroomID)
    application.addInfo("credits", credits)
    application.addApprover("admin")
    addApplication(application)
  }
}