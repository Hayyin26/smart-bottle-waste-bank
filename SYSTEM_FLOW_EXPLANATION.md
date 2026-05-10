# 🏗️ Alur Sistem Bank Sampah Digital IoT

## 📋 Daftar Isi
1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Komponen Utama](#komponen-utama)
3. [Alur Transaksi (Mode Simple)](#alur-transaksi-mode-simple)
4. [Alur Transaksi (Mode QR Login)](#alur-transaksi-mode-qr-login)
5. [Database Schema](#database-schema)
6. [Web Dashboard](#web-dashboard)
7. [Flow Diagram](#flow-diagram)

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        SISTEM BANK SAMPAH DIGITAL                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   ESP32      │      │  Supabase    │      │  Web Dashboard│
│   Device     │◄────►│  Database    │◄────►│  (Next.js)   │
│   (IoT)      │      │  (PostgreSQL)│      │              │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │                      │                      │
   Hardware              Cloud Storage          User Interface
   - Sensor              - Profiles             - Dashboard
   - Servo               - Transactions         - Leaderboard
   - LCD                 - IoT Devices          - Reports
   - Buzzer              - Sessions             - QR Generator
```

---

## 🧩 Komponen Utama

### 1. **Hardware (ESP32)**
- **Ultrasonic Sensors (2x):** Deteksi ukuran botol (tinggi & panjang)
- **Servo Motor:** Buka/tutup gate untuk botol masuk
- **LCD I2C (16x2):** Tampilkan status dan info user
- **Buzzer:** Feedback suara (valid/invalid)
- **WiFi Module:** Koneksi ke internet untuk kirim data

### 2. **Backend (Supabase)**
- **Database PostgreSQL:** Simpan semua data
- **REST API:** Endpoint untuk ESP32 dan web
- **Authentication:** Sistem login user
- **Real-time:** Auto-update data
- **Row Level Security (RLS):** Keamanan data

### 3. **Frontend (Next.js)**
- **Dashboard:** Monitoring real-time
- **Leaderboard:** Ranking user berdasarkan points
- **Reports:** Statistik dan analisis
- **QR Generator:** Generate QR untuk login
- **User Management:** Kelola user dan transaksi

---

## 🔄 Alur Transaksi (Mode Simple)

### **Skenario:** Satu user default untuk semua transaksi

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR MODE SIMPLE                              │
└─────────────────────────────────────────────────────────────────┘

1. USER DATANG
   └─► User bawa botol plastik ke device IoT

2. DETEKSI BOTOL
   ├─► Sensor ultrasonic baca tinggi botol
   ├─► Sensor ultrasonic baca panjang botol
   └─► ESP32 cek: apakah ukuran valid?

3. VALIDASI UKURAN
   ├─► Valid (8-25cm tinggi, 3-12cm panjang)
   │   ├─► LCD: "BOTOL VALID"
   │   ├─► Buzzer: 1x beep
   │   └─► Servo: Buka gate
   │
   └─► Invalid (di luar range)
       ├─► LCD: "UKURAN SALAH"
       ├─► Buzzer: 2x beep
       └─► Servo: Tetap tutup

4. BOTOL MASUK
   └─► User masukkan botol ke dalam device

5. DETEKSI BOTOL LEWAT
   ├─► Sensor deteksi botol sudah lewat
   └─► Servo: Tutup gate

6. KIRIM DATA KE SUPABASE
   ├─► ESP32 kirim via WiFi:
   │   {
   │     "user_id": "9db3ac82-...",  ← Default user
   │     "device_id": "ESP32-BOTOL-01",
   │     "points_earned": 10
   │   }
   │
   └─► Supabase terima data

7. DATABASE TRIGGER
   ├─► INSERT INTO transactions (otomatis)
   └─► TRIGGER: auto_update_user_points()
       └─► UPDATE profiles
           SET total_points = total_points + 10

8. KONFIRMASI
   ├─► LCD: "+10 POINT"
   ├─► LCD: "SUCCESS!"
   └─► Buzzer: 1x beep

9. DASHBOARD UPDATE
   ├─► Auto-refresh setiap 30 detik
   ├─► Leaderboard: Points bertambah
   ├─► Recent Transactions: Transaksi baru muncul
   └─► Stats: Total points update

10. SELESAI
    └─► Device siap untuk transaksi berikutnya
```

---

## 🎯 Alur Transaksi (Mode QR Login)

### **Skenario:** Setiap user punya akun sendiri

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR MODE QR LOGIN                            │
└─────────────────────────────────────────────────────────────────┘

=== FASE 1: SETUP (Dilakukan Admin) ===

1. ADMIN GENERATE QR CODE
   ├─► Buka web: /qr-login
   ├─► Input Device ID: "ESP32-BOTOL-01"
   ├─► Klik "Generate QR Code"
   ├─► System generate:
   │   - Session token (random 32 char)
   │   - URL: /iot-auth?device=ESP32-BOTOL-01&token=abc123...
   │   - QR code berisi URL tersebut
   └─► Print QR code dan tempel di device

=== FASE 2: USER LOGIN ===

2. USER SCAN QR CODE
   ├─► User scan QR dengan smartphone
   └─► Browser buka: /iot-auth?device=ESP32-BOTOL-01&token=abc123...

3. HALAMAN LOGIN/REGISTER
   ├─► User pilih: Login atau Register
   │
   ├─► Jika REGISTER:
   │   ├─► Input: Nama, Email, Password
   │   ├─► System create user di auth.users
   │   ├─► Trigger auto-create profile
   │   └─► User berhasil register
   │
   └─► Jika LOGIN:
       ├─► Input: Email, Password
       ├─► System verify credentials
       └─► User berhasil login

4. SAVE SESSION
   ├─► System simpan ke database:
   │   INSERT INTO iot_sessions {
   │     session_token: "abc123...",
   │     user_id: "user-uuid",
   │     device_id: "ESP32-BOTOL-01",
   │     expires_at: NOW() + 5 minutes
   │   }
   │
   └─► Halaman tampil: "Login Berhasil!"

=== FASE 3: ESP32 AMBIL USER ID ===

5. ESP32 POLLING API
   ├─► Setiap 30 detik, ESP32 request:
   │   GET /api/iot/get-user?token=abc123...&device=ESP32-BOTOL-01
   │
   ├─► API cek database:
   │   SELECT user_id, full_name FROM iot_sessions
   │   WHERE session_token = 'abc123...'
   │   AND expires_at > NOW()
   │
   └─► API return:
       {
         "user_id": "user-uuid",
         "full_name": "John Doe",
         "total_points": 50
       }

6. ESP32 SIMPAN USER INFO
   ├─► current_user_id = "user-uuid"
   ├─► current_user_name = "John Doe"
   ├─► LCD: "HELLO!"
   ├─► LCD: "John Doe"
   └─► Buzzer: 2x beep

=== FASE 4: TRANSAKSI ===

7. USER MASUKKAN BOTOL
   ├─► Sensor deteksi botol
   ├─► Validasi ukuran (sama seperti mode simple)
   └─► Gate buka jika valid

8. KIRIM DATA KE SUPABASE
   ├─► ESP32 kirim:
   │   {
   │     "user_id": "user-uuid",  ← User yang login!
   │     "device_id": "ESP32-BOTOL-01",
   │     "points_earned": 10
   │   }
   │
   └─► Supabase terima data

9. DATABASE TRIGGER
   ├─► INSERT INTO transactions
   └─► TRIGGER: auto_update_user_points()
       └─► UPDATE profiles
           SET total_points = total_points + 10
           WHERE id = 'user-uuid'  ← Points masuk ke user yang benar!

10. KONFIRMASI
    ├─► LCD: "+10 POINT"
    ├─► LCD: "SUCCESS!"
    ├─► LCD: "John Doe"
    └─► Buzzer: 1x beep

11. DASHBOARD UPDATE
    ├─► Leaderboard: John Doe points +10
    ├─► Recent Transactions: Tampil nama John Doe
    └─► Stats: Update real-time

=== FASE 5: SESSION EXPIRED ===

12. SESSION TIMEOUT (Setelah 5 menit)
    ├─► ESP32 polling API
    ├─► API return: "Session expired"
    ├─► ESP32 clear user info
    ├─► LCD: "SESSION EXPIRED"
    ├─► LCD: "SCAN QR AGAIN"
    └─► Kembali ke state WAIT_USER

13. USER BERIKUTNYA
    └─► User lain scan QR → Login → Transaksi
```

---

## 🗄️ Database Schema

```sql
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE TABLES                           │
└─────────────────────────────────────────────────────────────────┘

1. auth.users (Built-in Supabase)
   ├─ id (UUID) - Primary Key
   ├─ email (TEXT)
   ├─ encrypted_password (TEXT)
   └─ created_at (TIMESTAMP)

2. profiles (User profiles)
   ├─ id (UUID) - Primary Key, FK to auth.users
   ├─ full_name (TEXT)
   ├─ role (TEXT) - 'admin' or 'user'
   ├─ total_points (INTEGER) - Saldo points
   └─ updated_at (TIMESTAMP)

3. iot_devices (IoT devices)
   ├─ device_id (TEXT) - Primary Key
   ├─ location (TEXT)
   ├─ is_active (BOOLEAN)
   └─ created_at (TIMESTAMP)

4. transactions (Transaction history)
   ├─ id (BIGINT) - Primary Key
   ├─ user_id (UUID) - FK to auth.users
   ├─ device_id (TEXT) - FK to iot_devices
   ├─ points_earned (INTEGER)
   └─ created_at (TIMESTAMP)

5. iot_sessions (QR login sessions)
   ├─ id (BIGINT) - Primary Key
   ├─ session_token (TEXT) - Unique
   ├─ user_id (UUID) - FK to auth.users
   ├─ device_id (TEXT) - FK to iot_devices
   ├─ expires_at (TIMESTAMP)
   └─ created_at (TIMESTAMP)
```

### **Relasi Antar Tabel:**

```
auth.users (1) ──────► (N) profiles
    │                       │
    │                       │
    └──────► (N) transactions
                    │
                    │
iot_devices (1) ────┘

auth.users (1) ──────► (N) iot_sessions
                            │
                            │
iot_devices (1) ────────────┘
```

---

## 🌐 Web Dashboard

### **Halaman Utama:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        DASHBOARD                                 │
└─────────────────────────────────────────────────────────────────┘

1. /dashboard (Home)
   ├─ Stats Cards:
   │  ├─ Total Users
   │  ├─ Total Scans
   │  ├─ Points Distributed
   │  └─ IoT Devices
   │
   ├─ Recent Transactions (Real-time)
   │  └─ List 10 transaksi terakhir
   │
   ├─ Device Status
   │  └─ Status online/offline device
   │
   └─ Leaderboard (Top 5)
      └─ Ranking user berdasarkan points

2. /nasabah (Users)
   ├─ List semua user
   ├─ Total points per user
   ├─ Total transaksi per user
   └─ Filter & search

3. /transaksi (Transactions)
   ├─ List semua transaksi
   ├─ Filter by status
   ├─ Filter by date
   └─ Detail transaksi

4. /laporan (Reports)
   ├─ Statistik lengkap
   ├─ Grafik transaksi
   ├─ Top users
   └─ Device performance

5. /qr-login (QR Generator)
   ├─ Input Device ID
   ├─ Generate QR code
   ├─ Download QR
   └─ Print QR

6. /qr-generator (User QR)
   ├─ Generate QR per user
   ├─ Download QR user
   └─ Print QR user

7. /iot-auth (Login Page)
   ├─ Login form
   ├─ Register form
   └─ Session management
```

---

## 📊 Flow Diagram

### **1. Hardware Flow (ESP32)**

```
START
  │
  ├─► WiFi Connect
  │   └─► Success? ─No─► Retry
  │       └─Yes
  │
  ├─► Initialize Hardware
  │   ├─► LCD
  │   ├─► Servo
  │   ├─► Sensors
  │   └─► Buzzer
  │
  ├─► Check Mode
  │   ├─► Simple Mode?
  │   │   └─► State: WAIT_BOTTLE
  │   │
  │   └─► QR Login Mode?
  │       └─► State: WAIT_USER
  │
  └─► LOOP:
      │
      ├─► Read Sensors
      │   ├─► Height sensor
      │   └─► Length sensor
      │
      ├─► State Machine:
      │   │
      │   ├─► WAIT_USER (QR Login only)
      │   │   ├─► Check session token
      │   │   ├─► Poll API for user
      │   │   └─► If user found → WAIT_BOTTLE
      │   │
      │   ├─► WAIT_BOTTLE
      │   │   ├─► Detect bottle present?
      │   │   ├─► Validate size
      │   │   ├─► If valid → Open gate → WAIT_PASS
      │   │   └─► If invalid → REJECT_HOLD
      │   │
      │   ├─► WAIT_PASS
      │   │   ├─► Detect bottle gone?
      │   │   ├─► Send to Supabase
      │   │   ├─► Show success
      │   │   └─► Back to WAIT_BOTTLE
      │   │
      │   └─► REJECT_HOLD
      │       ├─► Wait 1.5 seconds
      │       └─► Back to WAIT_BOTTLE
      │
      └─► Delay 50ms
```

### **2. Database Trigger Flow**

```
ESP32 POST /rest/v1/transactions
  │
  ├─► Supabase REST API
  │   └─► INSERT INTO transactions
  │       (user_id, device_id, points_earned)
  │
  ├─► TRIGGER: trigger_auto_update_points
  │   └─► AFTER INSERT ON transactions
  │
  ├─► FUNCTION: auto_update_user_points()
  │   └─► UPDATE profiles
  │       SET total_points = total_points + NEW.points_earned
  │       WHERE id = NEW.user_id
  │
  └─► Response 201 Created
      └─► ESP32 show success
```

### **3. Dashboard Real-time Flow**

```
User Open Dashboard
  │
  ├─► Fetch Initial Data
  │   ├─► GET /api/profiles (users)
  │   ├─► GET /api/transactions (transactions)
  │   ├─► GET /api/devices (devices)
  │   └─► Render UI
  │
  ├─► Auto-refresh Timer (30 seconds)
  │   └─► Re-fetch all data
  │       └─► Update UI
  │
  └─► User Actions:
      ├─► Click Leaderboard → Show top users
      ├─► Click Transactions → Show history
      ├─► Click Reports → Show statistics
      └─► Click QR Generator → Generate QR
```

---

## 🔐 Security & Authentication

### **1. Supabase Authentication**
```
User Register/Login
  │
  ├─► Supabase Auth
  │   ├─► Create user in auth.users
  │   ├─► Hash password (bcrypt)
  │   └─► Generate JWT token
  │
  ├─► Trigger: handle_new_user()
  │   └─► Auto-create profile
  │
  └─► Return session token
```

### **2. Row Level Security (RLS)**
```
Database Access
  │
  ├─► Check RLS Policies
  │   ├─► profiles: Public read
  │   ├─► transactions: Public read/insert
  │   ├─► iot_devices: Public read
  │   └─► iot_sessions: Public read/insert/delete
  │
  └─► Allow/Deny access
```

### **3. API Security**
```
ESP32 Request
  │
  ├─► Headers:
  │   ├─► apikey: [ANON_KEY]
  │   ├─► Authorization: Bearer [ANON_KEY]
  │   └─► Content-Type: application/json
  │
  ├─► Supabase verify key
  │   └─► Valid? → Process request
  │       └─► Invalid? → 401 Unauthorized
  │
  └─► Response
```

---

## 📈 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION
   └─► Masukkan botol ke device

2. HARDWARE PROCESSING
   ├─► Sensor deteksi
   ├─► Validasi ukuran
   └─► Gate control

3. DATA TRANSMISSION
   ├─► ESP32 → WiFi → Internet
   └─► POST to Supabase API

4. DATABASE PROCESSING
   ├─► Insert transaction
   ├─► Trigger update points
   └─► Store in PostgreSQL

5. REAL-TIME UPDATE
   ├─► Database change detected
   └─► Dashboard auto-refresh

6. USER INTERFACE
   ├─► Leaderboard update
   ├─► Stats update
   └─► Transaction list update

7. FEEDBACK
   ├─► LCD show success
   ├─► Buzzer beep
   └─► User sees points in dashboard
```

---

## 🎯 Key Features

### **1. Real-time Monitoring**
- Dashboard auto-refresh setiap 30 detik
- Live transaction updates
- Real-time leaderboard

### **2. Multi-user Support**
- QR login system
- Individual user accounts
- Personal point tracking

### **3. Automated Processing**
- Auto-detect bottle size
- Auto-calculate points
- Auto-update database

### **4. Scalability**
- Support multiple devices
- Support unlimited users
- Cloud-based storage

### **5. Security**
- Encrypted passwords
- JWT authentication
- Row Level Security
- Session management

---

## 🚀 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                              │
└─────────────────────────────────────────────────────────────────┘

HARDWARE:
├─ ESP32 (Microcontroller)
├─ HC-SR04 (Ultrasonic Sensors)
├─ SG90 (Servo Motor)
├─ LCD I2C 16x2
└─ Buzzer

FIRMWARE:
├─ Arduino IDE
├─ C++ (Arduino)
├─ WiFi Library
├─ HTTPClient Library
└─ ArduinoJson Library

BACKEND:
├─ Supabase (BaaS)
├─ PostgreSQL (Database)
├─ REST API
└─ Triggers & Functions

FRONTEND:
├─ Next.js 14 (React Framework)
├─ TypeScript
├─ Tailwind CSS
├─ Shadcn UI Components
└─ QRCode Library

DEPLOYMENT:
├─ Vercel (Frontend)
├─ Supabase Cloud (Backend)
└─ ESP32 (Edge Device)
```

---

## 📝 Summary

Sistem Bank Sampah Digital IoT ini adalah sistem terintegrasi yang menggabungkan:

1. **Hardware IoT** untuk deteksi dan validasi botol
2. **Cloud Database** untuk penyimpanan data
3. **Web Dashboard** untuk monitoring dan manajemen
4. **QR Login System** untuk multi-user support
5. **Real-time Updates** untuk pengalaman user yang baik

Sistem ini memungkinkan:
- ✅ Otomasi proses penerimaan sampah
- ✅ Tracking points per user
- ✅ Monitoring real-time
- ✅ Scalable untuk banyak device dan user
- ✅ Secure dengan authentication dan RLS

**Cocok untuk:** Bank sampah, sekolah, kampus, perumahan, atau komunitas yang ingin mengelola sampah plastik dengan sistem digital yang modern dan efisien.
