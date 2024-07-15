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
                                          classroomid: Int,
                                          override val planContext: PlanContext
                                        ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    if (classroomid == -1) {
      IO.raiseError(new Exception("Cannot delete classroom with id -1"))
    } else {
      val getEnrolledCoursesQuery = s"SELECT enrolled_courses FROM classroom WHERE classroomid = ?"
      val getEnrolledCoursesParams = List(SqlParameter("int", classroomid.toString))

      val deleteClassroomQuery = s"DELETE FROM classroom WHERE classroomid = ?"
      val deleteClassroomParams = List(SqlParameter("int", classroomid.toString))

      val updateCourseClassroomQuery = s"UPDATE course SET classroomid = ? WHERE courseid = ?"

      def getClassroomEnrolledCourses(classroomid: Int): IO[Json] = readDBString(getEnrolledCoursesQuery,
        List(SqlParameter("int", classroomid.toString))).flatMap { enrolledCoursesJsonString =>
        IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
      }

      def updateCoursesToNewClassroom(existingCourses: Json): IO[Unit] = {
        val courseids = existingCourses.asObject.map(_.keys).getOrElse(Set())
        val updateTasks = courseids.toList.map { courseid =>
          writeDB(updateCourseClassroomQuery,
            List(SqlParameter("int", "-1"), SqlParameter("int", courseid))
          )
        }
        IO.parSequenceN(1)(updateTasks).map(_ => ())
      }

      def updateClassroomEnrolledCourses(existingCourses: Json): IO[Unit] = getClassroomEnrolledCourses(-1).flatMap { existingCoursesForMinusOne =>
        val updatedCourses = existingCoursesForMinusOne.deepMerge(existingCourses)
        writeDB(s"UPDATE classroom SET enrolled_courses = ? WHERE classroomid = ?",
          List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", "-1"))
        ).map(_ => ())
      }

      getClassroomEnrolledCourses(classroomid).flatMap { existingCourses =>
        for {
          _ <- updateCoursesToNewClassroom(existingCourses)
          _ <- updateClassroomEnrolledCourses(existingCourses)
          _ <- writeDB(deleteClassroomQuery, deleteClassroomParams)
        } yield s"Classroom with id $classroomid successfully deleted and courses moved to classroom with id -1"
      }
    }
  }
}
