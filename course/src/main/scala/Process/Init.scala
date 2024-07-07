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
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS course (
           |  course_ID INT PRIMARY KEY,
           |  course_name TEXT,
           |  teacher_username TEXT,
           |  teacher_name TEXT,
           |  capacity INT,
           |  info TEXT,
           |  course_hour JSON,
           |  credits INT,
           |  enrolled_students JSON,
           |  kwargs JSON
           |)
         """.stripMargin, List()
        // The course_hour should be a list of Ints with value 42*w + 6*d + h where
        // w = 0, 1 stands for 前八周，后八周
        // d = 1, 2, 3, 4, 5, 6, 7 stands for 星期d
        // h = 1, 2, 3, 4, 5, 6 stands for 第h段时间
        // kwargs contain other info
      )
    } yield ()
  }
}
