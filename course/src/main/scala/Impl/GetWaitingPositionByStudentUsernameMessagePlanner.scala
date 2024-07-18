package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.Json
import io.circe.parser.parse
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, CourseWaitingPosition, Course, EnrolledStudent, AllStudent}

case class GetWaitingPositionByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[Option[List[CourseWaitingPosition]]] {
  override def plan(using planContext: PlanContext): IO[Option[List[CourseWaitingPosition]]] = {
    val getCoursesQuery = "SELECT * FROM course"
    val getCoursesParams = List.empty[SqlParameter]

    readDBRows(getCoursesQuery, getCoursesParams).flatMap { rows =>
      if (rows.isEmpty) IO.pure(None)
      else {
        val result = rows.flatMap { row =>
          val courseid = row.hcursor.get[Int]("courseid").getOrElse(0)
          val courseName = row.hcursor.get[String]("courseName").getOrElse("")
          val teacherUsername = row.hcursor.get[String]("teacherUsername").getOrElse("")
          val teacherName = row.hcursor.get[String]("teacherName").getOrElse("")
          val capacity = row.hcursor.get[Int]("capacity").getOrElse(0)
          val info = row.hcursor.get[String]("info").getOrElse("")
          val courseHourJsonString = row.hcursor.get[String]("courseHour").getOrElse("[]")
          val classroomid = row.hcursor.get[Int]("classroomid").getOrElse(0)
          val credits = row.hcursor.get[Int]("credits").getOrElse(0)
          val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledStudents").getOrElse("[]")
          val allStudentsJsonString = row.hcursor.get[String]("allStudents").getOrElse("[]")
          val status = row.hcursor.get[String]("status").getOrElse("")

          val courseHour = parse(courseHourJsonString).flatMap(_.as[List[Int]]).getOrElse(Nil)
          val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
          val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[AllStudent]]).getOrElse(Nil)

          val course = Course(courseid, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits, enrolledStudents, allStudents, status)

          // Check if the student is in enrolledStudents or allStudents
          val isEnrolled = enrolledStudents.exists(_.studentUsername == studentUsername)
          val isInAllStudents = allStudents.exists(_.studentUsername == studentUsername)

          if (isEnrolled) {
            // If the student is in enrolledStudents, position is 0
            List(CourseWaitingPosition(course, List.fill(9)(0), 0))
          } else if (isInAllStudents) {
            // Calculate the student's position in the waiting list
            val waitingList = allStudents.filterNot(student => enrolledStudents.exists(_.studentUsername == student.studentUsername))
            val position = waitingList.indexWhere(_.studentUsername == studentUsername)

            // Calculate priority statistics
            val priorityCounts = waitingList.groupBy(_.priority).mapValues(_.size).toMap
            val priorityList = (0 to 8).map(priorityCounts.getOrElse(_, 0)).toList

            List(CourseWaitingPosition(course, priorityList, position))
          } else {
            List.empty[CourseWaitingPosition]
          }
        }

        if (result.isEmpty) IO.pure(None)
        else IO.pure(Some(result))
      }
    }
  }
}
