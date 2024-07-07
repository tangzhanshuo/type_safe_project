package Common

import Common.API.{API, PlanContext, TraceID}
import Common.Object.SqlParameter
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.syntax.*
import org.http4s.client.Client
import io.circe.Json

package object CourseAPI {

  def addCourse(courseID: Int, courseName: String, teacherUsername: String, teacherName: String, capacity: Int)(using PlanContext): IO[String] =
    AddCourseMessage(courseID, courseName, teacherUsername, teacherName, capacity).send

  def deleteCourse(courseID: Int)(using PlanContext): IO[String] =
    DeleteCourseMessage(courseID).send

  def getCourse(courseID: Int)(using PlanContext): IO[String] =
    GetCourseMessage(courseID).send

  def updateCourse(courseID: Int, courseName: Option[String], teacherUsername: Option[String], teacherName: Option[String], capacity: Option[Int])(using PlanContext): IO[String] =
    UpdateCourseMessage(courseID, courseName, teacherUsername, teacherName, capacity).send
}
