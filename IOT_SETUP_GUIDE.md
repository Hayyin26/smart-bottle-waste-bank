# 🚀 Panduan Setup IoT - Bank Sampah Digital

## 📦 File Code: `iot-improved.ino`

Code ini support **2 MODE**:
1. **Mode Simple (Default User)** - Semua transaksi pakai 1 user ID
2. **Mode Advanced (QR Login)** - Setiap user scan QR untuk login

---

## ⚙️ MODE 1: Simple (Default User) - RECOMMENDED UNTUK MULAI

### Konfigurasi

Buka `iot-improved.ino`, cari baris 15:

```cpp
#define USE_QR_LOGIN false  // ✅ Set false untuk mode simple
```

Dan baris 18, ganti dengan user ID Anda:

```cpp
const char* default_user_id = "9db3ac82-dc1c-4f28-abe2-a8482986735f";
```

### Cara Dapat User ID

**Opsi A: Dari Supabase Dashboard**
1. Buka Supabase Dashboard
2. Klik **Table Editor** → **profiles**
3. Copy salah satu **id** (kolom pertama)

**Opsi B: Dari SQL Query**
```sql
SELECT id, full_name FROM profiles LIMIT 5;
```

### Upload & Test

1. **Upload ke ESP32**
2. **Buka Serial Monitor** (115200 baud)
3. **Lihat output:**
   ```
   ✅ WiFi Connected!
   Mode: DEFAULT USER
   Default User ID: 9db3ac82-dc1c-4f28-abe2-a8482986735f
   ```
4. **Masukkan botol** - Transaksi otomatis!

### Keuntungan Mode Simple
✅ Setup cepat (5 menit)  
✅ Tidak perlu QR code  
✅ Tidak perlu web server  
✅ Cocok untuk testing  
✅ Cocok untuk 1 user/keluarga  

### Kekurangan Mode Simple
❌ Semua transaksi masuk ke 1 akun  
❌ Tidak bisa tracking per user  
❌ Tidak ada login system  

---

## 🎯 MODE 2: Advanced (QR Login) - UNTUK PRODUCTION

### Konfigurasi

Buka `iot-improved.ino`, cari baris 15:

```cpp
#define USE_QR_LOGIN true  // ✅ Set true untuk mode QR login
```

Dan baris 21, ganti dengan IP komputer Anda:

```cpp
const char* api_get_user = "http://192.168.1.100:3000/api/iot/get-user";
//                                ^^^^^^^^^^^^^^
//                                IP komputer yang running web server
```

### Cara Dapat IP Komputer

**Windows:**
```bash
ipconfig
# Cari "IPv4 Address"
```

**Mac/Linux:**
```bash
ifconfig
# Atau: ip addr show
```

### Setup Database

Jalankan SQL ini di Supabase SQL Editor:

```sql
-- File: create-iot-sessions-table.sql
-- Sudah ada di workspace Anda
```

### Setup Web Server

```bash
# Install dependencies
npm install qrcode @types/qrcode

# Start server
npm run dev
```

### Generate QR Code

1. Buka: http://localhost:3000/qr-login
2. Device ID: `ESP32-BOTOL-01`
3. Klik "Generate QR Code"
4. Download/Print QR

### Upload & Test

1. **Upload ke ESP32**
2. **Buka Serial Monitor** (115200 baud)
3. **Lihat output:**
   ```
   ✅ WiFi Connected!
   Mode: QR LOGIN
   Commands:
     TOKEN:<token>  - Set session token
     CHECK          - Check current session
     CLEAR          - Clear session
   ```

### Cara Pakai (Manual - Tanpa QR Scanner)

1. **User scan QR** dengan smartphone
2. **User login/register** di halaman yang terbuka
3. **Copy token** dari URL browser (setelah `token=`)
4. **Kirim ke ESP32** via Serial Monitor:
   ```
   TOKEN:abc123def456...
   ```
5. **LCD tampil nama user**
6. **Masukkan botol** - Transaksi masuk ke akun user!

### Cara Pakai (Auto - Dengan QR Scanner Module)

1. **Pasang QR Scanner** ke ESP32 (TX/RX)
2. **User scan QR** di QR scanner
3. **Token otomatis** dikirim ke ESP32
4. **LCD tampil nama user**
5. **Masukkan botol** - Done!

### Keuntungan Mode QR Login
✅ Multi-user support  
✅ Tracking per user  
✅ Login system  
✅ Secure dengan session token  
✅ Professional  

### Kekurangan Mode QR Login
❌ Setup lebih kompleks  
❌ Perlu web server running  
❌ Perlu database setup  
❌ Perlu QR scanner (opsional)  

---

## 🔧 Konfigurasi Lengkap

### WiFi (Baris 8-9)

```cpp
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";
```

### Supabase (Baris 10-11)

```cpp
const char* supabase_url = "https://dsdtxqpzofrvzxpyktoo.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Device ID (Baris 12)

```cpp
const char* device_id = "ESP32-BOTOL-01";
```

Pastikan device ini ada di tabel `iot_devices`:

```sql
INSERT INTO iot_devices (device_id, location, is_active)
VALUES ('ESP32-BOTOL-01', 'Lokasi Device', true);
```

### Pin Configuration (Baris 26-31)

```cpp
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 15
#define PIN_SERVO 19
#define PIN_BUZZER 23
```

Sesuaikan dengan wiring ESP32 Anda.

### Ukuran Botol (Baris 38-41)

```cpp
#define HEIGHT_MIN_CM 8
#define HEIGHT_MAX_CM 25
#define LENGTH_MIN_CM 3
#define LENGTH_MAX_CM 12
```

Sesuaikan dengan ukuran botol yang diterima.

---

## 📊 Serial Monitor Output

### Mode Simple (Default User)

```
Connecting WiFi....
✅ WiFi Connected!
IP Address: 192.168.1.100

