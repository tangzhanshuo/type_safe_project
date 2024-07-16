package Impl

import cats.effect.IO
import io.circe.syntax._
import io.circe.parser.parse
import io.circe.generic.auto._
import io.circe.{Decoder, Encoder, Json}
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB, readDBBoolean, readDBInt, readDBString}
import Common.Object.{SqlParameter, EnrolledStudent, AllStudent, Course}
import Common.DBAPI.WriteDBMessage

// Define the encoder for WriteDBMessage


case class AddCourseMessagePlanner(
                                    courseName: String,
                                    teacherUsername: String,
                                    teacherName: String,
                                    capacity: Int,
                                    info: String,
                                    courseHour: List[Int],
                                    classroomid: Int,
                                    credits: Int,
                                    enrolledStudents: List[EnrolledStudent],
                                    allStudents: List[AllStudent],
                                    override val planContext: PlanContext
                                  ) extends Planner[Course] {

  override def plan(using planContext: PlanContext): IO[Course] = {
    val checkClassroomExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM classroom WHERE classroomid = ?)",
      List(SqlParameter("int", classroomid.toString))
    )

    def getClassroomEnrolledCourses(classroomid: Int): IO[Json] = readDBString(s"SELECT enrolled_courses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    def getClassroomCapacity(classroomid: Int): IO[Int] = readDBInt(s"SELECT capacity FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    )

    def checkCourseHourConflict(existingCourses: Json): Boolean = {
      val courseHours = courseHour
      existingCourses.asObject.exists { obj =>
        obj.values.exists { courseHoursJson =>
          val existingCourseHours = courseHoursJson.as[List[Int]].getOrElse(Nil)
          courseHours.exists(existingCourseHours.contains)
        }
      }
    }

    def addCourseToDB(): IO[Unit] = writeDB(s"""
      INSERT INTO course (
        course_name, teacher_username, teacher_name, capacity, info, course_hour, classroomid, credits, enrolled_students, all_students
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """.stripMargin,
      List(
        SqlParameter("string", courseName),
        SqlParameter("string", teacherUsername),
        SqlParameter("string", teacherName),
        SqlParameter("int", capacity.toString),
        SqlParameter("string", info),
        SqlParameter("jsonb", courseHour.asJson.noSpaces),
        SqlParameter("int", classroomid.toString),
        SqlParameter("int", credits.toString),
        SqlParameter("jsonb", enrolledStudents.asJson.noSpaces),
        SqlParameter("jsonb", allStudents.asJson.noSpaces)
      )
    ).void

    def getCourseid(): IO[Int] = readDBInt(s"""
      SELECT courseid FROM course
      WHERE course_name = ? AND teacher_username = ? AND teacher_name = ? AND capacity = ?
        AND info = ? AND classroomid = ? AND credits = ?
      ORDER BY courseid DESC
      LIMIT 1
    """.stripMargin,
      List(
        SqlParameter("string", courseName),
        SqlParameter("string", teacherUsername),
        SqlParameter("string", teacherName),
        SqlParameter("int", capacity.toString),
        SqlParameter("string", info),
        SqlParameter("int", classroomid.toString),
        SqlParameter("int", credits.toString)
      )
    )

    def updateClassroomEnrolledCourses(classroomid: Int, existingCourses: Json, courseid: Int): IO[Unit] = {
      val updatedCourses = existingCourses.deepMerge(Json.obj(courseid.toString -> courseHour.asJson))
      writeDB(s"UPDATE classroom SET enrolled_courses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", classroomid.toString))
      ).void
    }

    checkClassroomExists.flatMap { classroomExists =>
      if (!classroomExists) {
        IO.raiseError(new Exception("Classroom with this id does not exist"))
      } else {
        val courseHourValidation = courseHour.asJson.as[List[Int]].left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
        val enrolledStudentsValidation = enrolledStudents.asJson.as[List[EnrolledStudent]].left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
        val allStudentsValidation = allStudents.asJson.as[List[AllStudent]].left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))

        (courseHourValidation, enrolledStudentsValidation, allStudentsValidation) match {
          case (Right(_), Right(_), Right(_)) =>
            val checkConflictAndCapacityIO = for {
              existingCourses <- getClassroomEnrolledCourses(classroomid)
              conflict = checkCourseHourConflict(existingCourses)
              classroomCapacity <- getClassroomCapacity(classroomid)
              _ <- if (classroomid >= 0 && conflict) IO.raiseError(new Exception("Course hour conflict detected for the given classroom")) else IO.unit
              _ <- if (classroomCapacity > 0 && capacity > classroomCapacity) IO.raiseError(new Exception("Classroom capacity exceeded")) else IO.unit
            } yield existingCourses

            for {
              existingCourses <- checkConflictAndCapacityIO
              _ <- addCourseToDB()
              courseid <- getCourseid()
              _ <- if (courseid == 0) IO.raiseError(new Exception("Failed to retrieve course id after insertion")) else IO.unit
              _ <- updateClassroomEnrolledCourses(classroomid, existingCourses, courseid)
            } yield Course(
              courseid,
              courseName,
              teacherUsername,
              teacherName,
              capacity,
              info,
              courseHour,
              classroomid,
              credits,
              enrolledStudents,
              allStudents
            )

          case (Left(courseHourError), _, _) => IO.raiseError(courseHourError)
          case (_, Left(enrolledStudentsError), _) => IO.raiseError(enrolledStudentsError)
          case (_, _, Left(allStudentsError)) => IO.raiseError(allStudentsError)
        }
      }
    }
  }
}

