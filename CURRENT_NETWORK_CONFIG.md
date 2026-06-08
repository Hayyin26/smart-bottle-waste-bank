# 🌐 Konfigurasi Jaringan Terbaru

**Tanggal Update:** 5 Juni 2026

---

## 📡 **WiFi Configuration**

```cpp
SSID: "JTI-POLINEMA-2G"
Password: "jtifast!"
```

---

## 🖥️ **IP Address Configuration**

### **Komputer (Laptop):**
```
IPv4 Address: 192.168.73.134
Subnet Mask:  255.255.255.192
Gateway:      192.168.73.129
```

### **ESP32 (Static IP):**
```cpp
IP Address:   192.168.73.200
Gateway:      192.168.73.129
Subnet:       255.255.255.192
DNS Primary:  8.8.8.8
DNS Secondary: 8.8.4.4
```

---

## 🔗 **API Endpoints**

### **Web App (Next.js):**
```
Local:   http://localhost:3000
Network: http://192.168.73.134:3000
```

**IoT Auth Page:**
```
http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
```

### **ESP32 HTTP Server:**
```
http://192.168.73.200/
http://192.168.73.200/set-token?token=xxx
```

### **API Get User (dari ESP32):**
```
http://192.168.73.134:3000/api/iot/get-user
```

---

## ✅ **Verifikasi Konfigurasi**

### **1. Cek WiFi Credentials di ESP32:**
```cpp
// File: IOT/PBL/src/main.cpp
const char* ssid = "JTI-POLINEMA-2G";        ✅
const char* password = "jtifast!";            ✅
```

### **2. Cek API Endpoint di ESP32:**
```cpp
// File: IOT/PBL/src/main.cpp
const char* api_get_user = "http://192.168.73.134:3000/api/iot/get-user";  ✅
```

### **3. Cek Static IP di ESP32:**
```cpp
// File: IOT/PBL/src/main.cpp (setup function)
IPAddress local_IP(192, 168, 73, 200);    ✅
IPAddress gateway(192, 168, 73, 129);     ✅
IPAddress subnet(255, 255, 255, 192);     ✅
```

### **4. Cek ESP32 IP di Web App:**
```typescript
// File: src/app/(user)/iot-auth/page.tsx
const [esp32Ip, setEsp32Ip] = useState("192.168.73.200");  ✅
```

---

## 🧪 **Testing Steps**

### **1. Upload ESP32:**
```
1. Buka Arduino IDE
2. File: IOT/PBL/src/main.cpp
3. Klik Upload (Ctrl+U)
4. Tunggu sampai selesai
```

### **2. Cek Serial Monitor:**
```
✅ WiFi Connected!
IP Address: 192.168.73.200
⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!

[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.73.200
```

### **3. Test ESP32 HTTP Server:**
```
Browser → http://192.168.73.200/
Expected: ✅ "🤖 IoT Bank Sampah"
```

### **4. Start Web App:**
```bash
npm run dev
```

### **5. Test dari HP:**
```
1. Connect HP ke WiFi "JTI-POLINEMA-2G"
2. Buka browser di HP
3. Akses: http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
4. Login/Register
5. QR code akan muncul
6. Scan QR code
7. Expected: ✅ "Login Berhasil!"
8. ESP32 LCD: ✅ "HELLO! [Nama User]"
```

---

## 🐛 **Troubleshooting**

### **Problem: ESP32 tidak connect WiFi**
**Solusi:**
- Pastikan SSID dan password benar
- Pastikan WiFi 2.4GHz (ESP32 tidak support 5GHz)
- Check Serial Monitor untuk error message

### **Problem: IP ESP32 berbeda dari 192.168.73.200**
**Solusi:**
- Check Static IP configuration di setup()
- Restart ESP32
- Check Serial Monitor: "⚠️ Static IP configuration failed!"

### **Problem: Web app tidak bisa diakses dari HP**
**Solusi:**
- Pastikan HP dan laptop di WiFi yang SAMA
- Pastikan firewall tidak block port 3000
- Test dari browser laptop dulu: http://localhost:3000

### **Problem: QR Login gagal**
**Solusi:**
- Test ESP32 HTTP server: http://192.168.73.200/
- Check Serial Monitor ESP32 untuk error
- Pastikan ESP32 IP di web app = 192.168.73.200

---

## 📊 **Network Diagram**

```
┌─────────────────────────────┐
│    WiFi Router              │
│    "JTI-POLINEMA-2G"        │
│    Gateway: 192.168.73.129  │
└──────────┬──────────────────┘
           │
           ├─────────────────────────┐
           │                         │
    ┌──────▼──────┐          ┌──────▼─────┐
    │   Laptop    │          │   ESP32    │
    │ 192.168.73  │          │ 192.168.73 │
    │    .134     │          │    .200    │
    │             │          │            │
    │ Web App     │          │ HTTP       │
    │ :3000       │          │ Server :80 │
    └─────────────┘          └────────────┘
```

---

## 📝 **Summary Checklist**

- [x] WiFi SSID: `JTI-POLINEMA-2G` ✅
- [x] WiFi Password: `jtifast!` ✅
- [x] Laptop IP: `192.168.73.134` ✅
- [x] ESP32 Static IP: `192.168.73.200` ✅
- [x] Gateway: `192.168.73.129` ✅
- [x] Subnet: `255.255.255.192` ✅
- [x] API Endpoint: `http://192.168.73.134:3000/api/iot/get-user` ✅
- [x] ESP32 IP di Web App: `192.168.73.200` ✅

**Status: ✅ SEMUA KONFIGURASI SUDAH SESUAI!**

---

## 🚀 **Next Steps**

1. Upload kode ESP32
2. Test HTTP server ESP32
3. Start web app (npm run dev)
4. Test QR login dari HP
5. Test transaksi botol

**Siap untuk testing!** 🎉
