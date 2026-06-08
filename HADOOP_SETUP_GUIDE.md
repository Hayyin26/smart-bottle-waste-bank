# 🐘 Panduan Lengkap Setup Hadoop untuk Proyek IoT

## 📋 Daftar Isi
1. [Instalasi Hadoop di Windows](#1-instalasi-hadoop-di-windows)
2. [Konfigurasi Hadoop](#2-konfigurasi-hadoop)
3. [Integrasi dengan Next.js](#3-integrasi-dengan-nextjs)
4. [Testing & Troubleshooting](#4-testing--troubleshooting)

---

## 1. Instalasi Hadoop di Windows

### Prasyarat
- Java JDK 8 atau 11 (WAJIB)
- Windows 10/11
- Minimal 8GB RAM
- 20GB disk space

### Step 1: Install Java JDK

1. **Download Java JDK 11** dari [Oracle](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) atau [Adoptium](https://adoptium.net/)

2. **Install Java** dan set environment variables:
   ```cmd
   setx JAVA_HOME "C:\Program Files\Java\jdk-11.0.x"
   setx PATH "%PATH%;%JAVA_HOME%\bin"
   ```

3. **Verifikasi instalasi:**
   ```cmd
   java -version
   ```

### Step 2: Download Hadoop

1. **Download Hadoop 3.3.6** dari [Apache Hadoop](https://hadoop.apache.org/releases.html)
   - Pilih: `hadoop-3.3.6.tar.gz`

2. **Extract ke lokasi tanpa spasi:**
   ```
   C:\hadoop-3.3.6
   ```

### Step 3: Download Hadoop Native Libraries untuk Windows

Hadoop butuh file native Windows:

1. **Download winutils & hadoop.dll** dari [GitHub](https://github.com/cdarlint/winutils)
   - Pilih versi yang sesuai (misal: `hadoop-3.3.6`)
   - Download: `winutils.exe`, `hadoop.dll`

2. **Copy file ke:**
   ```
   C:\hadoop-3.3.6\bin\
   ```

### Step 4: Set Environment Variables

Buka **Command Prompt sebagai Administrator** dan jalankan:

```cmd
setx HADOOP_HOME "C:\hadoop-3.3.6"
setx PATH "%PATH%;%HADOOP_HOME%\bin;%HADOOP_HOME%\sbin"
setx HADOOP_CONF_DIR "%HADOOP_HOME%\etc\hadoop"
```

**Restart Command Prompt** setelah setting environment variables.

---

## 2. Konfigurasi Hadoop

### File 1: `hadoop-env.cmd`

Edit file: `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`

Tambahkan atau edit:
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
set HADOOP_HOME=C:\hadoop-3.3.6
set HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop
set HADOOP_LOG_DIR=%HADOOP_HOME%\logs
```

### File 2: `core-site.xml`

Edit file: `C:\hadoop-3.3.6\etc\hadoop\core-site.xml`

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/hadoop/tmp</value>
    </property>
</configuration>
```

### File 3: `hdfs-site.xml`

Edit file: `C:\hadoop-3.3.6\etc\hadoop\hdfs-site.xml`

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>/hadoop/data/namenode</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>/hadoop/data/datanode</value>
    </property>
    <property>
        <name>dfs.webhdfs.enabled</name>
        <value>true</value>
    </property>
    <property>
        <name>dfs.namenode.http-address</name>
        <value>localhost:9870</value>
    </property>
</configuration>
```

### File 4: `mapred-site.xml`

Edit file: `C:\hadoop-3.3.6\etc\hadoop\mapred-site.xml`

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>mapreduce.application.classpath</name>
        <value>%HADOOP_HOME%\share\hadoop\mapreduce\*,%HADOOP_HOME%\share\hadoop\mapreduce\lib\*</value>
    </property>
</configuration>
```

### File 5: `yarn-site.xml`

Edit file: `C:\hadoop-3.3.6\etc\hadoop\yarn-site.xml`

```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.env-whitelist</name>
        <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_HOME,PATH,LANG,TZ</value>
    </property>
</configuration>
```

### Step 5: Format NameNode

**PENTING:** Lakukan hanya sekali saat setup awal!

```cmd
hdfs namenode -format
```

Output yang diharapkan:
```
Storage directory C:\hadoop\data\namenode has been successfully formatted.
```

### Step 6: Start Hadoop Services

Buka **Command Prompt sebagai Administrator:**

```cmd
cd C:\hadoop-3.3.6\sbin

:: Start HDFS
start-dfs.cmd

:: Start YARN
start-yarn.cmd
```

### Step 7: Verifikasi Hadoop Running

1. **Check processes:**
   ```cmd
   jps
   ```
   
   Harus melihat:
   - NameNode
   - DataNode
   - ResourceManager
   - NodeManager

2. **Buka Web UI:**
   - HDFS NameNode: http://localhost:9870
   - YARN ResourceManager: http://localhost:8088

---

## 3. Integrasi dengan Next.js

### Step 1: Install Dependencies

```bash
npm install axios webhdfs
npm install --save-dev @types/webhdfs
```

### Step 2: Update .env

Tambahkan konfigurasi Hadoop:
```env
# Existing configs...

# Hadoop Configuration
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
HADOOP_WEBHDFS_PORT=9870
```

### Step 3: Implementasi sudah dibuat di:
- `src/lib/hadoop-config.ts`
- `src/lib/hadoop-client.ts`
- `src/app/api/hadoop/sync/route.ts`
- `scripts/test-hadoop-connection.ts`

---

## 4. Testing & Troubleshooting

### Test Koneksi Basic

```cmd
:: Test HDFS dengan command line
hdfs dfs -ls /
hdfs dfs -mkdir /test
hdfs dfs -put C:\path\to\file.txt /test/
hdfs dfs -cat /test/file.txt
```

### Test dengan Node.js

```bash
npx tsx scripts/test-hadoop-connection.ts
```

### Common Issues & Solutions

#### ❌ Error: "Could not locate Hadoop executable"
**Solusi:**
- Pastikan `HADOOP_HOME` sudah di-set
- Restart Command Prompt
- Verifikasi dengan: `echo %HADOOP_HOME%`

#### ❌ Error: "JAVA_HOME is not set"
**Solusi:**
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-11.0.x"
```

#### ❌ Error: "NameNode is in safe mode"
**Solusi:**
```cmd
hdfs dfsadmin -safemode leave
```

#### ❌ Error: "Connection refused to localhost:9870"
**Solusi:**
- Check apakah NameNode running: `jps`
- Restart Hadoop:
  ```cmd
  stop-all.cmd
  start-all.cmd
  ```

#### ❌ Error: "Permission denied"
**Solusi:**
```cmd
hdfs dfs -chmod -R 777 /
```

---

## 5. Hadoop Commands Cheat Sheet

```bash
# File Operations
hdfs dfs -ls /                          # List files
hdfs dfs -mkdir /folder                 # Create directory
hdfs dfs -put local.txt /hdfs/path/     # Upload file
hdfs dfs -get /hdfs/path/file.txt .     # Download file
hdfs dfs -cat /path/file.txt            # View file content
hdfs dfs -rm /path/file.txt             # Delete file
hdfs dfs -rm -r /path/folder            # Delete folder

# System Commands
hdfs dfsadmin -report                   # Cluster status
hdfs dfsadmin -safemode leave           # Exit safe mode
hdfs fsck /                             # Check filesystem
```

---

## 6. Stop Hadoop

Untuk stop Hadoop services:

```cmd
cd C:\hadoop-3.3.6\sbin
stop-yarn.cmd
stop-dfs.cmd
```

---

## 🎯 Next Steps

Setelah Hadoop running, lanjut ke:
1. ✅ Test koneksi dengan `test-hadoop-connection.ts`
2. ✅ Implementasi sync data dari Supabase ke Hadoop
3. ✅ Setup cron job untuk automated backup
4. ✅ Implementasi analytics dengan data di Hadoop

---

## 📚 Resources

- [Hadoop Documentation](https://hadoop.apache.org/docs/stable/)
- [WebHDFS REST API](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html)
- [Hadoop on Windows](https://cwiki.apache.org/confluence/display/HADOOP2/Hadoop2OnWindows)
