package Impl

import cats.effect.IO
import io.circe.{Decoder, Encoder, Json}
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import cats.implicits._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, EnrolledStudent, AllStudent, Course, Classroom}

case class UpdateCourseMessagePlanner(
                                       courseid: Int,
                                       courseName: Option[String],
                                       teacherUsername: Option[String],
                                       teacherName: Option[String],
                                       capacity: Option[Int],
                                       info: Option[String],
                                       courseHours: Option[List[Int]], // 直接使用 List[Int] 类型
                                       classroomid: Option[Int],
                                       credits: Option[Int],
                                       enrolledStudents: Option[List[EnrolledStudent]], // 直接使用 List[EnrolledStudent] 类型
                                       allStudents: Option[List[AllStudent]], // 直接使用 List[AllStudent] 类型
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
              enrolledCourses <- IO.fromEither(decode[Map[Int, List[Int]]](enrolledCoursesStr).left.map(e => new Exception(s"Invalid JSON for enrolled_courses: ${e.getMessage}")))
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

    def checkCourseHourConflict(existingCourses: Json, courseHours: List[Int]): Boolean = {
      existingCourses.asObject.exists { obj =>
        obj.toMap.view.filterKeys(_ != courseid.toString).values.exists { courseHoursJson =>
          val existingCourseHours = courseHoursJson.as[List[Int]].getOrElse(Nil)
          courseHours.exists(existingCourseHours.contains)
        }
      }
    }

    def getClassroomCapacity(classroomid: Int): IO[Int] = readDBInt(s"SELECT capacity FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    )

    readDBRows(getCurrentCourseQuery, getCurrentCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(currentCourse) =>
          val existingCourse = currentCourse.hcursor

          val updatedCourseName = courseName.orElse(existingCourse.get[String]("courseName").toOption)
          val updatedTeacherUsername = teacherUsername.orElse(existingCourse.get[String]("teacherUsername").toOption)
          val updatedTeacherName = teacherName.orElse(existingCourse.get[String]("teacherName").toOption)
          val updatedCapacity = capacity.orElse(existingCourse.get[Int]("capacity").toOption)
          val updatedInfo = info.orElse(existingCourse.get[String]("info").toOption)
          val updatedCourseHours = courseHours.orElse(existingCourse.get[List[Int]]("courseHour").toOption)
          val updatedClassroomid = classroomid.orElse(existingCourse.get[Int]("classroomid").toOption)
          val updatedCredits = credits.orElse(existingCourse.get[Int]("credits").toOption)
          val updatedEnrolledStudents = enrolledStudents.orElse(existingCourse.get[List[EnrolledStudent]]("enrolledStudents").toOption)
          val updatedAllStudents = allStudents.orElse(existingCourse.get[List[AllStudent]]("allStudents").toOption)

          // Validate the JSON strings by parsing them
          val courseHourValidation = updatedCourseHours.map(hours => parse(hours.asJson.noSpaces).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))).sequence
          val enrolledStudentsValidation = updatedEnrolledStudents.map(students => parse(students.asJson.noSpaces).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))).sequence
          val allStudentsValidation = updatedAllStudents.map(students => parse(students.asJson.noSpaces).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))).sequence

          (courseHourValidation, enrolledStudentsValidation, allStudentsValidation) match {
            case (Right(_), Right(_), Right(_)) =>
              val checkConflictAndCapacityIO = for {
                existingCourses <- updatedClassroomid match {
                  case Some(id) if id >= 0 => getClassroomEnrolledCourses(id)
                  case _ => IO.pure(Map.empty[Int, List[Int]])
                }
                conflict = updatedCourseHours.exists(hours => checkCourseHourConflict(existingCourses.asJson, hours))
                classroomCapacity <- updatedClassroomid match {
                  case Some(id) if id >= 0 => getClassroomCapacity(id)
                  case _ => IO.pure(0)
                }
                _ <- if (updatedClassroomid.isDefined && conflict) IO.raiseError(new Exception("Course hour conflict detected for the given classroom")) else IO.unit
                _ <- if (classroomCapacity > 0 && updatedCapacity.exists(_ > classroomCapacity)) IO.raiseError(new Exception("Classroom capacity exceeded")) else IO.unit
              } yield existingCourses

              checkConflictAndCapacityIO.flatMap { existingCourses =>
                val actualCourseHours = updatedCourseHours.orElse(existingCourse.get[List[Int]]("courseHour").toOption).getOrElse(Nil)

                val updatedEnrolledCourses = updatedClassroomid match {
                  case Some(id) if id >= 0 => existingCourses + (courseid -> actualCourseHours)
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
                  updatedEnrolledStudents.map(_ => "enrolled_students = ?"),
                  updatedAllStudents.map(_ => "all_students = ?")
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
                  updatedEnrolledStudents.map(students => SqlParameter("jsonb", students.asJson.noSpaces)),
                  updatedAllStudents.map(students => SqlParameter("jsonb", students.asJson.noSpaces)),
                  Some(SqlParameter("int", courseid.toString))
                ).flatten

                val updateClassroomsIO: IO[Unit] = {
                  val removeOldClassroom: IO[Unit] =
                    if (updatedClassroomid.isDefined && updatedClassroomid != existingCourse.get[Int]("classroomid").toOption) {
                      getClassroomEnrolledCourses(existingCourse.get[Int]("classroomid").getOrElse(0)).flatMap { oldClassroomCourses =>
                        removeCourseFromClassroom(existingCourse.get[Int]("classroomid").getOrElse(0), oldClassroomCourses)
                      }
                    } else IO.unit

                  val updateNewClassroom: IO[Unit] =
                    updatedClassroomid.map { classroomid =>
                      updateClassroomEnrolledCourses(classroomid, updatedEnrolledCourses)
                    }.getOrElse(IO.unit)

                  removeOldClassroom *> updateNewClassroom
                }

                writeDB(updateCourseQuery.format(updates), params).flatMap { result =>
                  updateClassroomsIO.map(_ => result)
                }.map(_ => Course(
                  courseid,
                  updatedCourseName.getOrElse(""),
                  updatedTeacherUsername.getOrElse(""),
                  updatedTeacherName.getOrElse(""),
                  updatedCapacity.getOrElse(0),
                  updatedInfo.getOrElse(""),
                  updatedCourseHours.getOrElse(Nil),
                  updatedClassroomid.getOrElse(0),
                  updatedCredits.getOrElse(0),
                  updatedEnrolledStudents.getOrElse(Nil),
                  updatedAllStudents.getOrElse(Nil)
                ))
              }
          }

        case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
      }
    }
  }
}
