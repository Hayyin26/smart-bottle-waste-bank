# 🔐 Panduan Mode Operasi - QR Login vs Default User

## 🎯 Dua Mode Operasi

Sistem IoT Bank Sampah mendukung 2 mode operasi:

| Mode | Deskripsi | Use Case |
|------|-----------|----------|
| **QR Login** | User harus scan QR untuk login | Production, multi-user, keamanan tinggi |
| **Default User** | Semua transaksi pakai 1 user ID | Testing, demo, single-user |

---

## 🔧 Cara Mengubah Mode

### Di File: `ESP32_UPDATED_CODE.ino`

Cari bagian ini di awal kode:

```cpp
// --- MODE OPERASI ---
#define USE_QR_LOGIN true  // ← UBAH INI
```

---

## 🔐 Mode 1: QR Login (Recommended untuk Production)

### Aktifkan Mode Ini:
```cpp
#define USE_QR_LOGIN true  // ← Set true
```

### Cara Kerja:
```
1. ESP32 boot → LCD: "SCAN QR CODE TO LOGIN"
2. User scan QR dari web app
3. Web app kirim session token ke ESP32
4. ESP32 verifikasi token ke server
5. Jika valid → User bisa masukkan botol
6. Setelah transaksi → Auto logout
7. Kembali ke step 1
```

### Kelebihan:
- ✅ **Multi-user**: Setiap user punya akun sendiri
- ✅ **Keamanan tinggi**: Session token expire dalam 5 menit
- ✅ **Tracking akurat**: Tahu siapa yang masukkan botol
- ✅ **Auto-logout**: Otomatis logout setelah transaksi
- ✅ **Gamifikasi**: User bisa lihat poin mereka sendiri

### Kekurangan:
- ❌ Butuh koneksi internet
- ❌ User harus punya akun
- ❌ Lebih kompleks untuk setup

### Tampilan LCD:
```
Awal:
┌────────────────┐
│ SCAN QR CODE   │
│ TO LOGIN       │
└────────────────┘

Setelah login:
┌────────────────┐
│ HELLO!         │
│ John Doe       │
└────────────────┘

Siap pakai:
┌────────────────┐
│ John Doe       │
│ MASUKKAN BOTOL │
└────────────────┘
```

### Serial Monitor Commands:
```
TOKEN:<token>  - Set session token dari QR
CHECK          - Cek status session
LOGOUT         - Logout manual
CLEAR          - Clear session
```

### Contoh Flow:
```
1. User buka web app → Scan QR
2. Web app tampilkan: "Login Berhasil!"
3. ESP32 LCD: "HELLO! John Doe"
4. User masukkan botol → +10 poin
5. ESP32 LCD: "THANK YOU! John Doe"
6. Auto logout → LCD: "SCAN QR CODE"
```

---

## 🔓 Mode 2: Default User (Untuk Testing/Demo)

### Aktifkan Mode Ini:
```cpp
#define USE_QR_LOGIN false  // ← Set false
```

### Cara Kerja:
```
1. ESP32 boot → Langsung siap pakai
2. User langsung masukkan botol
3. Semua transaksi pakai user ID yang sama
4. Tidak perlu login/logout
```

### Kelebihan:
- ✅ **Simpel**: Tidak perlu login
- ✅ **Cepat**: Langsung pakai
- ✅ **Cocok untuk demo**: Tidak ribet
- ✅ **Tidak butuh internet**: Bisa offline (kecuali kirim data)

### Kekurangan:
- ❌ Semua transaksi pakai 1 user ID
- ❌ Tidak bisa tracking per user
- ❌ Tidak ada keamanan
- ❌ Tidak cocok untuk production

### Tampilan LCD:
```
Awal (langsung siap):
┌────────────────┐
│ SIAP MASUKKAN  │
│                │
└────────────────┘

Setelah transaksi:
┌────────────────┐
│ SUCCESS!       │
│ SEDANG 10PT    │
└────────────────┘
```

### Default User ID:
```cpp
const char* default_user_id = "9db3ac82-dc1c-4f28-abe2-a8482986735f";
```

⚠️ **PENTING**: Pastikan user ID ini ada di database Anda!

### Cara Cek User ID di Database:
```sql
-- Cek apakah user ID ada
SELECT id, full_name, email 
FROM profiles 
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';

-- Jika tidak ada, buat user baru
INSERT INTO profiles (id, full_name, email, role, total_points)
VALUES (
  '9db3ac82-dc1c-4f28-abe2-a8482986735f',
  'Default User',
  'default@example.com',
  'user',
  0
);
```

---

## 📊 Perbandingan Mode

| Fitur | QR Login | Default User |
|-------|----------|--------------|
| **Multi-user** | ✅ Ya | ❌ Tidak |
| **Keamanan** | ✅ Tinggi | ❌ Rendah |
| **Tracking** | ✅ Per user | ❌ Semua sama |
| **Setup** | ⚠️ Kompleks | ✅ Mudah |
| **Internet** | ⚠️ Wajib | ⚠️ Hanya untuk kirim data |
| **User Experience** | ⚠️ Harus scan QR | ✅ Langsung pakai |
| **Production Ready** | ✅ Ya | ❌ Tidak |
| **Demo/Testing** | ⚠️ Ribet | ✅ Cocok |

---

## 🎯 Rekomendasi Penggunaan

### Gunakan QR Login Jika:
- ✅ Production environment
- ✅ Multi-user (sekolah, kampus, komunitas)
- ✅ Butuh tracking per user
- ✅ Butuh keamanan
- ✅ Ingin gamifikasi (leaderboard, reward)

