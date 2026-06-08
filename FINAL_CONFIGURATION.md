# ✅ Konfigurasi Final - Siap Upload!

## 📝 **Ringkasan Konfigurasi**

File `IOT/PBL/src/main.cpp` sudah diperbaiki dan siap untuk diupload ke ESP32.

---

## 🔧 **Konfigurasi yang Sudah Benar:**

### **1. WiFi Credentials** ✅
```cpp
const char* ssid = "Slumk";
const char* password = "raudhil1234567";
```

### **2. API Endpoint** ✅
```cpp
const char* api_get_user = "http://10.139.60.155:3000/api/iot/get-user";
```
**Catatan:** Mengarah ke IP **komputer** (bukan ESP32)

### **3. Static IP Configuration** ✅
```cpp
IPAddress local_IP(10, 139, 60, 87);        // IP ESP32
IPAddress gateway(10, 139, 60, 182);        // Gateway router
IPAddress subnet(255, 255, 255, 0);         // Subnet mask
```

### **4. Device ID** ✅
```cpp
const char* device_id = "ESP32-BOTOL-01";
```

### **5. Mode Operasi** ✅
```cpp
#define USE_QR_LOGIN true  // Wajib scan QR untuk login
```

---

## 🌐 **Network Configuration:**

| Device | IP Address | Port | Role |
|--------|------------|------|------|
| **Komputer** | `10.139.60.155` | 3000 | Web App Server |
| **ESP32** | `10.139.60.87` | 80 | IoT Device (HTTP Server) |
| **Router** | `10.139.60.182` | - | Gateway |
| **WiFi** | `Slumk` | - | Network SSID |

---

## 🚀 **Langkah Upload ke ESP32:**

### **Opsi 1: Menggunakan PlatformIO (Recommended)**

```bash
# 1. Masuk ke folder project
cd IOT/PBL

# 2. Build dan upload
pio run --target upload

# 3. Monitor serial output
pio device monitor
```

---

### **Opsi 2: Menggunakan Arduino IDE**

1. **Buka Arduino IDE**
2. **File → Open** → Pilih `IOT/PBL/src/main.cpp`
3. **Tools → Board** → Pilih **ESP32 Dev Module**
4. **Tools → Port** → Pilih port COM yang sesuai (misal: COM3, COM4)
5. **Klik Upload** (atau tekan **Ctrl+U**)
6. **Tunggu sampai selesai** (akan muncul "Done uploading")
7. **Buka Serial Monitor** (Ctrl+Shift+M) dengan baud rate **115200**

---

## 📊 **Expected Serial Output:**

Setelah upload berhasil, Serial Monitor akan menampilkan:

```
Connecting WiFi...
✅ WiFi Connected!
IP Address: 10.139.60.87
⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!

=================================
IoT Bank Sampah Digital
=================================
Mode: QR LOGIN
Commands:
  TOKEN:<token>  - Set session token
  CHECK          - Check current session
  CLEAR          - Clear session
  LOGOUT         - Logout and delete session
  LCD            - Test LCD display
  SCAN           - Scan I2C devices
  TEST           - Test sensors (Height, Length, Weight, Metal)
  METAL          - Monitor metal sensor real-time
=================================

[HTTP] Server started on port 80
[HTTP] Access at: http://10.139.60.87
[HTTP] Endpoints:
[HTTP]   GET  /              → Device info
[HTTP]   GET  /set-token     → Auto-login from QR
=================================
```

---

## ✅ **Verifikasi Koneksi:**

### **1. Test Ping dari Komputer:**
```bash
ping 10.139.60.87
```

**Expected:**
```
Reply from 10.139.60.87: bytes=32 time=5ms TTL=255
Reply from 10.139.60.87: bytes=32 time=3ms TTL=255
```

---

### **2. Test HTTP Server dari Browser:**

Buka browser dan akses:
```
http://10.139.60.87/
```

**Expected:**
```
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 10.139.60.87
```

---

### **3. Test dari HP:**

1. **Connect HP ke WiFi "Slumk"**
2. **Buka browser di HP**
3. **Akses:** `http://10.139.60.87/`
4. **Harus tampil halaman device info**

---

## 🔄 **Test QR Login (End-to-End):**

### **Langkah 1: Jalankan Web App**
```bash
npm run dev
```

### **Langkah 2: Akses dari HP**
```
http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
```

### **Langkah 3: Login/Register**
- Masukkan email dan password
- Klik Login atau Daftar

### **Langkah 4: Scan QR Code**
- QR code akan muncul setelah login berhasil
- Scan dengan kamera HP
- HP akan otomatis buka: `http://10.139.60.87/set-token?token=...`

### **Langkah 5: Verifikasi**
- **HP harus tampil:** "✅ Login Berhasil!"
- **ESP32 LCD harus tampil:** "HELLO! [Nama User]"
- **Serial Monitor harus tampil:**
  ```
  [HTTP] Request received!
  [HTTP] Token received from QR scan!
  [HTTP] Token: abc123...
  [Session] ✅ User found!
  [Session] User ID: xxx-xxx-xxx
  [Session] Name: [Nama User]
  ```

---

## 🐛 **Troubleshooting:**

### **Problem 1: Upload Failed**

**Gejala:**
```
Failed to connect to ESP32: Timed out waiting for packet header
```

**Solusi:**
1. Tekan dan tahan tombol **BOOT** di ESP32
2. Klik **Upload** di Arduino IDE
3. Lepas tombol **BOOT** setelah "Connecting..." muncul
4. Atau coba port COM yang berbeda

---

### **Problem 2: WiFi Tidak Connect**

