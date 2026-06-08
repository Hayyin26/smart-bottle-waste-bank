# 🐘 Hadoop Integration - Summary Lengkap

## 📦 Yang Sudah Dibuat

### 1. Configuration Files
- ✅ `src/lib/hadoop-config.ts` - Konfigurasi koneksi Hadoop
- ✅ `src/lib/hadoop-client.ts` - Client untuk operasi HDFS

### 2. API Routes
- ✅ `src/app/api/hadoop/sync/route.ts` - Sync data Supabase → Hadoop
- ✅ `src/app/api/hadoop/list/route.ts` - List files di HDFS
- ✅ `src/app/api/hadoop/read/route.ts` - Read file dari HDFS

### 3. Scripts
- ✅ `scripts/test-hadoop-connection.ts` - Test koneksi & create directories
- ✅ `scripts/scheduled-hadoop-sync.ts` - Backup otomatis ke Hadoop
- ✅ `install-hadoop-deps.bat` - Install npm dependencies

### 4. Documentation
- ✅ `HADOOP_SETUP_GUIDE.md` - Panduan setup detail
- ✅ `HADOOP_QUICK_START.md` - Quick start 5 langkah
- ✅ `HADOOP_INTEGRATION_SUMMARY.md` - Summary lengkap (file ini)

### 5. Environment Config
- ✅ `.env` - Updated dengan Hadoop config

---

## 🚀 Cara Mulai

### Step 1: Install Hadoop
Ikuti panduan di `HADOOP_QUICK_START.md` atau `HADOOP_SETUP_GUIDE.md`

**Singkatnya:**
1. Install Java JDK 11
2. Download & extract Hadoop 3.3.6
3. Download winutils untuk Windows
4. Edit config files
5. Format NameNode
6. Start Hadoop

### Step 2: Install Dependencies
```bash
# Opsi 1: Manual
npm install axios

# Opsi 2: Pakai script
install-hadoop-deps.bat
```

### Step 3: Test Koneksi
```bash
npx tsx scripts/test-hadoop-connection.ts
```

### Step 4: Start Next.js
```bash
npm run dev
```

### Step 5: Test API
```bash
# Check connection
curl http://localhost:3000/api/hadoop/sync

# Sync data
curl -X POST http://localhost:3000/api/hadoop/sync \
  -H "Content-Type: application/json" \
  -d "{\"dataType\":\"transactions\",\"timeRange\":\"24h\"}"
```

---

## 📁 HDFS Directory Structure

Setelah setup, struktur directory di Hadoop:

```
/
├── iot-data/
│   ├── transactions/
│   │   └── transactions_2026-06-08T10-30-00-000Z.json
│   ├── devices/
│   │   └── devices_2026-06-08T10-30-00-000Z.json
│   ├── sessions/
│   │   └── iot_sessions_2026-06-08T10-30-00-000Z.json
│   ├── daily/
│   ├── monthly/
│   └── backup/
└── test-iot-data/
    └── test-xxxxx.json
```

---

## 🔌 API Usage Examples

### 1. Check Hadoop Connection
```javascript
// GET /api/hadoop/sync
fetch('http://localhost:3000/api/hadoop/sync')
  .then(res => res.json())
  .then(data => console.log(data))

// Response:
{
  "success": true,
  "message": "Hadoop connection OK",
  "filesInRoot": 2,
  "files": [...]
}
```

### 2. Sync Transactions Data
```javascript
// POST /api/hadoop/sync
fetch('http://localhost:3000/api/hadoop/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dataType: 'transactions',
    timeRange: '24h'
  })
})
.then(res => res.json())
.then(data => console.log(data))

// Response:
{
  "success": true,
  "message": "Successfully synced 150 transactions records to Hadoop",
  "hdfsPath": "/iot-data/transactions/transactions_2026-06-08T10-30-00-000Z.json",
  "recordCount": 150,
  "syncTime": "2026-06-08T10:30:00.000Z"
}
```

