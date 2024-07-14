package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addCourse

case class AdminAddCourseMessagePlanner(
                                         courseName: String,
                                         teacherUsername: String,
                                         teacherName: String,
                                         capacity: Int,
                                         info: String,
                                         courseHourJson: String, // JSON represented as String
                                         classroomID: Int,
                                         credits: Int,
                                         enrolledStudentsJson: String, // JSON represented as String
                                         allStudentsJson: String, // JSON represented as String
                                         override val planContext: PlanContext
                                       ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    addCourse(courseName, teacherUsername, teacherName, capacity, info, courseHourJson, classroomID, credits, enrolledStudentsJson, allStudentsJson)
  }
}
