# 🔧 Langkah-Langkah Edit hadoop-env.cmd

## ⚠️ MASALAH YANG TERJADI

Error:
```
The system cannot find the path specified.
Error: JAVA_HOME is incorrectly set.
Please update C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
'-Xmx512m' is not recognized as an internal or external command
```

**Penyebab:** Path mengandung **spasi** (`Program Files`) dan tidak di-quote dengan benar.

---

## 📍 LOKASI FILE YANG HARUS DIEDIT

```
C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
```

---

## 🎯 CARA BUKA FILE

### **Metode 1: Menggunakan Notepad** (RECOMMENDED)

1. Tekan tombol **Windows + R**
2. Ketik:
   ```
   notepad C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
   ```
3. Tekan **Enter**

### **Metode 2: Menggunakan File Explorer**

1. Buka **File Explorer** (Windows + E)
2. Navigasi ke: `C:\hadoop-3.3.6\etc\hadoop\`
3. Cari file: `hadoop-env.cmd`
4. Klik kanan → **Edit** atau **Open with** → **Notepad**

### **Metode 3: Menggunakan VS Code**

1. Buka **VS Code**
2. Tekan **Ctrl + O**
3. Navigasi ke: `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`
4. Klik **Open**

---

## ✏️ YANG HARUS DIEDIT

### **Step 1: Cari Section JAVA_HOME**

Di dalam file `hadoop-env.cmd`, cari baris yang mirip seperti ini (biasanya sekitar baris 25-30):

```cmd
@rem set JAVA_HOME=%JAVA_HOME%
```

ATAU

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
```

### **Step 2: HAPUS atau COMMENT baris lama**

Tambahkan `@rem` di depan baris lama untuk mematikannya:

```cmd
@rem set JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
```

### **Step 3: TAMBAHKAN baris baru dengan QUOTES**

**Di bawah baris yang di-comment**, tambahkan:

```cmd
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
set "HADOOP_HOME=C:\hadoop-3.3.6"
set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"
set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"
```

⚠️ **PERHATIKAN:** 
- Ada **double quotes** (`"`) di sekitar **seluruh assignment**
- Format: `set "VARIABEL=nilai"`
- **BUKAN** `set VARIABEL="nilai"` ❌

---

## 📝 CONTOH LENGKAP

Setelah diedit, bagian file Anda harus terlihat seperti ini:

```cmd
@echo off
@rem Licensed to the Apache Software Foundation (ASF)...

@rem ============================================
@rem JAVA_HOME CONFIGURATION
@rem ============================================
@rem OLD (commented out)
@rem set JAVA_HOME=%JAVA_HOME%

@rem NEW (EDITED BY USER - June 9, 2026)
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
set "HADOOP_HOME=C:\hadoop-3.3.6"
set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"
set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"

@rem ============================================
@rem HADOOP OPTS
@rem ============================================
set "HADOOP_OPTS=-Xmx512m -Djava.net.preferIPv4Stack=true"
set "HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%"

@rem ... sisanya biarkan default ...
```

---

## 💾 SAVE FILE

1. Tekan **Ctrl + S** untuk save
2. Tutup Notepad/VS Code

---

## 🧪 TEST SETELAH EDIT

### **Test 1: Buka Command Prompt BARU**

⚠️ **PENTING:** Harus buka CMD/PowerShell **BARU** setelah edit!

```cmd
# Close semua terminal yang lama
# Buka Command Prompt baru
```

### **Test 2: Check Java Version**

```cmd
java -version
```

**Expected Output:**
```
openjdk version "11.0.31" 2026-04-21
OpenJDK Runtime Environment Temurin-11.0.31+11 (build 11.0.31+11)
OpenJDK 64-Bit Server VM Temurin-11.0.31+11 (build 11.0.31+11, mixed mode)
```

✅ **Jika muncul output seperti di atas, JAVA sudah benar!**

### **Test 3: Check Hadoop Version**

