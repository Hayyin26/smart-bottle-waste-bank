# 🌐 Panduan Akses Hadoop di Web

## 📋 Daftar Isi
1. [Start Hadoop Services](#1-start-hadoop-services)
2. [Akses Native Hadoop Web UI](#2-akses-native-hadoop-web-ui)
3. [Akses Melalui Next.js App](#3-akses-melalui-nextjs-app)
4. [Testing & Troubleshooting](#4-testing--troubleshooting)

---

## 1. Start Hadoop Services

### **Metode 1: Menggunakan Script (RECOMMENDED)**

Double-click file ini:
```
start-hadoop.cmd
```

Script akan otomatis:
1. ✅ Start HDFS (NameNode & DataNode)
2. ✅ Start YARN (ResourceManager & NodeManager)
3. ✅ Check services dengan `jps`
4. ✅ Buka browser ke http://localhost:9870

---

### **Metode 2: Manual Command**

Buka **Command Prompt** dan jalankan:

```cmd
cd C:\hadoop-3.3.6\sbin

REM Start HDFS
start-dfs.cmd

REM Tunggu 10 detik
timeout /t 10

REM Start YARN
start-yarn.cmd

REM Check services
jps
```

**Expected Output dari `jps`:**
```
12345 NameNode
67890 DataNode
11111 ResourceManager
22222 NodeManager
33333 Jps
```

✅ **Jika melihat 4 services di atas, Hadoop running!**

---

## 2. Akses Native Hadoop Web UI

Setelah Hadoop services running, buka browser dan akses:

### **🟢 HDFS NameNode UI**
```
http://localhost:9870
```

**Fitur:**
- 📊 Cluster overview (storage, nodes)
- 📁 Browse HDFS file system
- 📈 Metrics & statistics
- ⚙️ Configuration

**Screenshot Features:**
- **Utilities** → **Browse the file system** → Lihat semua file di HDFS
- **Datanodes** → Status semua DataNode
- **Startup Progress** → Status startup cluster

---

### **🟡 YARN ResourceManager UI**
```
http://localhost:8088
```

**Fitur:**
- 📊 Application status
- 💾 Cluster metrics
- 🔧 Node managers
- 📈 Resource usage

---

### **🔵 MapReduce JobHistory UI**
```
http://localhost:19888
```

**Fitur:**
- 📜 Job history
- 📊 Job statistics
- ⏱️ Execution time

---

## 3. Akses Melalui Next.js App

### **🚀 Start Next.js Development Server**

```bash
npm run dev
```

### **📊 Buka Hadoop Monitoring Page**

```
http://localhost:3000/hadoop
```

**Fitur Dashboard:**

#### 1️⃣ **Cluster Status Card**
- ✅ Online/Offline status
- 🔢 Hadoop version
- 🖥️ Host & port info
- 📊 Live nodes count

#### 2️⃣ **Storage Usage Card**
- 📈 Usage percentage bar
- 💾 Total storage
- 🟢 Free space
- 🔴 Used space

#### 3️⃣ **Web UI Access Card**
- 🔗 Quick link ke HDFS NameNode UI
- 🔗 Quick link ke YARN ResourceManager UI

#### 4️⃣ **HDFS File Browser**
- 📁 Browse directories
- 📄 View files
- 📊 File metadata (size, owner, modified date)
- 🔍 Navigate through folders

**Buttons:**
- **Refresh** → Reload status & files
- **Root** → Navigate to root directory (`/`)
- **IoT Data** → Navigate to IoT data directory (`/iot-data`)

---

## 4. Testing & Troubleshooting

### ✅ **Test 1: Check Services Running**

```cmd
jps
```

**Expected:**
- NameNode ✅
- DataNode ✅
- ResourceManager ✅
- NodeManager ✅

---

### ✅ **Test 2: Test HDFS Command**

```cmd
hdfs dfs -ls /
```

**Expected:**
```
Found X items
drwxr-xr-x   - hadoop supergroup          0 2026-06-09 10:00 /iot-data
...
```

---

### ✅ **Test 3: Upload Test File**

```cmd
echo Hello Hadoop > test.txt
hdfs dfs -put test.txt /test.txt
hdfs dfs -cat /test.txt
```

**Expected Output:**
```
Hello Hadoop
```

---

### ✅ **Test 4: Access Web UI**

Buka browser dan check:
- http://localhost:9870 → Harus tampil **Hadoop NameNode UI** ✅
- http://localhost:8088 → Harus tampil **YARN UI** ✅

---

### ❌ **Error: "Cannot connect to localhost:9870"**

**Penyebab:** Hadoop services belum running

**Solusi:**
```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

Tunggu 10-15 detik, lalu refresh browser.

---

### ❌ **Error: "NameNode is in safe mode"**

**Penyebab:** HDFS dalam safe mode (read-only)

**Solusi:**
```cmd
hdfs dfsadmin -safemode leave
```

---

### ❌ **Error: "Connection refused to NameNode"**

**Penyebab:** NameNode tidak running atau port salah

**Solusi 1:** Check NameNode running
```cmd
jps
```

**Solusi 2:** Check port di `core-site.xml`:
```xml
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://localhost:9000</value>
</property>
```

**Solusi 3:** Restart Hadoop:
```cmd
cd C:\hadoop-3.3.6\sbin
stop-all.cmd
start-all.cmd
```

---

### ❌ **Error: "Fetch failed" di Next.js Dashboard**

**Penyebab:** Hadoop tidak running atau environment variables salah

**Solusi 1:** Check Hadoop running
```cmd
jps
curl http://localhost:9870/jmx
```

**Solusi 2:** Check `.env` file:
```env
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

**Solusi 3:** Restart Next.js dev server
```bash
# Kill server (Ctrl+C)
npm run dev
```

---

## 5. Stop Hadoop Services

Ketika selesai, stop services dengan:

```cmd
cd C:\hadoop-3.3.6\sbin
stop-yarn.cmd
stop-dfs.cmd
```

Atau stop semua sekaligus:
```cmd
cd C:\hadoop-3.3.6\sbin
stop-all.cmd
```

---

## 6. Hadoop Commands Cheat Sheet

### **File Operations**
```bash
# List files
hdfs dfs -ls /

# Create directory
hdfs dfs -mkdir /iot-data

# Upload file
hdfs dfs -put localfile.txt /hdfs/path/

# Download file
hdfs dfs -get /hdfs/path/file.txt .

# View file content
hdfs dfs -cat /path/file.txt

# Delete file
hdfs dfs -rm /path/file.txt

# Delete directory
hdfs dfs -rm -r /path/directory
```

### **System Commands**
```bash
# Check cluster status
hdfs dfsadmin -report

# Check HDFS health
hdfs fsck /

# Leave safe mode
hdfs dfsadmin -safemode leave

# Check disk usage
hdfs dfs -du -h /
```

---

## 📊 Dashboard Screenshots

### Native Hadoop UI
![HDFS NameNode UI](http://localhost:9870)
- Left sidebar: Navigation menu
- Center: Cluster overview with storage info
- Top: Tabs (Overview, Datanodes, Utilities, etc.)

### Next.js Custom Dashboard
![Custom Dashboard](http://localhost:3000/hadoop)
- Top: Status cards (Cluster, Storage, Web UI links)
- Bottom: File browser with clickable directories

---

## 🎯 Use Cases

### 1. **Monitor Cluster Health**
- Open: http://localhost:9870
- Check: "Live Nodes" harus > 0
- Check: "Dead Nodes" harus = 0

### 2. **Browse IoT Data**
- Open: http://localhost:3000/hadoop
- Click: "IoT Data" button
- Navigate: Click folder names untuk browse

### 3. **Check Storage Usage**
- Open: http://localhost:3000/hadoop
- View: Storage Usage card (percentage bar)
- Monitor: Free space available

### 4. **Upload Data Programmatically**
- Use: Hadoop Client API di Next.js
- Endpoint: `/api/hadoop/sync`
- Function: `hadoopClient.uploadFile()`

---

## 📚 Resources

- **Official Hadoop Docs:** https://hadoop.apache.org/docs/stable/
- **WebHDFS API:** https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html
- **HDFS Commands:** https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/FileSystemShell.html

---

## 🔗 Quick Links

| Service | URL | Purpose |
|---------|-----|---------|
| HDFS NameNode | http://localhost:9870 | File system UI |
| YARN ResourceManager | http://localhost:8088 | Job management |
| MapReduce JobHistory | http://localhost:19888 | Job history |
| Next.js Dashboard | http://localhost:3000/hadoop | Custom monitoring |
| Next.js API | http://localhost:3000/api/hadoop/status | Status API |

---

**Status:** Ready to use  
**Last Updated:** June 9, 2026  
**Version:** 1.0
