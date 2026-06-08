# ✅ File main.cpp Sudah Diperbaiki!

## 📝 Ringkasan Perbaikan

File `IOT/PBL/src/main.cpp` sudah diupdate dengan konfigurasi network WiFi yang baru.

---

## 🔧 Konfigurasi yang Sudah Diperbaiki

### **1. WiFi Credentials** (Baris 11-12)
```cpp
const char* ssid = "Slumk";
const char* password = "raudhil1234567";
```
✅ **Status:** Sudah diisi dengan WiFi Anda

---

### **2. API Endpoint** (Baris 27)
```cpp
const char* api_get_user = "http://10.139.60.155:3000/api/iot/get-user";
```
✅ **Status:** Sudah diperbaiki (ditambahkan port `:3000`)

**Sebelumnya:** `http://10.139.60.155/api/iot/get-user` ❌ (kurang port)  
**Sekarang:** `http://10.139.60.155:3000/api/iot/get-user` ✅

---

### **3. Static IP Configuration** (Baris 502-507)
```cpp
IPAddress local_IP(10, 139, 60, 87);        // IP ESP32
IPAddress gateway(10, 139, 60, 182);        // Gateway router
IPAddress subnet(255, 255, 255, 0);         // Subnet mask
IPAddress primaryDNS(8, 8, 8, 8);           // Google DNS
IPAddress secondaryDNS(8, 8, 4, 4);         // Google DNS
```
✅ **Status:** Sudah diupdate ke network baru

**Sebelumnya:**
- IP: `192.168.100.87` ❌
- Gateway: `192.168.100.1` ❌

**Sekarang:**
- IP: `10.139.60.87` ✅
- Gateway: `10.139.60.182` ✅

---

## 🌐 Network Configuration Summary

| Device | IP Address | Port | Gateway |
|--------|------------|------|---------|
| **Komputer** | `10.139.60.155` | 3000 | `10.139.60.182` |
| **ESP32** | `10.139.60.87` | 80 | `10.139.60.182` |
| **WiFi** | `Slumk` | - | - |

---

## 🚀 Langkah Selanjutnya

### **1. Upload Code ke ESP32**

#### Menggunakan PlatformIO:
```bash
cd IOT/PBL
pio run --target upload
```

#### Menggunakan Arduino IDE:
1. Buka file `IOT/PBL/src/main.cpp`
2. Pilih board: **ESP32 Dev Module**
3. Pilih port COM yang sesuai
4. Klik **Upload** (Ctrl+U)

---

### **2. Monitor Serial Output**

Setelah upload, buka Serial Monitor (115200 baud) dan cek:

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

### **3. Test Koneksi**

#### A. Test dari Komputer:
```bash
# Ping ESP32
ping 10.139.60.87

# Akses HTTP Server (buka di browser)
http://10.139.60.87/
```

**Expected Output:**
```
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 10.139.60.87
```

#### B. Test Web App:
```bash
# Jalankan web app
npm run dev

# Akses di browser
http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
```

#### C. Test dari HP:
```
1. Connect HP ke WiFi "Slumk"
2. Buka browser di HP
3. Akses: http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
4. Login atau Register
5. Scan QR code yang muncul
6. HP akan otomatis buka: http://10.139.60.87/set-token?token=...
7. Harus tampil: "✅ Login Berhasil!"
8. ESP32 LCD akan tampil: "HELLO! [Nama User]"
```

---

## 🔍 Troubleshooting

### **Problem 1: ESP32 tidak connect ke WiFi**

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

### **Problem 2: IP ESP32 berbeda dari yang diharapkan**

**Gejala:**
```
IP Address: 10.139.60.XXX  (bukan 10.139.60.87)
```

**Solusi:**
1. Cek static IP configuration di code (baris 502-507)
2. Pastikan tidak ada device lain yang pakai IP `10.139.60.87`
3. Restart ESP32 (tekan tombol RST)
4. Jika masih gagal, coba IP lain (misal: `10.139.60.88`)

---

### **Problem 3: "Static IP configuration failed!"**

**Gejala:**
```
⚠️ Static IP configuration failed!
```

