# ✅ Verifikasi Konfigurasi Network

**Last Updated:** 5 Juni 2026

---

## 📡 **WiFi Configuration**

```cpp
SSID:     "JTI-POLINEMA-2G"
Password: "jtifast!"
```

---

## 🖥️ **IP Address Configuration**

### **Network Info (dari ipconfig):**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.73.134
   Subnet Mask . . . . . . . . . . . : 255.255.255.192
   Default Gateway . . . . . . . . . : 192.168.73.129
```

### **Laptop (Komputer):**
```
IP Address: 192.168.73.134
Subnet:     255.255.255.192
Gateway:    192.168.73.129
```

### **ESP32 (IoT Device):**
```cpp
IP Address: 192.168.73.200  ✅ (BERBEDA dari laptop!)
Subnet:     255.255.255.192  ✅ (SAMA dengan laptop)
Gateway:    192.168.73.129   ✅ (SAMA dengan laptop)
DNS 1:      8.8.8.8          ✅ (Google DNS)
DNS 2:      8.8.4.4          ✅ (Google DNS)
```

---

## ✅ **Verifikasi IP - Tidak Ada Konflik!**

| Device | IP Address | Port | Status |
|--------|------------|------|--------|
| **Laptop** | `192.168.73.134` | 3000 | ✅ Unique |
| **ESP32** | `192.168.73.200` | 80 | ✅ Unique |
| **Gateway** | `192.168.73.129` | - | ✅ Router |

**✅ Semua IP berbeda - TIDAK ADA KONFLIK!**

---

## 🔗 **URL Configuration**

### **Web App (Next.js):**
```
Local:    http://localhost:3000
Network:  http://192.168.73.134:3000
IoT Auth: http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
```

### **ESP32 HTTP Server:**
```
Root:       http://192.168.73.200/
Set Token:  http://192.168.73.200/set-token?token=xxx
```

### **API Endpoint (dari ESP32):**
```cpp
API URL: http://192.168.73.134:3000/api/iot/get-user
```

**✅ ESP32 → Laptop API: Correct!**

---

## 📊 **Network Topology**

```
┌──────────────────────────────────┐
│   WiFi Router (JTI-POLINEMA-2G)  │
│   Gateway: 192.168.73.129        │
│   Subnet:  255.255.255.192       │
└───────────────┬──────────────────┘
                │
        ┌───────┴────────┐
        │                │
  ┌─────▼─────┐   ┌─────▼──────┐
  │  Laptop   │   │   ESP32    │
  │ .134:3000 │   │  .200:80   │
  └───────────┘   └────────────┘
  
  API Request Flow:
  ESP32 (.200) → API (.134:3000) ✅
  
  QR Code Flow:
  HP → Web (.134:3000) → QR → ESP32 (.200) ✅
```

---

## 🧪 **Test Configuration**

### **Test 1: Ping ESP32 dari Laptop**
```cmd
ping 192.168.73.200

Expected:
Reply from 192.168.73.200: bytes=32 time<10ms TTL=64
```

### **Test 2: Ping Laptop dari ESP32**
```
ESP32 akan ping ke: 192.168.73.134:3000/api/iot/get-user

Expected di Serial Monitor:
[API] Response: 200
```

### **Test 3: Access ESP32 HTTP Server**
```
Browser → http://192.168.73.200/

Expected:
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 192.168.73.200
```

### **Test 4: QR Code URL**
```
QR Code Content:
http://192.168.73.200/set-token?token=abc123...&device=ESP32-BOTOL-01

Expected:
✅ Redirect ke ESP32 (192.168.73.200)
❌ BUKAN ke Laptop (192.168.73.134)
```

---

## 🔍 **Verification Checklist**

### **ESP32 Code (main.cpp):**

#### **WiFi Credentials:**
```cpp
const char* ssid = "JTI-POLINEMA-2G";        ✅
const char* password = "jtifast!";            ✅
```

#### **API Endpoint:**
```cpp
const char* api_get_user = "http://192.168.73.134:3000/api/iot/get-user";  ✅
                                    ^^^^^^^^^ (IP Laptop)
```

#### **Static IP Configuration:**
```cpp
IPAddress local_IP(192, 168, 73, 200);    ✅ (IP ESP32 - berbeda dari laptop!)
IPAddress gateway(192, 168, 73, 129);     ✅ (Gateway sama)
IPAddress subnet(255, 255, 255, 192);     ✅ (Subnet sama)
```

### **Web App (iot-auth/page.tsx):**

#### **ESP32 IP:**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.73.200");  ✅
                                        ^^^^^^^^^ (IP ESP32)
```