### Gunakan Default User Jika:
- ✅ Testing/development
- ✅ Demo untuk presentasi
- ✅ Single-user (rumah pribadi)
- ✅ Proof of concept
- ✅ Tidak butuh tracking detail

---

## 🔄 Cara Switch Mode

### Dari Default User → QR Login

**Step 1: Edit Kode**
```cpp
// Ubah dari:
#define USE_QR_LOGIN false

// Menjadi:
#define USE_QR_LOGIN true
```

**Step 2: Upload ke ESP32**
```
1. Buka Arduino IDE
2. Upload kode
3. ESP32 akan restart
```

**Step 3: Test**
```
1. LCD harus tampil: "SCAN QR CODE TO LOGIN"
2. Buka web app → Scan QR
3. Harus bisa login
```

---

### Dari QR Login → Default User

**Step 1: Pastikan Default User ID Ada**
```sql
-- Cek di Supabase
SELECT * FROM profiles 
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';
```

**Step 2: Edit Kode**
```cpp
// Ubah dari:
#define USE_QR_LOGIN true

// Menjadi:
#define USE_QR_LOGIN false
```

**Step 3: Upload ke ESP32**
```
1. Buka Arduino IDE
2. Upload kode
3. ESP32 akan restart
```

**Step 4: Test**
```
1. LCD harus tampil: "SIAP MASUKKAN"
2. Langsung masukkan botol
3. Harus bisa transaksi tanpa login
```

---

## 🐛 Troubleshooting

### Problem 1: Mode QR Login, tapi LCD "SIAP MASUKKAN"
**Penyebab**: `USE_QR_LOGIN` masih `false`
**Solusi**: 
```cpp
#define USE_QR_LOGIN true  // ← Pastikan true
```

### Problem 2: Mode Default User, tapi transaksi gagal
**Penyebab**: User ID tidak ada di database
**Solusi**:
```sql
-- Buat user default
INSERT INTO profiles (id, full_name, email, role, total_points)
VALUES (
  '9db3ac82-dc1c-4f28-abe2-a8482986735f',
  'Default User',
  'default@example.com',
  'user',
  0
);
```

### Problem 3: QR Login, tapi session expired terus
**Penyebab**: Session timeout terlalu pendek
**Solusi**:
```cpp
// Di kode, ubah dari 5 menit ke 30 menit
expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
```

### Problem 4: Ingin ganti default user ID
**Solusi**:
```cpp
// Ubah user ID di kode
const char* default_user_id = "USER-ID-BARU-ANDA";

// Pastikan user ID ini ada di database!
```

---

## 💡 Tips & Best Practices

### Untuk Development:
```cpp
// Gunakan default user untuk cepat testing
#define USE_QR_LOGIN false
```

### Untuk Production:
```cpp
// Wajib pakai QR login
#define USE_QR_LOGIN true
```

### Untuk Demo:
```cpp
// Gunakan default user agar tidak ribet
#define USE_QR_LOGIN false

// Tapi buat user dengan nama yang jelas
const char* default_user_id = "demo-user-id";
// Di database: full_name = "Demo User"
```

### Untuk Testing Multi-User:
```cpp
// Gunakan QR login
#define USE_QR_LOGIN true

// Buat beberapa akun test di web app
// Test dengan scan QR berbeda
```

---

## 📝 Checklist Switch Mode

### Checklist: Aktifkan QR Login
- [ ] Set `USE_QR_LOGIN = true`
- [ ] Upload ke ESP32
- [ ] Cek LCD: "SCAN QR CODE TO LOGIN"
- [ ] Test scan QR dari web app
- [ ] Test transaksi dengan login
- [ ] Test auto-logout setelah transaksi
- [ ] Test session expired (tunggu 5 menit)

### Checklist: Aktifkan Default User
- [ ] Cek user ID ada di database
- [ ] Set `USE_QR_LOGIN = false`
- [ ] Upload ke ESP32
- [ ] Cek LCD: "SIAP MASUKKAN"
- [ ] Test transaksi langsung (tanpa login)
- [ ] Cek database: semua transaksi pakai user ID yang sama

---

## 🔐 Security Notes

### QR Login Mode:
- ✅ Session token expire dalam 5 menit
- ✅ Auto-logout setelah transaksi
- ✅ Token dihapus dari database setelah digunakan
- ✅ Setiap user punya session sendiri

### Default User Mode:
- ⚠️ **TIDAK AMAN untuk production**
- ⚠️ Semua orang bisa pakai tanpa autentikasi
- ⚠️ Tidak ada tracking siapa yang pakai
- ⚠️ Hanya untuk testing/demo

---

## 📞 Quick Reference

### Aktifkan QR Login:
```cpp
#define USE_QR_LOGIN true
```

### Nonaktifkan QR Login (Default User):
```cpp
#define USE_QR_LOGIN false
```

### Ganti Default User ID:
```cpp
const char* default_user_id = "YOUR-USER-ID-HERE";
```

### Cek Mode Saat Ini:
```
Buka Serial Monitor → Lihat log saat boot:
- "Mode: QR LOGIN" → QR login aktif
- "Mode: DEFAULT USER" → Default user aktif
```

---

## 🎉 Summary

**Untuk Production**: 
```cpp
#define USE_QR_LOGIN true  // ← Gunakan ini
```

**Untuk Testing/Demo**: 
```cpp
#define USE_QR_LOGIN false  // ← Gunakan ini
```

**Untuk Menonaktifkan Default User**:
```cpp
#define USE_QR_LOGIN true  // ← Cukup set true
// default_user_id akan diabaikan
```

Semudah itu! 🚀
