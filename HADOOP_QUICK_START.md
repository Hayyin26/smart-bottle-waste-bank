# 🚀 Hadoop Quick Start Guide

## Setup Cepat dalam 5 Langkah

### 1️⃣ Install Java
```cmd
# Download Java JDK 11 dari: https://adoptium.net/
# Install, lalu set environment:
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.x"
setx PATH "%PATH%;%JAVA_HOME%\bin"
```

Verify:
```cmd
java -version
```

### 2️⃣ Install Hadoop
```cmd
# 1. Download Hadoop 3.3.6: https://hadoop.apache.org/releases.html
# 2. Extract ke: C:\hadoop-3.3.6
# 3. Download winutils: https://github.com/cdarlint/winutils
# 4. Copy winutils.exe dan hadoop.dll ke: C:\hadoop-3.3.6\bin\
```

Set environment:
```cmd
setx HADOOP_HOME "C:\hadoop-3.3.6"
setx PATH "%PATH%;%HADOOP_HOME%\bin;%HADOOP_HOME%\sbin"
```

### 3️⃣ Konfigurasi Hadoop

Copy konfigurasi dari `HADOOP_SETUP_GUIDE.md` bagian #2.

File yang harus diedit:
- `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`
- `C:\hadoop-3.3.6\etc\hadoop\core-site.xml`
- `C:\hadoop-3.3.6\etc\hadoop\hdfs-site.xml`
- `C:\hadoop-3.3.6\etc\hadoop\mapred-site.xml`
- `C:\hadoop-3.3.6\etc\hadoop\yarn-site.xml`

### 4️⃣ Format & Start Hadoop

```cmd
# Format NameNode (HANYA SEKALI!)
hdfs namenode -format

# Start Hadoop (sebagai Administrator)
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

Verify:
```cmd
jps
```

Harus melihat:
- NameNode
- DataNode  
- ResourceManager
- NodeManager

Check Web UI:
- http://localhost:9870 (HDFS)
- http://localhost:8088 (YARN)

### 5️⃣ Install Dependencies & Test

```bash
# Install npm packages
npm install axios

# Test koneksi
npx tsx scripts/test-hadoop-connection.ts
```

---

## 🎯 Usage

### Test API dari Browser/Postman

**1. Check connection:**
```
GET http://localhost:3000/api/hadoop/sync
```

**2. Sync data ke Hadoop:**
```
POST http://localhost:3000/api/hadoop/sync
Content-Type: application/json

{
  "dataType": "transactions",
  "timeRange": "24h"
}
```

**3. List files:**
```
GET http://localhost:3000/api/hadoop/list?path=/iot-data
```

**4. Read file:**
```
GET http://localhost:3000/api/hadoop/read?path=/iot-data/transactions/transactions_2026-06-08.json
```

### Scheduled Sync (Backup Otomatis)

Run manual:
```bash
npx tsx scripts/scheduled-hadoop-sync.ts
```

Setup Windows Task Scheduler untuk run otomatis setiap hari:
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily pada waktu tertentu
4. Action: Start a program
   - Program: `node`
   - Arguments: `C:\Data Hayyin\Kuliah\Semester 6\PBL\smart\node_modules\tsx\dist\cli.mjs scripts/scheduled-hadoop-sync.ts`
   - Start in: `C:\Data Hayyin\Kuliah\Semester 6\PBL\smart`

---

## 🛠️ Troubleshooting

### ❌ "Connection refused"
```cmd
# Check if Hadoop running:
jps

# If not running, start:
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

### ❌ "NameNode in safe mode"
```cmd
hdfs dfsadmin -safemode leave
```

### ❌ "Permission denied"
```cmd
hdfs dfs -chmod -R 777 /
```

### ❌ Test script error
Check .env file memiliki:
```env
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

---

## 📊 Monitoring

### Check HDFS Status
```cmd
hdfs dfsadmin -report
```

### View Files
```cmd
hdfs dfs -ls /iot-data
hdfs dfs -ls /iot-data/transactions
```

### View File Content
```cmd
hdfs dfs -cat /iot-data/transactions/transactions_2026-06-08.json
```

### Check Logs
```
C:\hadoop-3.3.6\logs\
```

---

## 🔄 Daily Workflow

**Morning:**
```cmd
# Start Hadoop
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd

# Verify
jps
```

**During Work:**
```bash
# Develop normally
npm run dev

# Data akan auto-sync via API calls
```

**Evening:**
```bash
# Manual backup jika perlu
npx tsx scripts/scheduled-hadoop-sync.ts

# Stop Hadoop (optional)
cd C:\hadoop-3.3.6\sbin
stop-yarn.cmd
stop-dfs.cmd
```

---

## 📚 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/hadoop/sync` | Check Hadoop connection |
| POST | `/api/hadoop/sync` | Sync data Supabase → Hadoop |
| GET | `/api/hadoop/list?path=X` | List files di directory |
| GET | `/api/hadoop/read?path=X` | Read file content |

---

## ✅ Checklist Setup

- [ ] Java JDK 11 installed
- [ ] Hadoop 3.3.6 extracted
- [ ] winutils.exe & hadoop.dll in bin/
- [ ] Environment variables set
- [ ] Hadoop config files edited
- [ ] NameNode formatted
- [ ] Hadoop services running
- [ ] Web UI accessible (http://localhost:9870)
- [ ] npm packages installed
- [ ] .env configured
- [ ] Test script passed
- [ ] API endpoints working

---

## 🎉 You're Ready!

Hadoop sudah siap untuk menyimpan data IoT Anda!

Next: Integrate dengan dashboard untuk visualisasi data dari Hadoop.
