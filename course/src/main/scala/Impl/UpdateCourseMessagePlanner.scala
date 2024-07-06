package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class UpdateCourseMessagePlanner(courseID: Int, courseName: Option[String], teacherUsername: Option[String], teacherName: Option[String], capacity: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val updates = List(
      courseName.map(name => "course_name = ?"),
      teacherUsername.map(username => "teacher_username = ?"),
      teacherName.map(name => "teacher_name = ?"),
      capacity.map(cap => "capacity = ?")
    ).flatten.mkString(", ")

    val params = List(
      courseName.map(name => SqlParameter("string", name)),
      teacherUsername.map(username => SqlParameter("string", username)),
      teacherName.map(name => SqlParameter("string", name)),
      capacity.map(cap => SqlParameter("int", cap.toString))
    ).flatten

    writeDB(s"UPDATE course SET $updates WHERE course_ID = ?", params :+ SqlParameter("int", courseID.toString))
  }
}
