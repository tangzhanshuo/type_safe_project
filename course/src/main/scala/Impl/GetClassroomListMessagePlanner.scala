package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.readDBRows
import Common.Object.*
import cats.effect.IO
import io.circe.generic.auto._
import io.circe.parser.decode
import io.circe.syntax._
import cats.implicits._

case class GetClassroomListMessagePlanner(override val planContext: PlanContext) extends Planner[List[Classroom]] {
  override def plan(using planContext: PlanContext): IO[List[Classroom]] = {
    val query = "SELECT * FROM classroom ORDER BY classroomid"
    readDBRows(query, List()).flatMap { rows =>
      if (rows.isEmpty) IO.raiseError(new NoSuchElementException(s"No classrooms found"))
      else {
        val classroomsIO = rows.map { row =>
          val cursor = row.hcursor
          for {
            classroomID <- cursor.get[Int]("classroomid").toOption.toRight(new Exception("Missing classroomid"))
            classroomName <- cursor.get[String]("classroomName").toOption.toRight(new Exception("Missing classroomname"))
            capacity <- cursor.get[Int]("capacity").toOption.toRight(new Exception("Missing capacity"))
            enrolledCoursesStr <- cursor.get[String]("enrolledCourses").toOption.toRight(new Exception("Missing enrolledcourses"))
            enrolledCourses <- decode[Map[Int, List[Int]]](enrolledCoursesStr).left.map(e => new Exception(s"Invalid JSON for enrolledcourses: ${e.getMessage}"))
          } yield Classroom(classroomID, classroomName, capacity, enrolledCourses)
        }
        classroomsIO.sequence match {
          case Left(error) => IO.raiseError(error)
          case Right(classrooms) => IO.pure(classrooms)
        }
      }
    }
  }
}
