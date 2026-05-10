# 🎯 Permanent QR System Guide

Sistem QR Code Permanen untuk IoT Bank Sampah Digital - **Print Sekali, Pakai Selamanya!**

---

## 📖 Konsep Sistem Baru

### ❌ Sistem Lama (Kompleks):
```
1. Admin generate QR dengan session token
2. Print QR
3. User scan → Login
4. Session expire setelah 5 menit
5. Harus generate QR baru lagi
6. User tidak tahu points mereka
```

### ✅ Sistem Baru (Permanent QR):
```
1. Admin generate QR SEKALI (tanpa session token)
2. Print dan tempel PERMANEN di device
3. User scan kapan saja → Login/Register
4. User redirect ke dashboard pribadi
5. User bisa cek points, history, leaderboard
6. IoT cek active session setiap 30 detik
7. QR tidak perlu diganti!
```

---

## 🎯 Keuntungan Sistem Baru

### Untuk Admin:
- ✅ Print QR sekali saja
- ✅ Tidak perlu generate ulang
- ✅ Tidak perlu manage session tokens
- ✅ Lebih simple dan praktis

### Untuk User:
- ✅ Scan QR kapan saja
- ✅ Punya dashboard pribadi
- ✅ Bisa cek points real-time
- ✅ Bisa lihat history transaksi
- ✅ Bisa lihat posisi di leaderboard
- ✅ User experience lebih baik

### Untuk IoT:
- ✅ Auto-detect user yang login
- ✅ Cek session aktif otomatis
- ✅ Support unlimited users
- ✅ Lebih reliable

---

## 🚀 Setup Guide

### 1. Generate Permanent QR Code

#### Buka halaman Device QR:
```
http://localhost:3000/device-qr
```

#### Steps:
1. Masukkan Device ID (contoh: `ESP32-BOTOL-01`)
2. Klik "Update" (QR akan auto-generate)
3. Download atau Print QR code
4. Tempel QR di device IoT

**QR Code ini PERMANEN!** Tidak perlu generate ulang! ✅

---

### 2. Upload ESP32 Code

#### File: `iot-permanent-qr.ino`

#### Konfigurasi:
```cpp
// WiFi
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";

// Device ID (harus sama dengan QR code!)
const char* device_id = "ESP32-BOTOL-01";

// API Endpoint
// Development:
const char* api_active_session = "http://192.168.1.100:3000/api/iot/active-session";

// Production (ganti dengan URL Vercel Anda):
// const char* api_active_session = "https://your-app.vercel.app/api/iot/active-session";
```

#### Upload:
1. Buka `iot-permanent-qr.ino` di Arduino IDE
2. Update konfigurasi di atas
3. Upload ke ESP32
4. Buka Serial Monitor (115200 baud)
5. Verify WiFi connected

---

### 3. Test Sistem

#### Test Flow:
```
1. ESP32 menyala → LCD: "SCAN QR CODE TO LOGIN"
2. User scan QR dengan smartphone
3. User login atau register
4. User redirect ke dashboard pribadi (/user)
5. ESP32 detect user (cek setiap 30 detik)
6. LCD: "HELLO! [Nama User]"
7. User masukkan botol
8. Points masuk ke akun user
9. User bisa cek dashboard kapan saja
```

---

## 🔄 Alur Sistem Detail

### 1. User Scan QR Code

```
User Smartphone
      │
      │ Scan QR
      ▼
┌─────────────────┐
│  /iot-auth      │
│  ?device=ESP32  │
└────────┬────────┘
         │
         │ Generate session token
         │
         ▼
┌─────────────────┐
│  Login/Register │
│  Form           │
└────────┬────────┘
         │
         │ Submit
         ▼
```

### 2. Save Session to Database

```
┌─────────────────────────────┐
│  iot_sessions table         │
├─────────────────────────────┤
│ session_token: abc123...    │
│ user_id: uuid               │
│ device_id: ESP32-BOTOL-01   │
│ expires_at: now + 5 min     │
└─────────────────────────────┘
```

