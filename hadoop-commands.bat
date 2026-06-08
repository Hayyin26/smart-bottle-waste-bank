@echo off
REM Hadoop Quick Commands untuk Windows
REM Gunakan: hadoop-commands.bat [command]

if "%1"=="" goto :menu
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="status" goto :status
if "%1"=="test" goto :test
if "%1"=="backup" goto :backup
if "%1"=="ui" goto :ui
goto :menu

:menu
echo ================================
echo  Hadoop Quick Commands
echo ================================
echo.
echo Usage: hadoop-commands.bat [command]
echo.
echo Available commands:
echo   start   - Start Hadoop services
echo   stop    - Stop Hadoop services
echo   status  - Check Hadoop status
echo   test    - Test Hadoop connection
echo   backup  - Run manual backup
echo   ui      - Open Hadoop Web UI
echo.
goto :end

:start
echo Starting Hadoop services...
cd C:\hadoop-3.3.6\sbin
call start-dfs.cmd
call start-yarn.cmd
echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul
echo.
call jps
echo.
echo Hadoop started! Web UI: http://localhost:9870
goto :end

:stop
echo Stopping Hadoop services...
cd C:\hadoop-3.3.6\sbin
call stop-yarn.cmd
call stop-dfs.cmd
echo Hadoop stopped!
goto :end

:status
echo Checking Hadoop status...
call jps
echo.
npx tsx scripts/hadoop-status.ts
goto :end

:test
echo Testing Hadoop connection...
npx tsx scripts/test-hadoop-connection.ts
goto :end

:backup
echo Running manual backup...
npx tsx scripts/scheduled-hadoop-sync.ts
goto :end

:ui
echo Opening Hadoop Web UI...
start http://localhost:9870
start http://localhost:8088
goto :end

:end
