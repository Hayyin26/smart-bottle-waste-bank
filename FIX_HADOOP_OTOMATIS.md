# 🚀 Fix Hadoop Error - SOLUSI OTOMATIS

## 📝 Masalah
File `C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd` tidak bisa dibuka secara manual.

## ✅ Solusi: Gunakan Script Otomatis

Saya sudah membuat **PowerShell script** yang akan otomatis mengedit file `hadoop-env.cmd` untuk Anda.

---

## 🎯 CARA MENGGUNAKAN

### **Step 1: Buka PowerShell sebagai Administrator**

1. Tekan tombol **Windows**
2. Ketik: `PowerShell`
3. **Klik kanan** pada "Windows PowerShell"
4. Pilih **"Run as Administrator"**
5. Klik **Yes** pada UAC prompt

### **Step 2: Jalankan Script**

Di PowerShell Administrator, jalankan perintah ini **SATU PER SATU**:

```powershell
# Masuk ke folder project
cd "C:\Data Hayyin\Kuliah\Semester 6\PBL\smart"

# Allow script execution (jika belum pernah)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Jalankan script
.\fix-hadoop-env.ps1
```

### **Step 3: Tunggu Sampai Selesai**

Script akan:
- ✅ Check apakah Java dan Hadoop terinstall
- 📦 Backup file original ke `hadoop-env.cmd.backup`
- ✏️ Edit file dengan konfigurasi yang benar
- ✅ Konfirmasi berhasil

---

## 🧪 TESTING SETELAH SCRIPT

### **Step 1: Tutup PowerShell Lama**

⚠️ **PENTING:** Tutup semua terminal yang sedang terbuka!

### **Step 2: Buka Command Prompt BARU**

1. Tekan **Windows + R**
2. Ketik: `cmd`
3. Tekan **Enter**

### **Step 3: Test Java**

```cmd
java -version
```

**Expected Output:**
```
openjdk version "11.0.31" 2026-04-21
OpenJDK Runtime Environment Temurin-11.0.31+11
OpenJDK 64-Bit Server VM Temurin-11.0.31+11
```

✅ **Jika muncul output seperti ini, Java OK!**

### **Step 4: Test Hadoop**

```cmd
hadoop version
```

**Expected Output:**
```
Hadoop 3.3.6
Source code repository https://github.com/apache/hadoop.git -r ...
Compiled by ...
```

✅ **Jika muncul output seperti ini, BERHASIL!**

---

## 🚨 TROUBLESHOOTING

### ❌ **Error: "Script tidak bisa dijalankan" atau "ExecutionPolicy"**

**Solusi:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

Lalu jalankan script lagi.

---

### ❌ **Error: "Access Denied" atau "Permission Denied"**

**Penyebab:** PowerShell tidak dibuka sebagai Administrator

**Solusi:**
1. Tutup PowerShell
2. Buka lagi dengan **Run as Administrator**
3. Jalankan script lagi

---

### ❌ **Error: "Cannot find path C:\hadoop-3.3.6"**

**Penyebab:** Hadoop belum di-extract atau lokasi salah

**Solusi:**
1. Check apakah folder `C:\hadoop-3.3.6` ada
2. Jika tidak, extract Hadoop ke lokasi tersebut
3. Jika lokasi berbeda, edit script di baris:
   ```powershell
   $hadoopHome = "C:\hadoop-3.3.6"
   ```

---

### ❌ **Error: "Cannot find Java path"**

**Penyebab:** Java tidak terinstall atau lokasi berbeda

**Solusi:**

1. Check apakah folder Java ada:
   ```powershell
   Test-Path "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
   ```

2. Jika `False`, cari lokasi Java Anda:
   ```powershell
   Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Recurse -Filter "java.exe" | Select-Object FullName
   ```

3. Edit script `fix-hadoop-env.ps1` dengan path yang benar

---

## ✅ JIKA BERHASIL

Setelah `hadoop version` sukses, lanjut ke:

### **1. Format NameNode** (sekali saja)

```cmd
hdfs namenode -format
```

**Expected Output:**
```
Storage directory ... has been successfully formatted.
```

### **2. Start Hadoop Services**

```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

### **3. Check Services Running**

```cmd
jps
```

**Expected Output:**
```
NameNode
DataNode
ResourceManager
NodeManager
```

### **4. Buka Web UI**

- **HDFS NameNode:** http://localhost:9870
- **YARN ResourceManager:** http://localhost:8088

---

## 📁 File-File yang Dibuat

1. **fix-hadoop-env.ps1** - Script otomatis untuk fix konfigurasi
2. **hadoop-env.cmd.backup** - Backup file original (dibuat otomatis saat script jalan)
3. **FIX_HADOOP_OTOMATIS.md** - Panduan ini

---

## 🔄 Restore dari Backup (jika ada masalah)

Jika setelah script ada masalah dan ingin kembali ke konfigurasi lama:

```powershell
cd C:\hadoop-3.3.6\etc\hadoop
Copy-Item hadoop-env.cmd.backup hadoop-env.cmd -Force
```

---

## 📋 CHECKLIST

- [ ] Buka PowerShell sebagai **Administrator**
- [ ] Masuk ke folder project: `cd "C:\Data Hayyin\Kuliah\Semester 6\PBL\smart"`
- [ ] Set execution policy: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force`
- [ ] Jalankan script: `.\fix-hadoop-env.ps1`
- [ ] Lihat konfirmasi "✅ HADOOP CONFIGURATION FIXED!"
- [ ] **Tutup semua terminal**
- [ ] Buka Command Prompt **BARU**
- [ ] Test: `java -version` ✅
- [ ] Test: `hadoop version` ✅
- [ ] Format NameNode: `hdfs namenode -format`
- [ ] Start services: `start-dfs.cmd` dan `start-yarn.cmd`
- [ ] Check web UI: http://localhost:9870 ✅

---

## 💡 TIPS

1. ✅ **Selalu jalankan script dengan PowerShell Administrator**
2. ✅ **Restart terminal setelah script selesai**
3. ✅ **Check backup file jika ada masalah**
4. ✅ **Jangan edit manual jika script sudah jalan**

---

## 🎯 Alternative: Manual Command (tanpa script)

Jika script tidak bisa jalan sama sekali, gunakan command ini di PowerShell Administrator:

```powershell
# Set environment variables di System level
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot', 'Machine')
[System.Environment]::SetEnvironmentVariable('HADOOP_HOME', 'C:\hadoop-3.3.6', 'Machine')

# Add to PATH
$oldPath = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine')
$newPath = "C:\hadoop-3.3.6\bin;C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot\bin;" + $oldPath
[System.Environment]::SetEnvironmentVariable('PATH', $newPath, 'Machine')

Write-Host "✅ Environment variables set!"
Write-Host "⚠️ Restart komputer untuk apply changes"
```

⚠️ **Setelah ini, RESTART KOMPUTER!**

---

**Good luck! 🚀**

**Status:** Ready to execute  
**File Script:** `fix-hadoop-env.ps1`  
**Last Updated:** June 9, 2026
