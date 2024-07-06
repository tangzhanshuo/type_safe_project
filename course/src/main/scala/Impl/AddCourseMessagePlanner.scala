package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddCourseMessagePlanner(courseID: Int, courseName: String, teacherUsername: String, teacherName: String, capacity: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM course WHERE course_ID = ?)",
      List(SqlParameter("int", courseID.toString))
    )

    checkCourseExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("Course with this ID already exists"))
      } else {
        writeDB(s"INSERT INTO course (course_ID, course_name, teacher_username, teacher_name, capacity, enrolled_students) VALUES (?, ?, ?, ?, ?, ?)",
          List(
            SqlParameter("int", courseID.toString),
            SqlParameter("string", courseName),
            SqlParameter("string", teacherUsername),
            SqlParameter("string", teacherName),
            SqlParameter("int", capacity.toString),
            SqlParameter("json", "[]".toString)
          )
        )
      }
    }
  }
}