**Gejala:**
```
Connecting WiFi.........
(tidak berhenti)
```

**Solusi:**
1. ✅ Cek nama WiFi: `"Slumk"` (case-sensitive!)
2. ✅ Cek password: `"raudhil1234567"`
3. ⚠️ Pastikan WiFi 2.4GHz (ESP32 tidak support 5GHz)
4. ⚠️ Cek jarak ESP32 ke router
5. ⚠️ Restart router jika perlu

---

### **Problem 3: IP ESP32 Berbeda**

**Gejala:**
```
IP Address: 10.139.60.XXX  (bukan 10.139.60.87)
```

**Solusi:**
1. Cek static IP configuration di code (baris 502-507)
2. Pastikan tidak ada device lain yang pakai IP `10.139.60.87`
3. Restart ESP32 (tekan tombol RST)
4. Jika masih gagal, coba IP lain (misal: `10.139.60.88`)
5. Update juga di web app: `src/app/(user)/iot-auth/page.tsx` baris 17

---

### **Problem 4: HTTP Server Tidak Bisa Diakses**

**Gejala:**
- Ping ke `10.139.60.87` berhasil ✅
- Tapi `http://10.139.60.87/` tidak bisa dibuka ❌

**Solusi:**
1. Cek Serial Monitor, pastikan ada:
   ```
   [HTTP] Server started on port 80
   ```
2. Cek firewall di komputer (port 80 harus terbuka)
3. Coba akses dari HP (bukan komputer)
4. Restart ESP32

---

### **Problem 5: QR Login Gagal**

**Gejala:**
- QR code berhasil di-scan ✅
- HP berhasil buka URL ✅
- Tapi tampil: "❌ Login Gagal - Token tidak valid" ❌

**Solusi:**
1. ⚠️ **Pastikan HP dan ESP32 di WiFi yang SAMA** (`"Slumk"`)
2. Cek Serial Monitor ESP32, pastikan ada log:
   ```
   [HTTP] Request received!
   [HTTP] Token received from QR scan!
   ```
3. Jika tidak ada log, berarti ESP32 tidak menerima request
4. Test akses `http://10.139.60.87/` di browser HP
5. Restart ESP32 dan web app

---

### **Problem 6: "Static IP configuration failed!"**

**Gejala:**
```
⚠️ Static IP configuration failed!
```

**Solusi:**
1. Cek gateway: `10.139.60.182` (harus sesuai dengan router)
2. Cek subnet: `255.255.255.0`
3. Coba restart ESP32
4. Jika masih gagal, gunakan DHCP (comment `WiFi.config()`)

---

## 📊 **Diagram Alur Lengkap:**

```
┌─────────────────────────────────────┐
│    Router WiFi "Slumk"              │
│    Gateway: 10.139.60.182           │
│    Subnet: 255.255.255.0            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼────┐      ┌───▼────┐
   │  PC    │      │ ESP32  │
   │ .155   │      │  .87   │
   │:3000   │      │  :80   │
   └────┬───┘      └───┬────┘
        │              │
        │   ┌──────────┘
        │   │
   ┌────▼───▼────┐
   │     HP      │
   │   Browser   │
   └─────────────┘

Flow:
1. HP → PC:3000 (Login/Register)
2. PC → Database (Save session)
3. PC → HP (QR Code dengan URL ESP32)
4. HP → ESP32:80 (Scan QR, kirim token)
5. ESP32 → PC:3000 (Verify token)
6. ESP32 → LCD (Tampil nama user)
```

---

## 📱 **URL Reference:**

### **Web App (dari HP):**
```
http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
```

### **ESP32 HTTP Server:**
```
http://10.139.60.87/
```

### **QR Code Content:**
```
http://10.139.60.87/set-token?token=abc123...&device=ESP32-BOTOL-01
```

### **API Endpoint (ESP32 → PC):**
```
http://10.139.60.155:3000/api/iot/get-user?token=abc123...&device=ESP32-BOTOL-01
```

---

## ✅ **Final Checklist:**

- [x] WiFi SSID: `"Slumk"` ✅
- [x] WiFi Password: `"raudhil1234567"` ✅
- [x] ESP32 IP: `10.139.60.87` ✅
- [x] Gateway: `10.139.60.182` ✅
- [x] API Endpoint: `http://10.139.60.155:3000/api/iot/get-user` ✅
- [x] Web App ESP32 IP: `10.139.60.87` ✅
- [ ] **Upload code ke ESP32** ⚠️ **← LANGKAH BERIKUTNYA!**
- [ ] Verifikasi Serial Monitor
- [ ] Test ping ke ESP32
- [ ] Test HTTP server
- [ ] Test QR login dari HP

---

## 🎯 **Summary:**

| Item | Status | Value |
|------|--------|-------|
| WiFi SSID | ✅ | `Slumk` |
| WiFi Password | ✅ | `raudhil1234567` |
| ESP32 IP | ✅ | `10.139.60.87` |
| PC IP | ✅ | `10.139.60.155` |
| Gateway | ✅ | `10.139.60.182` |
| API Endpoint | ✅ | `http://10.139.60.155:3000/api/iot/get-user` |
| Device ID | ✅ | `ESP32-BOTOL-01` |
| QR Login Mode | ✅ | `true` |

---

## 🚀 **Ready to Upload!**

Kode Anda sudah **100% siap** untuk diupload ke ESP32!

**Langkah berikutnya:**
1. Connect ESP32 ke komputer via USB
2. Upload code (PlatformIO atau Arduino IDE)
3. Buka Serial Monitor untuk monitoring
4. Test koneksi dan QR login

**Selamat mencoba! 🎉**
