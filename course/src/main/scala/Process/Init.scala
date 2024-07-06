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
           |  enrolled_students JSON
           |)
         """.stripMargin, List()
      )
    } yield ()
  }
}
