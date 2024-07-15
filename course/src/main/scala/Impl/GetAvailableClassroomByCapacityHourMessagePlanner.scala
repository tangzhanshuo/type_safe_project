package Impl

import cats.effect.IO
import cats.syntax.all._  // 导入 traverse 方法
import io.circe.generic.auto._
import io.circe.parser.parse
import io.circe.syntax._
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.{Classroom, SqlParameter}
import io.circe.Decoder

case class GetAvailableClassroomByCapacityHourMessagePlanner(
                                                              capacity: Int,
                                                              courseHour: List[Int],
                                                              override val planContext: PlanContext
                                                            ) extends Planner[List[Classroom]] {

  override def plan(using planContext: PlanContext): IO[List[Classroom]] = {
    val getClassroomsQuery = "SELECT * FROM classroom"

    def checkTimeConflict(existingHours: List[Int], newHours: List[Int]): Boolean = {
      existingHours.exists(newHours.contains)
    }

    def getClassroomEnrolledCourses(classroomid: Int): IO[Map[Int, List[Int]]] = readDBString("SELECT enrolled_courses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomid.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).flatMap(_.as[Map[Int, List[Int]]]).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    def isClassroomAvailable(classroomid: Int, enrolledCourses: Map[Int, List[Int]], newCourseHours: List[Int], classroomCapacity: Int): Boolean = {
      if (classroomid < 0 || classroomCapacity < 0) {
        true
      } else {
        val isAvailableByTime = !enrolledCourses.values.exists { existingCourseHours =>
          checkTimeConflict(existingCourseHours, newCourseHours)
        }
        val isAvailableByCapacity = classroomCapacity >= capacity
        isAvailableByTime && isAvailableByCapacity
      }
    }

    def sortClassroomsById(classrooms: List[Classroom]): List[Classroom] = {
      classrooms.sortBy(_.classroomid)
    }

    readDBRows(getClassroomsQuery, List()).flatMap { rows =>
      val availableClassroomsIO = rows.traverse { row =>
        val cursor = row.hcursor
        for {
          classroomid <- IO.fromEither(cursor.get[Int]("classroomid").left.map(e => new Exception("Missing classroomid")))
          classroomName <- IO.fromEither(cursor.get[String]("classroomName").left.map(e => new Exception("Missing classroomName")))
          classroomCapacity <- IO.fromEither(cursor.get[Int]("capacity").left.map(e => new Exception("Missing capacity")))
          enrolledCourses <- getClassroomEnrolledCourses(classroomid)
        } yield {
          if (isClassroomAvailable(classroomid, enrolledCourses, courseHour, classroomCapacity)) {
            Some(Classroom(classroomid, classroomName, classroomCapacity, enrolledCourses))
          } else {
            None
          }
        }
      }
      availableClassroomsIO.map { classrooms =>
        val availableClassrooms = classrooms.flatten
        sortClassroomsById(availableClassrooms)
      }
    }
  }
}
