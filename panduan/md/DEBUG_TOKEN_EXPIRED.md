# 🐛 Debug: Token Expired Issue

## 📋 **Status Saat Ini:**

✅ ESP32 connect ke WiFi (IP: 192.168.73.150)  
✅ ESP32 terima token dari QR scan  
✅ ESP32 mulai call API  
❌ ESP32 stuck di "Getting user from session..."  
❌ Tidak ada response dari API  
❌ HP: "Login Gagal - Token tidak valid atau sudah expired"

---

## 🔍 **Kemungkinan Penyebab:**

### **1. Web App Tidak Running / Crash**
API tidak merespon karena web app tidak jalan.

### **2. Session Tidak Tersimpan di Database**
Token di-generate tapi tidak masuk database.

### **3. HTTP Request Gagal (Network Issue)**
ESP32 tidak bisa reach laptop API.

### **4. API Return Error Tapi ESP32 Tidak Log**
API return 404/401 tapi ESP32 tidak print response code.

---

## ✅ **Fix yang Sudah Dilakukan:**

### **1. Tambah Logging di ESP32 (main.cpp)**

**Sebelum:**
```cpp
Serial.println("[API] Getting user from session...");
int httpResponseCode = http.GET();
```

**Setelah:**
```cpp
Serial.println("[API] Getting user from session...");
Serial.println("[API] URL: " + url);
int httpResponseCode = http.GET();
Serial.println("[API] Response Code: " + String(httpResponseCode));
// + Error handling untuk response code < 0
// + Print response body untuk semua status
```

### **2. Tambah Logging di Web App (iot-auth/page.tsx)**

```typescript
console.log("[IoT Auth] Saving session to database...");
console.log("[IoT Auth] Token:", sessionToken);
console.log("[IoT Auth] User ID:", userId);
console.log("[IoT Auth] ✅ Session saved successfully!");
```

### **3. Tambah Logging di API (get-user/route.ts)**

```typescript
console.log("[API Get User] Request received");
console.log("[API Get User] Token:", sessionToken);
console.log("[API Get User] Querying database...");
console.log("[API Get User] Session found:", session);
console.log("[API Get User] Success! User:", profile.full_name);
```

---

## 🚀 **Cara Debug:**

### **Step 1: Upload ESP32 dengan Logging Baru**

```
Arduino IDE → Upload
```

**Expected Serial Monitor:**
```
[HTTP] Token received from QR scan!
[HTTP] Token: 7c06940d4bae53d164a78299065b59dd
[API] Getting user from session...
[API] URL: http://192.168.73.134:3000/api/iot/get-user?token=7c06940d...&device=ESP32-BOTOL-01
[API] Response Code: 200  ← CEK INI!
[API] Response: {"user_id":"...","full_name":"John Doe",...}
[Session] ✅ User found!
```

**Jika Response Code < 0:**
```
[API] Response Code: -1
[API] HTTP Error: connection refused
```
→ Web app tidak running atau firewall block!

**Jika Response Code = 404:**
```
[API] Response Code: 404
[Session] Session expired or not found
[Session] Response: {"error":"Session not found or expired"}
```
→ Session tidak ada di database!

### **Step 2: Check Web App Console**

**Restart web app:**
```bash
Ctrl+C
npm run dev
```

**Login lagi, check browser console (F12):**
```
[IoT Auth] Saving session to database...
[IoT Auth] Token: 7c06940d4bae53d164a78299065b59dd
[IoT Auth] User ID: 9db3ac82-dc1c-4f28-abe2-a8482986735f
[IoT Auth] Device ID: ESP32-BOTOL-01
[IoT Auth] ✅ Session saved successfully!  ← CEK INI!
[IoT Auth] QR Code URL: http://192.168.73.150/set-token?token=...
```

**Jika error:**
```
[IoT Auth] Error saving session: { code: '42501', message: 'permission denied' }
```
→ Supabase RLS policy block insert!

### **Step 3: Check API Server Console**

**Setelah scan QR, check terminal web app:**
```
[API Get User] Request received
[API Get User] Token: 7c06940d4bae53d164a78299065b59dd
[API Get User] Device: ESP32-BOTOL-01
[API Get User] Querying database...
[API Get User] Session found: { user_id: '...', expires_at: '...' }
[API Get User] Getting user profile...
[API Get User] Success! User: John Doe  ← CEK INI!
```

**Jika "Session not found":**
```
[API Get User] Session not found { code: 'PGRST116', ... }
```
→ Session tidak ada di database atau token salah!

---

## 🐛 **Troubleshooting Scenarios:**

### **Scenario 1: Response Code -1 (Connection Refused)**

**Serial Monitor:**
```
[API] Response Code: -1
[API] HTTP Error: connection refused
```

**Penyebab:**
- Web app tidak running
- Firewall block port 3000
- Web app tidak bind ke 0.0.0.0

**Solusi:**
```bash
# 1. Check web app running
# Terminal harus show:
- Network:      http://192.168.73.134:3000  ← HARUS ADA!

# 2. Test API dari browser laptop
http://192.168.73.134:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01

# Expected: {"error":"Session not found or expired"}
# (Error ini OK, yang penting API respond!)

# 3. Allow firewall (jika perlu)
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### **Scenario 2: Response Code 404 (Session Not Found)**

**Serial Monitor:**
```
[API] Response Code: 404
[Session] Session expired or not found
[Session] Response: {"error":"Session not found or expired"}
```

**Penyebab:**
- Session tidak tersimpan ke database
- Token salah (mismatch)
- Session sudah dihapus

**Solusi:**

**A. Check Browser Console:**
```
[IoT Auth] ✅ Session saved successfully!  ← HARUS ADA!
```

Jika tidak ada, berarti save session gagal!

**B. Check Supabase Database:**
```sql
-- Login ke Supabase Dashboard
-- SQL Editor → Run:

