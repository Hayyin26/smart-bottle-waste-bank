# 🚀 Quick Reference Guide - IoT Bank Sampah

Panduan cepat untuk operasi sehari-hari sistem IoT Bank Sampah Digital.

---

## 📋 Table of Contents
1. [Menjalankan Sistem](#menjalankan-sistem)
2. [Testing](#testing)
3. [Common Commands](#common-commands)
4. [Troubleshooting Cepat](#troubleshooting-cepat)
5. [Database Queries](#database-queries)

---

## 🎬 Menjalankan Sistem

### Start Web Server
```bash
# Install dependencies (pertama kali saja)
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Upload ESP32 Code
1. Buka Arduino IDE
2. File → Open → `iot-improved.ino`
3. Tools → Board → ESP32 Dev Module
4. Tools → Port → (pilih port ESP32)
5. Upload (Ctrl+U)

### Akses Dashboard
- Local: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- QR Login: `http://localhost:3000/qr-login`

---

## 🧪 Testing

### Test Mode Simple (1 User)
```cpp
// Di iot-improved.ino, set:
#define USE_QR_LOGIN false
```
1. Upload code
2. Masukkan botol
3. Cek dashboard → points bertambah

### Test Mode QR Login (Multi-User)
```cpp
// Di iot-improved.ino, set:
#define USE_QR_LOGIN true

// Ganti IP dengan IP komputer Anda:
const char* api_get_user = "http://192.168.1.100:3000/api/iot/get-user";
```
1. Upload code
2. Buka `/qr-login` di browser
3. Generate QR code
4. Scan dengan smartphone
5. Login/register
6. Masukkan botol
7. Cek dashboard

### Cek IP Komputer
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```
Cari IP yang dimulai dengan `192.168.x.x`

---

## 💻 Common Commands

### NPM Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
```

### Git Commands
```bash
git status           # Cek perubahan
git add .            # Stage semua perubahan
git commit -m "msg"  # Commit dengan message
git push             # Push ke remote
```

### Arduino Serial Monitor
```bash
# Baud rate: 115200
# Commands (untuk QR mode):
TOKEN:<token>        # Set session token
CHECK                # Check current session
CLEAR                # Clear session
```

---

## 🔧 Troubleshooting Cepat

### Problem: Web tidak bisa connect ke Supabase
```bash
# 1. Cek .env file
cat .env

# 2. Restart server
# Ctrl+C untuk stop, lalu:
npm run dev
```

### Problem: ESP32 tidak connect WiFi
```cpp
// Cek di Serial Monitor (115200 baud)
// Pastikan SSID dan password benar:
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";
```

### Problem: Points tidak update
```sql
-- Cek apakah trigger ada:
SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_update_points';

-- Jika tidak ada, jalankan:
-- fix-auto-update-points.sql
```

### Problem: Transaction error 409
```sql
-- Cek user_id ada di profiles:
SELECT id, full_name FROM profiles;

-- Pastikan user_id di ESP32 sama dengan yang ada di database
```

### Problem: QR Login tidak berfungsi
1. Cek IP di `api_get_user` sudah benar
2. Cek web server running di port 3000
3. Cek smartphone dan komputer di WiFi yang sama
4. Cek session token di Serial Monitor

---

## 🗄️ Database Queries

### Cek Total Users
```sql
SELECT COUNT(*) as total_users FROM profiles;
```

### Cek Total Transactions
```sql
SELECT COUNT(*) as total_transactions FROM transactions;
```

### Cek Total Points Distributed
```sql
SELECT SUM(points_earned) as total_points FROM transactions;
```

### Cek Transactions per User
```sql
SELECT 
  p.full_name,
  COUNT(t.id) as total_transactions,
  SUM(t.points_earned) as total_points
FROM profiles p
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.full_name
ORDER BY total_points DESC;
```

### Cek Recent Transactions
```sql
SELECT 
  t.id,
  p.full_name as user_name,
  t.points_earned,
  t.created_at
FROM transactions t
JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC
LIMIT 10;
```

### Cek Active Sessions
```sql
SELECT 
  s.session_token,
  p.full_name,
  s.device_id,
  s.expires_at
FROM iot_sessions s
JOIN profiles p ON s.user_id = p.id
WHERE s.expires_at > NOW()
ORDER BY s.expires_at DESC;
```

### Delete Expired Sessions
```sql
DELETE FROM iot_sessions 
WHERE expires_at < NOW();
```

### Reset User Points (Testing)
```sql
-- HATI-HATI! Ini akan reset semua points
UPDATE profiles SET total_points = 0;
```

### Delete All Transactions (Testing)
```sql
-- HATI-HATI! Ini akan hapus semua transaksi
DELETE FROM transactions;
```

### Create Test User
```sql
INSERT INTO profiles (id, full_name, role, total_points)
VALUES (
  gen_random_uuid(),
  'Test User',
  'user',
  0
);
```

---

## 📊 Monitoring

### Cek ESP32 Status
```bash
# Serial Monitor (115200 baud)
# Output yang normal:
✅ WiFi Connected!
IP Address: 192.168.x.x
SYSTEM READY
```

### Cek Web Server Status
```bash
# Terminal output:
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Cek Database Connection
```javascript
// Browser console (F12):
// Buka dashboard, cek console
// Tidak ada error = connection OK
```

---

## 🎯 Quick Actions

### Generate QR Code
1. Buka `http://localhost:3000/qr-login`
2. Klik "Generate QR Code"
3. Download atau Print

### Add New User (Manual)
1. Buka `http://localhost:3000/iot-auth?device=ESP32-BOTOL-01&token=test123`
2. Klik "Daftar"
3. Isi form dan submit

### View Dashboard
1. Buka `http://localhost:3000/dashboard`
2. Auto-refresh setiap 30 detik

### Check Leaderboard
1. Buka `http://localhost:3000/dashboard`
2. Scroll ke section "Top Users"

---

## 🔐 Environment Variables

### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### After Changing .env
```bash
# WAJIB restart server!
# Ctrl+C untuk stop
npm run dev
```

---

## 📱 Mobile Testing

### Test QR Login dari Smartphone
1. Pastikan smartphone dan komputer di WiFi yang sama
2. Cek IP komputer: `ipconfig` (Windows) atau `ifconfig` (Mac/Linux)
3. Buka browser di smartphone
4. Akses: `http://192.168.x.x:3000/qr-login`
5. Generate QR
6. Scan dengan camera app atau QR scanner
7. Login/register

---

## 🚨 Emergency Commands

### Reset Everything (Development Only!)
```sql
-- HATI-HATI! Ini akan hapus semua data
DELETE FROM transactions;
DELETE FROM iot_sessions;
UPDATE profiles SET total_points = 0;
```

### Restart ESP32
```bash
# Press EN button on ESP32
# Or re-upload code
```

### Clear Browser Cache
```bash
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
# Safari: Cmd+Option+E
```

---

## 📞 Support Checklist

Jika ada masalah, cek:
- [ ] Web server running? (`npm run dev`)
- [ ] ESP32 connected to WiFi? (Serial Monitor)
- [ ] Database connection OK? (Browser console)
- [ ] Environment variables correct? (`.env` file)
- [ ] User ID exists in database? (SQL query)
- [ ] Trigger installed? (`fix-auto-update-points.sql`)

---

## 🎓 Learning Resources

### Supabase
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs

### Next.js
- Docs: https://nextjs.org/docs

### ESP32
- Arduino IDE: https://www.arduino.cc/en/software
- ESP32 Docs: https://docs.espressif.com

---

**Last Updated:** 6 Mei 2026  
**Version:** 1.0