=================================
IoT Bank Sampah Digital
=================================
Mode: DEFAULT USER
Default User ID: 9db3ac82-dc1c-4f28-abe2-a8482986735f
=================================

[Supabase] Mengirim data:
{"user_id":"9db3ac82-dc1c-4f28-abe2-a8482986735f","device_id":"ESP32-BOTOL-01","points_earned":10}
[Supabase] ✅ Data Terkirim! Respon: 201
```

### Mode QR Login

```
Connecting WiFi....
✅ WiFi Connected!
IP Address: 192.168.1.100

=================================
IoT Bank Sampah Digital
=================================
Mode: QR LOGIN
Commands:
  TOKEN:<token>  - Set session token
  CHECK          - Check current session
  CLEAR          - Clear session
=================================

[Command] Token set: abc123def456...
[API] Getting user from session...
[Session] ✅ User found!
[Session] User ID: xxx-xxx-xxx
[Session] Name: John Doe

[Supabase] Mengirim data:
{"user_id":"xxx-xxx-xxx","device_id":"ESP32-BOTOL-01","points_earned":10}
[Supabase] ✅ Data Terkirim! Respon: 201
```

---

## 🎨 LCD Display

### Mode Simple

```
┌────────────────┐
│ SIAP MASUKKAN  │
│                │
└────────────────┘

┌────────────────┐
│ BOTOL VALID    │
│ MASUKKAN...    │
└────────────────┘

┌────────────────┐
│ +10 POINT      │
│ SENDING...     │
└────────────────┘

┌────────────────┐
│ SUCCESS!       │
│                │
└────────────────┘
```

### Mode QR Login

```
┌────────────────┐
│ SCAN QR CODE   │
│ TO LOGIN       │
└────────────────┘

┌────────────────┐
│ HELLO!         │
│ John Doe       │
└────────────────┘

┌────────────────┐
│ John Doe       │
│ MASUKKAN BOTOL │
└────────────────┘

┌────────────────┐
│ +10 POINT      │
│ SENDING...     │
└────────────────┘

┌────────────────┐
│ SUCCESS!       │
│ John Doe       │
└────────────────┘
```

---

## 🐛 Troubleshooting

### Error: WiFi tidak connect

**Cek:**
- SSID dan password benar?
- ESP32 dalam jangkauan WiFi?

**Fix:**
```cpp
const char* ssid = "SSID_YANG_BENAR";
const char* password = "PASSWORD_YANG_BENAR";
```

### Error: Data tidak terkirim (409)

**Cek Serial Monitor:**
```
[Supabase] ❌ Gagal! Error: 409
Foreign key constraint violation
```

**Penyebab:** User ID tidak ada di database

**Fix:**
1. Cek user ID di Supabase: `SELECT * FROM profiles;`
2. Ganti dengan user ID yang benar
3. Atau buat user baru di Authentication

### Error: API tidak bisa diakses (Mode QR Login)

**Cek:**
- Web server running? (`npm run dev`)
- IP address benar?
- ESP32 dan komputer di network yang sama?

**Fix:**
```cpp
// Ganti dengan IP yang benar
const char* api_get_user = "http://192.168.1.XXX:3000/api/iot/get-user";
```

**Test manual:**
```bash
curl "http://192.168.1.100:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01"
```

### Error: Session expired

**Penyebab:** Session timeout (default 5 menit)

**Fix:**
- Generate QR baru
- Scan ulang
- Login lagi

---

## 📋 Checklist Setup

### Mode Simple
- [ ] Update WiFi credentials
- [ ] Update Supabase URL & key
- [ ] Update default_user_id
- [ ] Set `USE_QR_LOGIN = false`
- [ ] Upload ke ESP32
- [ ] Test transaksi

### Mode QR Login
- [ ] Update WiFi credentials
- [ ] Update Supabase URL & key
- [ ] Update API endpoint (IP address)
- [ ] Set `USE_QR_LOGIN = true`
- [ ] Jalankan `create-iot-sessions-table.sql`
- [ ] Install npm packages: `npm install qrcode`
- [ ] Start web server: `npm run dev`
- [ ] Generate QR code di `/qr-login`
- [ ] Upload ke ESP32
- [ ] Test login & transaksi

---

## 🎯 Rekomendasi

### Untuk Testing/Development
→ **Gunakan Mode Simple**
- Setup cepat
- Tidak perlu web server
- Fokus ke hardware dulu

### Untuk Production/Demo
→ **Upgrade ke Mode QR Login**
- Professional
- Multi-user
- Tracking per user

### Upgrade Path
1. Mulai dengan Mode Simple
2. Test hardware & sensor
3. Pastikan transaksi berhasil
4. Setup database untuk QR login
5. Setup web server
6. Generate QR code
7. Switch ke Mode QR Login
8. Test dengan multiple users

---

## 📞 Need Help?

1. **Cek Serial Monitor** untuk error log
2. **Baca dokumentasi:**
   - `QR_SYSTEM_SUMMARY.md` - Ringkasan QR system
   - `QR_LOGIN_SYSTEM_GUIDE.md` - Panduan lengkap QR login
3. **Test API** dengan curl/Postman
4. **Cek Supabase logs** di Dashboard

---

**Good luck! 🚀**
