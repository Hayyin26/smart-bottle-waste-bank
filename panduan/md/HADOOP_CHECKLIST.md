# ✅ Hadoop Integration Checklist

## 📦 Pre-Installation

### Windows Requirements
- [ ] Windows 10/11 (64-bit)
- [ ] Minimum 8GB RAM
- [ ] 20GB free disk space
- [ ] Administrator access
- [ ] Stable internet connection

---

## ☕ Java Installation

- [ ] Download Java JDK 11 dari [Adoptium](https://adoptium.net/)
- [ ] Install Java JDK
- [ ] Set `JAVA_HOME` environment variable
  ```cmd
  setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.x"
  ```
- [ ] Add Java to PATH
  ```cmd
  setx PATH "%PATH%;%JAVA_HOME%\bin"
  ```
- [ ] Verify installation
  ```cmd
  java -version
  javac -version
  ```
- [ ] Expected output: `java version "11.0.x"`

---

## 🐘 Hadoop Installation

### Download & Extract
- [ ] Download Hadoop 3.3.6 dari [Apache Hadoop](https://hadoop.apache.org/releases.html)
- [ ] Extract ke `C:\hadoop-3.3.6` (NO SPACES IN PATH!)
- [ ] Download [winutils](https://github.com/cdarlint/winutils) untuk Hadoop 3.3.6
- [ ] Copy `winutils.exe` ke `C:\hadoop-3.3.6\bin\`
- [ ] Copy `hadoop.dll` ke `C:\hadoop-3.3.6\bin\`

### Environment Variables
- [ ] Set `HADOOP_HOME`
  ```cmd
  setx HADOOP_HOME "C:\hadoop-3.3.6"
  ```
- [ ] Add Hadoop to PATH
  ```cmd
  setx PATH "%PATH%;%HADOOP_HOME%\bin;%HADOOP_HOME%\sbin"
  ```
- [ ] Set `HADOOP_CONF_DIR`
  ```cmd
  setx HADOOP_CONF_DIR "%HADOOP_HOME%\etc\hadoop"
  ```
- [ ] **RESTART Command Prompt after setting variables**

---

## ⚙️ Hadoop Configuration

### File 1: `hadoop-env.cmd`
Location: `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`

- [ ] Open file in text editor
- [ ] Find and edit/add these lines:
  ```cmd
  set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.x
  set HADOOP_HOME=C:\hadoop-3.3.6
  set HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop
  set HADOOP_LOG_DIR=%HADOOP_HOME%\logs
  ```
- [ ] Save file

### File 2: `core-site.xml`
Location: `C:\hadoop-3.3.6\etc\hadoop\core-site.xml`

- [ ] Open file
- [ ] Replace `<configuration>` section with:
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
- [ ] Save file

### File 3: `hdfs-site.xml`
Location: `C:\hadoop-3.3.6\etc\hadoop\hdfs-site.xml`

- [ ] Open file
- [ ] Replace `<configuration>` section with:
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
- [ ] Save file

### File 4: `mapred-site.xml`
Location: `C:\hadoop-3.3.6\etc\hadoop\mapred-site.xml`

- [ ] Create file if not exists
- [ ] Add configuration:
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
- [ ] Save file

### File 5: `yarn-site.xml`
Location: `C:\hadoop-3.3.6\etc\hadoop\yarn-site.xml`

- [ ] Open file
- [ ] Replace `<configuration>` section with:
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
- [ ] Save file

---

## 🔧 Format NameNode

**⚠️ WARNING: Only do this ONCE during initial setup!**

- [ ] Open Command Prompt **as Administrator**
- [ ] Run format command:
  ```cmd
  hdfs namenode -format
  ```
- [ ] Look for success message:
  ```
  Storage directory C:\hadoop\data\namenode has been successfully formatted.
  ```
- [ ] Press Enter to continue

---

## 🚀 Start Hadoop

- [ ] Open Command Prompt **as Administrator**
- [ ] Navigate to sbin folder:
  ```cmd
  cd C:\hadoop-3.3.6\sbin
  ```
- [ ] Start HDFS:
  ```cmd
  start-dfs.cmd
  ```
- [ ] Wait for NameNode and DataNode to start (~30 seconds)
- [ ] Start YARN:
  ```cmd
  start-yarn.cmd
  ```
- [ ] Wait for ResourceManager and NodeManager to start (~30 seconds)

---

## ✅ Verify Hadoop is Running

### Check Java Processes
- [ ] Run command:
  ```cmd
  jps
  ```
- [ ] Verify you see these processes:
  - [ ] NameNode
  - [ ] DataNode
  - [ ] ResourceManager
  - [ ] NodeManager
  - [ ] Jps (the jps command itself)

### Check Web UI
- [ ] Open browser
- [ ] Navigate to: http://localhost:9870
- [ ] Verify HDFS NameNode UI loads
- [ ] Check "Datanodes" tab shows 1 active node
- [ ] Navigate to: http://localhost:8088
- [ ] Verify YARN ResourceManager UI loads

### Test HDFS Commands
- [ ] Create test directory:
  ```cmd
  hdfs dfs -mkdir /test
  ```
- [ ] List root directory:
  ```cmd
  hdfs dfs -ls /
  ```
- [ ] Verify `/test` directory appears
- [ ] Remove test directory:
  ```cmd
  hdfs dfs -rm -r /test
  ```

---

## 📦 Next.js Integration

### Install Dependencies
- [ ] Open terminal in project root
- [ ] Install axios:
  ```bash
  npm install axios
  ```
- [ ] Verify installation:
  ```bash
  npm list axios
  ```

### Environment Configuration
- [ ] Open `.env` file
- [ ] Verify Hadoop config exists:
  ```env
  HADOOP_HOST=localhost
  HADOOP_PORT=9870
  HADOOP_WEBHDFS_PORT=9870
  HADOOP_USER=hadoop
  HADOOP_PROTOCOL=http
  ```
- [ ] Save file

### Test Connection Script
- [ ] Run test script:
  ```bash
  npx tsx scripts/test-hadoop-connection.ts
  ```
- [ ] Verify all tests pass:
  - [ ] List root directory
  - [ ] Create test directory
  - [ ] Upload test file
  - [ ] Read test file
  - [ ] Get file status
  - [ ] List test directory
  - [ ] Create IoT directories

---

## 🌐 API Testing

### Start Next.js Server
- [ ] Start development server:
  ```bash
  npm run dev
  ```
- [ ] Verify server runs on http://localhost:3000

### Test GET Endpoint
- [ ] Open browser
- [ ] Navigate to: http://localhost:3000/api/hadoop/sync
- [ ] Expected response:
  ```json
  {
    "success": true,
    "message": "Hadoop connection OK",
    "filesInRoot": 2,
    "files": [...]
  }
  ```

### Test POST Endpoint (Postman/curl)
- [ ] Open Postman or use curl
- [ ] POST to: http://localhost:3000/api/hadoop/sync
- [ ] Body:
  ```json
  {
    "dataType": "transactions",
    "timeRange": "24h"
  }
  ```
- [ ] Expected response:
  ```json
  {
    "success": true,
    "message": "Successfully synced X transactions records to Hadoop",
    "hdfsPath": "/iot-data/transactions/...",
    "recordCount": X
  }
  ```

### Test List Endpoint
- [ ] Navigate to: http://localhost:3000/api/hadoop/list?path=/iot-data
- [ ] Verify directory listing appears

### Test Read Endpoint
- [ ] Copy a file path from list endpoint
- [ ] Navigate to: http://localhost:3000/api/hadoop/read?path=/iot-data/transactions/...
- [ ] Verify file content appears

---

## 📊 Verify Data in Hadoop

### Via Web UI
- [ ] Open: http://localhost:9870
- [ ] Click "Utilities" → "Browse the file system"
- [ ] Navigate to `/iot-data/transactions/`
- [ ] Verify files exist
- [ ] Click a file to view content

### Via Command Line
- [ ] List IoT data:
  ```cmd
  hdfs dfs -ls /iot-data
  hdfs dfs -ls /iot-data/transactions
  ```
- [ ] View file content:
  ```cmd
  hdfs dfs -cat /iot-data/transactions/transactions_xxx.json
  ```

---

## 🤖 Scheduled Backup (Optional)

### Test Manual Backup
- [ ] Run backup script:
  ```bash
  npx tsx scripts/scheduled-hadoop-sync.ts
  ```
- [ ] Verify data synced successfully
- [ ] Check summary shows:
  - [ ] ✅ transactions
  - [ ] ✅ devices
  - [ ] ✅ iot_sessions

### Setup Windows Task Scheduler
- [ ] Press Win + R
- [ ] Type: `taskschd.msc`
- [ ] Click "Create Basic Task"
- [ ] Name: `Hadoop IoT Backup`
- [ ] Trigger: Daily at 23:00
- [ ] Action: Start a program
- [ ] Program: Path to node.exe
- [ ] Arguments: Path to tsx and script
- [ ] Start in: Project root directory
- [ ] Finish and save task
- [ ] Right-click task → "Run" to test
- [ ] Verify task completes successfully

---

## 🧹 Maintenance Commands

### Daily Operations
- [ ] Know how to start Hadoop:
  ```cmd
  hadoop-commands.bat start
  ```
- [ ] Know how to stop Hadoop:
  ```cmd
  hadoop-commands.bat stop
  ```
- [ ] Know how to check status:
  ```cmd
  hadoop-commands.bat status
  ```

### Health Checks
- [ ] Run status script:
  ```bash
  npx tsx scripts/hadoop-status.ts
  ```
- [ ] Verify all checks pass

---

## 📚 Documentation Review

- [ ] Read `README_HADOOP.md` - Overview
- [ ] Read `HADOOP_QUICK_START.md` - Quick setup guide
- [ ] Read `HADOOP_SETUP_GUIDE.md` - Detailed setup
- [ ] Read `HADOOP_ARCHITECTURE.md` - System architecture
- [ ] Read `HADOOP_INTEGRATION_SUMMARY.md` - Complete API docs
- [ ] Bookmark Hadoop Web UI: http://localhost:9870

---

## 🐛 Troubleshooting Checklist

If something doesn't work:

### Hadoop won't start
- [ ] Check Java installed: `java -version`
- [ ] Check HADOOP_HOME set: `echo %HADOOP_HOME%`
- [ ] Check winutils.exe exists in bin/
- [ ] Run as Administrator
- [ ] Check logs in `C:\hadoop-3.3.6\logs\`

### Connection refused
- [ ] Verify Hadoop running: `jps`
- [ ] Check Web UI: http://localhost:9870
- [ ] Restart Hadoop services
- [ ] Check .env file configuration

### NameNode in safe mode
- [ ] Exit safe mode:
  ```cmd
  hdfs dfsadmin -safemode leave
  ```

### Permission denied
- [ ] Set permissions:
  ```cmd
  hdfs dfs -chmod -R 777 /
  ```

### Port already in use
- [ ] Check if another instance running
- [ ] Kill processes:
  ```cmd
  taskkill /F /IM java.exe
  ```
- [ ] Restart Hadoop

---

## ✅ Final Verification

- [ ] All Java processes running (`jps`)
- [ ] Web UI accessible (http://localhost:9870)
- [ ] Test script passes
- [ ] API endpoints working
- [ ] Data visible in HDFS
- [ ] Backup script works
- [ ] Documentation reviewed

---

## 🎉 Success Criteria

You're ready when:

✅ Hadoop services start without errors  
✅ Web UI shows 1 active DataNode  
✅ Test script creates and reads files  
✅ API sync endpoint works  
✅ Data visible in Hadoop Web UI  
✅ You understand the architecture  

---

## 📝 Notes

**Important Tips:**
- Always run Hadoop commands as Administrator
- Don't format NameNode after initial setup
- Check logs if something fails
- Hadoop needs ~2 minutes to fully start
- Port 9870 must be free (not used by other apps)

**Common Mistakes:**
- ❌ Not running as Administrator
- ❌ Spaces in Hadoop path
- ❌ Missing winutils.exe
- ❌ JAVA_HOME not set
- ❌ Formatting NameNode multiple times

---

## 🎯 Next Steps After Setup

1. [ ] Run test sync for all data types
2. [ ] Monitor storage usage
3. [ ] Setup automated backup schedule
4. [ ] Create analytics dashboard
5. [ ] Plan for production deployment

---

**Estimated Time:**
- Java installation: 10 minutes
- Hadoop installation: 15 minutes
- Configuration: 15 minutes
- Testing: 10 minutes
- **Total: ~50 minutes**

---

**Need Help?**
- Check logs: `C:\hadoop-3.3.6\logs\`
- Review docs: `HADOOP_SETUP_GUIDE.md`
- Test connection: `npx tsx scripts/test-hadoop-connection.ts`

---

Made with ❤️ for PBL IoT Project
