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
           |CREATE TABLE IF NOT EXISTS course (
           |  courseid SERIAL PRIMARY KEY,
           |  course_name TEXT,
           |  teacher_username TEXT,
           |  teacher_name TEXT,
           |  capacity INT,
           |  info TEXT,
           |  course_hour JSONB,
           |  classroomid INT,
           |  credits INT,
           |  enrolled_students JSONB,
           |  all_students JSONB,
           |  status TEXT
           |)
         """.stripMargin, List()
        // The course_hour should be a list of Ints with value 42*w + 6*d + h where
        // w = 0, 1 stands for 前八周，后八周
        // d = 1, 2, 3, 4, 5, 6, 7 stands for 星期d
        // h = 1, 2, 3, 4, 5, 6 stands for 第h段时间
      )

      /*_ <- writeDB(
        s"""
           |INSERT INTO course (
           |  course_name,
           |  teacher_username,
           |  teacher_name,
           |  capacity,
           |  info,
           |  course_hour,
           |  classroomid,
           |  credits,
           |  enrolled_students,
           |  all_students
           |)
           |VALUES ('入学', 't', 't', '1', '抢不到就等着退学吧', '[1]', -1, 0, '[]', '[]')
           |ON CONFLICT (courseid) DO NOTHING
         """.stripMargin, List()
      )*/
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS classroom (
           |  classroomid INT PRIMARY KEY,
           |  classroom_name TEXT,
           |  capacity INT,
           |  enrolled_courses JSONB
           |)
         """.stripMargin, List()
        // enrolled_courses should be a dict of "courseid: LIST[*course_hour]"
        // If id < 0, then no conflict checking within enrolled_courses.
      )
      // Initialize a default classroom
      _ <- writeDB(
        s"""
           |INSERT INTO classroom (classroomid, classroom_name, capacity, enrolled_courses)
           |VALUES (-1, 'No room', '-1', '{"-1":[1]}')
           |ON CONFLICT (classroomid) DO NOTHING
         """.stripMargin, List()
      )
      _ <- writeDB(
        s"""
           |CREATE TABLE IF NOT EXISTS plan (
           |  planid INT PRIMARY KEY,
           |  plan_name TEXT,
           |  credits_limits JSONB DEFAULT '{"1": {"min": 6, "max": 26}, "2": {"min": 6, "max": 26}, "3": {"min": 6, "max": 30}, "4": {"min": 6, "max": 114514}}'::jsonb,
           |  priority JSONB DEFAULT '{"1": {"-1": 2}, "4": {"1": 2}}'::jsonb
           |)
         """.stripMargin, List()
      )
      _ <- writeDB(
        s"""
           |INSERT INTO plan (
           |  planid,
           |  plan_name,
           |  credits_limits,
           |  priority
           |)
           |VALUES (
           |  1,
           |  'Computer Science Plan',
           |  '{"1": {"min": 6, "max": 26}, "2": {"min": 6, "max": 26}, "3": {"min": 6, "max": 30}, "4": {"min": 6, "max": 114514}}'::jsonb,
           |  '{"1": {"-1": 2}, "4": {"1": 2}}'::jsonb
           |)
           |ON CONFLICT (planid) DO NOTHING
         """.stripMargin, List()
      )
    } yield ()
  }
}
