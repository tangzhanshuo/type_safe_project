package Common

import Common.API.{API, PlanContext, TraceID}
import Common.Object.*
import Global.ServiceCenter.courseServiceCode
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import io.circe.syntax.*
import org.http4s.client.Client

package object CourseAPI {

  def addCourse(
                 courseName: String,
                 teacherUsername: String,
                 teacherName: String,
                 capacity: Int,
                 info: String,
                 courseHour: List[Int],
                 classroomid: Int,
                 credits: Int,
               )(using PlanContext): IO[Course] = {
    AddCourseMessage(courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits).send
  }

  def deleteCourse(courseid: Int)(using PlanContext): IO[String] =
    DeleteCourseMessage(courseid).send

  def updateCourse(
                    courseid: Int,
                    courseName: Option[String],
                    teacherUsername: Option[String],
                    teacherName: Option[String],
                    capacity: Option[Int],
                    info: Option[String],
                    courseHour: Option[List[Int]],
                    classroomid: Option[Int],
                    credits: Option[Int],
                  )(using PlanContext): IO[Course] =
    UpdateCourseMessage(courseid, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits).send

  def addStudent2Course(courseid: Int, studentUsername: Option[String], priority: Option[Int])(using PlanContext): IO[String] =
    AddStudent2CourseMessage(courseid, studentUsername, priority).send

  def forceAddStudent2Course(courseid: Int, studentUsername: Option[String])(using PlanContext): IO[String] =
    ForceAddStudent2CourseMessage(courseid, studentUsername).send

  def deleteStudentFromCourse(courseid: Int, studentUsername: Option[String])(using PlanContext): IO[String] =
    DeleteStudentFromCourseMessage(courseid, studentUsername).send

  def isStudentEnrolled(courseid: Int, studentUsername: Option[String])(using PlanContext): IO[Boolean] =
    IsStudentEnrolledMessage(courseid, studentUsername).send

  def getCourseList()(using PlanContext): IO[Option[List[Course]]] =
    GetCourseListMessage().send

  def getCourseByCourseID(courseid: Int)(using PlanContext): IO[Course] =
    GetCourseByCourseIDMessage(courseid).send
    
  def getCourseByCourseName(courseName: String)(using PlanContext): IO[Option[List[Course]]] =
    GetCourseByCourseNameMessage(courseName).send

  def getCourseByTeacherUsername(teacherUsername: String)(using PlanContext): IO[Option[List[Course]]] =
    GetCourseByTeacherUsernameMessage(teacherUsername).send

  def getCourseByStudentUsername(studentUsername: String)(using PlanContext): IO[Option[List[Course]]] =
    GetCourseByStudentUsernameMessage(studentUsername).send

  def getAllCoursesByStudentUsername(studentUsername: String)(using PlanContext): IO[Option[List[Course]]] =
    GetAllCoursesByStudentUsernameMessage(studentUsername).send

  def getWaitingPositionByStudentUsername(studentUsername: String)(using PlanContext): IO[Option[List[CourseWaitingPosition]]] =
    GetWaitingPositionByStudentUsernameMessage(studentUsername).send

  def getWaitingCoursesByStudentUsername(studentUsername: String)(using PlanContext): IO[Option[List[WaitingCourse]]] =
    GetWaitingCoursesByStudentUsernameMessage(studentUsername).send

  def getCreditsByStudentUsername(studentUsername: String)(using PlanContext): IO[Int] =
    GetCreditsByStudentUsernameMessage(studentUsername).send

  def addClassroom(classroomid: Int, classroomName: String, capacity: Int, enrolledCourses: Map[Int, List[Int]])(using PlanContext): IO[Classroom] =
    AddClassroomMessage(classroomid, classroomName, capacity, enrolledCourses).send

  def deleteClassroom(classroomid: Int)(using PlanContext): IO[String] =
    DeleteClassroomMessage(classroomid).send

  def getClassroomList()(using PlanContext): IO[List[Classroom]] =
    GetClassroomListMessage().send

  def getClassroom(classroomid: Int)(using PlanContext): IO[Classroom] =
    GetClassroomMessage(classroomid).send

  def getAvailableClassroomByCapacityHour(capacity: Int, courseHour: List[Int])(using PlanContext): IO[List[Classroom]] =
    GetAvailableClassroomByCapacityHourMessage(capacity, courseHour).send

  def reorderStudentsByCourseID(classroomid: Int)(using PlanContext): IO[String] =
    ReorderStudentsByCourseIDMessage(classroomid).send

  def addPlan(plan: Plan)(using PlanContext): IO[Plan] =
    AddPlanMessage(plan).send

  def updatePlan(
                  planid: Int,
                  planName: Option[String],
                  creditsLimits: Option[Map[Int, CreditsLimits]],
                  priority: Option[Map[Int, Map[Int, Int]]]
                )(using PlanContext): IO[Plan] =
    UpdatePlanMessage(planid, planName, creditsLimits, priority ).send


  def getPriorityByPlanIDYearCourseID(
                                       planid: Int,
                                       year: Int,
                                       courseid: Int
                                     )(using PlanContext): IO[Int] =
    GetPriorityByPlanIDYearCourseIDMessage(planid, year, courseid).send

  def getPlan(planid: Int)(using PlanContext): IO[Plan] =
    GetPlanMessage(planid).send

  def getPlanList()(using PlanContext): IO[List[Plan]] =
    GetPlanListMessage().send

  def updateCoursePriority(planid: Int, year: Int, courseid: Int, priority: Int)(using PlanContext): IO[Plan] =
    UpdateCoursePriorityMessage(planid, year, courseid, priority).send

  def endPreRegister(courseid: Int)(using PlanContext): IO[String] =
    EndPreRegisterMessage(courseid).send
}