**Solusi:**
1. Cek gateway: `10.139.60.182` (harus sesuai dengan router)
2. Cek subnet: `255.255.255.0`
3. Coba restart ESP32
4. Jika masih gagal, gunakan DHCP (hapus `WiFi.config()`)

---

### **Problem 4: HTTP Server tidak bisa diakses**

**Gejala:**
- Ping ke `10.139.60.87` berhasil
- Tapi `http://10.139.60.87/` tidak bisa dibuka

**Solusi:**
1. Cek Serial Monitor, pastikan ada:
   ```
   [HTTP] Server started on port 80
   ```
2. Cek firewall di komputer (port 80 harus terbuka)
3. Coba akses dari HP (bukan komputer)
4. Restart ESP32

---

### **Problem 5: QR Code tidak bisa di-scan**

**Gejala:**
- QR code muncul di web app
- Tapi scan gagal atau HP tidak bisa buka URL

**Solusi:**
1. ✅ Pastikan HP dan ESP32 di WiFi yang SAMA (`"Slumk"`)
2. ✅ Test akses `http://10.139.60.87/` di browser HP
3. ✅ Cek IP ESP32 di Serial Monitor
4. ⚠️ Cek firewall di komputer (port 3000 dan 80)
5. ⚠️ Restart web app dan ESP32

---

### **Problem 6: "Login Gagal" setelah scan QR**

**Gejala:**
```
❌ Login Gagal
Token tidak valid atau sudah expired
```

**Solusi:**
1. Cek HTTP server running di ESP32
2. Test endpoint: `http://10.139.60.87/`
3. Cek API endpoint di code (baris 27)
4. Cek web app running di `http://10.139.60.155:3000`
5. Restart ESP32 dan web app

---

## 📊 Network Diagram

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
   └────────┘      └────────┘
       │                │
       └────────┬───────┘
                │
           ┌────▼────┐
           │   HP    │
           │ Browser │
           └─────────┘
```

---

## 📱 URL Reference

### **Web App (Komputer):**
```
✅ http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
✅ http://127.0.0.1:3000/iot-auth?device=ESP32-BOTOL-01
✅ http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
```

### **Web App (HP):**
```
✅ http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
   ^^^^^^^^^^^^^^
   IP KOMPUTER (port 3000)
```

### **ESP32 HTTP Server:**
```
✅ http://10.139.60.87/
   ^^^^^^^^^^^^^^
   IP ESP32 (port 80)
```

### **QR Code Content:**
```
http://10.139.60.87/set-token?token=abc123...&device=ESP32-BOTOL-01
```

---

## ✅ Checklist

- [x] WiFi SSID: `"Slumk"` ✅
- [x] WiFi Password: `"raudhil1234567"` ✅
- [x] ESP32 IP: `10.139.60.87` ✅
- [x] Gateway: `10.139.60.182` ✅
- [x] API Endpoint: `http://10.139.60.155:3000/api/iot/get-user` ✅
- [x] Web App ESP32 IP: `10.139.60.87` ✅
- [ ] **Upload code ke ESP32** ⚠️
- [ ] **Test koneksi ESP32** ⚠️
- [ ] **Test QR login dari HP** ⚠️

---

## 🎯 Summary

### **Apa yang Sudah Diperbaiki:**
1. ✅ WiFi credentials sudah diisi
2. ✅ API endpoint sudah ditambahkan port `:3000`
3. ✅ Static IP configuration sudah diupdate ke network baru
4. ✅ Web app sudah diupdate dengan IP ESP32 yang benar

### **Apa yang Harus Dilakukan:**
1. ⚠️ **Upload code ke ESP32**
2. ⚠️ **Test koneksi**
3. ⚠️ **Test QR login**

---

## 🚀 Ready to Upload!

Kode Anda sudah siap untuk diupload ke ESP32! 

**Langkah berikutnya:**
1. Connect ESP32 ke komputer via USB
2. Upload code (PlatformIO atau Arduino IDE)
3. Buka Serial Monitor untuk monitoring
4. Test koneksi dan QR login

**Selamat mencoba! 🎉**
