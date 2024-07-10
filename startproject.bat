@echo off
setlocal enabledelayedexpansion

:: Set the absolute path for the SBT_JAR variable
set SBT_JAR=C:\Users\13552\AppData\Roaming\JetBrains\IntelliJIdea2024.1\plugins\Scala\launcher\sbt-launch.jar

start cmd /k "cd db-manager && java -jar "!SBT_JAR!" clean run || echo Error running sbt-launch.jar in db-manager"

timeout /t 20

set FOLDERS=student admin course teacher tw-portal user request

for %%d in (%FOLDERS%) do (
    start cmd /k "cd %%d && java -jar "!SBT_JAR!" clean run || echo Error running sbt-launch.jar in %%d"
)

:: 等待后端服务启动
timeout /t 70

:: 启动前端项目
start cmd /k "cd login-panel && yarn start"

endlocal