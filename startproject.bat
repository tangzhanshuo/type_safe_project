setlocal enabledelayedexpansion

cd db-manager
start cmd /c "java -jar .\out\artifacts\DB_Manager_jar\DB-Manager.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

timeout /t 5

cd admin
start cmd /c "java -jar .\out\artifacts\Admin_jar\Admin.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

cd student
start cmd /c "java -jar .\out\artifacts\Student_jar\Student.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

cd course
start cmd /c "java -jar .\out\artifacts\Course_jar\Course.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

cd teacher
start cmd /c "java -jar .\out\artifacts\Teacher_jar\Teacher.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

cd tw-portal
start cmd /c "java -jar .\out\artifacts\Portal_jar\Portal.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

cd user
start cmd /c "java -jar .\out\artifacts\User_jar\User.jar"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
cd..

:: 等待后端服务启动
timeout /t 5

:: 启动前端项目
cd login-panel
start cmd /c "yarn start"
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

endlocal