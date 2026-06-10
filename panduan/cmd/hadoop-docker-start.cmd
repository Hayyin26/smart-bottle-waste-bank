@echo off
REM ============================================
REM Start Hadoop Cluster with Docker
REM ============================================

echo ============================================
echo Starting Hadoop Docker Cluster
echo ============================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo.
    echo Please:
    echo 1. Start Docker Desktop
    echo 2. Wait for Docker to be ready
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo [1/3] Docker is running... OK
echo.

REM Start Hadoop cluster
echo [2/3] Starting Hadoop containers...
docker-compose -f docker-compose.hadoop.yml up -d

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start Hadoop cluster!
    echo Check Docker Desktop and try again.
    pause
    exit /b 1
)

echo.
echo [3/3] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ============================================
echo Hadoop Cluster Started Successfully!
echo ============================================
echo.
echo Web Interfaces:
echo   NameNode:         http://localhost:9870
echo   DataNode:         http://localhost:9864
echo   ResourceManager:  http://localhost:8088
echo   NodeManager:      http://localhost:8042
echo.
echo Status:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | findstr hadoop

echo.
echo Next steps:
echo 1. Upload data: .\hadoop-docker-upload-data.cmd
echo 2. Start web app: npm run dev
echo 3. View dashboard: http://localhost:3000/hadoop
echo.
echo To view logs: docker-compose -f docker-compose.hadoop.yml logs -f
echo To stop: .\hadoop-docker-stop.cmd
echo.
pause
