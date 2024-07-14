package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config:ServerConfig):IO[Unit]=
    given PlanContext=PlanContext(traceID = TraceID(UUID.randomUUID().toString),0)
    for{
      _ <- API.init(config.maximumClientConnection)
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS plan (
           |  planid INT PRIMARY KEY,
           |  planname TEXT,
           |  credits_limits JSONB,
           |  p1courses JSONB,
           |  p2courses JSONB
           |)
         """.stripMargin, List()
      )
      _ <- writeDB(
        s"""
           |INSERT INTO plan (
           |  planid,
           |  planname,
           |  credits_limits,
           |  p1courses,
           |  p2courses
           |)
           |VALUES (
           |  1,
           |  'Computer Science Plan',
           |  '[{"min": 6, "max": 26}, {"min": 6, "max": 26}, {"min": 6, "max": 30}, {"min": 6, "max": 114514}]'::jsonb,
           |  '[[], [], [], []]'::jsonb,
           |  '[[-1], [], [], [1]]'::jsonb
           |)
           |ON CONFLICT (planid) DO NOTHING
         """.stripMargin, List()
      )
    } yield ()
}
