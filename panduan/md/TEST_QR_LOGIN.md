# 🧪 Test QR Login - Step by Step

Follow these steps in order to identify where the QR login fails.

---

## ⚙️ Prerequisites

1. ✅ ESP32 connected to WiFi
2. ✅ Web app running (local or production)
3. ✅ Supabase database configured
4. ✅ Phone on same WiFi network as ESP32

---

## 📋 Test Steps

### STEP 1: Verify Database Tables

**Action**: Run SQL check script

```bash
# In Supabase SQL Editor, run:
check-qr-login-status.sql
```

**Expected Output**:
```
✅ iot_sessions table exists
✅ iot_devices table exists with ip_address column
```

**If Failed**:
- Run `create-iot-sessions-table.sql`
- Run `fix-iot-devices-table.sql`

---

### STEP 2: Check ESP32 WiFi Connection

**Action**: Open Serial Monitor (115200 baud)

**Expected Output**:
```
✅ WiFi Connected!
📡 SSID: MERA
🌐 IP Address: 192.168.1.14
[HTTP] Server started on port 80
[Register] ✅ Device is now discoverable!
```

**Copy the IP Address** (e.g., 192.168.1.14)

**If Failed**:
- Check WiFi credentials in main.cpp
- Restart ESP32
- Check router allows DHCP

---

### STEP 3: Test ESP32 HTTP Server

**Action**: Open browser and visit:
```
http://{ESP32_IP}/
```

Example: `http://192.168.1.14/`

**Expected**: HTML page showing:
```
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 192.168.1.14
```

**If Failed**:
- Phone not on same WiFi network
- Firewall blocking port 80
- ESP32 HTTP server not started
- Try from computer browser first

---

### STEP 4: Verify Device IP Registration

**Action**: Run SQL query in Supabase SQL Editor:

```sql
SELECT 
  device_id,
  ip_address,
  last_seen,
  NOW() - last_seen as offline_time
FROM iot_devices
WHERE device_id = 'ESP32-BOTOL-01';
```

**Expected**: Row with your ESP32 IP address

**If NO Data**:
- ESP32 registration failed
- Check Serial Monitor for registration errors
- Verify SUPABASE_SERVICE_ROLE_KEY in .env
- Restart ESP32 and wait 30 seconds

---

### STEP 5: Login and Generate QR Code

**Action**: Open web app and go to:
```
http://localhost:3000/iot-auth
```

Or production:
```
https://smart-bottle-waste-bank.vercel.app/iot-auth
```

1. Enter email and password
2. Click "Login"
3. Wait for success page with QR code

**Expected**: 
- ✅ "Login Berhasil!" message
- QR code displayed
- Your name shown
- ESP32 IP displayed (if registered)

**If Failed**:
- Check browser console (F12) for errors
- Verify user email/password correct
- Check SUPABASE_ANON_KEY in .env

---

### STEP 6: Verify Session Saved to Database

**Action**: Run SQL query in Supabase SQL Editor:

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
LIMIT 1;
```

**Expected**: Recent row with:
- ✅ session_token = 32 characters
- ✅ user_id = your UUID
- ✅ device_id = 'ESP32-BOTOL-01'
- ✅ is_valid = true
- ✅ created_at = just now

**If NO Data**:
- Session save failed
- Check browser console for Supabase errors
- Run RLS policy check (in check-qr-login-status.sql)
- Verify SUPABASE_ANON_KEY allows INSERT

---

### STEP 7: Test API Endpoint Manually

**Action**: Get session_token from Step 6, then open browser:

```
https://smart-bottle-waste-bank.vercel.app/api/iot/get-user?token={YOUR_TOKEN}&device=ESP32-BOTOL-01
```

Replace `{YOUR_TOKEN}` with actual token from database.

**Expected JSON Response**:
```json
{
  "user_id": "abc-123-...",
  "full_name": "Your Name",
  "total_points": 0,
  "expires_at": "2026-07-09T..."
}
```

**If Error**:
- `404` = Session not found (check token spelling)
- `401` = Session expired (check expires_at)
- `500` = Server error (check API logs)

**If Works**: API is OK, continue to Step 8

---

### STEP 8: Scan QR Code

**Action**: Use phone camera to scan QR code from web app

**Expected**: 
1. Camera recognizes QR code
2. Shows URL: `http://192.168.1.14/set-token?token=...&device=ESP32-BOTOL-01`
3. Taps to open URL
4. Browser loads page

