package Impl

import cats.effect.IO
import io.circe.syntax._
import Common.API.{PlanContext, Planner}
import Common.CourseAPI._
import io.circe.generic.auto._
import Common.Object.Course
import cats.syntax.apply._

case class AdminGetAllCoursesMessagePlanner(
                                                     element: String,
                                                     override val planContext: PlanContext
                                                   ) extends Planner[List[Course]] {
  override def plan(using planContext: PlanContext): IO[List[Course]] = {
    val courseIdOption = element.toIntOption

    val coursesByName: IO[List[Course]] = getCourseByCourseName(element)
    val coursesById: IO[List[Course]] = courseIdOption match {
      case Some(id) => getCourseByCourseID(id).map(List(_))
      case None => IO.pure(List.empty[Course])
    }
    val coursesByTeacher: IO[List[Course]] = getCourseByTeacherUsername(element)

    (coursesByName, coursesById, coursesByTeacher).mapN { (name, id, teacher) =>
      (name ++ id ++ teacher).distinct
    }
  }
}