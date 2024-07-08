package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config: ServerConfig): IO[Unit] = {
    given PlanContext = PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)

    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema("course")
      _ <- initSchema("classroom")
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS course (
           |  courseid INT PRIMARY KEY,
           |  coursename TEXT,
           |  teacherusername TEXT,
           |  teachername TEXT,
           |  capacity INT,
           |  info TEXT,
           |  coursehour JSON,
           |  credits INT,
           |  enrolledstudents JSON,
           |  kwargs JSON
           |)
         """.stripMargin, List()
        // The course_hour should be a list of Ints with value 42*w + 6*d + h where
        // w = 0, 1 stands for 前八周，后八周
        // d = 1, 2, 3, 4, 5, 6, 7 stands for 星期d
        // h = 1, 2, 3, 4, 5, 6 stands for 第h段时间
        // kwargs contain other info
      )
      - <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS classroom (
           |  classroomid TEXT PRIMARY KEY,
           |  classroomname TEXT,
           |  enrolledcourses JSON
           |)
         """.stripMargin, List()
        // enrolledcourses should be a dict of "courseid: LIST[*coursehour]"
      )
    } yield ()
  }
}
