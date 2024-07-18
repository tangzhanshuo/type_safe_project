package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getWaitingPositionByStudentUsername
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetWaitingPositionMessagePlanner(username: String, override val planContext: PlanContext) extends Planner[Option[List[StudentCourseWaitingPosition]]]:
  override def plan(using PlanContext): IO[Option[List[StudentCourseWaitingPosition]]] = {
    getWaitingPositionByStudentUsername(username).map {
      case Some(pairs) =>
        Some(pairs.map { pair =>
          val course = pair.course
          val studentStatus = if (course.enrolledStudents.exists(_.studentUsername == username)) {
            StudentStatus.Enrolled
          } else if (course.allStudents.exists(_.studentUsername == username)) {
            StudentStatus.Waiting
          } else {
            StudentStatus.NotEnrolled
          }

          StudentCourseWaitingPosition(
            studentCourse = StudentCourse(
              courseid = course.courseid,
              courseName = course.courseName,
              teacherName = course.teacherName,
              capacity = course.capacity,
              info = course.info,
              courseHour = course.courseHour,
              classroomid = course.classroomid,
              credits = course.credits,
              enrolledStudentsNumber = course.enrolledStudents.length,
              allStudentsNumber = course.allStudents.length,
              status = course.status,
              studentStatus = studentStatus
            ),
            priority = pair.priority,
            position = pair.position
          )
        })
      case None => None
    }
  }
