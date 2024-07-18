package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{StudentCourse, Course, SqlParameter, StudentStatus}
import Common.ServiceUtils.schemaName
import Common.CourseAPI.getCourseList

case class StudentGetCourseListMessagePlanner(username: String, override val planContext: PlanContext) extends Planner[Option[List[StudentCourse]]] {
  override def plan(using planContext: PlanContext): IO[Option[List[StudentCourse]]] = {
    getCourseList().map {
      case Some(courses) =>
        Some(courses.map { course =>
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
        })
      case None => None
    }
  }
}
