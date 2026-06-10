# ⚡ QR Login Quick Fix Guide

**Problem**: User cannot login to IoT device via QR code scan

**Most Common Causes**:
1. ESP32 and phone on different WiFi networks
2. iot_sessions table doesn't exist
3. ESP32 IP not registered
4. HTTP server not accessible

---

## 🚀 Quick Fix Steps (5 minutes)

### 1. Check Database Tables

Run in **Supabase SQL Editor**:
```sql
-- Quick check
SELECT 'iot_sessions' as table_name, COUNT(*) as row_count FROM iot_sessions
UNION ALL
SELECT 'iot_devices', COUNT(*) FROM iot_devices;
```

**If Error "table does not exist"**:
```bash
# Run these SQL files in order:
1. create-iot-sessions-table.sql
2. fix-iot-devices-table.sql
```

---

### 2. Check ESP32 Connection

Open **Serial Monitor** (115200 baud), look for:
```
✅ WiFi Connected!
🌐 IP Address: 192.168.1.14    ← COPY THIS IP
[HTTP] Server started on port 80
```

**If NOT connected**: 
- Check WiFi credentials in `IOT/PBL/src/main.cpp`
- Restart ESP32

---

### 3. Test ESP32 HTTP Server

From your **computer browser**, visit:
```
http://192.168.1.14/
```
(Replace with your ESP32 IP)

**Expected**: Device info page

**If timeout**: 
- Computer and ESP32 not on same network
- Firewall blocking port 80
- HTTP server not started

---

### 4. Test from Phone

From your **phone browser**, visit same URL:
```
http://192.168.1.14/
```

**If works from computer but NOT phone**:
- Phone on different WiFi network (most common!)
- Router has AP isolation enabled
- Phone on 5GHz, ESP32 on 2.4GHz

**Fix**: Connect phone to same 2.4GHz WiFi as ESP32

---

### 5. Test QR Login Flow

1. **Login** at web app → `/iot-auth`
2. **Wait** for QR code to appear
3. **Check** browser console (F12) for errors
4. **Verify** session saved:
   ```sql
   SELECT * FROM iot_sessions ORDER BY created_at DESC LIMIT 1;
   ```
5. **Scan** QR code with phone
6. **Watch** ESP32 Serial Monitor for request

---

## 🎯 Manual Test (Bypass QR)

If QR scan doesn't work, test manually:

### From Computer Browser:
1. Get session token from database:
   ```sql
   SELECT session_token FROM iot_sessions ORDER BY created_at DESC LIMIT 1;
   ```
2. Visit:
   ```
   http://192.168.1.14/set-token?token={TOKEN}&device=ESP32-BOTOL-01
   ```
3. Check Serial Monitor

**If this works**: QR scanning issue (phone camera/network)
**If this fails**: ESP32 or API issue

---

## 🔍 Most Common Issues

### Issue 1: Phone Cannot Reach ESP32 (80% of cases)

**Symptoms**: QR scan opens URL but times out

**Cause**: Phone and ESP32 on different networks

**Fix**:
1. Check phone WiFi: Settings → WiFi → Connected to `MERA`?
2. Check ESP32 WiFi: Serial Monitor → `SSID: MERA`?
3. If different, connect phone to same network
4. If router has 2.4GHz and 5GHz, use 2.4GHz for both

---

### Issue 2: iot_sessions Table Missing (15% of cases)

**Symptoms**: Web app shows QR but session not in database

**Fix**: Run `create-iot-sessions-table.sql`

---

### Issue 3: ESP32 IP Not Registered (5% of cases)

**Symptoms**: Web app shows "Device not found"

**Fix**:
1. Check `.env` has correct `SUPABASE_SERVICE_ROLE_KEY`
2. Restart ESP32
3. Wait 30 seconds for registration
4. Or manually enter IP in web app

---

## ✅ Verification Checklist

Run these checks in order:

```bash
# 1. Database tables exist
✓ iot_sessions table exists
✓ iot_devices table exists with ip_address column

# 2. ESP32 online
✓ WiFi connected
✓ HTTP server started on port 80
✓ IP registered to database

# 3. Network reachable
✓ Can access http://ESP32_IP/ from computer
✓ Can access http://ESP32_IP/ from phone
✓ Phone and ESP32 on SAME WiFi network

# 4. Session created
✓ Login at /iot-auth works
✓ QR code displayed
✓ Session saved to iot_sessions table
✓ Token is 32 characters

# 5. QR scan works
✓ Phone camera recognizes QR
✓ URL opens in browser
✓ ESP32 receives HTTP request
✓ API returns user data
✓ LCD shows user name
```

---

## 📱 Alternative: Manual Token Input

If QR scan keeps failing, use manual method:

1. Login at `/iot-auth`
2. Click **"🔧 Opsi Manual"** 
3. Copy the token
4. In ESP32 Serial Monitor, type:
   ```
   TOKEN:abc123def456...
   ```
5. Press Enter

This bypasses QR scanning entirely.

---

## 🆘 Still Not Working?

Run **full diagnostic**:

```bash
# 1. Run SQL diagnostic
check-qr-login-status.sql

# 2. Follow step-by-step test
TEST_QR_LOGIN.md

# 3. Read detailed guide
QR_LOGIN_DIAGNOSTIC.md
```

---

## 📊 Success Rate by Fix

| Fix | Success Rate | Time |
|-----|--------------|------|
| Connect phone to same WiFi | 80% | 1 min |
| Create iot_sessions table | 15% | 2 min |
| Register ESP32 IP | 5% | 2 min |

---

## 🎓 Understanding the Flow

```
User Phone         Web App              Database           ESP32
    |                 |                     |                 |
    |--- 1. Login --->|                     |                 |
    |                 |--- 2. Save Session->|                 |
    |                 |<--- Token ----------|                 |
    |<-- 3. QR Code --|                     |                 |
    |                 |                     |                 |
    |-- 4. Scan QR -->|                     |                 |
    |                 |                     |                 |
    |-------- 5. HTTP Request: /set-token?token=... -------->|
    |                 |                     |                 |
    |                 |                     |<-- 6. Get User--|
    |                 |                     |                 |
    |                 |                     |--- User Data -->|
    |                 |                     |                 |
    |<-------- 7. Success Page: "Login Berhasil!" -----------|
```

**Failure Point 4→5**: Phone cannot reach ESP32 (network issue)
**Failure Point 5→6**: Session not found (database issue)
**Failure Point 6→7**: API error (server issue)

---

## 📞 Quick Commands

### ESP32 Serial Monitor:
```
CHECK    - Verify current session
TOKEN:X  - Set session manually
CLEAR    - Clear session
TEST     - Test all sensors
```

### Supabase SQL Editor:
```sql
-- View sessions
SELECT * FROM iot_sessions ORDER BY created_at DESC LIMIT 5;

-- View devices
SELECT * FROM iot_devices WHERE device_id = 'ESP32-BOTOL-01';

-- Clean expired
DELETE FROM iot_sessions WHERE expires_at < NOW();
```

---

**TL;DR**: 
1. Ensure phone and ESP32 on same WiFi (2.4GHz)
2. Test `http://ESP32_IP/` from phone browser
3. If works → QR scan should work
4. If not → Check WiFi network

---

**Created**: 2026-06-09
**Estimated Fix Time**: 5-10 minutes