### 3. List Files in Directory
```javascript
// GET /api/hadoop/list?path=/iot-data/transactions
fetch('http://localhost:3000/api/hadoop/list?path=/iot-data/transactions')
  .then(res => res.json())
  .then(data => console.log(data))

// Response:
{
  "success": true,
  "path": "/iot-data/transactions",
  "fileCount": 5,
  "files": [
    {
      "name": "transactions_2026-06-08T10-30-00-000Z.json",
      "type": "FILE",
      "size": 45632,
      "sizeMB": "0.04",
      "modified": "2026-06-08T10:30:00.000Z",
      "owner": "hadoop",
      "replication": 1
    }
  ]
}
```

### 4. Read File Content
```javascript
// GET /api/hadoop/read?path=/iot-data/transactions/file.json
fetch('http://localhost:3000/api/hadoop/read?path=/iot-data/transactions/transactions_2026-06-08.json')
  .then(res => res.json())
  .then(data => console.log(data))

// Response:
{
  "success": true,
  "path": "/iot-data/transactions/transactions_2026-06-08.json",
  "content": {
    "metadata": { ... },
    "data": [ ... ]
  }
}
```

---

## 🤖 Automated Backup

### Manual Run
```bash
npx tsx scripts/scheduled-hadoop-sync.ts
```

### Setup Windows Task Scheduler

1. **Open Task Scheduler**
   - Win + R → `taskschd.msc`

2. **Create Basic Task**
   - Name: `Hadoop IoT Backup`
   - Description: `Daily backup of IoT data to Hadoop`

3. **Trigger**
   - Daily
   - Start: 23:00 (11 PM)
   - Recur every: 1 days

4. **Action**
   - Action: Start a program
   - Program/script: `C:\Program Files\nodejs\node.exe`
   - Add arguments:
     ```
     C:\Data Hayyin\Kuliah\Semester 6\PBL\smart\node_modules\tsx\dist\cli.mjs scripts/scheduled-hadoop-sync.ts
     ```
   - Start in:
     ```
     C:\Data Hayyin\Kuliah\Semester 6\PBL\smart
     ```

5. **Finish**
   - Check: "Open the Properties dialog"
   - Set: "Run whether user is logged on or not"
   - Check: "Run with highest privileges"

---

## 🔍 Data Types yang Bisa Di-Sync

| Data Type | Supabase Table | HDFS Path | Time Range |
|-----------|---------------|-----------|------------|
| transactions | `transactions` | `/iot-data/transactions/` | 1h, 24h, 7d, 30d, all |
| devices | `devices` | `/iot-data/devices/` | all |
| iot_sessions | `iot_sessions` | `/iot-data/sessions/` | 1h, 24h, 7d, 30d, all |

---

## 📊 Data Format di Hadoop

Setiap file JSON di Hadoop memiliki struktur:

```json
{
  "metadata": {
    "syncTime": "2026-06-08T10:30:00.000Z",
    "dataType": "transactions",
    "timeRange": "24h",
    "recordCount": 150,
    "startDate": "2026-06-07T10:30:00.000Z",
    "endDate": "2026-06-08T10:30:00.000Z"
  },
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "device_id": "ESP32-001",
      "bottle_type": "large",
      "points": 50,
      "created_at": "2026-06-08T09:15:00.000Z"
    }
    // ... more records
  ]
}
```

---

## 🛠️ Hadoop Client Methods

```typescript
import { hadoopClient } from '@/lib/hadoop-client'

// Upload file
await hadoopClient.uploadFile('source', '/hdfs/path/file.json', jsonData)

// Read file
const content = await hadoopClient.readFile('/hdfs/path/file.json')

// List directory
const files = await hadoopClient.listDirectory('/iot-data')

// Delete file
await hadoopClient.deleteFile('/hdfs/path/file.json', false)

// Delete directory (recursive)
await hadoopClient.deleteFile('/hdfs/path/dir', true)

// Create directory
await hadoopClient.createDirectory('/new/directory')

// Check if exists
const exists = await hadoopClient.exists('/hdfs/path')

// Get file status
const status = await hadoopClient.getFileStatus('/hdfs/path/file.json')
```

