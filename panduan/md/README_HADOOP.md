# 🐘 Hadoop Integration untuk Proyek IoT

Integrasi lengkap Hadoop HDFS dengan Next.js untuk big data storage dan analytics.

## ⚡ Quick Start (5 Menit)

### 1. Install Hadoop
```cmd
# Lihat panduan lengkap di HADOOP_QUICK_START.md
```

### 2. Start Hadoop
```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

### 3. Test Koneksi
```bash
npx tsx scripts/test-hadoop-connection.ts
```

### 4. Start App
```bash
npm run dev
```

### 5. Test API
```bash
# Browser: http://localhost:3000/api/hadoop/sync
```

---

## 📚 Documentation

| File | Deskripsi |
|------|-----------|
| `HADOOP_QUICK_START.md` | Setup cepat 5 langkah |
| `HADOOP_SETUP_GUIDE.md` | Panduan setup detail |
| `HADOOP_INTEGRATION_SUMMARY.md` | Summary lengkap + API docs |

---

## 🎯 Fitur

✅ **Sync Data** - Backup otomatis dari Supabase ke Hadoop  
✅ **Read/Write** - Full HDFS file operations  
✅ **Scheduled Backup** - Script untuk backup terjadwal  
✅ **REST API** - API endpoints untuk semua operasi  
✅ **Type Safe** - Full TypeScript support  

---

## 🔌 API Endpoints

```typescript
// Check connection
GET /api/hadoop/sync

// Sync data
POST /api/hadoop/sync
Body: { "dataType": "transactions", "timeRange": "24h" }

// List files
GET /api/hadoop/list?path=/iot-data

// Read file
GET /api/hadoop/read?path=/iot-data/file.json
```

---

## 📁 File Structure

```
src/
├── lib/
│   ├── hadoop-config.ts       # Konfigurasi
│   └── hadoop-client.ts       # Client operations
└── app/api/hadoop/
    ├── sync/route.ts          # Sync endpoint
    ├── list/route.ts          # List endpoint
    └── read/route.ts          # Read endpoint

scripts/
├── test-hadoop-connection.ts  # Test script
└── scheduled-hadoop-sync.ts   # Backup script
```

---

## 🚀 Usage Examples

### Sync dari Code
```typescript
import { hadoopClient } from '@/lib/hadoop-client'

// Upload file
const data = JSON.stringify({ test: 'data' })
await hadoopClient.uploadFile('source', '/iot-data/test.json', data)

// Read file
const content = await hadoopClient.readFile('/iot-data/test.json')

// List directory
const files = await hadoopClient.listDirectory('/iot-data')
```

### Sync via API
```javascript
// React/Next.js component
const syncToHadoop = async () => {
  const response = await fetch('/api/hadoop/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataType: 'transactions',
      timeRange: '24h'
    })
  })
  const result = await response.json()
  console.log(result) // { success: true, recordCount: 150, ... }
}
```

### Scheduled Backup
```bash
# Manual run
npx tsx scripts/scheduled-hadoop-sync.ts

# Or setup Windows Task Scheduler (lihat docs)
```

---

## 🛠️ Hadoop Commands

```bash
# Start/Stop
start-dfs.cmd
stop-dfs.cmd

# HDFS Commands
hdfs dfs -ls /
hdfs dfs -cat /iot-data/test.json
hdfs dfs -mkdir /new-folder
hdfs dfs -rm /file.json

# Check status
hdfs dfsadmin -report
jps
```

---

## 🌐 Web UI

- **HDFS NameNode:** http://localhost:9870
- **YARN ResourceManager:** http://localhost:8088

---

## 📊 Data Flow

```
ESP32 Device
    ↓
Next.js API
    ↓
Supabase (Real-time)
    ↓
Hadoop HDFS (Backup/Analytics)
```

---

## 🔧 Environment Variables

```env
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

---

## 🎯 Use Cases

1. **Historical Data Storage** - Simpan data lama tanpa beban database
2. **Big Data Analytics** - Process dengan Spark/MapReduce
3. **Backup & Recovery** - Distributed backup system
4. **Compliance** - Long-term data retention

---

## ⚠️ Troubleshooting

**Connection refused:**
```cmd
# Check Hadoop running
jps

# Start if not running
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
```

**Safe mode:**
```cmd
hdfs dfsadmin -safemode leave
```

**Permission denied:**
```cmd
hdfs dfs -chmod -R 777 /
```

---

## 🎓 Learn More

- [Hadoop Docs](https://hadoop.apache.org/docs/stable/)
- [WebHDFS API](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html)
- [HDFS Architecture](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html)

---

## ✅ Checklist

- [x] Install dependencies (`npm install axios`)
- [ ] Install Hadoop
- [ ] Configure Hadoop
- [ ] Format NameNode
- [ ] Start Hadoop
- [ ] Run test script
- [ ] Test API endpoints
- [ ] Setup scheduled backup (optional)

---

## 🚀 Status

✅ **Code:** Ready  
⏳ **Hadoop:** Needs installation  
📝 **Docs:** Complete  

**Next:** Follow `HADOOP_QUICK_START.md` untuk mulai!

---

Made with ❤️ for PBL IoT Project
