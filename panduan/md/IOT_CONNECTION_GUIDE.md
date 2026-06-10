# 🔧 Panduan Koneksi IoT & Troubleshooting

## 🐛 Problem 1: Profile Creation Error

### Error Message:
```
Profile creation error: {}
```

### Penyebab:
1. RLS Policy terlalu ketat
2. Duplicate key (user sudah ada)
3. Missing permissions

### Solusi:
Run file: **`fix-profile-creation-error.sql`** di Supabase SQL Editor

---

## 🔌 Problem 2: Tidak Terhubung ke IoT

### Cara Menghubungkan Web App ke ESP32:

#### **Step 1: Login di Web App**
```
1. Buka: http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
2. Login atau Register
3. Setelah berhasil, akan muncul kotak kuning dengan token
4. Klik "📋 Copy Token"
```

#### **Step 2: Kirim Token ke ESP32**
```
1. Buka Arduino IDE → Serial Monitor (115200 baud)
2. Paste token yang sudah dicopy
3. Format: TOKEN:abc123def456...
4. Tekan Enter
```

#### **Step 3: Verifikasi Koneksi**
```
Serial Monitor harus tampil:
[Command] Token set: abc123def456...
[API] Getting user from session...
[Session] ✅ User found!
[Session] User ID: ...
[Session] Name: John Doe

LCD harus tampil:
┌────────────────┐
│ HELLO!         │
│ John Doe       │
└────────────────┘
```

---

## 🚀 Complete Flow Test

### 1. Register User Baru
```
Web App:
- Nama: John Doe
- Email: john@example.com
- Password: 123456
- Klik "Daftar"
```

### 2. Copy Token
```
Setelah berhasil, copy token dari kotak kuning
Format: TOKEN:abc123def456...
```

### 3. Kirim ke ESP32
```
Serial Monitor:
TOKEN:abc123def456...
[Enter]
```

### 4. Verifikasi
```
LCD: "HELLO! John Doe"
LCD: "MASUKKAN BOTOL"
```

### 5. Transaksi
```
Masukkan botol → Dapat poin → Auto-logout
```

---

## 🐛 Common Errors

### Error: "Profile creation error"
**Solusi**: Run `fix-profile-creation-error.sql`

### Error: "Session not found"
**Solusi**: 
- Pastikan token benar
- Cek session di database (< 5 menit)
- Kirim ulang token

### Error: ESP32 tidak connect WiFi
**Solusi**: Ganti SSID dan password di kode ESP32

### Error: API endpoint tidak bisa diakses
**Solusi**: Ganti IP di kode ESP32:
```cpp
const char* api_get_user = "http://YOUR-IP:3000/api/iot/get-user";
```

---

## ✅ Checklist

- [ ] Run `fix-profile-creation-error.sql`
- [ ] Web app running (npm run dev)
- [ ] ESP32 connect ke WiFi
- [ ] Login di web app berhasil
- [ ] Token muncul di web app
- [ ] Copy token
- [ ] Paste ke Serial Monitor
- [ ] ESP32 tampil "User found"
- [ ] LCD tampil "HELLO! [Name]"
- [ ] Bisa transaksi
- [ ] Data masuk database

---

## 💡 Tips

1. **Gunakan Serial Monitor** untuk debugging
2. **Cek database** setelah setiap step
3. **Pastikan WiFi stabil**
4. **Token valid 5 menit** - jangan terlalu lama

---

## 📞 Quick Commands

### Serial Monitor:
```
TOKEN:abc123...  - Set session token
CHECK            - Check current session
LOGOUT           - Logout
CLEAR            - Clear session
```

### SQL:
```sql
-- Cek sessions
SELECT * FROM iot_sessions ORDER BY created_at DESC LIMIT 5;

-- Cek transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
```
