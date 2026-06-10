# 🔍 QR Login Diagnostic Guide

## Problem Summary
User reports that QR code scanning for IoT login is not working.

---

## System Architecture

### QR Login Flow
```
1. User opens /iot-auth page
2. Web generates session_token (32-char hex)
3. Web saves session to iot_sessions table
4. Web generates QR code: http://{esp32_ip}/set-token?token={token}&device={deviceId}
5. User scans QR with phone
6. Phone opens URL → ESP32 HTTP server receives request
7. ESP32 calls /api/iot/get-user?token={token}&device={deviceId}
8. API validates session and returns user data
9. ESP32 stores user_id and allows transactions
```

---

## ✅ Checklist: Verify Each Step

### Step 1: Check if iot_sessions Table Exists

Run this in **Supabase SQL Editor**:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'iot_sessions'
);

-- If FALSE, create table
-- Run: create-iot-sessions-table.sql
```

**Expected**: `true`

---

### Step 2: Check if Session is Saved to Database

After scanning QR code, run this in **Supabase SQL Editor**:

```sql
SELECT 
  session_token,
  user_id,
  device_id,
  expires_at,
  expires_at > NOW() as is_valid,
  created_at
FROM iot_sessions
ORDER BY created_at DESC
LIMIT 5;
```

**Expected**: Recent session with your user_id and device_id

**If NO rows**: Session save failed in web app
- Check browser console for errors
- Verify SUPABASE_ANON_KEY is correct in .env
- Check RLS policies allow INSERT

---

### Step 3: Check ESP32 IP is Registered

Run this in **Supabase SQL Editor**:

```sql
SELECT 
  device_id,
  ip_address,
  last_seen,
  NOW() - last_seen as time_since_update
FROM iot_devices
WHERE device_id = 'ESP32-BOTOL-01';
```

**Expected**: Row exists with valid IP address (e.g., 192.168.1.14)

**If NO rows or NULL ip_address**:
- ESP32 failed to register IP
- Check ESP32 Serial Monitor for registration errors
- Verify iot_devices table has ip_address column (run fix-iot-devices-table.sql)

---

### Step 4: Check ESP32 HTTP Server is Running

Open browser and visit:
```
http://{esp32_ip}/
```

Replace `{esp32_ip}` with actual IP (e.g., http://192.168.1.14/)

**Expected**: HTML page showing device info

**If Failed**:
- ESP32 not on same network as phone
- ESP32 HTTP server not started
- Firewall blocking port 80
- IP address changed (ESP32 restarted)

---

### Step 5: Test QR URL Manually

Copy the QR code URL from web app and open in browser:
```
http://{esp32_ip}/set-token?token={32-char-token}&device=ESP32-BOTOL-01
```

**Expected**: Success page with user name

**If 404 Not Found**:
- ESP32 HTTP server doesn't have `/set-token` route
- Update ESP32 code (IOT/PBL/src/main.cpp has this)

**If 401 Unauthorized**:
- Session token invalid or expired
- Check iot_sessions table (Step 2)

**If Timeout**:
- Network issue
- ESP32 not accessible from phone
- Check ESP32 and phone on same WiFi

---

### Step 6: Check ESP32 Serial Monitor

Connect ESP32 to computer and open Serial Monitor (115200 baud).

Look for these messages:

#### On Boot:
```
✅ WiFi Connected!
📡 SSID: MERA
🌐 IP Address: 192.168.1.14
[HTTP] Server started on port 80
[Register] ✅ Device is now discoverable!
```

#### When QR is Scanned:
```
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Args: 2
[HTTP]   token: abc123...
[HTTP]   device: ESP32-BOTOL-01
[HTTP] ========================================
[HTTP] Token received from QR scan!
[API] Getting user from session...
[Session] ✅ User found!
[Session] Name: John Doe
```

**If NO HTTP Request**:
- QR code not scanned correctly
- Phone not opening URL
- Network issue

**If "Session not found"**:
- Token not in database (Step 2)
- Device ID mismatch

---

### Step 7: Check API Endpoint Accessibility

Test the API from browser:
```
https://smart-bottle-waste-bank.vercel.app/api/iot/get-user?token=TEST&device=ESP32-BOTOL-01
```

**Expected**: `{ "error": "Session not found or expired" }` (404)

This confirms the API is accessible.

**If Connection Refused / Timeout**:
- Vercel deployment failed
- API route not deployed
- Network issue

---

### Step 8: Check ESP32 Can Call API

In ESP32 Serial Monitor, send command:
```
CHECK
```

Look for response:
```
[Command] Checking session...
[API] Getting user from session...
[API] Response Code: 404
[Session] Session expired or not found
```

**If Connection Error**:
- ESP32 can't reach internet
- WiFi issue
- DNS resolution failed

---

## 🐛 Common Issues & Solutions

### Issue 1: QR Code Shows But Scan Does Nothing

**Symptoms**: QR code displays, but scanning doesn't redirect to ESP32

**Causes**:
1. Phone camera doesn't recognize QR code
2. QR URL format incorrect
3. Phone doesn't auto-open URLs

**Solutions**:
1. Use dedicated QR scanner app (not camera)
2. Check QR URL format: `http://192.168.1.14/set-token?token=...&device=...`
3. Manually copy URL and paste in browser

---

### Issue 2: ESP32 IP Not Found

**Symptoms**: Web app shows "Device not found. Please enter IP manually."

