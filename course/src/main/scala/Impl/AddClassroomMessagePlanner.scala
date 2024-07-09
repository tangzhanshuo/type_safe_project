package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.parser.parse
import io.circe.syntax.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter

case class AddClassroomMessagePlanner(
                                       classroomID: Int,
                                       classroomName: String,
                                       capacity: Int, // 新增的capacity字段
                                       enrolledCoursesJson: String, // JSON represented as String
                                       override val planContext: PlanContext
                                     ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkClassroomExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM classroom WHERE classroomid = ?)",
      List(SqlParameter("int", classroomID.toString))
    )

    checkClassroomExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("Classroom with this ID already exists"))
      } else {
        // Validate the JSON string by parsing it
        val enrolledCoursesValidation = parse(enrolledCoursesJson).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}"))

        enrolledCoursesValidation match {
          case Right(_) =>
            writeDB(s"""
                       |INSERT INTO classroom (
                       |  classroomid, classroomname, capacity, enrolledcourses
                       |) VALUES (?, ?, ?, ?)
            """.stripMargin,
              List(
                SqlParameter("int", classroomID.toString),
                SqlParameter("string", classroomName),
                SqlParameter("int", capacity.toString), // 插入新的capacity字段
                SqlParameter("jsonb", enrolledCoursesJson)
              )
            ).map(_ => s"Classroom $classroomName with ID $classroomID and capacity $capacity successfully added")

          case Left(error) => IO.raiseError(error)
        }
      }
    }
  }
}
