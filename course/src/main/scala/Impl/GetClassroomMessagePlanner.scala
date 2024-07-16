package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.{Classroom, SqlParameter}
import cats.implicits.*

case class GetClassroomMessagePlanner(classroomid: Int, override val planContext: PlanContext) extends Planner[Classroom] {
  override def plan(using planContext: PlanContext): IO[Classroom] = {
    val query = "SELECT * FROM classroom WHERE classroomid = ?"
    readDBRows(query, List(SqlParameter("int", classroomid.toString))).flatMap { rows =>
      rows.headOption match {
        case Some(row) =>
          val cursor = row.hcursor

          val classroomID = cursor.get[Int]("classroomid").left.map(e => new Exception("Missing classroomid"))
          val classroomName = cursor.get[String]("classroomName").left.map(e => new Exception("Missing classroomName"))
          val capacity = cursor.get[Int]("capacity").left.map(e => new Exception("Missing capacity"))
          val enrolledCoursesStr = cursor.get[String]("enrolledCourses").left.map(e => new Exception("Missing enrolledCourses"))
          val enrolledCourses = enrolledCoursesStr.flatMap(str => decode[Map[Int, List[Int]]](str).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))

          (classroomID, classroomName, capacity, enrolledCourses) match {
            case (Right(classroomID), Right(classroomName), Right(capacity), Right(enrolledCourses)) =>
              IO.pure(Classroom(classroomID, classroomName, capacity, enrolledCourses))
            case _ =>
              IO.raiseError(new Exception("Failed to parse classroom data"))
          }

        case None => IO.raiseError(new NoSuchElementException(s"No classroom found with classroomid: $classroomid"))
      }
    }
  }
}
