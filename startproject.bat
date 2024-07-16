@echo off
setlocal enabledelayedexpansion

:: Set the absolute path for the SBT_JAR variable
set SBT_JAR=C:\Users\Jiayu Liu\AppData\Roaming\JetBrains\IntelliJIdea2024.1\plugins\Scala\launcher\sbt-launch.jar

set FOLDERS=db-manager admin application course student teacher user

for %%d in (%FOLDERS%) do (
    start cmd /k "cd %%d && java -jar "!SBT_JAR!" clean run || echo Error running sbt in %%d"
    timeout /t 30	
)

cmd /k "cd tw-portal && java -jar "!SBT_JAR!" clean run && (timeout /t 15 /nobreak >nul && echo 1) || echo Error running sbt in tw-portal"

timeout /t 30

:: 启动前端项目
start cmd /k "cd login-panel && yarn start"

endlocal