**If Failed**:
- Try QR scanner app (not camera)
- Manually copy URL and paste in browser
- Check QR code format (should be http:// not https://)

---

### STEP 9: Watch ESP32 Serial Monitor

**Action**: While scanning QR, watch Serial Monitor

**Expected Output**:
```
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Method: GET
[HTTP] Args: 2
[HTTP]   token: abc123def456...
[HTTP]   device: ESP32-BOTOL-01
[HTTP] ========================================
[HTTP] Token received from QR scan!
[API] Getting user from session...
[API] URL: https://smart-bottle-waste-bank.vercel.app/api/iot/get-user?token=...
[API] Response Code: 200
[API] Response: {"user_id":"...","full_name":"Your Name",...}
[Session] ✅ User found!
[Session] User ID: abc-123-...
[Session] Name: Your Name
```

**If NO HTTP Request**:
- Phone didn't open URL
- Network issue
- Try manual URL paste

**If HTTP 404**:
- `/set-token` route missing
- Update ESP32 code (IOT/PBL/src/main.cpp)

**If API Error**:
- Session expired
- Token mismatch
- API unreachable

---

### STEP 10: Check LCD Display

**Expected**: 
```
Line 1: HELLO!
Line 2: Your Name
```

**If Blank**:
- LCD not connected
- Check I2C wiring (SDA=21, SCL=22)
- Run: `SCAN` command in Serial Monitor

---

### STEP 11: Test Bottle Transaction

**Action**: Insert a plastic bottle

**Expected**:
1. Sensor detects bottle
2. LCD shows size and points
3. Gate opens
4. LED green turns on
5. Buzzer beeps 1x
6. Transaction saved to database

**If Failed**: Different issue (not QR login related)

---

## 🐛 Common Failure Points

### Failure at Step 1
**Problem**: Database tables missing
**Fix**: Run SQL creation scripts

### Failure at Step 2
**Problem**: ESP32 not connected to WiFi
**Fix**: Check WiFi credentials, restart ESP32

### Failure at Step 3
**Problem**: HTTP server not accessible
**Fix**: Check phone on same WiFi, test from computer first

### Failure at Step 4
**Problem**: Device IP not registered
**Fix**: Check SUPABASE_SERVICE_ROLE_KEY, restart ESP32

### Failure at Step 6
**Problem**: Session not saved
**Fix**: Check SUPABASE_ANON_KEY, check RLS policies

### Failure at Step 8
**Problem**: QR scan doesn't redirect
**Fix**: Use QR scanner app, manual URL paste

### Failure at Step 9
**Problem**: ESP32 doesn't receive request
**Fix**: Phone not on same network, firewall blocking

---

## 🎯 Quick Diagnosis

**Run this test from your computer browser**:

1. Get ESP32 IP from Serial Monitor
2. Get session token from database
3. Open this URL in browser:
   ```
   http://{ESP32_IP}/set-token?token={TOKEN}&device=ESP32-BOTOL-01
   ```

**If this works from computer but NOT from phone**:
- Phone on different WiFi network
- Phone WiFi has AP isolation enabled
- Router blocking phone-to-device communication

**If this doesn't work from computer**:
- ESP32 HTTP server issue
- Network configuration issue
- Firewall blocking

---

## ✅ Success Checklist

- [ ] iot_sessions table exists
- [ ] iot_devices table has ip_address column
- [ ] ESP32 connected to WiFi
- [ ] ESP32 HTTP server accessible from browser
- [ ] ESP32 IP registered in database
- [ ] Web login creates session in database
- [ ] QR code generated correctly
- [ ] Phone can scan QR code
- [ ] Phone can open QR URL
- [ ] ESP32 receives HTTP request
- [ ] ESP32 calls API successfully
- [ ] API returns user data
- [ ] LCD shows user name
- [ ] Bottle transaction works

---

## 📞 Help Commands

### ESP32 Serial Commands
```
CHECK    - Verify current session
CLEAR    - Clear session
LOGOUT   - Delete session from database
TEST     - Test sensors
SCAN     - Scan I2C devices
LCD      - Test LCD display
```

### Test Manual Login (Bypass QR)
1. Login at web app
2. Open browser console (F12)
3. Run this to get token:
   ```javascript
   // In web app console after login success
   console.log("Token:", sessionStorage.getItem('iot_session_token'));
   ```
4. In ESP32 Serial Monitor:
   ```
   TOKEN:abc123def456...
   ```

---

## 📋 Report Template

When asking for help, provide this information:

```
**Failed at Step**: [number]

**ESP32 Serial Output**:
[paste relevant logs]

**Browser Console Errors**:
[paste errors from F12]

**Database Query Results**:
[paste SQL results]

**Network Setup**:
- Phone WiFi: [SSID]
- ESP32 WiFi: [SSID]
- Same network: [Yes/No]
- ESP32 IP: [192.168.1.X]

**What I Tried**:
1. [action]
2. [action]
3. [action]
```

---

**Created**: 2026-06-09
**Last Updated**: 2026-06-09
