# Quick Start - IoT QR System Integration

## 🚀 Setup Cepat (10 Menit)

### 1. Database Sudah Ready ✅

Schema database Anda sudah ada:
- ✅ `profiles` - User dengan points system
- ✅ `iot_devices` - IoT devices untuk scan QR
- ✅ `transactions` - Transaksi scan QR code

### 2. Buat Test Users (WAJIB)

**Cara:**
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Authentication** → **Users**
4. Klik **Add User** → **Create new user**
5. Isi email & password
6. ✅ **PENTING: Centang "Auto Confirm User"**
7. Klik **Create User**
8. **Ulangi** untuk membuat 3-5 users

**Contoh:**
- test1@example.com / password123
- test2@example.com / password123
- test3@example.com / password123

> **Catatan**: Tanpa users, aplikasi tidak akan punya data untuk ditampilkan!

### 3. Setup SQL Functions

1. Buka **SQL Editor** → **New Query**
2. Copy semua isi file `supabase-functions.sql`
3. Paste dan klik **Run**

Ini akan membuat:
- Function untuk increment points
- Trigger auto-create profile untuk user baru
- Views untuk leaderboard

### 4. Insert Sample Data

Di SQL Editor:

1. Copy semua isi file `test-data.sql`
2. Paste dan klik **Run**

Ini akan:
- Insert IoT devices
- Auto-create profiles untuk existing users
- Insert sample transactions
- Update total points

### 5. Restart Server

```bash
npm run dev
```

### 6. Test

Buka browser dan akses:

- **Dashboard**: http://localhost:3000/dashboard
- **QR Generator**: http://localhost:3000/qr-generator
- **History**: http://localhost:3000/history

Dashboard sekarang menampilkan:
- 📊 Real-time statistics
- 🔴 Live transaction updates
- 🏆 User leaderboard
- 📡 IoT device status

## ⚠️ Troubleshooting

### Error: "Foreign key constraint violation"
**Penyebab**: Belum ada users di `auth.users`

**Solusi**: Buat users dulu via Dashboard (Step 2 di atas)

Baca `CREATE_USERS.md` untuk panduan lengkap!

### Data tidak muncul?
- Pastikan sudah buat users (Step 2)
- Pastikan sudah jalankan `supabase-functions.sql` (Step 3)
- Pastikan sudah jalankan `test-data.sql` (Step 4)
- Restart development server
- Cek console browser untuk error

### Real-time tidak bekerja?
- Pastikan Realtime enabled di Supabase settings
- Cek browser console untuk connection errors

## 📁 File Penting

- `CREATE_USERS.md` - 📖 Cara membuat users (BACA INI DULU!)
- `FIX_APPLIED.md` - 🔧 Penjelasan fix untuk foreign key error
- `supabase-functions.sql` - 🗄️ WAJIB dijalankan!
- `test-data.sql` - 🧪 Sample data (sudah auto-detect users)
- `IOT_INTEGRATION.md` - 📱 Cara integrasikan IoT device

## 📚 Dokumentasi Lengkap

Baca `IOT_INTEGRATION.md` untuk:
- Cara integrasikan IoT device (ESP32/Arduino/Raspberry Pi)
- Format QR code
- Real-time updates
- Security best practices

## 🎯 Next Steps

1. ✅ Buat users via Dashboard
2. ✅ Jalankan SQL files
3. ✅ Test dashboard
4. ✅ Generate QR codes
5. 🔄 Setup IoT device untuk scan QR
6. 🔄 Test transaksi dari IoT device
7. 🔄 Monitor real-time di dashboard
