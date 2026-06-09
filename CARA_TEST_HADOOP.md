# 🧪 Cara Test Hadoop Setelah Fix

## ⚠️ PENTING: TUTUP SEMUA TERMINAL!

**WAJIB tutup semua:**
- Command Prompt yang terbuka
- PowerShell yang terbuka
- Git Bash (jika ada)
- Terminal VS Code (jika ada)

**Lalu buka yang BARU!**

---

## ✅ Test 1: Java Version

Buka **Command Prompt BARU**:

```cmd
java -version
```

**Expected Output:**
```
openjdk version "11.0.31" 2026-04-21
OpenJDK Runtime Environment Temurin-11.0.31+11 (build 11.0.31+11)
OpenJDK 64-Bit Server VM Temurin-11.0.31+11 (build 11.0.31+11, mixed mode)
```

✅ Jika muncul ini, Java OK!

---

## ✅ Test 2: Hadoop Version

Di Command Prompt yang sama:

```cmd
hadoop version
```

**Expected Output:**
```
Hadoop 3.3.6
Source code repository https://github.com/apache/hadoop.git -r ...
Compiled by ...
```

✅ Jika muncul ini, **BERHASIL!** 🎉

---

## ❌ Jika Masih Error

### Error: "The system cannot find the path specified"

**Solusi:** Cek apakah JAVA_HOME di-set di System Environment Variables:

```cmd
echo %JAVA_HOME%
```

Harus muncul: `C:\PROGRA~1\ECLIPS~1\JDK-11~1.11-`

Jika kosong, jalankan di **PowerShell Administrator**:
```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\PROGRA~1\ECLIPS~1\JDK-11~1.11-', 'Machine')
```

Lalu **RESTART KOMPUTER**.

---

### Error: "'-Xmx512m' is not recognized"

Ini berarti file `hadoop-env.cmd` masih ada masalah. 

**Solusi:** Cek isi file:
```cmd
type C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
```

Pastikan ada baris:
```
set JAVA_HOME=C:\PROGRA~1\ECLIPS~1\JDK-11~1.11-
```

(BUKAN yang ada spasi!)

---

## 🎯 Setelah Berhasil

### 1. Format NameNode (SEKALI SAJA!)

```cmd
hdfs namenode -format
```

**Expected:**
```
Storage directory ... has been successfully formatted.
```

### 2. Start Hadoop Services

```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
```

Tunggu sampai selesai, lalu:

```cmd
start-yarn.cmd
```

### 3. Check Services Running

```cmd
jps
```

**Expected Output:**
```
12345 NameNode
67890 DataNode
11111 ResourceManager
22222 NodeManager
33333 Jps
```

### 4. Buka Web UI

Di browser:
- **HDFS NameNode:** http://localhost:9870
- **YARN ResourceManager:** http://localhost:8088

---

## 💾 Backup Files

Ada 2 backup file yang dibuat:
1. `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd.backup` (dari script pertama)
2. `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd.backup2` (dari script kedua)

Jika ada masalah, bisa restore dengan:
```cmd
copy C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd.backup2 C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
```

---

## 📝 What Changed?

**File yang diedit:** `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`

**Perubahan utama:**
```
SEBELUM (❌ Error):
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"

SESUDAH (✅ Fixed):
set JAVA_HOME=C:\PROGRA~1\ECLIPS~1\JDK-11~1.11-
```

**Kenapa berhasil?**
- Short path (8.3 format) tidak mengandung spasi
- Tidak perlu quotes
- Compatible dengan CMD batch file

---

**Good luck! 🚀**
