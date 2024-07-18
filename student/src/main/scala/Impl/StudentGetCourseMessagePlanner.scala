package Impl

import Common.API.{PlanContext, Planner}
import Common.CourseAPI.getCourseByCourseID
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.*
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class StudentGetCourseMessagePlanner(courseID: Int, username: String, override val planContext: PlanContext) extends Planner[StudentCourse]:
  override def plan(using PlanContext): IO[StudentCourse] = {
    getCourseByCourseID(courseID).map { course =>
      val studentStatus = if (course.enrolledStudents.exists(_.studentUsername == username)) {
        StudentStatus.Enrolled
      } else if (course.allStudents.exists(_.studentUsername == username)) {
        StudentStatus.Waiting
      } else {
        StudentStatus.NotEnrolled
      }

      StudentCourse(
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
      )
    }
  }