---

## 🌐 Hadoop Web UI

### NameNode UI (HDFS)
- URL: http://localhost:9870
- Browse files: Utilities → Browse the file system
- View logs: Logs
- Cluster info: Overview

### YARN ResourceManager UI
- URL: http://localhost:8088
- View jobs & applications
- Monitor cluster resources

---

## 📈 Use Cases

### 1. Historical Data Analysis
```bash
# Export semua transactions ke Hadoop
curl -X POST http://localhost:3000/api/hadoop/sync \
  -d '{"dataType":"transactions","timeRange":"all"}'

# Analyze dengan Hadoop MapReduce atau Spark
```

### 2. Data Backup & Disaster Recovery
```bash
# Backup harian otomatis via Task Scheduler
# Data aman di distributed file system
```

### 3. Big Data Processing
```bash
# Process large datasets dengan Hadoop ecosystem
# Spark, Hive, Pig, dll
```

### 4. Long-term Storage
```bash
# Simpan historical data tanpa beban database
# Supabase tetap cepat untuk real-time operations
```

---

## 🔐 Security Considerations

### Current Setup (Development)
- ✅ Simple authentication (user.name parameter)
- ⚠️ No encryption
- ⚠️ No Kerberos

### Production Recommendations
1. Enable Kerberos authentication
2. Use HTTPS for WebHDFS
3. Configure firewall rules
4. Set proper file permissions
5. Enable audit logging

---

## 🧪 Testing Checklist

- [ ] Hadoop services running (`jps`)
- [ ] Web UI accessible (http://localhost:9870)
- [ ] Test script passed
- [ ] API GET /api/hadoop/sync returns success
- [ ] API POST /api/hadoop/sync creates file
- [ ] File visible in Web UI
- [ ] File readable via API
- [ ] Scheduled sync script works
- [ ] Windows Task Scheduler configured (optional)

---

## 📚 References

- [Hadoop Documentation](https://hadoop.apache.org/docs/stable/)
- [WebHDFS REST API](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html)
- [HDFS Commands](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/FileSystemShell.html)

---

## 🎯 Next Steps

1. **Sekarang:** Setup Hadoop → Test koneksi
2. **Besok:** Implement scheduled backup
3. **Minggu depan:** Dashboard untuk view Hadoop data
4. **Future:** Spark integration untuk advanced analytics

---

## ❓ FAQ

**Q: Apakah harus install Hadoop di production?**
A: Tidak wajib. Untuk production, bisa pakai:
- AWS EMR (Elastic MapReduce)
- Google Cloud Dataproc
- Azure HDInsight
- Cloudera/Hortonworks

**Q: Berapa storage yang dibutuhkan?**
A: Tergantung data volume. Estimasi:
- 1000 transactions/day × 1KB = 1MB/day = 365MB/year
- Dengan replication factor 1 (single node)

**Q: Apakah bisa sync real-time?**
A: Bisa dengan webhook atau event-driven architecture, tapi Hadoop lebih cocok untuk batch processing.

**Q: Bagaimana kalau Hadoop down?**
A: Data tetap aman di Supabase. Hadoop hanya untuk backup/analytics.

---

## ✅ Summary

Sekarang Anda punya:
- ✅ Full Hadoop integration dengan Next.js
- ✅ API endpoints untuk CRUD operations
- ✅ Automated backup scripts
- ✅ Comprehensive documentation
- ✅ Testing scripts
- ✅ Production-ready code structure

**Selamat! Proyek IoT Anda sekarang punya Big Data storage! 🎉**
