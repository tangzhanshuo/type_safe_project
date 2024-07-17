package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.CourseAPI.{getPriorityByPlanIDYearCourseID, addStudent2Course, getCreditsByStudentUsername, getCourseByCourseID, getAllCoursesByStudentUsername, getPlan}
import Common.DBAPI._
import io.circe.generic.auto._
import io.circe.parser._
import Common.Object.{Course, SqlParameter}

case class StudentAddCourseMessagePlanner(username: String, courseID: Int, priority: Option[Int], override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val getStudentQuery = "SELECT info FROM student WHERE user_name = ?"
    val getStudentParams = List(SqlParameter("string", username))

    val validPriorities = Set(0, 1, 2)

    for {
      // Validate priority
      validatedPriority <- IO.fromOption(priority match {
        case Some(p) if validPriorities.contains(p) => Some(p)
        case None => Some(0)
        case _ => None
      })(new Exception("Priority range is invalid"))

      // Get student information
      studentRows <- readDBRows(getStudentQuery, getStudentParams)
      studentRow <- studentRows.headOption match {
        case Some(row) => IO.pure(row)
        case None => IO.raiseError(new Exception(s"Student with username $username not found"))
      }
      infoJson <- IO.fromEither(studentRow.hcursor.get[String]("info").left.map(e => new Exception(s"Failed to get info: ${e.getMessage}")))
      info <- IO.fromEither(parse(infoJson).left.map(e => new Exception(s"Failed to parse info JSON: ${e.getMessage}")))
      planid <- IO.fromEither(info.hcursor.get[Int]("planid").left.map(e => new Exception(s"Failed to get planid from info: ${e.getMessage}")))
      year <- IO.fromEither(info.hcursor.get[Int]("year").left.map(e => new Exception(s"Failed to get year from info: ${e.getMessage}")))

      // Get student credits
      studentCredits <- getCreditsByStudentUsername(username)

      // Get course information
      course <- getCourseByCourseID(courseID)
      courseCredits = course.credits

      // Get plan information
      plan <- getPlan(planid)

      // Check credit limits
      creditsLimit <- IO.fromEither(plan.creditsLimits.get(year).toRight(new Exception(s"Failed to get credits limits for year $year")))
      _ <- if (studentCredits + courseCredits > creditsLimit.max) IO.raiseError(new Exception(s"Student $username exceeds the credit limit for year $year with this course")) else IO.unit

      // Get existing courses and priorities
      coursesOption <- getAllCoursesByStudentUsername(username)
      courses = coursesOption.getOrElse(List.empty)
      priorityCounts = Array.fill(9)(0)
      _ = courses.foreach { c =>
        c.allStudents.find(_.studentUsername == username).foreach { student =>
          priorityCounts(student.priority) += 1
        }
      }

      // Calculate final priority
      planPriority <- getPriorityByPlanIDYearCourseID(planid, year, courseID)
      finalPriority = planPriority * 3 + validatedPriority

      // Check priority limits
      _ <- if ((finalPriority == 2 || finalPriority == 5 || finalPriority == 8) && priorityCounts(finalPriority) >= 1)
        IO.raiseError(new Exception(s"Student $username already has a course with priority $finalPriority"))
      else if ((finalPriority == 1 || finalPriority == 4 || finalPriority == 7) && priorityCounts(finalPriority) >= 2)
        IO.raiseError(new Exception(s"Student $username already has two courses with priority $finalPriority"))
      else IO.unit

      // Add student to course
      result <- addStudent2Course(courseID, Some(username), Some(finalPriority))
    } yield result
  }
}
