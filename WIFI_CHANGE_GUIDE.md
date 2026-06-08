# 📡 Panduan Perubahan WiFi - Network Baru

## ✅ Perubahan yang Sudah Dilakukan

### **Network Information:**
```
WiFi Network: (Gunakan WiFi yang sama dengan komputer)
Komputer IP: 10.139.60.155
Gateway: 10.139.60.182
Subnet: 255.255.255.0
ESP32 IP: 10.139.60.87 (Static IP)
```

---

## 📝 File yang Sudah Diupdate

### 1. **ESP32 Code** (`IOT/PBL/src/main.cpp`)

#### ✅ Static IP Configuration:
```cpp
IPAddress local_IP(10, 139, 60, 87);        // IP ESP32
IPAddress gateway(10, 139, 60, 182);        // Gateway router
IPAddress subnet(255, 255, 255, 0);         // Subnet mask
```

#### ✅ API Endpoint:
```cpp
const char* api_get_user = "http://10.139.60.155:3000/api/iot/get-user";
```

### 2. **Web App** (`src/app/(user)/iot-auth/page.tsx`)

#### ✅ ESP32 IP untuk QR Code:
```typescript
const [esp32Ip, setEsp32Ip] = useState("10.139.60.87");
```

---

## 🚀 Langkah Selanjutnya

### **1. Update WiFi Credentials di ESP32**

Buka file `IOT/PBL/src/main.cpp` dan ubah baris 11-12:

```cpp
const char* ssid = "NAMA_WIFI_ANDA";        // ← Ganti dengan nama WiFi
const char* password = "PASSWORD_WIFI";      // ← Ganti dengan password WiFi
```

**⚠️ PENTING:** Gunakan WiFi yang SAMA dengan komputer Anda!

### **2. Upload Code ke ESP32**

```bash
# Menggunakan PlatformIO
cd IOT/PBL
pio run --target upload

# Atau menggunakan Arduino IDE
# 1. Buka IOT/PBL/src/main.cpp
# 2. Klik Upload (Ctrl+U)
```

### **3. Verifikasi Koneksi**

Setelah upload, buka Serial Monitor dan cek:

```
✅ WiFi Connected!
IP Address: 10.139.60.87
⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!

[HTTP] Server started on port 80
[HTTP] Access at: http://10.139.60.87
```

### **4. Test Koneksi**

#### A. Test dari Komputer:
```bash
# Ping ESP32
ping 10.139.60.87

# Akses HTTP Server
# Buka browser: http://10.139.60.87/
```

#### B. Test dari HP:
```
1. Connect HP ke WiFi yang SAMA
2. Buka browser di HP
3. Akses: http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01
4. Login/Register
5. Scan QR code yang muncul
6. HP akan otomatis buka: http://10.139.60.87/set-token?token=...
7. Harus tampil: "✅ Login Berhasil!"
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
1. Cek nama WiFi dan password di `main.cpp` (baris 11-12)
2. Pastikan WiFi 2.4GHz (ESP32 tidak support 5GHz)
3. Cek jarak ESP32 ke router

### **Problem 2: IP ESP32 berbeda**

**Gejala:**
```
IP Address: 10.139.60.XXX  (bukan 10.139.60.87)
```

**Solusi:**
1. Cek static IP configuration di `main.cpp` (baris 663-667)
2. Pastikan tidak ada device lain yang pakai IP `10.139.60.87`
3. Restart ESP32

### **Problem 3: QR Code tidak bisa di-scan**

**Gejala:**
- QR code muncul tapi scan gagal
- Atau HP tidak bisa buka URL

**Solusi:**
1. Pastikan HP dan ESP32 di WiFi yang SAMA
2. Cek IP ESP32 di Serial Monitor
3. Test akses `http://10.139.60.87/` di HP
4. Cek firewall di komputer (port 3000 harus terbuka)

### **Problem 4: "Login Gagal" setelah scan**

**Gejala:**
```
❌ Login Gagal
Token tidak valid atau sudah expired
```

**Solusi:**
1. Cek HTTP server running di ESP32
2. Test endpoint: `http://10.139.60.87/`
3. Cek API endpoint di `main.cpp` (baris 23)
4. Restart ESP32 dan web app

---

## 📊 Network Diagram

```
┌─────────────────────────────────────┐
│    Router WiFi                      │
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
   IP KOMPUTER!
```

### **ESP32 HTTP Server:**
```
✅ http://10.139.60.87/
   ^^^^^^^^^^^^^^
   IP ESP32
```

### **QR Code Content:**
```
http://10.139.60.87/set-token?token=abc123...&device=ESP32-BOTOL-01
```

---

## ✅ Checklist

- [x] Update IP ESP32 di `main.cpp` → `10.139.60.87`
- [x] Update Gateway di `main.cpp` → `10.139.60.182`
- [x] Update API endpoint di `main.cpp` → `http://10.139.60.155:3000`
- [x] Update ESP32 IP di web app → `10.139.60.87`
- [ ] **Update WiFi SSID dan Password di `main.cpp`** ⚠️
- [ ] Upload code ke ESP32
- [ ] Test koneksi ESP32
- [ ] Test QR login dari HP

---

## 🎯 Next Steps

1. **Buka file `IOT/PBL/src/main.cpp`**
2. **Ubah baris 11-12** dengan WiFi credentials Anda
3. **Upload ke ESP32**
4. **Test koneksi**

**Selamat mencoba! 🚀**
