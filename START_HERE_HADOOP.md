# 🎯 START HERE - Hadoop Integration

> **Panduan paling simpel untuk mulai menggunakan Hadoop dengan proyek IoT Anda**

---

## ⚡ TL;DR (Too Long; Didn't Read)

```bash
# 1. Install Java JDK 11
# 2. Install Hadoop 3.3.6
# 3. Configure Hadoop
# 4. Format NameNode
# 5. Start Hadoop
# 6. Test connection
npx tsx scripts/test-hadoop-connection.ts
```

**Time:** ~50 menit  
**Difficulty:** Medium  
**Result:** Big data storage untuk IoT project ✅

---

## 🗺️ Peta Dokumentasi

Bingung mau baca yang mana? Ini panduannya:

### Baru Pertama Kali?
👉 **Baca:** [README_HADOOP.md](README_HADOOP.md) (5 menit)  
Pengenalan singkat apa itu Hadoop dan kenapa perlu.

### Mau Setup Cepat?
👉 **Ikuti:** [HADOOP_QUICK_START.md](HADOOP_QUICK_START.md) (30 menit)  
Setup Hadoop dalam 5 langkah sederhana.

### Butuh Detail Lengkap?
👉 **Pakai:** [HADOOP_CHECKLIST.md](HADOOP_CHECKLIST.md) (50 menit)  
Checklist lengkap step-by-step, tidak ada yang terlewat.

### Sudah Running, Mau Pakai API?
👉 **Lihat:** [HADOOP_INTEGRATION_SUMMARY.md](HADOOP_INTEGRATION_SUMMARY.md)  
Dokumentasi API lengkap dengan contoh.

### Penasaran Arsitekturnya?
👉 **Baca:** [HADOOP_ARCHITECTURE.md](HADOOP_ARCHITECTURE.md)  
Diagram dan penjelasan sistem architecture.

### Lupa File Apa Saja?
👉 **Cek:** [HADOOP_INDEX.md](HADOOP_INDEX.md)  
Master index dari semua dokumentasi.

---

## 🎬 Quick Start (5 Langkah)

### 1️⃣ Install Java (10 menit)
Download dari: https://adoptium.net/

```cmd
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.x"
java -version
```

### 2️⃣ Install Hadoop (15 menit)
Download dari: https://hadoop.apache.org/releases.html  
Extract ke: `C:\hadoop-3.3.6`  
Download winutils: https://github.com/cdarlint/winutils

```cmd
setx HADOOP_HOME "C:\hadoop-3.3.6"
```

### 3️⃣ Configure (15 menit)
Edit 5 files di `C:\hadoop-3.3.6\etc\hadoop\`:
- `hadoop-env.cmd`
- `core-site.xml`
- `hdfs-site.xml`
- `mapred-site.xml`
- `yarn-site.xml`

*Detail: Lihat [HADOOP_QUICK_START.md](HADOOP_QUICK_START.md)*

### 4️⃣ Format & Start (5 menit)
```cmd
hdfs namenode -format
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

### 5️⃣ Test (5 menit)
```bash
npx tsx scripts/test-hadoop-connection.ts
```

Buka: http://localhost:9870

---

## 📦 Apa yang Sudah Dibuat?

### ✅ Documentation (7 files)
- Setup guides (quick & detailed)
- API documentation
- Architecture diagrams
- Troubleshooting guides
- Checklists

### ✅ Source Code (6 files)
- Hadoop client library
- API endpoints (sync, list, read)
- Type-safe TypeScript

### ✅ Scripts (3 files)
- Test connection
- Automated backup
- Health check

### ✅ Utilities (2 files)
- Install dependencies
- Quick commands

**Total:** 18 files, ~70KB documentation, ~1000 lines code

---

## 🚀 Usage Cepat

### Start Hadoop
```cmd
hadoop-commands.bat start
```

### Test Connection
```bash
npx tsx scripts/test-hadoop-connection.ts
```

### Sync Data ke Hadoop
```bash
curl -X POST http://localhost:3000/api/hadoop/sync \
  -H "Content-Type: application/json" \
  -d '{"dataType":"transactions","timeRange":"24h"}'
```

### Check Status
```bash
npx tsx scripts/hadoop-status.ts
```

### Stop Hadoop
```cmd
hadoop-commands.bat stop
```

---

## 🎯 Kenapa Perlu Hadoop?

### Masalah Sekarang
- Supabase mahal untuk data besar
- Historical data membebani database
- Analytics lambat di PostgreSQL

### Solusi dengan Hadoop
- ✅ Storage murah untuk historical data
- ✅ Scalable untuk terabytes data
- ✅ Fast parallel processing
- ✅ Fault-tolerant dengan replication

### Strategy
```
Recent data (30 days)      →  Supabase  (Fast, Expensive)
Historical data (30+ days) →  Hadoop    (Slow, Cheap)
```

---

## 🏗️ Architecture

```
ESP32 IoT Device
    ↓
Next.js API
    ↓
    ├──→ Supabase (Real-time)
    └──→ Hadoop (Big Data)
```

**Best of both worlds!**