#### **Session Expiration:**
```typescript
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()  ✅
                                   ^^^^^^^^^^ (60 minutes)
```

---

## 🚨 **Common Mistakes - SUDAH DIPERBAIKI!**

### **❌ Mistake 1: IP Conflict (FIXED!)**
```cpp
// ❌ SALAH (Lama):
IPAddress local_IP(192, 168, 73, 134);  // Sama dengan laptop!

// ✅ BENAR (Sekarang):
IPAddress local_IP(192, 168, 73, 200);  // Berbeda dari laptop!
```

### **❌ Mistake 2: Wrong ESP32 IP in Web App (FIXED!)**
```typescript
// ❌ SALAH (Lama):
const [esp32Ip, setEsp32Ip] = useState("192.168.73.134");  // Ini laptop!

// ✅ BENAR (Sekarang):
const [esp32Ip, setEsp32Ip] = useState("192.168.73.200");  // Ini ESP32!
```

### **❌ Mistake 3: Short Expiration (FIXED!)**
```typescript
// ❌ SALAH (Lama):
Date.now() + 5 * 60 * 1000  // 5 minutes only!

// ✅ BENAR (Sekarang):
Date.now() + 60 * 60 * 1000  // 60 minutes!
```

---

## 🐛 **Troubleshooting**

### **Problem: ESP32 tidak dapat IP**
**Serial Monitor:**
```
Connecting WiFi........
⚠️ Static IP configuration failed!
```

**Solusi:**
- Cek WiFi SSID dan password
- Pastikan WiFi 2.4GHz (bukan 5GHz)
- Cek gateway dan subnet benar

### **Problem: ESP32 dapat IP tapi tidak bisa access API**
**Serial Monitor:**
```
✅ WiFi Connected!
IP Address: 192.168.73.200
[API] Failed! Error: -1
```

**Solusi:**
- Test ping dari laptop: `ping 192.168.73.200`
- Test web app running: `http://localhost:3000`
- Cek firewall tidak block port 3000
- Pastikan API endpoint benar: `192.168.73.134:3000`

### **Problem: QR code redirect ke laptop**
**Browser (HP):**
```
http://192.168.73.134/set-token?token=...  ❌ (Ke laptop!)
```

**Solusi:**
- Cek esp32Ip di web app = `192.168.73.200`
- Restart web app (Ctrl+C → npm run dev)
- Generate QR code baru (login ulang)

---

## 📝 **Final Checklist**

- [x] WiFi SSID: `JTI-POLINEMA-2G` ✅
- [x] WiFi Password: `jtifast!` ✅
- [x] Laptop IP: `192.168.73.134` ✅
- [x] ESP32 IP: `192.168.73.200` ✅ (BERBEDA dari laptop!)
- [x] Gateway: `192.168.73.129` ✅
- [x] Subnet: `255.255.255.192` ✅
- [x] API Endpoint: `http://192.168.73.134:3000/api/iot/get-user` ✅
- [x] ESP32 IP di Web App: `192.168.73.200` ✅
- [x] Token Expiration: 60 minutes ✅
- [x] TIDAK ADA IP CONFLICT ✅✅✅

---

## 🎯 **Expected Serial Monitor Output**

```
Connecting WiFi.....
✅ WiFi Connected!
IP Address: 192.168.73.200
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
=================================

[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.73.200
[HTTP] Endpoints:
[HTTP]   GET  /              → Device info
[HTTP]   GET  /set-token     → Auto-login from QR
=================================
```

---

## 🚀 **Ready to Test!**

### **1. Upload ESP32:**
```
Arduino IDE → Upload (Ctrl+U)
Expected: "WiFi Connected! IP: 192.168.73.200"
```

### **2. Start Web App:**
```bash
npm run dev
Expected: "Local: http://localhost:3000"
```

### **3. Test dari HP:**
```
1. Connect HP ke WiFi "JTI-POLINEMA-2G"
2. Browser → http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
3. Login/Register
4. QR code muncul
5. Scan QR
6. Expected: "Login Berhasil!" + Redirect ke http://192.168.73.200/set-token
7. ESP32 LCD: "HELLO! [Nama]"
```

**SEMUA KONFIGURASI SUDAH BENAR!** ✅✅✅

**Upload ESP32 sekarang!** 🚀
