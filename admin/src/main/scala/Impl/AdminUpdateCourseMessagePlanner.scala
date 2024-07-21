package Impl

import cats.effect.IO
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import Common.Object.{EnrolledStudent, Course}
import io.circe.generic.auto._

case class AdminUpdateCourseMessagePlanner(
                                            courseid: Int,
                                            courseName: Option[String],
                                            teacherUsername: Option[String],
                                            teacherName: Option[String],
                                            capacity: Option[Int],
                                            info: Option[String],
                                            courseHourJson: Option[String], // JSON represented as String
                                            classroomid: Option[Int],
                                            credits: Option[Int], 
                                            override val planContext: PlanContext
                                          ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    val courseHours = courseHourJson.flatMap(json => decode[List[Int]](json).toOption)
    println(courseHours)
    updateCourse(courseid, courseName, teacherUsername, teacherName, capacity, info, courseHours, classroomid, credits)
  }
}
