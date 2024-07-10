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
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS application(
           |  applicationID TEXT,
           |  usertype TEXT,
           |  username TEXT,
           |  applicationType TEXT,
           |  info JSONB,
           |  approver JSONB
           |)
         """.stripMargin, List()
      )
    } yield ()
  }
}
