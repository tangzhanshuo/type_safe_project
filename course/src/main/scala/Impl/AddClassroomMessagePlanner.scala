package Impl

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{SqlParameter, Classroom}

case class AddClassroomMessagePlanner(
                                       classroomid: Int,
                                       classroomName: String,
                                       capacity: Int, // 新增的capacity字段
                                       enrolledCourses: Map[Int, List[Int]], // JSON represented as String
                                       override val planContext: PlanContext
                                     ) extends Planner[Classroom] {
  override def plan(using planContext: PlanContext): IO[Classroom] = {
    val checkClassroomExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM classroom WHERE classroomid = ?)",
      List(SqlParameter("int", classroomid.toString))
    )

    checkClassroomExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("Classroom with this id already exists"))
      } else {
        // 将enrolledCourses转为JSON字符串
        val enrolledCoursesJson = enrolledCourses.asJson.noSpaces

        // 将enrolledCoursesJson作为jsonb类型插入数据库
        writeDB(
          s"""
             |INSERT INTO classroom (
             |  classroomid, classroom_name, capacity, enrolled_courses
             |) VALUES (?, ?, ?, ?)
            """.stripMargin,
          List(
            SqlParameter("int", classroomid.toString),
            SqlParameter("string", classroomName),
            SqlParameter("int", capacity.toString), // 插入新的capacity字段
            SqlParameter("jsonb", enrolledCoursesJson)
          )
        ).map(_ => Classroom(classroomid, classroomName, capacity, enrolledCourses))
      }
    }
  }
}