### 3. Redirect to User Dashboard

```
User Browser
      │
      │ Auto redirect
      ▼
┌─────────────────┐
│  /user          │
│  Dashboard      │
├─────────────────┤
│ • Total Points  │
│ • Transactions  │
│ • Leaderboard   │
│ • Profile       │
└─────────────────┘
```

### 4. ESP32 Check Active Session

```
ESP32 (every 30 seconds)
      │
      │ HTTP GET
      ▼
┌──────────────────────────────┐
│  /api/iot/active-session     │
│  ?device=ESP32-BOTOL-01      │
└────────┬─────────────────────┘
         │
         │ Query database
         ▼
┌─────────────────────────────┐
│  Get latest active session  │
│  WHERE device_id = ESP32    │
│  AND expires_at > NOW()     │
│  ORDER BY expires_at DESC   │
│  LIMIT 1                    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Return user info:          │
│  - user_id                  │
│  - full_name                │
│  - total_points             │
└────────┬────────────────────┘
         │
         ▼
ESP32 LCD: "HELLO! [Name]"
```

### 5. User Insert Bottle

```
User
  │
  │ Insert bottle
  ▼
ESP32
  │
  │ Validate size
  ▼
┌─────────────────┐
│ POST /rest/v1/  │
│ transactions    │
├─────────────────┤
│ user_id: uuid   │
│ device_id: ESP32│
│ points: 10      │
└────────┬────────┘
         │
         ▼
Database Trigger
  │
  │ auto_update_points
  ▼
UPDATE profiles
SET total_points += 10
WHERE id = user_id
```

### 6. User Check Dashboard

```
User opens /user
      │
      ▼
┌─────────────────────────────┐
│  Fetch user data:           │
│  • Profile (points)         │
│  • Transactions (history)   │
│  • Leaderboard (ranking)    │
└─────────────────────────────┘
      │
      ▼
Display in dashboard
```

---

## 📱 User Dashboard Features

### 1. Stats Cards
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Points    │  │ Transactions    │  │ Your Rank       │
│                 │  │                 │  │                 │
│     150         │  │      15         │  │      #3         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 2. Recent Transactions
```
┌──────────────────────────────────────────┐
│ Recent Transactions                      │
├──────────────────────────────────────────┤
│ ✅ +10 Points  │ ESP32-BOTOL-01 │ 2 min │
│ ✅ +10 Points  │ ESP32-BOTOL-01 │ 5 min │
│ ✅ +10 Points  │ ESP32-BOTOL-01 │ 10 min│
└──────────────────────────────────────────┘
```

### 3. Leaderboard
```
┌──────────────────────────────────────────┐
│ Leaderboard                              │
├──────────────────────────────────────────┤
│ 🥇 #1  John Doe        │ 250 points     │
│ 🥈 #2  Jane Smith      │ 180 points     │
│ 🥉 #3  You (Bob)       │ 150 points ⭐  │
│    #4  Alice           │ 120 points     │
└──────────────────────────────────────────┘
```

---

## 🔧 API Endpoints

### 1. `/api/iot/active-session`

**Purpose:** ESP32 cek siapa user yang sedang login

**Method:** GET

**Parameters:**
- `device` (required): Device ID

**Response (Success):**
```json
{
  "user_id": "uuid",
  "full_name": "John Doe",
  "total_points": 150,
  "expires_at": "2026-05-06T10:30:00Z",
  "session_token": "abc123..."
}
```

**Response (No Active Session):**
```json
{
  "error": "No active session found"
}
```

**Usage in ESP32:**
```cpp
// Check every 30 seconds
if (millis() - lastSessionCheck > 30000) {
  if (getActiveSession()) {
    // User found, ready for transaction
    gateState = WAIT_BOTTLE;
  } else {
    // No user, show "SCAN QR"
    gateState = WAIT_USER;
  }
}
```

---