**Causes**:
1. ESP32 not registered IP yet
2. iot_devices table missing or no data
3. ESP32 not connected to WiFi

**Solutions**:
1. Wait 30 seconds after ESP32 boots
2. Run fix-iot-devices-table.sql
3. Check ESP32 Serial Monitor for WiFi connection
4. Manually enter IP address in web app

---

### Issue 3: 404 Not Found When Scanning QR

**Symptoms**: Browser shows "404 Not Found" after scanning

**Causes**:
1. ESP32 HTTP server not started
2. `/set-token` route not registered
3. ESP32 code outdated

**Solutions**:
1. Check Serial Monitor for "[HTTP] Server started on port 80"
2. Update ESP32 code to latest version (IOT/PBL/src/main.cpp)
3. Restart ESP32

---

### Issue 4: Session Not Saved to Database

**Symptoms**: iot_sessions table is empty

**Causes**:
1. Browser console shows Supabase error
2. RLS policies blocking INSERT
3. Table doesn't exist

**Solutions**:
1. Check browser console for errors (F12)
2. Run create-iot-sessions-table.sql
3. Verify SUPABASE_ANON_KEY in .env

---

### Issue 5: Token Valid But User Not Found

**Symptoms**: ESP32 says "Session not found" but token exists in database

**Causes**:
1. Device ID mismatch (case-sensitive)
2. Session expired
3. User profile deleted

**Solutions**:
1. Verify device_id in iot_sessions matches ESP32 device_id
2. Check expires_at > NOW()
3. Verify user exists in profiles table

---

## 🔧 Quick Tests

### Test 1: Manual Token Input (Bypass QR)

1. Login at `/iot-auth`
2. Click "🔧 Opsi Manual"
3. Copy token
4. In ESP32 Serial Monitor, send:
   ```
   TOKEN:abc123456789...
   ```
5. Check if login works

**If Works**: QR scanning issue, not auth issue
**If Fails**: Session/API issue

---

### Test 2: Direct API Call

In browser, open:
```
https://smart-bottle-waste-bank.vercel.app/api/iot/get-user?token={your-token}&device=ESP32-BOTOL-01
```

Replace `{your-token}` with actual token from database.

**Expected**: User data JSON

**If Works**: ESP32 network issue
**If Fails**: API/database issue

---

### Test 3: HTTP Server Test

Visit ESP32 root page:
```
http://{esp32_ip}/
```

**Expected**: Device info page

**If Works**: HTTP server OK, check /set-token route
**If Fails**: HTTP server not started or network issue

---

## 📋 Step-by-Step Debugging Process

1. ✅ Check iot_sessions table exists → Run SQL check
2. ✅ Login at /iot-auth → Check browser console
3. ✅ Verify session saved → Check iot_sessions table
4. ✅ Get ESP32 IP → Check iot_devices table or Serial Monitor
5. ✅ Test ESP32 HTTP → Visit http://{esp32_ip}/
6. ✅ Scan QR code → Watch Serial Monitor
7. ✅ Check HTTP request received → Serial Monitor logs
8. ✅ Check API call successful → Serial Monitor response
9. ✅ Verify user data returned → Serial Monitor user info

---

## 🚀 Next Steps

Based on where the process fails, refer to the specific issue solution above.

Most common issue: **ESP32 IP not accessible from phone** (different WiFi network or firewall)

---

## 📞 Support Commands

### ESP32 Serial Commands
```
TOKEN:<token>  - Manually set session token
CHECK          - Verify current session
CLEAR          - Clear session data
LOGOUT         - Delete session from database
TEST           - Test all sensors
SCAN           - Scan I2C devices
```

### SQL Diagnostic Queries
```sql
-- Check recent sessions
SELECT * FROM iot_sessions ORDER BY created_at DESC LIMIT 5;

-- Check device registration
SELECT * FROM iot_devices WHERE device_id = 'ESP32-BOTOL-01';

-- Check user profile
SELECT id, full_name, role, total_points FROM profiles WHERE id = '{user-id}';

-- Clean up old sessions
DELETE FROM iot_sessions WHERE expires_at < NOW();
```

---

## 📝 Files to Check

1. **Web App**:
   - `src/app/(user)/iot-auth/page.tsx` - QR login page
   - `src/app/api/iot/get-user/route.ts` - Session validation API
   - `src/app/api/iot/register-device/route.ts` - IP registration API
   - `.env` - Supabase keys

2. **ESP32**:
   - `IOT/PBL/src/main.cpp` - Main code with HTTP server
   - Check WiFi credentials (SSID, password)
   - Check API URLs (production vs local)

3. **Database**:
   - `create-iot-sessions-table.sql` - Create sessions table
   - `fix-iot-devices-table.sql` - Fix devices table
   - Check RLS policies in Supabase Dashboard

---

## ✅ Success Criteria

QR login working when:
1. ✅ Session saved to iot_sessions table
2. ✅ ESP32 IP registered to iot_devices table
3. ✅ ESP32 HTTP server accessible from phone
4. ✅ Scanning QR opens ESP32 URL
5. ✅ ESP32 receives HTTP request
6. ✅ ESP32 calls API successfully
7. ✅ API returns user data
8. ✅ ESP32 displays user name on LCD
9. ✅ User can insert bottle and earn points

---

**Created**: 2026-06-09
**Version**: 1.0
