package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.Object.{SqlParameter, Application, Course}
import Common.ApplicationAPI.addApplication
import Common.CourseAPI.getCourseByCourseID
import io.circe.syntax._

case class StudentManualSelectCourseMessagePlanner(
                                                    usertype: String,
                                                    username: String,
                                                    courseID: Int,
                                                    reason: String,
                                                    override val planContext: PlanContext
                                                  ) extends Planner[Application] {

  override def plan(using planContext: PlanContext): IO[Application] = {
    for {
      course <- getCourseByCourseID(courseID)
      _ <- validateCourseAndEnrollment(course)
      application <- createApplication(course)
      savedApplication <- addApplication(application)
    } yield savedApplication
  }

  private def validateCourseAndEnrollment(course: Course): IO[Unit] = IO {
    if (course.status != "closed") {
      throw new Exception(s"Cannot manually select course. Course status is not closed. Current status: ${course.status}")
    }

    if (course.enrolledStudents.exists(_.studentUsername == username)) {
      throw new Exception(s"Student $username is already enrolled in course ${course.courseName} (ID: $courseID)")
    }
  }

  private def createApplication(course: Course): IO[Application] = IO {
    val application = Application.create(usertype, username, "StudentManualSelectCourse")
    application.addInfo("courseID", courseID)
    application.addInfo("reason", reason)
    application.addApprover("admin")
    application
  }
}