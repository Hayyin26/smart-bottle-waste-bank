@echo off
REM ============================================
REM Upload Sample Data ke Hadoop HDFS
REM ============================================

echo ============================================
echo Upload Data ke Hadoop HDFS
echo ============================================
echo.

REM 1. Check if Hadoop is running
echo [1/5] Checking Hadoop status...
hadoop version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Hadoop not found! Please start Hadoop first.
    echo Run: start-hadoop.cmd
    pause
    exit /b 1
)
echo [OK] Hadoop is available
echo.

REM 2. Create directory structure in HDFS
echo [2/5] Creating directory structure...
hadoop fs -mkdir -p /user/admin/transactions 2>nul
hadoop fs -mkdir -p /user/admin/bottles 2>nul
hadoop fs -mkdir -p /user/admin/users 2>nul
hadoop fs -mkdir -p /user/admin/devices 2>nul
echo [OK] Directories created
echo.

REM 3. Create sample data file
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
) > %TEMP%\sample_transactions.csv

(
echo user_id,full_name,total_points,created_at
echo user001,Ahmad Subagyo,45,2026-05-01
echo user002,Budi Santoso,30,2026-05-02
echo user003,Citra Dewi,20,2026-05-03
) > %TEMP%\sample_users.csv

(
echo device_id,ip_address,last_seen,status
echo ESP32-BOTOL-01,192.168.1.14,2026-06-09 12:00:00,online
) > %TEMP%\sample_devices.csv

echo [OK] Sample data created
echo.

REM 4. Upload files to HDFS
echo [4/5] Uploading files to HDFS...
hadoop fs -put -f %TEMP%\sample_transactions.csv /user/admin/transactions/
hadoop fs -put -f %TEMP%\sample_users.csv /user/admin/users/
hadoop fs -put -f %TEMP%\sample_devices.csv /user/admin/devices/
echo [OK] Files uploaded
echo.

REM 5. Verify upload
echo [5/5] Verifying uploaded files...
echo.
echo === Files in HDFS ===
hadoop fs -ls -R /user/admin/
echo.
echo === File Preview (transactions) ===
hadoop fs -cat /user/admin/transactions/sample_transactions.csv | more
echo.

REM Cleanup temp files
del %TEMP%\sample_transactions.csv 2>nul
del %TEMP%\sample_users.csv 2>nul
del %TEMP%\sample_devices.csv 2>nul

echo ============================================
echo DONE! Data uploaded successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Open http://localhost:9870 to view files
echo 2. Navigate to: Utilities ^> Browse the file system
echo 3. Go to: /user/admin/transactions
echo.
echo Or refresh your web dashboard at http://localhost:3000/hadoop
echo.
pause
