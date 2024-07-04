package Impl.Routes

import Impl.*
import cats.effect.*
import com.zaxxer.hikari.HikariDataSource
import io.circe.parser.decode
import io.circe.{Decoder, Encoder, Json}
import org.http4s.*
import org.http4s.dsl.io.*
import io.circe.generic.auto.*
import java.sql.{Connection, SQLException}
import scala.concurrent.duration.*

object Routes {
  private def withConnectionMap[T: Encoder](message: DBPlanner[T], dataSource: HikariDataSource, connectionMap: Ref[IO, Map[String, Connection]]): IO[String] =
    if (message.planContext.transactionLevel > 0)
      connectionMap.get.flatMap { map =>
        map.get(message.planContext.traceID.id) match {
          case Some(existingConnection) =>
            message.planWithConnection(existingConnection, connectionMap).map(implicitly[JsonStringEncoder[T]].toJsonString).handleErrorWith {
              case error: SQLException if error.getMessage.contains("Connection is closed") =>
                connectionMap.update(_ - message.planContext.traceID.id) >> withConnectionMap(message, dataSource, connectionMap)
              case other => IO.raiseError(other)
            }
          case None =>
            for {
              newConnection <- IO(dataSource.getConnection)
              _ <- connectionMap.update(_ + (message.planContext.traceID.id -> newConnection))
              result <- message.planWithConnection(newConnection, connectionMap).map(implicitly[JsonStringEncoder[T]].toJsonString)
              _ <- (for {
                _ <- IO.sleep(5.minutes)
                _ <- connectionMap.update(_ - message.planContext.traceID.id)
                _ <- IO(newConnection.close())
              } yield ()).start
            } yield result
        }
      }
    else
      Resource.make(IO(dataSource.getConnection)) { connection => IO(connection.close()) }.use {
        newConnection => message.planWithConnection(newConnection, connectionMap).map(implicitly[JsonStringEncoder[T]].toJsonString).flatMap{
          a => IO.println(a) >> IO.pure(a)
        }
      }

  private def executePlan(messageType: String, str: String, dataSource: HikariDataSource, connectionMap: Ref[IO, Map[String, Connection]]): IO[String] =
    IO.println(str) >>
      (messageType match {
        case "InitSchemaMessage" =>
          IO.fromEither(decode[InitSchemaMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "EndTransactionMessage" =>
          IO.fromEither(decode[EndTransactionMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "ReadDBRowsMessage" =>
          IO.fromEither(decode[ReadDBRowsMessagePlanner](str)).flatMap(withConnectionMap[List[Json]](_, dataSource, connectionMap))
        case "ReadDBValueMessage" =>
          IO.fromEither(decode[ReadDBValueMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "WriteDBMessage" =>
          IO.fromEither(decode[WriteDBMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "WriteDBListMessage" =>
          IO.fromEither(decode[WriteDBListMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "StartTransactionMessage" =>
          IO.fromEither(decode[StartTransactionMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "DeleteDBMessage" =>
          IO.fromEither(decode[DeleteDBMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case "UpdateDBMessage" =>
          IO.fromEither(decode[UpdateDBMessagePlanner](str)).flatMap(withConnectionMap(_, dataSource, connectionMap))
        case _ =>
          IO.raiseError(new Exception(s"Unknown type: $messageType"))
      })

  def service(dataSource: HikariDataSource, connectionMap: Ref[IO, Map[String, Connection]]): HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "api" / name =>
      req.as[String].flatMap(executePlan(name, _, dataSource, connectionMap)).flatMap {
          a =>
            println(a)
            Ok(a)
        }
        .handleErrorWith { e =>
          IO(println(s"Error handling request: ${e.getMessage}")) >> // Log the detailed error
            BadRequest(s"An error occurred: ${e.getMessage}") // Provide a client-friendly error message
        }
  }
}
