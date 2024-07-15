package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddCourseMessagePlanner(
                                    courseName: String,
                                    teacherUsername: String,
                                    teacherName: String,
                                    capacity: Int,
                                    info: String,
                                    courseHourJson: String,
                                    classroomID: Int,
                                    credits: Int,
                                    enrolledStudentsJson: String,
                                    allStudentsJson: String,
                                    override val planContext: PlanContext
                                  ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkClassroomExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM classroom WHERE classroomid = ?)",
      List(SqlParameter("int", classroomID.toString))
    )

    def getClassroomEnrolledCourses(classroomID: Int): IO[Json] = readDBString(s"SELECT enrolledcourses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomID.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    def getClassroomCapacity(classroomID: Int): IO[Int] = readDBInt(s"SELECT capacity FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomID.toString))
    )

    def checkCourseHourConflict(existingCourses: Json): Boolean = {
      val courseHours = parse(courseHourJson).getOrElse(Json.arr()).as[List[Int]].getOrElse(Nil)
      existingCourses.asObject.exists { obj =>
        obj.values.exists { courseHoursJson =>
          val existingCourseHours = courseHoursJson.as[List[Int]].getOrElse(Nil)
          courseHours.exists(existingCourseHours.contains)
        }
      }
    }

    def addCourseToDB(): IO[Unit] = writeDB(s"""
      INSERT INTO course (
        coursename, teacherusername, teachername, capacity, info, coursehour, classroomid, credits, enrolledstudents, allstudents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """.stripMargin,
      List(
        SqlParameter("string", courseName),
        SqlParameter("string", teacherUsername),
        SqlParameter("string", teacherName),
        SqlParameter("int", capacity.toString),
        SqlParameter("string", info),
        SqlParameter("jsonb", courseHourJson),
        SqlParameter("int", classroomID.toString),
        SqlParameter("int", credits.toString),
        SqlParameter("jsonb", enrolledStudentsJson),
        SqlParameter("jsonb", allStudentsJson)
      )
    ).void

    def getCourseID(): IO[String] = readDBString(s"""
  SELECT courseid FROM course
  WHERE coursename = ? AND teacherusername = ? AND teachername = ? AND capacity = ?
    AND info = ? AND coursehour::text = ? AND classroomid = ? AND credits = ?
  ORDER BY courseid DESC
  LIMIT 1
""".stripMargin,
      List(
        SqlParameter("string", courseName),
        SqlParameter("string", teacherUsername),
        SqlParameter("string", teacherName),
        SqlParameter("int", capacity.toString),
        SqlParameter("string", info),
        SqlParameter("string", courseHourJson),  // Changed from "jsonb" to "string"
        SqlParameter("int", classroomID.toString),
        SqlParameter("int", credits.toString)
      )
    )

    def updateClassroomEnrolledCourses(classroomID: Int, existingCourses: Json, courseID: String): IO[Unit] = {
      val updatedCourses = existingCourses.deepMerge(Json.obj(courseID -> parse(courseHourJson).getOrElse(Json.arr())))
      writeDB(s"UPDATE classroom SET enrolledcourses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", classroomID.toString))
      ).void
    }

    checkClassroomExists.flatMap { classroomExists =>
      if (!classroomExists) {
        IO.raiseError(new Exception("Classroom with this ID does not exist"))
      } else {
        val courseHourValidation = parse(courseHourJson).left.map(e => new Exception(s"Invalid JSON for courseHour: ${e.getMessage}"))
        val enrolledStudentsValidation = parse(enrolledStudentsJson).left.map(e => new Exception(s"Invalid JSON for enrolledStudents: ${e.getMessage}"))
        val allStudentsValidation = parse(allStudentsJson).left.map(e => new Exception(s"Invalid JSON for allStudents: ${e.getMessage}"))

        (courseHourValidation, enrolledStudentsValidation, allStudentsValidation) match {
          case (Right(_), Right(_), Right(_)) =>
            val checkConflictAndCapacityIO = for {
              existingCourses <- getClassroomEnrolledCourses(classroomID)
              conflict = checkCourseHourConflict(existingCourses)
              classroomCapacity <- getClassroomCapacity(classroomID)
              _ <- if (classroomID >= 0 && conflict) IO.raiseError(new Exception("Course hour conflict detected for the given classroom")) else IO.unit
              _ <- if (classroomCapacity > 0 && capacity > classroomCapacity) IO.raiseError(new Exception("Classroom capacity exceeded")) else IO.unit
            } yield existingCourses

            for {
              existingCourses <- checkConflictAndCapacityIO
              _ <- addCourseToDB()
              newCourseID <- getCourseID()
              _ <- updateClassroomEnrolledCourses(classroomID, existingCourses, newCourseID)
            } yield newCourseID

          case (Left(courseHourError), _, _) => IO.raiseError(courseHourError)
          case (_, Left(enrolledStudentsError), _) => IO.raiseError(enrolledStudentsError)
          case (_, _, Left(allStudentsError)) => IO.raiseError(allStudentsError)
        }
      }
    }
  }
}