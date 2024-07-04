package Impl

import Common.API.{PlanContext, TraceID}
import Common.Object.{ParameterList, SqlParameter}
import cats.effect.{IO, Ref}
import java.sql.{Connection, PreparedStatement}

case class DeleteDBMessagePlanner(sqlStatement: String, parameters: List[SqlParameter], override val planContext: PlanContext) extends DBPlanner[String] {
  override def planWithConnection(connection: Connection, connectionMap: Ref[IO, Map[String, Connection]]): IO[String] = IO.delay {
    val preparedStatement = connection.prepareStatement(sqlStatement)
    try {
      if (parameters.isEmpty) {
        preparedStatement.executeUpdate()
      } else {
        // Reset the statement for each set of parameters
        preparedStatement.clearParameters()

        // Set parameters for the current execution
        parameters.zipWithIndex.foreach { case (sqlParameter, index) =>
          setPreparedStatement(preparedStatement, index + 1, sqlParameter)
        }

        // Execute the update for the current set of parameters
        preparedStatement.executeUpdate()
      }
      "Delete operation successful"
    } finally {
      preparedStatement.close() // Ensure the PreparedStatement is closed after use
    }
  }

  // Function to set the PreparedStatement parameter based on SqlParameter
  private def setPreparedStatement(statement: PreparedStatement, index: Int, sqlParameter: SqlParameter): Unit = {
    sqlParameter.dataType.toLowerCase match {
      case "string" => statement.setString(index, sqlParameter.value)
      case "int" => statement.setInt(index, sqlParameter.value.toInt)
      case "double" => statement.setDouble(index, sqlParameter.value.toDouble)
      case "datetime" => statement.setTimestamp(index, new java.sql.Timestamp(sqlParameter.value.toLong))
      // Add more cases for other data types if needed
      case _ => throw new IllegalArgumentException(s"Unhandled parameter type: ${sqlParameter.dataType}")
    }
  }
}
