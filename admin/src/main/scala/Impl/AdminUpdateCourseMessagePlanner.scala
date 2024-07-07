package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.updateCourse

case class AdminUpdateCourseMessagePlanner(
                                            courseID: Int,
                                            courseName: Option[String],
                                            teacherUsername: Option[String],
                                            teacherName: Option[String],
                                            capacity: Option[Int],
                                            info: Option[String],
                                            courseHourJson: Option[String], // JSON represented as String
                                            credits: Option[Int],
                                            enrolledStudentsJson: Option[String], // JSON represented as String
                                            kwargsJson: Option[String], // JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    updateCourse(courseID, courseName, teacherUsername, teacherName, capacity, info, courseHourJson, credits, enrolledStudentsJson, kwargsJson)
  }
}
