package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.addCourse
import Common.Object.{EnrolledStudent, AllStudent, Course}
import io.circe.parser.decode
import io.circe.syntax._

case class AdminAddCourseMessagePlanner(
                                         courseName: String,
                                         teacherUsername: String,
                                         teacherName: String,
                                         capacity: Int,
                                         info: String,
                                         courseHour: List[Int],
                                         classroomid: Int,
                                         credits: Int,
                                         override val planContext: PlanContext
                                       ) extends Planner[Course] {
  override def plan(using planContext: PlanContext): IO[Course] = {
    addCourse(courseName, teacherUsername, teacherName, capacity, info, courseHour, classroomid, credits)
  }
}
