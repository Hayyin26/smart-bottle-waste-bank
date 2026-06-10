@echo off
REM ============================================
REM Upload Sample Data to Hadoop Docker
REM ============================================

echo ============================================
echo Upload Sample Data to Hadoop HDFS (Docker)
echo ============================================
echo.

REM Check if container is running
docker ps | findstr hadoop-namenode >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Hadoop containers not running!
    echo.
    echo Please start Hadoop first:
    echo .\hadoop-docker-start.cmd
    echo.
    pause
    exit /b 1
)

echo [1/5] Hadoop containers are running... OK
echo.

REM Create directory structure in HDFS
echo [2/5] Creating directory structure in HDFS...
docker exec hadoop-namenode hdfs dfs -mkdir -p /user/admin/transactions
docker exec hadoop-namenode hdfs dfs -mkdir -p /user/admin/bottles
docker exec hadoop-namenode hdfs dfs -mkdir -p /user/admin/users
docker exec hadoop-namenode hdfs dfs -mkdir -p /user/admin/devices
echo Done!
echo.

REM Create sample data directory
if not exist "hadoop-data" mkdir hadoop-data

REM Create sample transaction data
echo [3/5] Creating sample transaction data...
(
echo transaction_id,user_id,device_id,bottle_size,points_earned,created_at
echo 1,user001,ESP32-BOTOL-01,KECIL,5,2026-06-01 10:00:00
echo 2,user001,ESP32-BOTOL-01,SEDANG,10,2026-06-01 10:05:00
echo 3,user002,ESP32-BOTOL-01,BESAR,15,2026-06-01 10:10:00
echo 4,user002,ESP32-BOTOL-01,KECIL,5,2026-06-01 10:15:00
echo 5,user003,ESP32-BOTOL-01,SEDANG,10,2026-06-01 10:20:00
echo 6,user001,ESP32-BOTOL-01,BESAR,15,2026-06-01 10:25:00
echo 7,user003,ESP32-BOTOL-01,KECIL,5,2026-06-01 10:30:00
echo 8,user002,ESP32-BOTOL-01,SEDANG,10,2026-06-01 10:35:00
echo 9,user001,ESP32-BOTOL-01,BESAR,15,2026-06-01 10:40:00
echo 10,user003,ESP32-BOTOL-01,KECIL,5,2026-06-01 10:45:00
) > hadoop-data\transactions.csv

(
echo user_id,full_name,total_points,created_at
echo user001,Ahmad Subagyo,45,2026-05-01
echo user002,Budi Santoso,30,2026-05-02
echo user003,Citra Dewi,20,2026-05-03
) > hadoop-data\users.csv

(
echo device_id,ip_address,last_seen,status
echo ESP32-BOTOL-01,192.168.1.14,2026-06-09 12:00:00,online
) > hadoop-data\devices.csv

echo Done!
echo.

REM Copy files to container
echo [4/5] Uploading files to HDFS...
docker cp hadoop-data\transactions.csv hadoop-namenode:/tmp/
docker cp hadoop-data\users.csv hadoop-namenode:/tmp/
docker cp hadoop-data\devices.csv hadoop-namenode:/tmp/

REM Move to HDFS
docker exec hadoop-namenode hdfs dfs -put -f /tmp/transactions.csv /user/admin/transactions/
docker exec hadoop-namenode hdfs dfs -put -f /tmp/users.csv /user/admin/users/
docker exec hadoop-namenode hdfs dfs -put -f /tmp/devices.csv /user/admin/devices/

REM Cleanup temp files in container
docker exec hadoop-namenode rm /tmp/transactions.csv /tmp/users.csv /tmp/devices.csv

echo Done!
echo.

REM Verify upload
echo [5/5] Verifying upload...
echo.
echo === Files in HDFS ===
docker exec hadoop-namenode hdfs dfs -ls -R /user/admin/
echo.
echo === Transaction Data Preview ===
docker exec hadoop-namenode hdfs dfs -cat /user/admin/transactions/transactions.csv | more
echo.

echo ============================================
echo Data Upload Complete!
echo ============================================
echo.
echo Next steps:
echo 1. View HDFS: http://localhost:9870
echo    - Navigate to: Utilities ^> Browse the file system
echo    - Go to: /user/admin/transactions
echo.
echo 2. View web dashboard: http://localhost:3000/hadoop
echo    - Start web app: npm run dev
echo    - Navigate to Hadoop menu
echo.
pause