SELECT * FROM iot_sessions 
WHERE device_id = 'ESP32-BOTOL-01' 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected:**
```
session_token                     | user_id | device_id      | expires_at
7c06940d4bae53d164a78299065b59dd | ...     | ESP32-BOTOL-01 | 2026-06-05 15:30:00
```

**Jika empty**, berarti session tidak tersimpan!

**C. Check RLS Policy:**
```sql
-- Check policy di table iot_sessions
-- Pastikan ada policy untuk INSERT dan SELECT
```

### **Scenario 3: Response Code 401 (Expired)**

**Serial Monitor:**
```
[API] Response Code: 401
[Session] Session expired or not found
```

**Penyebab:**
- Token sudah expired (> 60 menit)
- expires_at salah

**Solusi:**
```sql
-- Check expires_at
SELECT session_token, expires_at, NOW() as current_time,
       (expires_at > NOW()) as is_valid
FROM iot_sessions
WHERE device_id = 'ESP32-BOTOL-01'
ORDER BY created_at DESC
LIMIT 1;
```

### **Scenario 4: Response Code 200 Tapi JSON Parse Error**

**Serial Monitor:**
```
[API] Response Code: 200
[API] Response: {"user_id":"...","full_name":"John Doe",...}
[API] JSON Parse Error: ...
```

**Penyebab:**
- Response terlalu besar (> 512 bytes)
- JSON format salah

**Solusi:**
```cpp
// Increase JSON buffer size
StaticJsonDocument<1024> doc;  // Dari 512 ke 1024
```

---

## 📝 **Debug Checklist:**

### **Before Scan QR:**
- [ ] Web app running: `npm run dev`
- [ ] "Network:" line ada: `http://192.168.73.134:3000`
- [ ] ESP32 connect: IP `192.168.73.150`
- [ ] ESP32 HTTP server running: `http://192.168.73.150/`

### **During Login:**
- [ ] Browser console: `[IoT Auth] ✅ Session saved successfully!`
- [ ] QR code muncul
- [ ] QR URL benar: `http://192.168.73.150/set-token?token=...`

### **After Scan QR:**
- [ ] ESP32 Serial: `[HTTP] Token received from QR scan!`
- [ ] ESP32 Serial: `[API] URL: http://192.168.73.134:3000/...`
- [ ] ESP32 Serial: `[API] Response Code: 200`
- [ ] Web app terminal: `[API Get User] Success! User: ...`
- [ ] ESP32 Serial: `[Session] ✅ User found!`
- [ ] ESP32 LCD: `HELLO! [Nama]`

---

## 🎯 **Expected Full Flow:**

### **1. Browser Console (Login):**
```
[IoT Auth] Saving session to database...
[IoT Auth] Token: 7c06940d4bae53d164a78299065b59dd
[IoT Auth] User ID: 9db3ac82-dc1c-4f28-abe2-a8482986735f
[IoT Auth] Device ID: ESP32-BOTOL-01
[IoT Auth] ✅ Session saved successfully!
[IoT Auth] QR Code URL: http://192.168.73.150/set-token?token=7c06940d...
```

### **2. ESP32 Serial Monitor (Scan QR):**
```
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Args: 2
[HTTP]   token: 7c06940d4bae53d164a78299065b59dd
[HTTP]   device: ESP32-BOTOL-01
[HTTP] ========================================
[HTTP] Token received from QR scan!
[HTTP] Token: 7c06940d4bae53d164a78299065b59dd
[API] Getting user from session...
[API] URL: http://192.168.73.134:3000/api/iot/get-user?token=7c06940d...&device=ESP32-BOTOL-01
[API] Response Code: 200
[API] Response: {"user_id":"9db3ac82-dc1c-4f28-abe2-a8482986735f","full_name":"John Doe","total_points":0,"expires_at":"2026-06-05T15:30:00.000Z"}
[Session] ✅ User found!
[Session] User ID: 9db3ac82-dc1c-4f28-abe2-a8482986735f
[Session] Name: John Doe
```

### **3. Web App Terminal (API Call):**
```
[API Get User] Request received
[API Get User] Token: 7c06940d4bae53d164a78299065b59dd
[API Get User] Device: ESP32-BOTOL-01
[API Get User] Querying database...
[API Get User] Session found: {
  user_id: '9db3ac82-dc1c-4f28-abe2-a8482986735f',
  expires_at: '2026-06-05T15:30:00.000Z'
}
[API Get User] Getting user profile...
[API Get User] Success! User: John Doe
```

### **4. ESP32 LCD:**
```
HELLO!
John Doe
```

### **5. Browser HP:**
```
✅ Login Berhasil!
Akun Anda telah terhubung dengan device IoT.
Nama: John Doe
Silakan masukkan botol untuk memulai transaksi.
```

---

## 🚀 **Next Actions:**

1. **Upload ESP32** dengan logging baru
2. **Restart web app**: `Ctrl+C → npm run dev`
3. **Login ulang** dari HP
4. **Scan QR** lagi
5. **Check Serial Monitor** untuk response code dan error
6. **Check Browser Console** (F12) untuk session save
7. **Check Terminal** web app untuk API logs

**Report hasil logging untuk debug lebih lanjut!** 🔍
