package Impl

import cats.effect.IO
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, EnrolledStudent, Course, Classroom}

case class UpdateCourseMessagePlanner(
                                       courseid: Int,
                                       courseName: Option[String],
                                       teacherUsername: Option[String],
                                       teacherName: Option[String],
                                       capacity: Option[Int],
                                       info: Option[String],
                                       courseHours: Option[List[Int]],
                                       classroomid: Option[Int],
                                       credits: Option[Int],
                                       override val planContext: PlanContext
                                     ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    val getCurrentCourseQuery = "SELECT * FROM course WHERE courseid = ?"
    val getCurrentCourseParams = List(SqlParameter("int", courseid.toString))

    val updateCourseQuery = "UPDATE course SET %s WHERE courseid = ?"

    def getClassroomEnrolledCourses(classroomid: Int): IO[Map[Int, List[Int]]] = {
      val query = s"SELECT enrolled_courses FROM classroom WHERE classroomid = ?"
      readDBRows(query, List(SqlParameter("int", classroomid.toString))).flatMap { rows =>
        rows.headOption match {
          case Some(row) =>
            val cursor = row.hcursor
            for {
              enrolledCoursesStr <- IO.fromEither(cursor.get[String]("enrolledCourses").toOption.toRight(new Exception("Missing enrolledCourses")))
              enrolledCourses <- IO.fromEither(decode[Map[Int, List[Int]]](enrolledCoursesStr).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
            } yield enrolledCourses
          case None => IO.raiseError(new NoSuchElementException(s"No classroom found with classroomid: $classroomid"))
        }
      }
    }

    def updateClassroomEnrolledCourses(classroomid: Int, enrolledCourses: Map[Int, List[Int]]): IO[Unit] = {
      val updatedCoursesJson = enrolledCourses.asJson.noSpaces
      writeDB(s"UPDATE classroom SET enrolled_courses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCoursesJson), SqlParameter("int", classroomid.toString))
      ).map(_ => ())
    }

    def removeCourseFromClassroom(classroomid: Int, enrolledCourses: Map[Int, List[Int]]): IO[Unit] = {
      val updatedCourses = enrolledCourses - courseid
      val updatedCoursesJson = updatedCourses.asJson.noSpaces
      writeDB(s"UPDATE classroom SET enrolled_courses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCoursesJson), SqlParameter("int", classroomid.toString))
      ).map(_ => ())
    }

    def checkCourseHourConflict(existingCourses: Map[Int, List[Int]], courseHours: List[Int]): Boolean = {
      existingCourses.exists { case (id, existingCourseHours) =>
        id != courseid && courseHours.exists(existingCourseHours.contains)
      }
    }

    def getClassroomCapacity(classroomid: Int): IO[Int] = readDBInt(s"SELECT capacity FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    )

    readDBRows(getCurrentCourseQuery, getCurrentCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentCourse) =>
          val cursor = currentCourse.hcursor

          val updatedCourseName = courseName.orElse(cursor.get[String]("courseName").toOption)
          val updatedTeacherUsername = teacherUsername.orElse(cursor.get[String]("teacherUsername").toOption)
          val updatedTeacherName = teacherName.orElse(cursor.get[String]("teacherName").toOption)
          val currentCapacity = cursor.get[Int]("capacity").getOrElse(0)
          val updatedInfo = info.orElse(cursor.get[String]("info").toOption)
          val currentStatus = cursor.get[String]("status").getOrElse("")

          val updatedCourseHours = courseHours.orElse(
            for {
              courseHourStr <- cursor.get[String]("courseHour").toOption
              decodedCourseHours <- decode[List[Int]](courseHourStr).toOption
            } yield decodedCourseHours
          )

          val updatedClassroomid = classroomid.orElse(cursor.get[Int]("classroomid").toOption)
          val updatedCredits = credits.orElse(cursor.get[Int]("credits").toOption)

          val currentEnrolledStudentsStr = cursor.get[String]("enrolledStudents").getOrElse("[]")
          val currentAllStudentsStr = cursor.get[String]("allStudents").getOrElse("[]")
          val currentEnrolledStudents = decode[List[EnrolledStudent]](currentEnrolledStudentsStr).getOrElse(Nil)
          val currentAllStudents = decode[List[EnrolledStudent]](currentAllStudentsStr).getOrElse(Nil)

          // Handle capacity update
          val (updatedCapacity, updatedStatus, updatedEnrolledStudents) = capacity match {
            case Some(newCapacity) =>
              if (currentStatus == "preregister") {
                (Some(newCapacity), currentStatus, currentEnrolledStudents)
              } else if (newCapacity < currentEnrolledStudents.size) {
                return IO.raiseError(new Exception("New capacity is less than the current number of enrolled students"))
              } else if (newCapacity == currentEnrolledStudents.size) {
                (Some(newCapacity), "closed", currentEnrolledStudents)
              } else {
                val sortedAllStudents = currentAllStudents.sortBy(_.time)
                val newEnrolledStudents = sortedAllStudents.take(newCapacity).map(s => EnrolledStudent(s.time, s.priority, s.studentUsername))
                (Some(newCapacity), if (newEnrolledStudents.size == newCapacity) "closed" else "open", newEnrolledStudents)
              }
            case None => (Some(currentCapacity), currentStatus, currentEnrolledStudents)
          }

          val checkConflictAndCapacityIO = for {
            existingCourses <- updatedClassroomid.map(getClassroomEnrolledCourses).getOrElse(IO.pure(Map.empty[Int, List[Int]]))
            conflict = updatedCourseHours.exists(hours => checkCourseHourConflict(existingCourses, hours))
            classroomCapacity <- updatedClassroomid.map(getClassroomCapacity).getOrElse(IO.pure(0))
            _ <- if (conflict && updatedClassroomid.exists(_ >= 0)) IO.raiseError(new Exception("Course hour conflict detected for the given classroom")) else IO.unit
            _ <- if (classroomCapacity > 0 && updatedCapacity.exists(_ > classroomCapacity)) IO.raiseError(new Exception("Classroom capacity exceeded")) else IO.unit
          } yield existingCourses

          checkConflictAndCapacityIO.flatMap { existingCourses =>
            val updatedEnrolledCourses = updatedClassroomid match {
              case Some(id) => existingCourses + (courseid -> updatedCourseHours.getOrElse(Nil))
              case _ => existingCourses
            }

            val updates = List(
              updatedCourseName.map(_ => "course_name = ?"),
              updatedTeacherUsername.map(_ => "teacher_username = ?"),
              updatedTeacherName.map(_ => "teacher_name = ?"),
              updatedCapacity.map(_ => "capacity = ?"),
              updatedInfo.map(_ => "info = ?"),
              updatedCourseHours.map(_ => "course_hour = ?"),
              updatedClassroomid.map(_ => "classroomid = ?"),
              updatedCredits.map(_ => "credits = ?"),
              Some("enrolled_students = ?"),
              Some("status = ?")
            ).flatten.mkString(", ")

            val params = List(
              updatedCourseName.map(SqlParameter("string", _)),
              updatedTeacherUsername.map(SqlParameter("string", _)),
              updatedTeacherName.map(SqlParameter("string", _)),
              updatedCapacity.map(c => SqlParameter("int", c.toString)),
              updatedInfo.map(SqlParameter("string", _)),
              updatedCourseHours.map(hours => SqlParameter("jsonb", hours.asJson.noSpaces)),
              updatedClassroomid.map(c => SqlParameter("int", c.toString)),
              updatedCredits.map(c => SqlParameter("int", c.toString)),
              Some(SqlParameter("jsonb", updatedEnrolledStudents.asJson.noSpaces)),
              Some(SqlParameter("string", updatedStatus)),
              Some(SqlParameter("int", courseid.toString))
            ).flatten

            val updateClassroomsIO: IO[Unit] = {
              val removeOldClassroom: IO[Unit] =
                if (updatedClassroomid.isDefined && updatedClassroomid != cursor.get[Int]("classroomid").toOption) {
                  getClassroomEnrolledCourses(cursor.get[Int]("classroomid").getOrElse(0)).flatMap { oldClassroomCourses =>
                    removeCourseFromClassroom(cursor.get[Int]("classroomid").getOrElse(0), oldClassroomCourses)
                  }
                } else IO.unit

              val updateNewClassroom: IO[Unit] =
                updatedClassroomid.map { classroomid =>
                  updateClassroomEnrolledCourses(classroomid, updatedEnrolledCourses)
                }.getOrElse(IO.unit)

              removeOldClassroom *> updateNewClassroom
            }

            writeDB(updateCourseQuery.format(updates), params).flatMap { _ =>
              updateClassroomsIO.map(_ => Course(
                courseid,
                updatedCourseName.getOrElse(""),
                updatedTeacherUsername.getOrElse(""),
                updatedTeacherName.getOrElse(""),
                updatedCapacity.getOrElse(0),
                updatedInfo.getOrElse(""),
                updatedCourseHours.getOrElse(Nil),
                updatedClassroomid.getOrElse(0),
                updatedCredits.getOrElse(0),
                updatedEnrolledStudents,
                currentAllStudents,
                updatedStatus
              ))
            }
          }

        case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
      }
    }
  }
}