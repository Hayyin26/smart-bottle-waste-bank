# 🎯 Auto-Login dengan QR Code - Implementation Guide

## 🎨 Konsep:

```
┌─────────────┐
│  User HP    │
│  (Web App)  │
└──────┬──────┘
       │ 1. Login
       │ 2. Scan QR
       │ 3. Kirim token via HTTP
       ▼
┌─────────────┐
│   ESP32     │
│ HTTP Server │
└─────────────┘
```

---

## 📱 **Flow User:**

```
1. User buka web app di HP
   http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01

2. Login/Register

3. Web app tampilkan:
   ┌─────────────────────┐
   │  Login Berhasil!    │
   │                     │
   │  ┌───────────────┐  │
   │  │  QR CODE      │  │
   │  │  [████████]   │  │
   │  │               │  │
   │  └───────────────┘  │
   │                     │
   │  Scan QR untuk     │
   │  login ke device   │
   └─────────────────────┘

4. User scan QR dengan HP

5. HP otomatis kirim token ke ESP32

6. ESP32 terima token → Auto-login ✅

7. LCD tampil: "HELLO! [Name]"
```

---

## 🔧 **Implementasi:**

### **Part 1: ESP32 HTTP Server**

Tambahkan di ESP32:

```cpp
#include <WebServer.h>

// Create HTTP server on port 80
WebServer server(80);

// Handler untuk terima token
void handleSetToken() {
  if (server.hasArg("token")) {
    String token = server.arg("token");
    
    Serial.println("[HTTP] Token received: " + token);
    
    // Set session token
    session_token = token;
    
    // Verify token
    if (getUserFromSession()) {
      server.send(200, "application/json", "{\"success\":true,\"message\":\"Login successful\"}");
      
      // Update LCD
      gateState = WAIT_BOTTLE;
      lcdPrintLine(0, "HELLO!");
      lcdPrintLine(1, current_user_name.substring(0, 16));
      buzzShort(2);
    } else {
      server.send(401, "application/json", "{\"success\":false,\"message\":\"Invalid token\"}");
    }
  } else {
    server.send(400, "application/json", "{\"success\":false,\"message\":\"Token required\"}");
  }
}

void setup() {
  // ... existing setup code ...
  
  // Setup HTTP server
  server.on("/set-token", HTTP_POST, handleSetToken);
  server.begin();
  
  Serial.println("[HTTP] Server started on port 80");
  Serial.print("[HTTP] Access at: http://");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ... existing loop code ...
  
  // Handle HTTP requests
  server.handleClient();
}
```

---

### **Part 2: Web App QR Code**

Update `src/app/(user)/iot-auth/page.tsx`:

```typescript
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';

export default function IotAuthPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  async function saveIotSession(userId: string) {
    try {
      // ... existing code ...
      
      // Generate QR code URL
      const esp32Ip = "192.168.100.53"; // IP ESP32 (sama dengan komputer)
      const qrData = `http://${esp32Ip}/set-token?token=${sessionToken}`;
      
      // Generate QR code image
      const qrImage = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrImage);
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Error:", err);
    }
  }
  
  if (success) {
    return (
      <div className="success-screen">
        <h1>Login Berhasil!</h1>
        
        {/* QR Code */}
        <div className="qr-container">
          <img src={qrCodeUrl} alt="QR Code" />
          <p>Scan QR untuk login ke device</p>
        </div>
        
        {/* Manual option (backup) */}
        <details>
          <summary>Atau kirim manual</summary>
          <code>TOKEN:{sessionToken}</code>
        </details>
      </div>
    );
  }
  
  // ... rest of component
}
```

---

### **Part 3: Install Dependencies**

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

---

## 🎯 **Flow Lengkap:**

### **1. User Login di HP:**
```
http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
→ Login
→ QR code muncul
```

### **2. User Scan QR:**
```
QR berisi: http://192.168.100.53/set-token?token=abc123...
```

### **3. HP Buka URL:**
```
HP otomatis buka URL di browser
→ Kirim POST request ke ESP32
→ ESP32 terima token
```

### **4. ESP32 Auto-Login:**
```
[HTTP] Token received: abc123...
[API] Getting user from session...
[Session] ✅ User found!
[Session] Name: Test User
```

### **5. LCD Update:**
```
┌────────────────┐
│ HELLO!         │
│ Test User      │
└────────────────┘
```

---

## 🚀 **Kelebihan Solusi Ini:**

1. ✅ **User-friendly** - Tinggal scan QR
2. ✅ **Cepat** - < 3 detik
3. ✅ **Tidak perlu Serial Monitor** - Production ready
4. ✅ **Tidak perlu copy-paste** - Otomatis
5. ✅ **Tidak butuh hardware tambahan** - Hanya software
6. ✅ **Works offline** - Tidak perlu internet (hanya WiFi lokal)

---

## 🔄 **Alternative: WebSocket (Real-time)**

Untuk yang lebih advanced:

```
1. User login di web app
2. Web app kirim token via WebSocket ke server
3. Server forward ke ESP32 via WebSocket
4. ESP32 terima token real-time
5. Auto-login instant ✅
```

**Kelebihan:**
- ✅ Real-time (instant)
- ✅ Tidak perlu scan QR
- ✅ Bi-directional communication

**Kekurangan:**
- ❌ Lebih kompleks
- ❌ Butuh WebSocket server

---

## 📊 **Perbandingan Metode:**

| Metode | Speed | UX | Complexity | Hardware |
|--------|-------|----|-----------| ---------|
| **QR Code** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | None |
| **NFC/RFID** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | RC522 |
| **Bluetooth** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | None |
| **Polling** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | None |
| **WebSocket** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | None |
| **Manual** | ⭐ | ⭐ | ⭐ | None |

---

## 🎯 **Rekomendasi:**

### **Untuk Production:**
1. **QR Code** (Best balance)
2. **NFC/RFID** (Jika budget ada)
3. **WebSocket** (Jika butuh real-time)

### **Untuk Development/Testing:**
- Manual copy-paste (current) ✅

---

## 💡 **Next Steps:**

Mau saya implementasikan QR Code auto-login?

Saya bisa buatkan:
1. ✅ ESP32 HTTP server code
2. ✅ Web app QR code generator
3. ✅ Complete integration
4. ✅ Testing guide

Atau mau pakai metode lain (NFC/WebSocket)?