### 2. `/iot-auth`

**Purpose:** User login/register page

**Method:** GET

**Parameters:**
- `device` (required): Device ID
- `redirect` (optional): Redirect URL after login (default: `/user`)

**Example:**
```
https://your-app.vercel.app/iot-auth?device=ESP32-BOTOL-01
```

**Flow:**
1. User scan QR → Open this page
2. User login or register
3. Session saved to database
4. Redirect to `/user` dashboard

---

### 3. `/user`

**Purpose:** User personal dashboard

**Method:** GET

**Features:**
- Total points
- Transaction history
- Leaderboard with user highlight
- Profile info
- Logout button

**Protected:** Requires authentication

---

### 4. `/device-qr`

**Purpose:** Generate permanent QR code

**Method:** GET

**Features:**
- Input device ID
- Generate QR code
- Download PNG
- Print QR code

**For:** Admin only

---

## 🗄️ Database Schema

### Table: `iot_sessions`

```sql
CREATE TABLE iot_sessions (
  session_token TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  device_id TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_iot_sessions_device_expires 
ON iot_sessions(device_id, expires_at DESC);
```

**Purpose:** Store active user sessions for each device

**Cleanup:** Sessions expire after 5 minutes

---

## 🔐 Security

### Session Management:
- ✅ Session expires after 5 minutes
- ✅ Only latest session per device is active
- ✅ Old sessions automatically ignored
- ✅ User must re-scan QR after expiry

### Authentication:
- ✅ Supabase Auth for user login
- ✅ JWT tokens for API access
- ✅ Row Level Security (RLS) on database
- ✅ Protected user dashboard

### Data Privacy:
- ✅ Users only see their own data
- ✅ Transactions linked to user_id
- ✅ Leaderboard shows public data only

---

## 🧪 Testing

### Test 1: Generate QR Code
```
1. Open http://localhost:3000/device-qr
2. Enter device ID: ESP32-BOTOL-01
3. Click "Update"
4. Verify QR code generated
5. Download PNG
```

### Test 2: User Login Flow
```
1. Scan QR with smartphone
2. Should open /iot-auth page
3. Click "Daftar" (Register)
4. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
5. Submit
6. Should redirect to /user dashboard
7. Verify dashboard shows:
   - User name
   - 0 points (new user)
   - Empty transactions
   - Leaderboard
```

### Test 3: ESP32 Detection
```
1. Upload iot-permanent-qr.ino to ESP32
2. Open Serial Monitor (115200 baud)
3. Wait for WiFi connection
4. Should show: "Checking active session..."
5. After user login (Test 2):
   - ESP32 should detect user
   - LCD should show: "HELLO! Test User"
   - Serial: "Active user found!"
```

### Test 4: Transaction Flow
```
1. User logged in (Test 2)
2. ESP32 detected user (Test 3)
3. Insert bottle to device
4. ESP32 validates size
5. Gate opens
6. Bottle passes through
7. Gate closes
8. LCD: "+10 POINT"
9. Check Serial Monitor:
   - "Data Terkirim! Respon: 201"
10. Open /user dashboard
11. Verify:
    - Points increased to 10
    - New transaction in history
```

### Test 5: Session Expiry
```
1. User login
2. Wait 5 minutes
3. ESP32 should detect session expired
4. LCD: "SCAN QR CODE TO LOGIN"
5. User must scan QR again
```

---

## 🚨 Troubleshooting

### Problem: ESP32 tidak detect user

**Cek:**
```cpp
// 1. Cek API endpoint benar
const char* api_active_session = "http://192.168.1.100:3000/api/iot/active-session";

// 2. Cek device ID sama dengan QR
const char* device_id = "ESP32-BOTOL-01";

// 3. Cek WiFi connected
Serial.println(WiFi.localIP());

// 4. Cek response dari API
Serial.println(response);
```

**Solusi:**
- Pastikan web server running
- Pastikan ESP32 dan komputer di WiFi yang sama
- Pastikan device ID match
- Cek Serial Monitor untuk error

