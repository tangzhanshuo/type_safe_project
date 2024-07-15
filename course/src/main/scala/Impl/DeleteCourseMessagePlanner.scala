package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class DeleteCourseMessagePlanner(courseid: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getCourseQuery = "SELECT classroomid FROM course WHERE courseid = ?"
    val getCourseParams = List(SqlParameter("int", courseid.toString))

    def removeCourseFromClassroom(classroomid: Int, existingCourses: Json): IO[Unit] = {
      val updatedCourses = existingCourses.asObject.map(_.remove(courseid.toString).asJson).getOrElse(Json.obj())
      writeDB(s"UPDATE classroom SET enrolled_courses = ? WHERE classroomid = ?",
        List(SqlParameter("jsonb", updatedCourses.noSpaces), SqlParameter("int", classroomid.toString))
      ).map(_ => ())
    }

    def getClassroomEnrolledCourses(classroomid: Int): IO[Json] = readDBString(s"SELECT enrolled_courses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    readDBRows(getCourseQuery, getCourseParams).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val classroomid = row.hcursor.get[Int]("classroomid").getOrElse(throw new Exception("Classroom id not found"))
          getClassroomEnrolledCourses(classroomid).flatMap { existingCourses =>
            removeCourseFromClassroom(classroomid, existingCourses).handleErrorWith { _ =>
              IO.unit // Ignore errors related to classroom updates
            }
          }.flatMap { _ =>
            writeDB(s"DELETE FROM course WHERE courseid = ?", List(SqlParameter("int", courseid.toString)))
          }
        case None => IO.raiseError(new Exception(s"Course with id $courseid not found"))
      }
    }
  }
}
