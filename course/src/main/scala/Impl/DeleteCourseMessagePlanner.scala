package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class DeleteCourseMessagePlanner(courseID: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCourseQuery = "SELECT classroomid FROM course WHERE courseid = ?"
    val getCourseParams = List(SqlParameter("int", courseID.toString))

    def removeCourseFromClassroom(classroomID: Int, existingCourses: Json): IO[Unit] = {
      val updatedCourses = existingCourses.asObject.map(_.remove(courseID.toString).asJson).getOrElse(Json.obj())
      writeDB(s"UPDATE classroom SET enrolledcourses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", classroomID.toString))
      ).map(_ => ())
    }

    def getClassroomEnrolledCourses(classroomID: Int): IO[Json] = readDBString(s"SELECT enrolledcourses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomID.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    readDBRows(getCourseQuery, getCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val classroomID = row.hcursor.get[Int]("classroomid").getOrElse(throw new Exception("Classroom ID not found"))
          getClassroomEnrolledCourses(classroomID).flatMap { existingCourses =>
            removeCourseFromClassroom(classroomID, existingCourses).handleErrorWith { _ =>
              IO.unit // Ignore errors related to classroom updates
            }
          }.flatMap { _ =>
            writeDB(s"DELETE FROM course WHERE courseid = ?", List(SqlParameter("int", courseID.toString)))
          }
        case None => IO.raiseError(new Exception(s"Course with ID $courseID not found"))
      }
    }
  }
}
