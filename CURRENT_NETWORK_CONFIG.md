# 📡 Current Network Configuration

**Last Updated:** 2026-06-08  
**WiFi Network:** Home WiFi / Current WiFi

---

## 🌐 Network Details

### **WiFi Information:**
```
SSID:         [Your WiFi Name]
Password:     [Your WiFi Password]
Gateway:      192.168.1.1
Subnet Mask:  255.255.255.0
```

### **Komputer (Laptop):**
```
IPv4 Address: 192.168.1.7
Subnet Mask:  255.255.255.0
Gateway:      192.168.1.1
IPv6:         2001:448a:50a0:1f57:846:cbf9:85a4:a98a
```

### **ESP32 (Static IP - RECOMMENDED):**
```cpp
IP Address:   192.168.1.200
Gateway:      192.168.1.1
Subnet:       255.255.255.0
DNS Primary:  8.8.8.8
DNS Secondary: 8.8.4.4
```

---

## 🔗 URLs & Endpoints

### **Next.js Development Server:**
```
Local:   http://localhost:3000
Network: http://192.168.1.7:3000
```

**IoT Auth Page:**
```
http://192.168.1.7:3000/iot-auth?device=ESP32-BOTOL-01
```

### **ESP32 HTTP Server:**
```
http://192.168.1.200/
http://192.168.1.200/set-token?token=xxx
```

### **API Get User (dari ESP32):**
```
http://192.168.1.7:3000/api/iot/get-user
```

---

## ⚙️ Configuration Files

### **1. ESP32 Code (main.cpp):**
```cpp
// File: IOT/PBL/src/main.cpp
const char* api_get_user = "http://192.168.1.7:3000/api/iot/get-user";  ✅
```

### **2. ESP32 Static IP Configuration:**
```cpp
// Add to setup() in main.cpp
IPAddress local_IP(192, 168, 1, 200);      // ESP32 IP
IPAddress gateway(192, 168, 1, 1);          // Router IP
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
  Serial.println("STA Failed to configure");
}
```

### **3. Web App (iot-auth/page.tsx):**
```typescript
// File: src/app/(user)/iot-auth/page.tsx
const [esp32Ip, setEsp32Ip] = useState("192.168.1.200");  ✅
```

---

## ✅ Verification Steps

### **1. Check Laptop IP:**
```cmd
ipconfig
```

Expected output:
```
IPv4 Address: 192.168.1.7
```

### **2. Start Next.js:**
```bash
npm run dev
```

Expected output:
```
✅ WiFi Connected!
IP Address: 192.168.1.200

⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!

[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.1.200
```

### **3. Test ESP32 HTTP Server:**
```
Browser → http://192.168.1.200/

Expected: ✅ "🤖 IoT Bank Sampah"
```

### **4. Test Full Flow dari HP:**
```
1. Connect HP ke WiFi yang sama
2. Buka browser di HP
3. Akses: http://192.168.1.7:3000/iot-auth?device=ESP32-BOTOL-01
4. Login/Register
5. QR code akan muncul
6. Scan dengan HP (bukan kamera ESP32!)
7. ESP32 akan menerima token dan login otomatis
```

---

## 🐛 Troubleshooting

### **Problem: ESP32 tidak connect ke WiFi**
**Solusi:**
- Check SSID dan password benar
- Check WiFi 2.4GHz (bukan 5GHz)
- Restart ESP32
- Check Serial Monitor untuk error message

### **Problem: IP ESP32 berbeda dari 192.168.1.200**
**Solusi:**
- Check Static IP configuration di setup()
- Restart ESP32
- Update esp32Ip di web app sesuai IP yang muncul

### **Problem: Web app tidak accessible dari HP**
**Solusi:**
- HP harus connect ke WiFi yang sama
- Check firewall allow port 3000
- Jalankan npm run dev dengan -H 0.0.0.0
- Test di browser laptop dulu: http://192.168.1.7:3000

### **Problem: QR Login gagal**
**Solusi:**
- Test ESP32 HTTP server: http://192.168.1.200/
- Check Serial Monitor ESP32 untuk error
- Pastikan ESP32 IP di web app = 192.168.1.200

---

## 🌍 Network Topology

```
┌────────────────────────────┐
│    WiFi Router             │
│    Gateway: 192.168.1.1    │
└──────────┬─────────────────┘
           │
           │
    ┌──────▼──────┐          ┌──────▼─────┐
    │   Laptop    │          │   ESP32    │
    │ 192.168.1   │          │ 192.168.1  │
    │    .7       │          │    .200    │
    │             │          │            │
    │  Next.js    │◄─────────┤ HTTP       │
    │  :3000      │  API     │ Client     │
    └─────────────┘          └────────────┘
           ▲                        ▲
           │                        │
           │                        │
    ┌──────┴────────┐               │
    │  HP Browser   │               │
    │  (Scan QR)    │───────────────┘
    └───────────────┘
       Via WiFi
```

---

## ✅ Quick Reference

- [x] WiFi Gateway: `192.168.1.1` ✅
- [x] Laptop IP: `192.168.1.7` ✅
- [x] ESP32 Static IP: `192.168.1.200` ✅
- [x] Subnet: `255.255.255.0` ✅
- [x] API Endpoint: `http://192.168.1.7:3000/api/iot/get-user` ✅
- [x] ESP32 IP di Web App: `192.168.1.200` ✅

**Status: ✅ KONFIGURASI UPDATED!**

---

## 🚀 Ready to Test!

Sekarang Anda bisa:
1. Upload code ke ESP32
2. Start Next.js: `npm run dev`
3. Test dari HP: `http://192.168.1.7:3000/iot-auth`
4. Scan QR & enjoy! 🎉
