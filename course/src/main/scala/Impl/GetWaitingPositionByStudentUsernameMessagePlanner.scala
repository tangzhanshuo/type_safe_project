package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.Json
import io.circe.parser.parse
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, CourseWaitingPosition, Course}

case class GetWaitingPositionByStudentUsernameMessagePlanner(studentUsername: String, override val planContext: PlanContext) extends Planner[List[CourseWaitingPosition]] {
  override def plan(using planContext: PlanContext): IO[List[CourseWaitingPosition]] = {
    val getCoursesQuery = "SELECT * FROM course"
    val getCoursesParams = List.empty[SqlParameter]

    readDBRows(getCoursesQuery, getCoursesParams).flatMap { rows =>
      if (rows.isEmpty) IO.raiseError(new NoSuchElementException("No courses found"))
      else {
        val result = rows.flatMap { row =>
          val courseid = row.hcursor.get[Int]("courseid").getOrElse(0)
          val courseName = row.hcursor.get[String]("courseName").getOrElse("")
          val teacherUsername = row.hcursor.get[String]("teacherUsername").getOrElse("")
          val teacherName = row.hcursor.get[String]("teacherName").getOrElse("")
          val capacity = row.hcursor.get[Int]("capacity").getOrElse(0)
          val info = row.hcursor.get[String]("info").getOrElse("")
          val courseHour = row.hcursor.get[List[Int]]("courseHour").getOrElse(Nil)
          val classroomid = row.hcursor.get[Int]("classroomid").getOrElse(0)
          val credits = row.hcursor.get[Int]("credits").getOrElse(0)
          val enrolledStudentsJsonString = row.hcursor.get[String]("enrolledStudents").getOrElse("[]")
          val allStudentsJsonString = row.hcursor.get[String]("allStudents").getOrElse("[]")
          val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)
          val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[Map[String, Json]]]).getOrElse(Nil)

          val course = Course(courseid, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits, List.empty, List.empty)

          // 检查学生是否在enrolledstudents中但在allstudents中
          val isEnrolled = enrolledStudents.exists(_("studentUsername").as[String].contains(studentUsername))
          val isInAllStudents = allStudents.exists(_("studentUsername").as[String].contains(studentUsername))

          if (isEnrolled) {
            // 如果学生在enrolledstudents中，位置返回0
            Some(CourseWaitingPosition(course, List.fill(9)(0), 0))
          } else if (isInAllStudents) {
            // 计算等待列表中该学生的位置
            val waitingList = allStudents.filterNot(student => enrolledStudents.exists(_("studentUsername") == student("studentUsername")))
            val position = waitingList.indexWhere(_("studentUsername").as[String].contains(studentUsername))

            // 计算优先级统计
            val priorityCounts = waitingList.groupBy(_("priority").as[Int].getOrElse(0)).mapValues(_.size).toMap
            val priorityList = (0 to 8).map(priorityCounts.getOrElse(_, 0)).toList

            Some(CourseWaitingPosition(course, priorityList, position))
          } else {
            None
          }
        }

        if (result.isEmpty) IO.raiseError(new NoSuchElementException(s"No waiting courses found with student username: $studentUsername"))
        else IO.pure(result)
      }
    }
  }
}
