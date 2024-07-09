package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class DeleteClassroomMessagePlanner(
                                          classroomID: Int,
                                          override val planContext: PlanContext
                                        ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    if (classroomID == -1) {
      IO.raiseError(new Exception("Cannot delete classroom with ID -1"))
    } else {
      val getEnrolledCoursesQuery = s"SELECT enrolledcourses FROM classroom WHERE classroomid = ?"
      val getEnrolledCoursesParams = List(SqlParameter("int", classroomID.toString))

      val deleteClassroomQuery = s"DELETE FROM classroom WHERE classroomid = ?"
      val deleteClassroomParams = List(SqlParameter("int", classroomID.toString))

      val updateCourseClassroomQuery = s"UPDATE course SET classroomid = ? WHERE courseid = ?"

      def getClassroomEnrolledCourses(classroomID: Int): IO[Json] = readDBString(getEnrolledCoursesQuery,
        List(SqlParameter("int", classroomID.toString))).flatMap { enrolledCoursesJsonString =>
        IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
      }

      def updateCoursesToNewClassroom(existingCourses: Json): IO[Unit] = {
        val courseIDs = existingCourses.asObject.map(_.keys).getOrElse(Set())
        val updateTasks = courseIDs.toList.map { courseID =>
          writeDB(updateCourseClassroomQuery,
            List(SqlParameter("int", "-1"), SqlParameter("int", courseID))
          )
        }
        IO.parSequenceN(1)(updateTasks).map(_ => ())
      }

      def updateClassroomEnrolledCourses(existingCourses: Json): IO[Unit] = getClassroomEnrolledCourses(-1).flatMap { existingCoursesForMinusOne =>
        val updatedCourses = existingCoursesForMinusOne.deepMerge(existingCourses)
        writeDB(s"UPDATE classroom SET enrolledcourses = ? WHERE classroomid = ?",
          List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", "-1"))
        ).map(_ => ())
      }

      getClassroomEnrolledCourses(classroomID).flatMap { existingCourses =>
        for {
          _ <- updateCoursesToNewClassroom(existingCourses)
          _ <- updateClassroomEnrolledCourses(existingCourses)
          _ <- writeDB(deleteClassroomQuery, deleteClassroomParams)
        } yield s"Classroom with ID $classroomID successfully deleted and courses moved to classroom with ID -1"
      }
    }
  }
}
