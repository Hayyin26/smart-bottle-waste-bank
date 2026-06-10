@echo off
REM ============================================
REM Sync Supabase Data to Hadoop HDFS
REM ============================================

echo ============================================
echo Sync Supabase to Hadoop
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js first.
    pause
    exit /b 1
)

REM Run the sync script
node sync-supabase-to-hadoop.js

pause
