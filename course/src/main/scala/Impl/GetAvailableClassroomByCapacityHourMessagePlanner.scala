package Impl

import cats.effect.IO
import cats.syntax.all._  // 导入 traverse 方法
import io.circe.generic.auto._
import io.circe.parser.parse
import io.circe.syntax._
import io.circe.Json
import Common.API.{PlanContext, Planner}
import Common.DBAPI._
import Common.Object.SqlParameter

case class GetAvailableClassroomByCapacityHourMessagePlanner(
                                                              capacity: Int,
                                                              courseHourJson: String,
                                                              override val planContext: PlanContext
                                                            ) extends Planner[String] {

  override def plan(using planContext: PlanContext): IO[String] = {
    val getClassroomsQuery = s"SELECT * FROM classroom"

    def parseCourseHours(courseHourJson: String): List[Int] = {
      parse(courseHourJson).getOrElse(Json.arr()).as[List[Int]].getOrElse(Nil)
    }

    def checkTimeConflict(existingHours: List[Int], newHours: List[Int]): Boolean = {
      existingHours.exists(newHours.contains)
    }

    def getClassroomEnrolledCourses(classroomID: Int): IO[Json] = readDBString(s"SELECT enrolledcourses FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomID.toString))
    ).flatMap { enrolledCoursesJsonString =>
      IO.fromEither(parse(enrolledCoursesJsonString).left.map(e => new Exception(s"Invalid JSON for enrolledCourses: ${e.getMessage}")))
    }

    def getClassroomCapacity(classroomID: Int): IO[Int] = readDBInt(s"SELECT capacity FROM classroom WHERE classroomid = ?",
      List(SqlParameter("int", classroomID.toString))
    )

    def isClassroomAvailable(classroomID: Int, existingCourses: Json, newCourseHours: List[Int], classroomCapacity: Int): Boolean = {
      if (classroomID < 0 || classroomCapacity < 0) {
        true
      } else {
        val enrolledCourses = existingCourses.asObject.map(_.toMap).getOrElse(Map.empty)
        val isAvailableByTime = !enrolledCourses.values.exists { courseHoursJson =>
          val existingCourseHours = courseHoursJson.as[List[Int]].getOrElse(Nil)
          checkTimeConflict(existingCourseHours, newCourseHours)
        }
        val isAvailableByCapacity = classroomCapacity >= capacity
        isAvailableByTime && isAvailableByCapacity
      }
    }

    def sortClassroomsByID(classrooms: List[Json]): List[Json] = {
      classrooms.sortBy(_.hcursor.get[Int]("classroomid").getOrElse(0))
    }

    readDBRows(getClassroomsQuery, List()).flatMap { rows =>
      val newCourseHours = parseCourseHours(courseHourJson)
      val availableClassroomsIO = rows.traverse { row =>
        val classroomID = row.hcursor.get[Int]("classroomid").getOrElse(0)
        for {
          enrolledCourses <- getClassroomEnrolledCourses(classroomID)
          classroomCapacity <- getClassroomCapacity(classroomID)
        } yield {
          if (isClassroomAvailable(classroomID, enrolledCourses, newCourseHours, classroomCapacity)) {
            Some(row)
          } else {
            None
          }
        }
      }
      availableClassroomsIO.map { classrooms =>
        val availableClassrooms = classrooms.flatten
        sortClassroomsByID(availableClassrooms).asJson.noSpaces
      }
    }
  }
}
