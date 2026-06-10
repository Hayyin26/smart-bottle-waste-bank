# Perbaikan Code IoT ESP32

## ❌ Masalah di Code Lama

### 1. **API Key Salah**
```cpp
// ❌ SALAH - Ini bukan API key yang valid
const char* supabase_key = "sb_publishable_Xm9drrlGVmprn3M0dYTajA_5XAzlT3R";
```

**Masalah:** Key ini terlalu pendek dan bukan format JWT token yang benar.

**Solusi:** Gunakan ANON KEY yang benar dari Supabase:
```cpp
// ✅ BENAR - Gunakan ANON KEY (JWT Token)
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk";
```

### 2. **Endpoint Tidak Lengkap**
```cpp
// ❌ SALAH - Hanya URL dasar, tidak ada endpoint tabel
http.begin(supabase_url);
```

**Masalah:** Tidak mengarah ke tabel `transactions`.

**Solusi:** Tambahkan endpoint lengkap:
```cpp
// ✅ BENAR - Endpoint lengkap ke tabel transactions
String endpoint = String(supabase_url) + "/rest/v1/transactions";
http.begin(endpoint);
```

### 3. **Data Tidak Lengkap**
```cpp
// ❌ SALAH - Tidak ada user_id
String jsonPayload = "{\"device_id\":\"" + String(device_id) + 
                     "\", \"points_earned\":" + String(addedPoints) + "}";
```

**Masalah:** Tabel `transactions` memerlukan `user_id` (foreign key ke `auth.users`).

**Solusi:** Tambahkan `user_id`:
```cpp
// ✅ BENAR - Lengkap dengan user_id, device_id, dan points_earned
String jsonPayload = "{";
jsonPayload += "\"user_id\":\"" + String(userId) + "\",";
jsonPayload += "\"device_id\":\"" + String(device_id) + "\",";
jsonPayload += "\"points_earned\":" + String(addedPoints);
jsonPayload += "}";
```

## ✅ Perubahan yang Dilakukan

### 1. **API Key Diperbaiki**
- Menggunakan ANON KEY yang benar (JWT token format)
- Key ini sama dengan yang ada di file `.env` web dashboard

### 2. **Endpoint Lengkap**
- Menambahkan `/rest/v1/transactions` ke URL
- Sekarang mengarah langsung ke tabel yang benar

### 3. **Menambahkan User ID**
- Menambahkan parameter `default_user_id` 
- Fungsi `sendDataToSupabase()` sekarang menerima `userId`
- Data yang dikirim lengkap: `user_id`, `device_id`, `points_earned`

### 4. **Logging Lebih Baik**
- Menampilkan JSON payload yang dikirim
- Menampilkan response dari Supabase
- Menampilkan IP address saat WiFi connect

### 5. **LCD Display Lebih Informatif**
- Menampilkan status WiFi saat startup
- Menampilkan pesan yang lebih jelas di setiap state

## 🔧 Cara Menggunakan Code Baru

### 1. **Update User ID**
Ganti `default_user_id` dengan user ID yang ada di database Anda:

```cpp
// Ganti dengan user_id dari tabel profiles Anda
const char* default_user_id = "11111111-1111-1111-1111-111111111111";
```

**Cara mendapatkan User ID:**
1. Buka Supabase Dashboard
2. Pergi ke **Table Editor** → **profiles**
3. Copy salah satu `id` (format UUID)
4. Paste ke code IoT

### 2. **Upload ke ESP32**
1. Buka Arduino IDE atau PlatformIO
2. Copy code dari `iot-fixed.ino`
3. Upload ke ESP32
4. Buka Serial Monitor (115200 baud)

### 3. **Test Koneksi**
Saat ESP32 menyala, Anda akan melihat di Serial Monitor:
```
Connecting WiFi....
✅ WiFi Connected!
IP Address: 192.168.x.x
```

### 4. **Test Transaksi**
1. Masukkan botol yang valid (ukuran sesuai)
2. Tunggu botol masuk
3. Di Serial Monitor akan muncul:
```
[Supabase] Mengirim data:
{"user_id":"xxx","device_id":"ESP32-BOTOL-01","points_earned":10}
[Supabase] ✅ Data Terkirim! Respon: 201
```

### 5. **Cek di Dashboard**
1. Buka web dashboard: http://localhost:3000/dashboard
2. Refresh halaman
3. Transaksi baru akan muncul di "Recent Transactions"
4. Points user akan bertambah di Leaderboard

## 🎯 Integrasi dengan QR Code (Opsional)

Untuk sistem yang lebih canggih, Anda bisa menambahkan QR code scanner:

### Hardware Tambahan:
- QR Code Scanner Module (contoh: GM65 atau sejenisnya)
- Atau gunakan kamera ESP32-CAM

### Modifikasi Code:
```cpp
// Tambahkan fungsi scan QR
String scanQRCode() {
  // Code untuk scan QR dan return user_id
  // Contoh: return "user-uuid-dari-qr";
}

// Di loop(), sebelum accept bottle:
if (bottlePresent) {
  String userId = scanQRCode(); // Scan QR dulu
  if (userId != "") {
    // Lanjut validasi botol
    // Simpan userId untuk digunakan saat sendDataToSupabase()
  }
}
```

## 📊 Schema Database yang Digunakan

```sql
-- Tabel transactions
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),  -- ✅ Wajib ada
  device_id TEXT REFERENCES iot_devices(device_id),
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🐛 Troubleshooting

### Error: "Invalid API key"
- Pastikan menggunakan ANON KEY yang benar (JWT token)
- Cek di Supabase Dashboard → Settings → API

### Error: "404 Not Found"
- Pastikan endpoint lengkap: `/rest/v1/transactions`
- Cek nama tabel di database (harus `transactions`)

### Error: "Foreign key violation"
- `user_id` tidak ada di tabel `auth.users`
- Buat user dulu di Supabase Authentication
- Atau gunakan user_id yang sudah ada

### Data tidak muncul di dashboard
- Cek Serial Monitor untuk error
- Pastikan RLS policies sudah dijalankan (`fix-rls-policies.sql`)
- Refresh browser dengan Ctrl+F5

### WiFi tidak connect
- Cek SSID dan password
- Pastikan ESP32 dalam jangkauan WiFi
- Coba restart ESP32

## 📝 Catatan Penting

1. **API Key adalah JWT Token** - Harus format panjang dengan 3 bagian dipisah titik (.)
2. **User ID harus UUID** - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. **Device ID harus terdaftar** - Pastikan ada di tabel `iot_devices`
4. **Points otomatis update** - Trigger database akan update `total_points` di tabel `profiles`

## 🚀 Next Steps

1. Upload code baru ke ESP32
2. Test dengan memasukkan botol
3. Cek Serial Monitor untuk log
4. Cek dashboard untuk melihat data real-time
5. (Opsional) Tambahkan QR code scanner untuk multi-user
