package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Json, Decoder}
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Course, EnrolledStudent, AllStudent}
import java.time.Instant
import cats.implicits._

case class AddStudent2CourseMessagePlanner(courseid: Int, studentUsername: Option[String], priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkCourseExistsQuery = "SELECT EXISTS(SELECT 1 FROM course WHERE courseid = ?)"
    val checkCourseExistsParams = List(SqlParameter("int", courseid.toString))

    val getCourseInfoQuery = "SELECT capacity, enrolled_students, all_students, course_hour FROM course WHERE courseid = ?"
    val getCourseInfoParams = List(SqlParameter("int", courseid.toString))

    val getStudentCoursesQuery = "SELECT * FROM course WHERE all_students @> ?::jsonb"
    val getStudentCoursesParams = (username: String) => List(SqlParameter("string", s"""[{"studentUsername":"$username"}]"""))

    val updateStudentsQuery = "UPDATE course SET enrolled_students = ?, all_students = ? WHERE courseid = ?"

    // 获取当前时间
    def getCurrentTime: Int = Instant.now.getEpochSecond.toInt

    // 检查课程是否存在
    val courseExistsIO = readDBBoolean(checkCourseExistsQuery, checkCourseExistsParams)
      .flatMap(courseExists =>
        if (!courseExists) IO.raiseError(new Exception(s"Course with id $courseid does not exist"))
        else IO.pure(())
      )

    // 获取课程信息 (容量，enrolledStudents 列表，和 allStudents 列表)
    val courseInfoIO = readDBRows(getCourseInfoQuery, getCourseInfoParams)
      .flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val cursor = row.hcursor
            val capacity = cursor.get[Int]("capacity").getOrElse(0)
            val courseHourStr = cursor.get[String]("courseHour").left.map(e => new Exception("Missing courseHour"))
            val courseHour = courseHourStr.flatMap(str => decode[List[Int]](str).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))).getOrElse(Nil)
            val enrolledStudentsJsonString = cursor.get[String]("enrolledStudents").getOrElse("[]")
            val allStudentsJsonString = cursor.get[String]("allStudents").getOrElse("[]")
            val enrolledStudents = parse(enrolledStudentsJsonString).flatMap(_.as[List[EnrolledStudent]]).getOrElse(Nil)
            val allStudents = parse(allStudentsJsonString).flatMap(_.as[List[AllStudent]]).getOrElse(Nil)
            IO.pure((capacity, enrolledStudents, allStudents, courseHour))
          case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
        }
      }

    // 检查时间冲突
    def checkTimeConflict(newCourseHours: List[Int], studentCourses: List[Course]): Boolean = {
      studentCourses.exists { course =>
        newCourseHours.exists(course.courseHour.contains)
      }
    }

    // 获取学生现有课程信息
    def getStudentCourses(username: String): IO[List[Course]] = {
      readDBRows(getStudentCoursesQuery, getStudentCoursesParams(username)).flatMap { rows =>
        if (rows.nonEmpty) {
          val coursesIO = rows.map { row =>
            val cursor = row.hcursor
            for {
              courseID <- cursor.get[Int]("courseid").toOption.toRight(new Exception("Missing courseid"))
              courseName <- cursor.get[String]("courseName").toOption.toRight(new Exception("Missing courseName"))
              teacherUsername <- cursor.get[String]("teacherUsername").toOption.toRight(new Exception("Missing teacherUsername"))
              teacherName <- cursor.get[String]("teacherName").toOption.toRight(new Exception("Missing teacherName"))
              capacity <- cursor.get[Int]("capacity").toOption.toRight(new Exception("Missing capacity"))
              info <- cursor.get[String]("info").toOption.toRight(new Exception("Missing info"))
              courseHourStr <- cursor.get[String]("courseHour").toOption.toRight(new Exception("Missing courseHour"))
              courseHour <- decode[List[Int]](courseHourStr).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
              classroomID <- cursor.get[Int]("classroomid").toOption.toRight(new Exception("Missing classroomid"))
              credits <- cursor.get[Int]("credits").toOption.toRight(new Exception("Missing credits"))
              enrolledStudentsStr <- cursor.get[String]("enrolledStudents").toOption.toRight(new Exception("Missing enrolledStudents"))
              enrolledStudents <- decode[List[EnrolledStudent]](enrolledStudentsStr).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
              allStudentsStr <- cursor.get[String]("allStudents").toOption.toRight(new Exception("Missing allStudents"))
              allStudents <- decode[List[AllStudent]](allStudentsStr).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))
            } yield Course(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomID, credits, enrolledStudents, allStudents)
          }
          coursesIO.sequence.fold(IO.raiseError, IO.pure)
        } else {
          IO.pure(Nil)
        }
      }
    }

    // 组合检查和更新操作
    courseExistsIO.flatMap { _ =>
      courseInfoIO.flatMap { case (capacity, enrolledStudents, allStudents, courseHour) =>
        (studentUsername, priority) match {
          case (Some(username), Some(pri)) =>
            if (allStudents.exists(_.studentUsername == username)) {
              IO.raiseError(new Exception(s"Student $username is already in the all students list for course $courseid"))
            } else {
              getStudentCourses(username).flatMap { studentCourses =>
                if (checkTimeConflict(courseHour, studentCourses)) {
                  IO.raiseError(new Exception(s"Student $username has a time conflict with another course"))
                } else {
                  val newStudent = AllStudent(time = getCurrentTime, priority = pri, studentUsername = username) // 确保newStudent是AllStudent类型

                  val updatedAllStudents = allStudents :+ newStudent
                  val updatedAllStudentsJsonString = updatedAllStudents.asJson.noSpaces

                  if (enrolledStudents.size >= capacity) {
                    // 不添加到 enrolledStudents
                    writeDB(updateStudentsQuery, List(
                      SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
                      SqlParameter("jsonb", updatedAllStudentsJsonString),
                      SqlParameter("int", courseid.toString)
                    )).map(_ => s"Student $username added to all students list for course $courseid, but not enrolled due to capacity limit")
                  } else {
                    val newEnrolledStudent = EnrolledStudent(time = getCurrentTime, priority = pri, studentUsername = username) // 确保newEnrolledStudent是EnrolledStudent类型
                    val updatedEnrolledStudents = enrolledStudents :+ newEnrolledStudent
                    val updatedEnrolledStudentsJsonString = updatedEnrolledStudents.asJson.noSpaces

                    writeDB(updateStudentsQuery, List(
                      SqlParameter("jsonb", updatedEnrolledStudentsJsonString),
                      SqlParameter("jsonb", updatedAllStudentsJsonString),
                      SqlParameter("int", courseid.toString)
                    )).map(_ => s"Student $username successfully added to course $courseid")
                  }
                }
              }
            }
          case _ => IO.raiseError(new Exception("Student username and priority must be provided"))
        }
      }
    }
  }
}