```cmd
hadoop version
```

**Expected Output:**
```
Hadoop 3.3.6
Source code repository https://github.com/apache/hadoop.git
...
```

✅ **Jika muncul output seperti di atas, HADOOP BERHASIL!**

---

## 🚨 TROUBLESHOOTING

### ❌ **Error: "notepad: cannot find the specified file"**

**Solusi:**
1. Check apakah Hadoop sudah di-extract ke `C:\hadoop-3.3.6`
2. Pastikan path **benar-benar ada**
3. Coba buka File Explorer dan navigasi manual ke folder tersebut

### ❌ **Error: "Access Denied" saat save**

**Solusi:**
1. Tutup Notepad
2. Klik kanan **Notepad** → **Run as Administrator**
3. Buka file lagi dengan Notepad admin
4. Edit dan save

### ❌ **Masih error "'Xmx512m' is not recognized"**

**Penyebab:** Quotes salah atau hilang

**Solusi:** Pastikan format **persis** seperti ini:
```cmd
set "HADOOP_OPTS=-Xmx512m -Djava.net.preferIPv4Stack=true"
```

**BUKAN:**
```cmd
set HADOOP_OPTS=-Xmx512m    ❌ Salah (no quotes)
set HADOOP_OPTS="-Xmx512m"  ❌ Salah (quotes di value saja)
```

### ❌ **Error: "JAVA_HOME is incorrectly set" (masih muncul)**

**Solusi:**

1. **Check path benar:**
   ```powershell
   Test-Path "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
   ```
   Harus return: `True`

2. **Check java.exe ada:**
   ```powershell
   Test-Path "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot\bin\java.exe"
   ```
   Harus return: `True`

3. **Restart komputer** (last resort)

---

## 📋 CHECKLIST

Ikuti checklist ini step-by-step:

- [ ] Buka file `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`
- [ ] Cari baris `@rem set JAVA_HOME=...` atau `set JAVA_HOME=...`
- [ ] Comment baris lama dengan `@rem`
- [ ] Tambahkan baris baru:
  ```cmd
  set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
  set "HADOOP_HOME=C:\hadoop-3.3.6"
  set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"
  set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"
  ```
- [ ] Cari dan fix `HADOOP_OPTS` (tambah quotes jika belum ada)
- [ ] Save file (Ctrl + S)
- [ ] Tutup editor
- [ ] **RESTART terminal** (tutup yang lama, buka baru)
- [ ] Test: `java -version` ✅
- [ ] Test: `hadoop version` ✅

---

## 🎯 SETELAH BERHASIL

Jika `hadoop version` sudah berhasil, lanjut ke step berikutnya:

1. **Format NameNode** (sekali saja):
   ```cmd
   hdfs namenode -format
   ```

2. **Start Hadoop Services:**
   ```cmd
   cd C:\hadoop-3.3.6\sbin
   start-dfs.cmd
   start-yarn.cmd
   ```

3. **Check Web UI:**
   - HDFS: http://localhost:9870
   - YARN: http://localhost:8088

---

## 💡 TIPS PENTING

1. ✅ **Selalu gunakan quotes** untuk path yang ada spasi
2. ✅ **Restart terminal** setelah edit environment variables
3. ✅ **Backup file** sebelum edit (copy ke `hadoop-env.cmd.backup`)
4. ✅ **Test step by step** (java dulu, baru hadoop)
5. ✅ **Baca error message** dengan teliti

---

## 📞 JIKA MASIH ERROR

Jika setelah mengikuti langkah ini masih error, **copy-paste:**

1. **Output dari:** `java -version`
2. **Output dari:** `hadoop version`
3. **Isi file:** `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd` (bagian yang sudah Anda edit)

Saya akan bantu troubleshoot lebih lanjut.

---

**Good luck! 🚀**

**Status:** Ready to execute  
**Priority:** CRITICAL (blocking Hadoop setup)  
**Last Updated:** June 9, 2026
