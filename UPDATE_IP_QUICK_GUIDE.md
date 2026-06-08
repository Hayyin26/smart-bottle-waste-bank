# 🔄 Quick Guide: Update IP Address

**Current Network:**
- **Laptop IP:** 192.168.1.7
- **ESP32 IP:** 192.168.1.200
- **Gateway:** 192.168.1.1

---

## ✅ Files Already Updated

### 1. **ESP32 Main Code** ✅
- `IOT/PBL/src/main.cpp`
  ```cpp
  const char* api_get_user = "http://192.168.1.7:3000/api/iot/get-user";
  ```

### 2. **ESP32 Arduino Code** ✅
- `ESP32_UPDATED_CODE.ino`
  ```cpp
  const char* api_get_user = "http://192.168.1.7:3000/api/iot/get-user";
  ```

### 3. **Web App IoT Auth** ✅
- `src/app/(user)/iot-auth/page.tsx`
  ```typescript
  const [esp32Ip, setEsp32Ip] = useState("192.168.1.200");
  ```

### 4. **Network Configuration** ✅
- `CURRENT_NETWORK_CONFIG.md` - Updated dengan network info terbaru

---

## 🚀 Next Steps

### 1️⃣ **Update ESP32 Static IP Configuration**

Tambahkan code ini di `main.cpp` atau `ESP32_UPDATED_CODE.ino` **SEBELUM** `WiFi.begin()`:

```cpp
// Static IP configuration
IPAddress local_IP(192, 168, 1, 200);      // ESP32 IP
IPAddress gateway(192, 168, 1, 1);          // Router gateway
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

// Configure static IP
if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
  Serial.println("❌ Static IP configuration failed!");
} else {
  Serial.println("✅ Static IP configured: 192.168.1.200");
}

// Then connect to WiFi
WiFi.begin(ssid, password);
```

**File reference:** `ESP32_STATIC_IP_CONFIG.cpp`

---

### 2️⃣ **Upload ESP32 Code**

```bash
# Using PlatformIO
cd IOT/PBL
pio run --target upload

# Or using Arduino IDE
# Open ESP32_UPDATED_CODE.ino
# Tools → Board → ESP32 Dev Module
# Tools → Port → [Select your ESP32 port]
# Upload
```

---

### 3️⃣ **Verify ESP32 Connection**

Buka Serial Monitor (115200 baud):

```
✅ WiFi Connected!
📡 SSID: [Your WiFi]
🌐 IP Address: 192.168.1.200
🚪 Gateway: 192.168.1.1
```

**⚠️ Important:** IP harus **192.168.1.200**!

---

### 4️⃣ **Test ESP32 HTTP Server**

Buka browser:
```
http://192.168.1.200/
```

Expected response:
```
🤖 IoT Bank Sampah - ESP32 Ready!
```

---

### 5️⃣ **Start Next.js with Network Access**

```bash
npm run dev
```

Check output shows:
```
- Local:   http://localhost:3000
- Network: http://192.168.1.7:3000  ← HARUS ADA!
```

---

### 6️⃣ **Test dari Browser**

**Laptop:**
```
http://192.168.1.7:3000
```

**HP (Connect ke WiFi yang sama):**
```
http://192.168.1.7:3000/iot-auth?device=ESP32-BOTOL-01
```

---

## 🧪 Test Checklist

- [ ] ESP32 connect dengan IP: `192.168.1.200`
- [ ] ESP32 HTTP server accessible: `http://192.168.1.200/`
- [ ] Next.js running dengan Network: `http://192.168.1.7:3000`
- [ ] Web app accessible dari laptop
- [ ] Web app accessible dari HP
- [ ] QR login flow working

---

## 🐛 Troubleshooting

### ❌ ESP32 dapat IP berbeda (misal: 192.168.1.150)

**Option 1:** Update web app
```typescript
// src/app/(user)/iot-auth/page.tsx
const [esp32Ip, setEsp32Ip] = useState("192.168.1.150"); // Ganti sesuai IP ESP32
```

**Option 2:** Set static IP di ESP32 (RECOMMENDED)
- Follow step 1 di atas
- Upload ulang code ke ESP32

---

### ❌ Next.js tidak show "Network:" line

**Solution:**
```bash
# Stop current dev server (Ctrl+C)
# Start with explicit host binding:
npm run dev -- -H 0.0.0.0

# Or update package.json:
"scripts": {
  "dev": "next dev -H 0.0.0.0"
}
```

---

### ❌ HP tidak bisa akses web app

**Checklist:**
- [ ] HP connect ke WiFi yang sama dengan laptop
- [ ] Firewall allow port 3000
- [ ] Test dari laptop dulu: `http://192.168.1.7:3000`
- [ ] Check laptop IP dengan: `ipconfig`

---

### ❌ API call dari ESP32 timeout

**Checklist:**
- [ ] Next.js running: `npm run dev`
- [ ] ESP32 IP benar di web app: `192.168.1.200`
- [ ] API endpoint benar di ESP32: `http://192.168.1.7:3000/api/iot/get-user`
- [ ] Test API dari browser: `http://192.168.1.7:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01`

---

## 📋 Quick Commands

```bash
# Check laptop IP
ipconfig

# Test ESP32 server
curl http://192.168.1.200/

# Test Next.js API
curl http://192.168.1.7:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01

# Start Next.js with network access
npm run dev

# Upload ESP32 code (PlatformIO)
cd IOT/PBL
pio run -t upload

# Monitor ESP32 serial output
pio device monitor
```

---

## 🎯 Success Criteria

✅ Serial Monitor shows:
```
✅ WiFi Connected!
IP Address: 192.168.1.200
[HTTP] Server started on port 80
```

✅ Browser shows:
```
http://192.168.1.200/ → ESP32 response
http://192.168.1.7:3000 → Next.js app
```

✅ QR Login works:
```
1. Open http://192.168.1.7:3000/iot-auth on phone
2. Login/Register
3. QR code appears
4. Scan QR with phone
5. ESP32 receives token
6. LCD shows user info
```

---

## 📚 Reference Files

- `CURRENT_NETWORK_CONFIG.md` - Complete network configuration
- `ESP32_STATIC_IP_CONFIG.cpp` - Static IP code examples
- `IOT/PBL/src/main.cpp` - Main ESP32 code
- `ESP32_UPDATED_CODE.ino` - Arduino version
- `src/app/(user)/iot-auth/page.tsx` - Web app IoT auth

---

**Status:** ✅ ALL FILES UPDATED TO IP 192.168.1.7

**Ready to test!** 🚀
