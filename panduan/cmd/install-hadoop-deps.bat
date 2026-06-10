@echo off
echo ================================
echo  Installing Hadoop Dependencies
echo ================================
echo.

echo [1/2] Installing axios...
call npm install axios

echo.
echo [2/2] Installing TypeScript type definitions...
call npm install --save-dev @types/node

echo.
echo ================================
echo  Installation Complete!
echo ================================
echo.
echo Next steps:
echo 1. Setup Hadoop - follow HADOOP_QUICK_START.md
echo 2. Update .env with Hadoop config
echo 3. Run test: npx tsx scripts/test-hadoop-connection.ts
echo.
pause
