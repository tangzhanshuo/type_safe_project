package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto._
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config: ServerConfig): IO[Unit] = {
    given PlanContext = PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)
    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS student (user_name TEXT, password TEXT, info JSONB)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS teacher (user_name TEXT, password TEXT, info JSONB)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS admin (user_name TEXT, password TEXT, info JSONB)", List())
    } yield ()
  }
}
