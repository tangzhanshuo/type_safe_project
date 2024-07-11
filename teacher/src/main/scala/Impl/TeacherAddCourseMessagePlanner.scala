package Impl

import cats.effect.IO
import Common.API.PlanContext
import Common.DBAPI.writeDB
import Common.API.{PlanContext, Planner}
import Common.Object.SqlParameter
import Common.CourseAPI.addCourse
import scala.util.Random

case class TeacherAddCourseMessagePlanner(usertype: String,
                                          username: String,
                                          password: String,
                                          courseID: Int,
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
    if (usertype != "teacher" && usertype != "admin") {
      IO.pure("No permission")
    }
    else {
      val courseID = Random.nextInt();
      val teacherUsername = username;
      val enrolledStudentsJson = "[]";
      addCourse(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHourJson, classroomID, credits, enrolledStudentsJson, kwargsJson)}
  }
}