---

### Problem: User tidak redirect ke dashboard

**Cek:**
```typescript
// src/app/iot-auth/page.tsx
// Pastikan redirect parameter ada
const redirect = searchParams.get("redirect") || "/user";

// Pastikan setTimeout ada
setTimeout(() => {
  router.push(redirect);
}, 2000);
```

**Solusi:**
- Clear browser cache
- Cek browser console untuk error
- Pastikan /user page exists

---

### Problem: Dashboard tidak load data

**Cek:**
```typescript
// src/app/user/page.tsx
// Pastikan user authenticated
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  router.push("/iot-auth?redirect=/user");
  return;
}
```

**Solusi:**
- User harus login dulu
- Cek Supabase connection
- Cek browser console untuk error

---

### Problem: Points tidak update

**Cek:**
```sql
-- Pastikan trigger installed
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_auto_update_points';

-- Jika tidak ada, run:
-- fix-auto-update-points.sql
```

---

## 📊 Monitoring

### ESP32 Serial Monitor:
```
✅ WiFi Connected!
IP Address: 192.168.1.50
=================================
IoT Bank Sampah Digital
Mode: PERMANENT QR CODE
Device: ESP32-BOTOL-01
=================================

[API] Checking active session...
[API] Response: {"user_id":"...","full_name":"John Doe",...}
[Session] ✅ Active user found!
[Session] User ID: abc-123-def
[Session] Name: John Doe

[Supabase] Mengirim data:
{"user_id":"abc-123-def","device_id":"ESP32-BOTOL-01","points_earned":10}
[Supabase] ✅ Data Terkirim! Respon: 201
```

### Web Dashboard:
- Monitor user registrations
- Monitor transactions
- Monitor leaderboard changes
- Monitor session activity

---

## 🎯 Production Deployment

### 1. Deploy Web App (Vercel)
```bash
# Push to GitHub
git add .
git commit -m "Add permanent QR system"
git push origin main

# Deploy via Vercel
# Or use CLI:
vercel --prod
```

### 2. Update ESP32 Config
```cpp
// Change API endpoint to production
const char* api_active_session = "https://your-app.vercel.app/api/iot/active-session";
```

### 3. Generate Production QR
```
1. Open https://your-app.vercel.app/device-qr
2. Generate QR code
3. Print high quality (300 DPI)
4. Laminate for durability
5. Mount on device
```

### 4. Test Production
```
1. Scan QR with smartphone
2. Should open production URL
3. Login/register
4. Test transaction
5. Verify dashboard updates
```

---

## ✅ Checklist

### Setup:
- [ ] Generate permanent QR code
- [ ] Print and mount QR on device
- [ ] Upload iot-permanent-qr.ino to ESP32
- [ ] Update API endpoint in ESP32
- [ ] Test WiFi connection
- [ ] Test session detection

### Testing:
- [ ] User can scan QR
- [ ] User can login/register
- [ ] User redirects to dashboard
- [ ] ESP32 detects user
- [ ] Transaction works
- [ ] Points update correctly
- [ ] Dashboard shows data
- [ ] Leaderboard updates

### Production:
- [ ] Deploy web app to Vercel
- [ ] Update ESP32 with production URL
- [ ] Generate production QR
- [ ] Print and mount QR
- [ ] Test end-to-end flow
- [ ] Monitor for 24 hours

---

## 🎉 Kesimpulan

Sistem Permanent QR Code ini memberikan:

✅ **Simplicity** - Print QR sekali, pakai selamanya
✅ **User Experience** - Dashboard pribadi untuk setiap user
✅ **Scalability** - Support unlimited users
✅ **Reliability** - Auto-detect active sessions
✅ **Maintainability** - Tidak perlu manage session tokens

**Status:** Production Ready! 🚀

---

**Last Updated:** 6 Mei 2026  
**Version:** 2.0  
**Author:** Kiro AI Assistant
