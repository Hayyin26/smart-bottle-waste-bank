# 🧪 Test Hadoop Web - Quick Guide

## ✅ Fix Applied

**Problem:** Module not found `@nextui-org/card`  
**Solution:** Updated to use Tailwind CSS dan Container component (sama seperti dashboard lainnya)

---

## 🚀 Testing Steps

### **1. Start Hadoop**

Buka Command Prompt dan jalankan:
```cmd
# Test hadoop version dulu
hadoop version

# Kalau berhasil, start services
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd

# Check services running
jps
```

**Expected Output dari `jps`:**
```
12345 NameNode          ✅
67890 DataNode          ✅
11111 ResourceManager   ✅
22222 NodeManager       ✅
```

---

### **2. Test Native Hadoop UI**

Buka browser:
```
http://localhost:9870
```

✅ Harus tampil **Hadoop HDFS NameNode UI**

---

### **3. Start Next.js Dev Server**

```bash
npm run dev
```

---

### **4. Test Custom Dashboard**

Buka browser:
```
http://localhost:3000/hadoop
```

**Expected:**
- ✅ Page loads without errors
- ✅ Cluster Status card (Online/Offline)
- ✅ Storage Usage card dengan progress bar
- ✅ Web UI links (2 buttons)
- ✅ File Browser table

---

## 🎨 UI Changes

### **Before (Error):**
- ❌ Using `@nextui-org/card`
- ❌ Using `@nextui-org/button`
- ❌ Using `@nextui-org/chip`
- ❌ Using `@nextui-org/spinner`

### **After (Fixed):**
- ✅ Using Tailwind CSS classes
- ✅ Using `Container` component
- ✅ Using native HTML elements (`<button>`, `<div>`, etc.)
- ✅ Consistent with other pages (dashboard, transaksi, etc.)

---

## 🎯 Features Available

### **1. Cluster Status Card**
- Status badge (Online/Offline)
- Hadoop version
- Host & port
- Live nodes count

### **2. Storage Usage Card**
- Usage percentage (progress bar)
- Total capacity
- Free space

### **3. Web UI Links Card**
- Button → HDFS NameNode (port 9870)
- Button → YARN Manager (port 8088)

### **4. File Browser**
- Table dengan columns: Name, Type, Size, Modified, Owner
- Clickable directories (navigate)
- Buttons: Root, IoT Data
- Loading spinner saat fetch data

---

## ❌ Troubleshooting

### **Error: "Failed to compile" masih muncul**

**Solusi:**
1. Stop dev server (Ctrl+C)
2. Clear cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### **Error: "Cannot read properties of undefined"**

**Penyebab:** Hadoop belum running

**Solusi:**
```cmd
cd C:\hadoop-3.3.6\sbin
start-dfs.cmd
start-yarn.cmd
```

---

### **Error: "Fetch failed" di dashboard**

**Penyebab:** Environment variables tidak di-set

**Solusi:** Check `.env` file ada config:
```env
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

Lalu restart dev server.

---

## 📸 Preview

### **Layout:**
```
┌──────────────────────────────────────────┐
│  🗄️ Hadoop Monitoring     [🔄 Refresh]  │
│  Monitor Hadoop HDFS cluster             │
├──────────────────────────────────────────┤
│                                           │
│  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │Cluster │  │Storage │  │Web UI  │     │
│  │Status  │  │Usage   │  │Links   │     │
│  │🟢 Online│  │[████  ]│  │[Open] │     │
│  │v3.3.6  │  │5% Used │  │[YARN] │     │
│  └────────┘  └────────┘  └────────┘     │
│                                           │
│  📁 HDFS File Browser: /iot-data        │
│  [Root] [IoT Data]                       │
│  ┌───────────────────────────────────┐  │
│  │ Name    │ Type │ Size │ Modified │  │
│  ├───────────────────────────────────┤  │
│  │📁 daily │ DIR  │ --   │ Jun 9    │  │
│  │📄 data  │ FILE │ 2MB  │ Jun 9    │  │
│  └───────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Compile berhasil (no errors)
- [ ] Page `/hadoop` dapat diakses
- [ ] Status card menampilkan "Online" atau "Offline"
- [ ] Storage card menampilkan usage percentage
- [ ] Web UI buttons bisa diklik
- [ ] File browser menampilkan data
- [ ] Refresh button berfungsi
- [ ] Navigate folders berfungsi

---

**Status:** ✅ Fixed  
**Last Updated:** June 9, 2026
