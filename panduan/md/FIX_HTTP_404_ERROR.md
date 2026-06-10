# 🔧 Fix HTTP 404 Error - "request handler not found"

## ❌ **Error yang Terjadi:**
```
[E][WebServer.cpp:633] _handleRequest(): request handler not found
```

## 🎯 **Penyebab:**

Error ini muncul karena:
1. **Browser request favicon** - Browser otomatis request `/favicon.ico`
2. **Request ke endpoint lain** - Misal: `/robots.txt`, `/sitemap.xml`
3. **Method tidak match** - POST vs GET

**Ini NORMAL!** Browser selalu request file-file ini.

---

## ✅ **Solusi (Sudah Diperbaiki):**

Saya sudah menambahkan:
1. ✅ **`handleNotFound()`** - Handler untuk 404
2. ✅ **Logging detail** - Log semua request
3. ✅ **`server.onNotFound()`** - Register 404 handler

---

## 🔍 **Cara Debug:**

### **Upload Kode Baru:**
```
1. Arduino IDE → Upload
2. Buka Serial Monitor (115200 baud)
3. Cek log HTTP server
```

### **Expected Output:**
```
[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.100.53
[HTTP] Endpoints:
[HTTP]   GET  /              → Device info
[HTTP]   GET  /set-token     → Auto-login from QR
=================================
```

### **Saat Ada Request:**
```
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /favicon.ico
[HTTP] Method: GET
[HTTP] Args: 0
[HTTP] ========================================
[HTTP] 404 Not Found:
404 Not Found

URI: /favicon.ico
Method: GET
Arguments: 0
```

**Ini NORMAL!** Browser selalu request favicon.

---

## 🎯 **Test HTTP Server:**

### **Test 1: Root Endpoint**
```
Browser → http://192.168.100.53/
```

**Expected:**
```
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 192.168.100.53
```

### **Test 2: Set Token Endpoint (Manual)**
```
Browser → http://192.168.100.53/set-token?token=test123
```

**Expected:**
```
⚠️ Token Required
Parameter token tidak ditemukan.
(atau)
❌ Login Gagal
Token tidak valid atau sudah expired.
```

### **Test 3: 404 Endpoint**
```
Browser → http://192.168.100.53/notfound
```

**Expected:**
```
404 Not Found

URI: /notfound
Method: GET
Arguments: 0
```

---

## 📊 **Common Requests dari Browser:**

| Request | Penyebab | Status |
|---------|----------|--------|
| `/` | User akses root | ✅ 200 OK |
| `/set-token?token=xxx` | QR scan | ✅ 200 OK |
| `/favicon.ico` | Browser otomatis | ⚠️ 404 (normal) |
| `/robots.txt` | Browser otomatis | ⚠️ 404 (normal) |
| `/apple-touch-icon.png` | iOS Safari | ⚠️ 404 (normal) |

**Semua 404 di atas NORMAL!** Tidak perlu diperbaiki.

---

## 🐛 **Troubleshooting:**

### **Problem 1: Masih ada error 404**
**Solusi:**
- Ini normal! Browser selalu request file-file ini
- Abaikan saja jika tidak mengganggu fungsi utama
- Atau tambahkan handler untuk file-file tersebut

### **Problem 2: `/set-token` tidak work**
**Solusi:**
- Cek Serial Monitor untuk log detail
- Pastikan ada parameter `token` di URL
- Test manual: `http://192.168.100.53/set-token?token=test`

### **Problem 3: CORS error di browser**
**Solusi:**
- Sudah ditambahkan CORS headers
- Jika masih error, cek browser console
- Pastikan request dari domain yang sama

---

## 🎯 **Test QR Login:**

### **Step 1: Upload ESP32**
```
Arduino IDE → Upload
Serial Monitor → Cek [HTTP] Server started
```

### **Step 2: Test Root**
```
Browser → http://192.168.100.53/
Harus tampil: "🤖 IoT Bank Sampah"
```

### **Step 3: Login di HP**
```
HP → http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
Login → QR code muncul
```

### **Step 4: Scan QR**
```
Scan QR → HP buka URL
Serial Monitor → Cek log:
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Token: abc123...
[Session] ✅ User found!
```

### **Step 5: Verify**
```
LCD: "HELLO! Test User"
Serial: [Session] Name: Test User
```

---

## 💡 **Tips:**

1. **Abaikan 404 untuk favicon** - Ini normal
2. **Fokus ke log `/set-token`** - Ini yang penting
3. **Cek parameter token** - Harus ada di URL
4. **Test manual dulu** - Sebelum test QR

---

## ✅ **Expected Serial Monitor Output:**

### **Normal Operation:**
```
[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.100.53

// Browser request favicon (normal, abaikan)
[HTTP] 404 Not Found:
URI: /favicon.ico

// User scan QR (ini yang penting!)
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Method: GET
[HTTP] Args: 2
[HTTP]   token: abc123def456...
[HTTP]   device: ESP32-BOTOL-01
[HTTP] ========================================
[HTTP] Token received from QR scan!
[API] Getting user from session...
[Session] ✅ User found!
[Session] Name: Test User
```

---

## 🎉 **Summary:**

**Error `request handler not found` adalah NORMAL!**

Ini terjadi karena:
- ✅ Browser request `/favicon.ico` (normal)
- ✅ Browser request `/robots.txt` (normal)
- ✅ Tidak mengganggu fungsi utama

**Yang penting:**
- ✅ `/` endpoint work
- ✅ `/set-token` endpoint work
- ✅ QR login work

**Upload kode baru dan test!** 🚀
