package Impl

import cats.effect.IO
import io.circe.parser.decode
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import Common.Object.{Classroom}
import io.circe.generic.auto._

case class AdminAddClassroomMessagePlanner(
                                            classroomid: Int,
                                            classroomName: String,
                                            capacity: Int,
                                            enrolledCoursesJson: String, // JSON represented as String
                                            override val planContext: PlanContext
                                          ) extends Planner[Classroom] {
  override def plan(using planContext: PlanContext): IO[Classroom] = {
    val enrolledCourses = decode[Map[Int, List[Int]]](enrolledCoursesJson).getOrElse(Map.empty[Int, List[Int]])
    println(enrolledCourses)
    addClassroom(classroomid, classroomName, capacity, enrolledCourses)
  }
}
