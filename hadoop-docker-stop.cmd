@echo off
REM ============================================
REM Stop Hadoop Docker Cluster
REM ============================================

echo ============================================
echo Stopping Hadoop Docker Cluster
echo ============================================
echo.

docker-compose -f docker-compose.hadoop.yml down

echo.
echo ============================================
echo Hadoop Cluster Stopped
echo ============================================
echo.
echo Data is preserved in Docker volumes.
echo To start again: .\hadoop-docker-start.cmd
echo.
echo To remove all data (⚠️ WARNING):
echo docker-compose -f docker-compose.hadoop.yml down -v
echo.
pause
