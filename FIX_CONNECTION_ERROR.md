# 🔧 Fix ESP32 Connection Error

## ❌ Error yang Terjadi:
```
[Command] Token set: a72afa5633916e2d9cf10fec658274d2
[API] Getting user from session...
[E][WiFiClient.cpp:258] connect(): socket error on fd 54, errno: 113, 
"Software caused connection abort"
```

## 🎯 Penyebab:
ESP32 tidak bisa connect ke API server karena:
1. **IP address salah** - IP komputer bukan `192.168.1.100`
2. **Server tidak running** - Web app tidak jalan
3. **Firewall block** - Windows Firewall block koneksi
4. **Beda network** - ESP32 dan komputer di WiFi berbeda

---

## ✅ Solusi (Step by Step):

### **Step 1: Cek IP Komputer Anda**

#### Windows:
```cmd
ipconfig
```

Cari bagian:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.XXX  ← COPY INI!
```

#### Mac/Linux:
```bash
ifconfig
```

Cari bagian:
```
en0: inet 192.168.1.XXX  ← COPY INI!
```

**Contoh IP yang benar:**
- ✅ `192.168.1.105`
- ✅ `192.168.0.50`
- ✅ `10.0.0.25`
- ❌ `127.0.0.1` (localhost - tidak bisa!)

---

### **Step 2: Pastikan Web App Running**

```bash
# Terminal
npm run dev
```

Harus tampil:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
○ Network: http://192.168.1.XXX:3000  ← CEK IP INI!
```

**Test di browser:**
```
http://192.168.1.XXX:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01
```

Harus return JSON (bukan error 404)

---

### **Step 3: Update IP di Kode ESP32**

Buka file: **`ESP32_UPDATED_CODE.ino`**

Cari baris ini (sekitar line 27):
```cpp
const char* api_get_user = "http://192.168.1.100:3000/api/iot/get-user";
```

**Ganti dengan IP komputer Anda:**
```cpp
const char* api_get_user = "http://192.168.1.XXX:3000/api/iot/get-user";
                                        ^^^
                                        Ganti dengan IP Anda!
```

**Contoh:**
```cpp
// Jika IP komputer Anda: 192.168.1.105
const char* api_get_user = "http://192.168.1.105:3000/api/iot/get-user";

// Jika IP komputer Anda: 192.168.0.50
const char* api_get_user = "http://192.168.0.50:3000/api/iot/get-user";

// Jika IP komputer Anda: 10.0.0.25
const char* api_get_user = "http://10.0.0.25:3000/api/iot/get-user";
```

---

### **Step 4: Upload Kode ke ESP32**

```
1. Save file (Ctrl+S)
2. Arduino IDE → Upload
3. Tunggu sampai selesai
4. Buka Serial Monitor (115200 baud)
```

---

### **Step 5: Test Koneksi**

#### A. Test dari Browser (Komputer):
```
http://YOUR-IP:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01
```

Harus return:
```json
{"error": "Session not found or expired"}
```

Ini normal! Artinya API berjalan ✅

#### B. Test dari ESP32:
```
Serial Monitor → Ketik:
CHECK
```

Harus tampil:
```
[Command] Checking session...
[API] Getting user from session...
[API] Response: {"error":"Session not found or expired"}
[Session] Session expired or not found
```

Ini normal! Artinya koneksi berhasil ✅

#### C. Test dengan Token Real:
```
1. Login di web app
2. Copy token
3. Serial Monitor → Paste: TOKEN:abc123...
4. Harus tampil: [Session] ✅ User found!
```

---

## 🐛 Troubleshooting:

### Problem 1: Masih "connection abort"
**Solusi:**
1. Cek IP komputer lagi (mungkin berubah)
2. Pastikan ESP32 dan komputer di WiFi yang SAMA
3. Restart router jika perlu

### Problem 2: "Connection refused"
**Solusi:**
1. Pastikan web app running (`npm run dev`)
2. Cek firewall Windows (allow port 3000)
3. Test API di browser dulu

### Problem 3: "Connection timeout"
**Solusi:**
1. Cek WiFi ESP32 masih connect
2. Ping IP komputer dari device lain
3. Restart ESP32

### Problem 4: IP komputer berubah terus
**Solusi:**
Set static IP di router:
```
Router Settings → DHCP → Static IP
Assign IP tetap untuk komputer Anda
```

---

## 🔥 Quick Fix Commands:

### Cek IP (Windows):
```cmd
ipconfig | findstr "IPv4"
```

### Cek IP (Mac/Linux):
```bash
ifconfig | grep "inet "
```

### Test API dari Terminal:
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri "http://YOUR-IP:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01"

# Mac/Linux
curl "http://YOUR-IP:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01"
```

### Allow Firewall (Windows):
```cmd
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
```

---

## 📊 Network Diagram:

```
┌─────────────────┐
│   Router WiFi   │
│  192.168.1.1    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ ESP32 │ │ PC    │
│ WiFi  │ │ WiFi  │
└───────┘ └───────┘
          │
          ▼
    ┌─────────────┐
    │ Web Server  │
    │ Port 3000   │
    └─────────────┘

ESP32 → Router → PC:3000 → API
```

**Syarat:**
- ✅ ESP32 dan PC di WiFi yang SAMA
- ✅ IP PC harus benar
- ✅ Web server running
- ✅ Firewall allow port 3000

---

## ✅ Checklist:

- [ ] Cek IP komputer (`ipconfig` atau `ifconfig`)
- [ ] Copy IP yang benar
- [ ] Update IP di `ESP32_UPDATED_CODE.ino` line 27
- [ ] Save file
- [ ] Upload ke ESP32
- [ ] Pastikan web app running (`npm run dev`)
- [ ] Test API di browser
- [ ] Test koneksi dari ESP32 (command `CHECK`)
- [ ] Test dengan token real
- [ ] Harus tampil: `[Session] ✅ User found!`

---

## 🎯 Expected Result:

### Serial Monitor:
```
[Command] Token set: abc123...
[API] Getting user from session...
[API] Response: {"user_id":"...","full_name":"Test User",...}
[Session] ✅ User found!
[Session] User ID: ...
[Session] Name: Test User
```

### LCD:
```
┌────────────────┐
│ HELLO!         │
│ Test User      │
└────────────────┘

Lalu:
┌────────────────┐
│ Test User      │
│ MASUKKAN BOTOL │
└────────────────┘
```

---

## 💡 Tips:

1. **Gunakan IP static** untuk komputer (set di router)
2. **Bookmark IP** untuk referensi cepat
3. **Test API di browser** sebelum test di ESP32
4. **Cek Serial Monitor** untuk debug
5. **Restart ESP32** jika masih error

---

## 📞 Quick Reference:

### Cek IP:
```
Windows: ipconfig
Mac/Linux: ifconfig
```

### Update Kode:
```cpp
// Line 27 di ESP32_UPDATED_CODE.ino
const char* api_get_user = "http://YOUR-IP:3000/api/iot/get-user";
```

### Test API:
```
Browser: http://YOUR-IP:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01
```

### Test ESP32:
```
Serial Monitor: CHECK
```
