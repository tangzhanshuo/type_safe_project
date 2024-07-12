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

  def addCourse(
                 courseID: Int,
                 courseName: String,
                 teacherUsername: String,
                 teacherName: String,
                 capacity: Int,
                 info: String,
                 courseHourJson: String,
                 classroomID: Int,
                 credits: Int,
                 enrolledStudentsJson: String,
                 allStudentsJson: String
               )(using PlanContext): IO[String] =
    AddCourseMessage(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHourJson, classroomID, credits, enrolledStudentsJson, allStudentsJson).send

  def deleteCourse(courseID: Int)(using PlanContext): IO[String] =
    DeleteCourseMessage(courseID).send

  def getCourse(courseID: Int)(using PlanContext): IO[String] =
    GetCourseMessage(courseID).send

  def updateCourse(
                    courseID: Int,
                    courseName: Option[String],
                    teacherUsername: Option[String],
                    teacherName: Option[String],
                    capacity: Option[Int],
                    info: Option[String],
                    courseHourJson: Option[String],
                    classroomID: Option[Int],
                    credits: Option[Int],
                    enrolledStudentsJson: Option[String],
                    allStudentsJson: Option[String]
                  )(using PlanContext): IO[String] =
    UpdateCourseMessage(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHourJson, classroomID, credits, enrolledStudentsJson, allStudentsJson).send

  def addStudent2Course(courseID: Int, studentUsername: Option[String], priority: Option[Int])(using PlanContext): IO[String] =
    AddStudent2CourseMessage(courseID, studentUsername, priority).send

  def getCoursesByTeacherUsername(teacherUsername: String)(using PlanContext): IO[String] =
    GetCoursesByTeacherUsernameMessage(teacherUsername).send

  def deleteStudentFromCourse(courseID: Int, studentUsername: Option[String])(using PlanContext): IO[String] =
    DeleteStudentFromCourseMessage(courseID, studentUsername).send

  def isStudentEnrolled(courseID: Int, studentUsername: Option[String])(using PlanContext): IO[Boolean] =
    IsStudentEnrolledMessage(courseID, studentUsername).send

  def getCourseList()(using PlanContext): IO[String] =
    GetCourseListMessage().send

  def getCoursesByStudentUsername(studentUsername: String)(using PlanContext): IO[String] =
    GetCourseByStudentUsernameMessage(studentUsername).send

  def getWaitingCoursesByStudentUsername(studentUsername: String)(using PlanContext): IO[String] =
    GetWaitingCoursesByStudentUsernameMessage(studentUsername).send

  def addClassroom(classroomID: Int, classroomName: String, capacity: Int, enrolledCoursesJson: String)(using PlanContext): IO[String] =
    AddClassroomMessage(classroomID, classroomName, capacity, enrolledCoursesJson).send

  def deleteClassroom(classroomID: Int)(using PlanContext): IO[String] =
    DeleteClassroomMessage(classroomID).send

  def getClassroomList()(using PlanContext): IO[String] =
    GetClassroomListMessage().send

  def getClassroom(classroomID: Int)(using PlanContext): IO[String] =
    GetClassroomMessage(classroomID).send

  def getAvailableClassroomByCapacityHour(capacity: Int, courseHourJson: String)(using PlanContext): IO[String] =
    GetAvailableClassroomByCapacityHourMessage(capacity, courseHourJson).send
}
