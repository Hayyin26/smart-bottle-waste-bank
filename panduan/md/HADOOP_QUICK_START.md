# ⚡ Hadoop Quick Start - Tampilkan di Web

## 🎯 3 Langkah Cepat

### **1. Start Hadoop Services**

Double-click file:
```
start-hadoop.cmd
```

✅ Browser akan otomatis buka ke: http://localhost:9870

---

### **2. Akses Native Hadoop UI**

Buka browser:
- **HDFS:** http://localhost:9870
- **YARN:** http://localhost:8088

---

### **3. Akses Custom Dashboard (Next.js)**

```bash
# Start Next.js dev server
npm run dev
```

Buka browser:
```
http://localhost:3000/hadoop
```

---

## 🖼️ Preview

### **Native Hadoop UI** (http://localhost:9870)
![image](https://user-images.githubusercontent.com/placeholder/hadoop-ui.png)

**Fitur:**
- 📊 Cluster overview
- 📁 Browse file system (klik: Utilities → Browse)
- 📈 Storage metrics
- 🖥️ DataNodes status

### **Custom Dashboard** (http://localhost:3000/hadoop)
![image](https://user-images.githubusercontent.com/placeholder/custom-dashboard.png)

**Fitur:**
- ✅ Cluster status (online/offline)
- 💾 Storage usage (progress bar)
- 📁 File browser dengan navigasi
- 🔗 Quick links ke native UI
- 🔄 Refresh button

---

## 🧪 Testing

### **Check Services Running:**
```cmd
jps
```

**Expected:**
```
12345 NameNode     ✅
67890 DataNode     ✅
11111 ResourceManager ✅
22222 NodeManager  ✅
```

### **Test HDFS Command:**
```cmd
hdfs dfs -ls /
```

### **Test Web UI:**
- ✅ http://localhost:9870 → Harus tampil Hadoop UI
- ✅ http://localhost:3000/hadoop → Harus tampil Custom Dashboard

---

## ❌ Troubleshooting

### **Error: Cannot connect to localhost:9870**

**Solusi:** Start Hadoop services
```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

---

### **Error: Services tidak muncul di `jps`**

**Solusi:** Check `hadoop-env.cmd` sudah di-fix
```cmd
hadoop version
```

Harus muncul:
```
Hadoop 3.3.6
```

Kalau error, jalankan:
```powershell
cd "C:\Data Hayyin\Kuliah\Semester 6\PBL\smart"
.\fix-hadoop-env-v2.ps1
```

---

### **Error: Dashboard fetch failed**

**Solusi 1:** Check `.env` file
```env
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

**Solusi 2:** Restart Next.js dev server
```bash
# Kill (Ctrl+C)
npm run dev
```

---

## 📋 Checklist

- [ ] Hadoop version berjalan: `hadoop version` ✅
- [ ] Services running: `jps` menampilkan 4 services ✅
- [ ] Native UI accessible: http://localhost:9870 ✅
- [ ] YARN UI accessible: http://localhost:8088 ✅
- [ ] `.env` file configured ✅
- [ ] Next.js running: `npm run dev` ✅
- [ ] Custom dashboard accessible: http://localhost:3000/hadoop ✅

---

## 🎉 Success!

Jika semua checklist ✅, Anda sudah berhasil menampilkan Hadoop di web!

**URLs:**
- Native HDFS UI: http://localhost:9870
- Native YARN UI: http://localhost:8088
- Custom Dashboard: http://localhost:3000/hadoop

---

**Last Updated:** June 9, 2026