---

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hadoop/sync` | GET | Check connection |
| `/api/hadoop/sync` | POST | Sync data |
| `/api/hadoop/list` | GET | List files |
| `/api/hadoop/read` | GET | Read file |

*Full API docs: [HADOOP_INTEGRATION_SUMMARY.md](HADOOP_INTEGRATION_SUMMARY.md)*

---

## 🛠️ Troubleshooting

### ❌ Hadoop tidak start
```cmd
# Check Java
java -version

# Check HADOOP_HOME
echo %HADOOP_HOME%

# Run as Administrator
```

### ❌ Connection refused
```cmd
# Check Hadoop running
jps

# Restart Hadoop
hadoop-commands.bat start
```

### ❌ Safe mode
```cmd
hdfs dfsadmin -safemode leave
```

*More: [HADOOP_SETUP_GUIDE.md](HADOOP_SETUP_GUIDE.md) → Troubleshooting*

---

## 📚 Learning Path

### Hari 1 (1 jam)
- [ ] Baca START_HERE_HADOOP.md (ini!)
- [ ] Baca README_HADOOP.md
- [ ] Install Hadoop (HADOOP_QUICK_START.md)
- [ ] Test connection

### Hari 2 (30 menit)
- [ ] Test semua API endpoints
- [ ] Sync sample data
- [ ] Explore Web UI

### Hari 3 (30 menit)
- [ ] Setup automated backup
- [ ] Read HADOOP_ARCHITECTURE.md
- [ ] Plan production deployment

---

## ✅ Success Checklist

- [ ] Java installed (`java -version`)
- [ ] Hadoop installed (`hdfs version`)
- [ ] Config files edited
- [ ] NameNode formatted
- [ ] Hadoop services running (`jps`)
- [ ] Web UI accessible (http://localhost:9870)
- [ ] Test script passed ✅
- [ ] API endpoints working ✅
- [ ] First data synced ✅

---

## 🎁 Bonus: Quick Commands

```bash
# Start/Stop
hadoop-commands.bat start
hadoop-commands.bat stop

# Test & Status
hadoop-commands.bat test
hadoop-commands.bat status

# Backup
hadoop-commands.bat backup

# Open UI
hadoop-commands.bat ui

# HDFS Commands
hdfs dfs -ls /
hdfs dfs -cat /file.json
hdfs dfs -mkdir /dir
```

---

## 💡 Tips

### ✅ DO
- Run as Administrator
- Check status sebelum operasi
- Monitor disk space
- Backup important data

### ❌ DON'T
- Format NameNode multiple times
- Ignore error logs
- Use spaces in paths
- Delete without backup

---

## 🎯 Next Steps

### Immediate
1. Install Hadoop (follow HADOOP_QUICK_START.md)
2. Run test script
3. Test API endpoints

### This Week
1. Setup automated backup
2. Sync production data
3. Monitor performance

### This Month
1. Implement analytics
2. Create dashboard
3. Plan scaling strategy

---

## 📞 Need Help?

### Documentation
- Quick: [HADOOP_QUICK_START.md](HADOOP_QUICK_START.md)
- Detail: [HADOOP_SETUP_GUIDE.md](HADOOP_SETUP_GUIDE.md)
- API: [HADOOP_INTEGRATION_SUMMARY.md](HADOOP_INTEGRATION_SUMMARY.md)

### Tools
- Web UI: http://localhost:9870
- Status: `npx tsx scripts/hadoop-status.ts`
- Logs: `C:\hadoop-3.3.6\logs\`

---

## 📝 Summary

**What you get:**
- 🐘 Hadoop integration code
- 📚 70KB+ documentation
- 🔧 Testing & automation scripts
- 🎯 Production-ready architecture

**What you need:**
- ⏰ 50 minutes for setup
- ☕ Coffee
- 💪 Patience

**Result:**
- ✅ Big data storage
- ✅ Cost-effective solution
- ✅ Scalable architecture
- ✅ Production ready

---

## 🎉 Let's Start!

```bash
# Step 1: Read quick start
start HADOOP_QUICK_START.md

# Step 2: Install Hadoop
# (Follow the guide)

# Step 3: Test
npx tsx scripts/test-hadoop-connection.ts

# Step 4: Enjoy! 🎊
```

---

## 🗂️ All Documentation Files

1. **START_HERE_HADOOP.md** ← You are here
2. [README_HADOOP.md](README_HADOOP.md) - Overview
3. [HADOOP_QUICK_START.md](HADOOP_QUICK_START.md) - Fast setup
4. [HADOOP_SETUP_GUIDE.md](HADOOP_SETUP_GUIDE.md) - Detailed guide
5. [HADOOP_CHECKLIST.md](HADOOP_CHECKLIST.md) - Complete checklist
6. [HADOOP_ARCHITECTURE.md](HADOOP_ARCHITECTURE.md) - Architecture
7. [HADOOP_INTEGRATION_SUMMARY.md](HADOOP_INTEGRATION_SUMMARY.md) - API docs
8. [HADOOP_INDEX.md](HADOOP_INDEX.md) - Master index
9. [HADOOP_COMPLETE_SUMMARY.md](HADOOP_COMPLETE_SUMMARY.md) - Complete summary

---

**👉 Next:** Open [HADOOP_QUICK_START.md](HADOOP_QUICK_START.md) and follow the steps!

---

Made with ❤️ for PBL IoT Smart Bottle Project  
Date: June 8, 2026

**Good luck! 🚀**
