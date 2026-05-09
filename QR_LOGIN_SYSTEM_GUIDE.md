# 🎯 Panduan Lengkap: Sistem QR Code Login untuk IoT

## 📋 Daftar Isi
1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Setup Database](#setup-database)
3. [Setup Web Dashboard](#setup-web-dashboard)
4. [Setup ESP32](#setup-esp32)
5. [Cara Penggunaan](#cara-penggunaan)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur Sistem

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   User      │      │  Web Server  │      │   ESP32     │
│ (Smartphone)│      │  (Next.js)   │      │   Device    │
└──────┬──────┘      └──────┬───────┘      └──────┬──────┘
       │                    │                     │
       │ 1. Scan QR Code    │                     │
       ├───────────────────>│                     │
       │                    │                     │
       │ 2. Login/Register  │                     │
       ├───────────────────>│                     │
       │                    │                     │
       │ 3. Save Session    │                     │
       │    to Database     │                     │
       │                    ├──────────────┐      │
       │                    │  Supabase DB │      │
       │                    │<─────────────┘      │
       │                    │                     │
       │ 4. Success Page    │                     │
       │<───────────────────┤                     │
       │                    │                     │
       │                    │ 5. Get User ID      │
       │                    │<────────────────────┤
       │                    │                     │
       │                    │ 6. Return User Data │
       │                    ├────────────────────>│
       │                    │                     │
       │                    │ 7. User Insert Bottle
       │                    │                     │
       │                    │ 8. Send Transaction │
       │                    │<────────────────────┤
       │                    │                     │
       │                    │ 9. Update Points    │
       │                    ├──────────────┐      │
       │                    │  Supabase DB │      │
       │                    │<─────────────┘      │
       │                    │                     │
       │ 10. View Dashboard │                     │
       ├───────────────────>│                     │
       │                    │                     │
```

---

## 🗄️ Setup Database

### 1. Buat Tabel `iot_sessions`

Jalankan SQL ini di **Supabase SQL Editor**:

```sql
-- File: create-iot-sessions-table.sql
-- Sudah tersedia di workspace Anda
```

Atau copy-paste:

```sql
CREATE TABLE IF NOT EXISTS public.iot_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES public.iot_devices(device_id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_iot_sessions_token ON public.iot_sessions(session_token);
CREATE INDEX idx_iot_sessions_device ON public.iot_sessions(device_id);

ALTER TABLE public.iot_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read iot_sessions"
  ON public.iot_sessions FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert iot_sessions"
  ON public.iot_sessions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public delete iot_sessions"
  ON public.iot_sessions FOR DELETE TO public USING (true);
```

### 2. Verifikasi Tabel Lain

Pastikan tabel ini sudah ada:
- ✅ `auth.users` (built-in Supabase)
- ✅ `profiles` (sudah dibuat sebelumnya)
- ✅ `iot_devices` (sudah dibuat sebelumnya)
- ✅ `transactions` (sudah dibuat sebelumnya)
- ✅ `iot_sessions` (baru dibuat)

---

## 🌐 Setup Web Dashboard

### 1. File yang Sudah Dibuat

Saya sudah membuat file-file ini:

```
src/
├── app/
│   ├── iot-auth/
│   │   └── page.tsx          # Halaman login/register untuk user
│   ├── qr-login/
│   │   └── page.tsx          # Halaman generate QR code
│   └── api/
│       └── iot/
│           └── get-user/
│               └── route.ts  # API untuk ESP32 ambil user ID
```

### 2. Install Dependencies (Jika Belum)

```bash
npm install qrcode
npm install @types/qrcode --save-dev
```

### 3. Test Web Dashboard

```bash
# Start dev server
npm run dev

# Buka browser:
# http://localhost:3000/qr-login     - Generate QR
# http://localhost:3000/iot-auth     - Login page (akan dibuka dari QR)
```

---

## 🤖 Setup ESP32

### 1. Hardware yang Dibutuhkan

**Opsi A: Dengan QR Scanner (Recommended)**
- ESP32
- QR Code Scanner Module (GM65, GM66, atau sejenisnya)
- Ultrasonic sensors (2x)
- Servo motor
- LCD I2C
- Buzzer

**Opsi B: Tanpa QR Scanner (Manual)**
- ESP32 (tanpa QR scanner)
- Ultrasonic sensors (2x)
- Servo motor
- LCD I2C
- Buzzer
- User scan QR dengan smartphone, token dikirim via Serial Monitor

### 2. Upload Code ESP32

**File:** `iot-with-qr-login.ino`

**Langkah:**

1. **Buka Arduino IDE**

2. **Update Konfigurasi:**

```cpp
// Line 8-9: WiFi credentials
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";

// Line 13: API endpoint - GANTI DENGAN DOMAIN ANDA
const char* api_get_user = "http://YOUR_DOMAIN/api/iot/get-user";
// Contoh:
// - Development: "http://192.168.1.100:3000/api/iot/get-user"
// - Production: "https://yourdomain.com/api/iot/get-user"
```

3. **Upload ke ESP32**

4. **Buka Serial Monitor** (115200 baud)

---

## 🚀 Cara Penggunaan

### Skenario 1: Dengan QR Scanner Module

#### A. Setup Awal

1. **Generate QR Code:**
   - Buka: http://localhost:3000/qr-login
   - Masukkan Device ID: `ESP32-BOTOL-01`
   - Klik "Generate QR Code"
   - Print atau download QR code

2. **Pasang QR Scanner di ESP32:**
   - Hubungkan QR scanner ke ESP32 (TX/RX)
   - QR scanner akan otomatis baca QR code
   - Token akan dikirim ke ESP32 via Serial

#### B. Flow Penggunaan

1. **User Scan QR Code** dengan smartphone
2. **Browser terbuka** ke halaman login (`/iot-auth`)
3. **User Login atau Register:**
   - Jika sudah punya akun: Login
   - Jika belum: Register (isi nama, email, password)
4. **Setelah login berhasil:**
   - Session disimpan ke database
   - Halaman menampilkan "Login Berhasil!"
5. **ESP32 otomatis ambil User ID:**
   - ESP32 polling API setiap 30 detik
   - Mendapat user_id dari session
   - LCD menampilkan nama user
6. **User masukkan botol:**
   - Botol valid → Gate buka
   - Transaksi dikirim ke Supabase
   - Points masuk ke akun user
7. **Selesai!**
   - User bisa lihat points di dashboard
   - Session expired setelah 5 menit atau setelah transaksi

### Skenario 2: Tanpa QR Scanner (Manual)

#### A. Setup Awal

1. **Generate QR Code** (sama seperti Skenario 1)

2. **User Scan QR dengan Smartphone:**
   - Scan QR code
   - Login/Register
   - Setelah berhasil, lihat URL di browser
   - Copy **token** dari URL (setelah `token=`)

3. **Kirim Token ke ESP32:**
   - Buka Serial Monitor
   - Ketik: `TOKEN:abc123def456...` (paste token yang dicopy)
   - Enter

#### B. Flow Penggunaan

1. **ESP32 terima token** via Serial
2. **ESP32 ambil User ID** dari API
3. **LCD menampilkan nama user**
4. **User masukkan botol**
5. **Transaksi dikirim** dengan user_id yang benar
6. **Selesai!**

---

## 🎨 Tampilan LCD

```
┌────────────────┐
│ SCAN QR CODE   │  <- State: WAIT_USER
│ TO LOGIN       │
└────────────────┘

┌────────────────┐
│ HELLO!         │  <- Setelah login
│ John Doe       │
└────────────────┘

┌────────────────┐
│ John Doe       │  <- State: WAIT_BOTTLE
│ MASUKKAN BOTOL │
└────────────────┘

┌────────────────┐
│ BOTOL VALID    │  <- Botol diterima
│ MASUKKAN...    │
└────────────────┘

┌────────────────┐
│ +10 POINT      │  <- Transaksi berhasil
│ SENDING...     │
└────────────────┘

┌────────────────┐
│ SUCCESS!       │  <- Selesai
│ John Doe       │
└────────────────┘
```

---

## 🔧 Troubleshooting

### 1. ESP32 tidak bisa ambil User ID

**Error:** `[API] Error: -1` atau `[API] Error: 404`

**Solusi:**
- Pastikan API endpoint benar (ganti `YOUR_DOMAIN`)
- Cek ESP32 dan server di network yang sama (development)
- Cek firewall tidak block port 3000
- Test API manual: `http://YOUR_IP:3000/api/iot/get-user?token=xxx&device=ESP32-BOTOL-01`

### 2. Session Not Found

**Error:** `[Session] Session expired or not found`

**Solusi:**
- User belum login via QR code
- Session sudah expired (> 5 menit)
- Token salah atau tidak match
- Generate QR baru dan scan ulang

### 3. User ID tidak ada di database

**Error:** `Foreign key constraint violation`

**Solusi:**
- Pastikan user sudah register via `/iot-auth`
- Cek tabel `profiles` ada data user
- Jalankan query: `SELECT * FROM profiles;`

### 4. QR Code tidak bisa di-scan

**Solusi:**
- Pastikan QR code cukup besar (minimal 300x300px)
- Print dengan kualitas tinggi
- Jangan ada lipatan atau kotoran di QR code
- Test scan dengan app QR scanner di smartphone

### 5. LCD tidak menampilkan nama user

**Solusi:**
- Cek Serial Monitor untuk error
- Pastikan `getUserFromSession()` return true
- Cek `current_user_name` tidak kosong
- Nama terlalu panjang? LCD hanya 16 karakter

---

## 📊 Monitoring & Debugging

### Serial Monitor Commands

```
TOKEN:<token>  - Set session token manual
CHECK          - Check current session status
CLEAR          - Clear session dan kembali ke WAIT_USER
```

### Serial Monitor Output

```
[WiFi] Connected!
IP Address: 192.168.1.100

[Command] Token set: abc123def456...
[API] Getting user from session...
[API] URL: http://192.168.1.100:3000/api/iot/get-user?token=abc123...
[API] Response: {"user_id":"xxx","full_name":"John Doe","total_points":50}
[Session] ✅ User found!
[Session] User ID: xxx-xxx-xxx
[Session] Name: John Doe

[Supabase] Mengirim data:
{"user_id":"xxx","device_id":"ESP32-BOTOL-01","points_earned":10}
[Supabase] ✅ Data Terkirim! Respon: 201
```

---

## 🎯 Keuntungan Sistem Ini

✅ **User-Friendly:** User hanya scan QR, tidak perlu input manual  
✅ **Secure:** Session token dengan expiry time  
✅ **Multi-User:** Satu device bisa digunakan banyak user  
✅ **Real-Time:** Data langsung masuk ke dashboard  
✅ **Scalable:** Bisa tambah device dengan QR berbeda  
✅ **Traceable:** Semua transaksi tercatat dengan user_id  

---

## 🔮 Pengembangan Selanjutnya

### 1. Tambah QR Scanner Hardware
- Gunakan module GM65 atau GM66
- Auto-scan QR code tanpa manual input
- Parsing token otomatis dari QR data

### 2. Tambah Display User Points
- Tampilkan current points di LCD
- Fetch dari API saat login

### 3. Tambah Logout Button
- Button fisik untuk logout
- Clear session otomatis

### 4. Tambah Sound/Voice
- "Selamat datang, John Doe"
- "Transaksi berhasil, +10 points"

### 5. Tambah LED Indicator
- Hijau: User logged in
- Merah: No user
- Biru: Processing transaction

---

## 📞 Support

Jika ada masalah:
1. Cek Serial Monitor untuk error log
2. Cek browser console untuk web error
3. Cek Supabase logs di Dashboard
4. Test API endpoint dengan Postman/curl

---

**Selamat mencoba! 🚀**
