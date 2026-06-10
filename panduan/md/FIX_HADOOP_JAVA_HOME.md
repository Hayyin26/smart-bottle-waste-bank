# 🔧 Fix: Hadoop JAVA_HOME Error

## 🔍 Error Message
```
The system cannot find the path specified.
Error: JAVA_HOME is incorrectly set.
Please update C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd
'-Xmx512m' is not recognized as an internal or external command
```

## 🎯 Penyebab
Path JAVA_HOME mengandung **spasi** (`Program Files`) dan tidak di-quote dengan benar di `hadoop-env.cmd`.

---

## ✅ SOLUSI

### **Step 1: Edit hadoop-env.cmd**

Buka file: `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd`

**CARI baris ini** (biasanya di baris 25-30):
```cmd
@rem set JAVA_HOME=%JAVA_HOME%
```

**GANTI dengan** (uncomment dan tambah quotes):
```cmd
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
```

⚠️ **PENTING:** Perhatikan **double quotes** di sekitar seluruh assignment!

---

### **Step 2: Tambahkan Environment Variables**

Di **baris setelah JAVA_HOME**, tambahkan:

```cmd
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
set "HADOOP_HOME=C:\hadoop-3.3.6"
set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"
set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"
set "PATH=%HADOOP_HOME%\bin;%JAVA_HOME%\bin;%PATH%"
```

---

### **Step 3: Fix HADOOP_OPTS (Jika Ada)**

Cari baris yang mengandung `-Xmx512m` dan pastikan di-quote:

**SEBELUM (❌ Salah):**
```cmd
set HADOOP_OPTS=-Xmx512m
```

**SESUDAH (✅ Benar):**
```cmd
set "HADOOP_OPTS=-Xmx512m"
```

---

## 📝 Template Lengkap hadoop-env.cmd

Copy-paste ini ke **bagian atas** file `hadoop-env.cmd`:

```cmd
@echo off
rem Licensed to the Apache Software Foundation (ASF) under one or more
rem ...

rem ============================================
rem SET JAVA_HOME (EDITED - JANGAN HAPUS QUOTES!)
rem ============================================
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"

rem ============================================
rem SET HADOOP VARIABLES
rem ============================================
set "HADOOP_HOME=C:\hadoop-3.3.6"
set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"
set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"
set "HADOOP_CLASSPATH=%HADOOP_HOME%\share\hadoop\tools\lib\*"

rem ============================================
rem HADOOP OPTS
rem ============================================
set "HADOOP_OPTS=-Xmx512m -Djava.net.preferIPv4Stack=true"
set "HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%"

rem ============================================
rem PATH
rem ============================================
set "PATH=%HADOOP_HOME%\bin;%JAVA_HOME%\bin;%PATH%"
```

---

## 🧪 Testing

### **Test 1: Check JAVA_HOME**
```powershell
# Di PowerShell baru (restart terminal)
$env:JAVA_HOME
# Expected: C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot

java -version
# Expected: openjdk version "11.0.31"
```

### **Test 2: Check Hadoop**
```powershell
hadoop version
```

**Expected Output:**
```
Hadoop 3.3.6
Source code repository https://github.com/apache/hadoop.git -r ...
Compiled by ... on ...
```

### **Test 3: Check HDFS (jika sudah format)**
```powershell
hdfs version
```

---

## 🚨 Troubleshooting

### **Problem: Masih error "cannot find path"**

**Solution 1: Check path benar**
```powershell
Test-Path "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
# Harus return: True
```

**Solution 2: Check ada `java.exe`**
```powershell
Test-Path "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot\bin\java.exe"
# Harus return: True
```

**Solution 3: Restart terminal**
- Close semua PowerShell/CMD yang terbuka
- Buka baru
- Test lagi

---

### **Problem: "'-Xmx512m' is not recognized"**

**Cause:** Quotes hilang di HADOOP_OPTS

**Solution:** Pastikan semua line yang ada spasi atau parameter di-quote:
```cmd
set "HADOOP_OPTS=-Xmx512m -Djava.net.preferIPv4Stack=true"
set "HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%"
```

---

### **Problem: "JAVA_HOME is incorrectly set"**

**Cause 1:** Quotes salah

❌ **SALAH:**
```cmd
set JAVA_HOME="C:\Program Files\..."  # Quotes di value saja
set "JAVA_HOME"="C:\Program Files\..." # Quotes di variable name
```

✅ **BENAR:**
```cmd
set "JAVA_HOME=C:\Program Files\..." # Quotes di keseluruhan assignment
```

**Cause 2:** Path tidak ada

Check di File Explorer apakah folder benar-benar ada.

---

## 📋 Checklist

- [ ] Edit `hadoop-env.cmd`
- [ ] Set `JAVA_HOME` dengan quotes: `set "JAVA_HOME=..."`
- [ ] Set `HADOOP_HOME` dengan quotes
- [ ] Fix semua `HADOOP_OPTS` dengan quotes
- [ ] Save file
- [ ] Close terminal
- [ ] Buka terminal baru
- [ ] Test `java -version` ✅
- [ ] Test `hadoop version` ✅

---

## 🎯 Quick Fix Script

Kalau mau cepat, jalankan PowerShell script ini:

```powershell
# Set environment variables di Windows System
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot', 'Machine')
[System.Environment]::SetEnvironmentVariable('HADOOP_HOME', 'C:\hadoop-3.3.6', 'Machine')

# Add to PATH
$oldPath = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine')
$newPath = "C:\hadoop-3.3.6\bin;C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot\bin;" + $oldPath
[System.Environment]::SetEnvironmentVariable('PATH', $newPath, 'Machine')

Write-Host "✅ Environment variables set!"
Write-Host "⚠️ Restart terminal untuk apply changes"
```

**⚠️ WARNING:** Jalankan PowerShell sebagai **Administrator**!

---

## 💡 Tips

1. **Selalu gunakan quotes** untuk path yang ada spasi
2. **Restart terminal** setelah edit environment variables
3. **Backup** hadoop-env.cmd sebelum edit
4. **Test step by step** (java dulu, baru hadoop)

---

**Status:** Ready to fix  
**Priority:** HIGH (blocker untuk Hadoop)  
**Last Updated:** June 9, 2026
