@echo off
echo ========================================
echo Starting Hadoop Services
echo ========================================
echo.

echo Step 1: Starting HDFS...
echo ----------------------------------------
cd C:\hadoop-3.3.6\sbin
call start-dfs.cmd
echo.

echo Waiting 10 seconds...
timeout /t 10 /nobreak
echo.

echo Step 2: Starting YARN...
echo ----------------------------------------
call start-yarn.cmd
echo.

echo Waiting 5 seconds...
timeout /t 5 /nobreak
echo.

echo Step 3: Checking Services...
echo ----------------------------------------
jps
echo.

echo ========================================
echo Hadoop Services Started!
echo ========================================
echo.
echo Web UI URLs:
echo - HDFS NameNode:       http://localhost:9870
echo - YARN ResourceManager: http://localhost:8088
echo - MapReduce JobHistory: http://localhost:19888
echo.
echo Press any key to open HDFS Web UI...
pause > nul

start http://localhost:9870

echo Press any key to exit...
pause > nul
