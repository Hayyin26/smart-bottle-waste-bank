# 🔧 Fix: Saldo/Points Tidak Terupdate di Web

## ❌ Masalah

Setelah ESP32 kirim transaksi dan berhasil (response 201), tapi saldo di web dashboard tidak bertambah.

## 🔍 Penyebab

**Trigger database belum ada!** 

Saat transaksi baru masuk ke tabel `transactions`, tidak ada trigger yang otomatis update `total_points` di tabel `profiles`.

## ✅ Solusi

### Step 1: Jalankan SQL Fix

1. **Buka Supabase Dashboard**
2. **Klik SQL Editor** (di sidebar kiri)
3. **Copy-paste SQL ini:**

```sql
-- ========================================
-- FIX: Auto-Update Points Saat Transaksi
-- ========================================

-- Function untuk auto-update points saat transaksi baru
CREATE OR REPLACE FUNCTION auto_update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_points di tabel profiles
  UPDATE profiles
  SET 
    total_points = total_points + NEW.points_earned,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger lama jika ada
DROP TRIGGER IF EXISTS trigger_auto_update_points ON transactions;

-- Buat trigger baru
CREATE TRIGGER trigger_auto_update_points
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_user_points();
```

4. **Klik Run** (atau tekan Ctrl+Enter)
5. **Lihat output:** Harus sukses tanpa error

### Step 2: Verifikasi Trigger

Cek apakah trigger sudah aktif:

```sql
-- Cek trigger yang ada
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_update_points';
```

Output harus menampilkan trigger `trigger_auto_update_points`.

### Step 3: Test Trigger

**Opsi A: Test dengan SQL**

```sql
-- 1. Cek points sebelum insert
SELECT id, full_name, total_points FROM profiles 
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';

-- 2. Insert transaksi test
INSERT INTO transactions (user_id, device_id, points_earned)
VALUES (
  '9db3ac82-dc1c-4f28-abe2-a8482986735f',
  'ESP32-BOTOL-01',
  10
);

-- 3. Cek points setelah insert (harus bertambah +10)
SELECT id, full_name, total_points FROM profiles 
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';
```

**Opsi B: Test dengan ESP32**

1. Upload code ke ESP32
2. Masukkan botol
3. Lihat Serial Monitor: `[Supabase] ✅ Data Terkirim! Respon: 201`
4. Refresh dashboard web
5. Points harus bertambah!

### Step 4: Refresh Dashboard

Dashboard sudah ada auto-refresh setiap 30 detik, tapi untuk test manual:

1. **Buka dashboard:** http://localhost:3000/dashboard
2. **Tekan Ctrl+F5** (hard refresh)
3. **Lihat Leaderboard** - Points harus update!

---

## 🎯 Cara Kerja Trigger

```
┌─────────────────────────────────────────────────┐
│  ESP32 kirim transaksi                          │
│  POST /rest/v1/transactions                     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Supabase: INSERT INTO transactions             │
│  - user_id: xxx                                 │
│  - device_id: ESP32-BOTOL-01                    │
│  - points_earned: 10                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  TRIGGER: trigger_auto_update_points            │
│  (Otomatis dipanggil AFTER INSERT)              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  FUNCTION: auto_update_user_points()            │
│  UPDATE profiles                                │
│  SET total_points = total_points + 10           │
│  WHERE id = user_id                             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  ✅ Points di profiles terupdate!               │
│  User points: 50 → 60                           │
└─────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Dashboard refresh (auto 30s atau manual)       │
│  Leaderboard tampil points terbaru: 60          │
└─────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### 1. Error: "permission denied for table profiles"

**Penyebab:** Function tidak punya akses ke tabel profiles

**Fix:** Tambahkan `SECURITY DEFINER` di function (sudah ada di SQL di atas)

### 2. Points tidak update setelah jalankan SQL

**Cek:**
```sql
-- Apakah trigger aktif?
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_update_points';
```

**Fix:** Jalankan ulang SQL create trigger

### 3. Points update tapi tidak muncul di dashboard

**Cek:**
- Dashboard sudah refresh? (Ctrl+F5)
- Auto-refresh aktif? (tunggu 30 detik)
- Browser cache? (Clear cache)

**Fix:**
```bash
# Restart dev server
# Ctrl+C di terminal
npm run dev
```

### 4. Error: "function auto_update_user_points() does not exist"

**Penyebab:** Function belum dibuat

**Fix:** Jalankan SQL create function di atas

### 5. Transaksi masuk tapi points tidak bertambah

**Cek di SQL:**
```sql
-- Lihat transaksi terakhir
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;

-- Lihat points user
SELECT id, full_name, total_points FROM profiles;
```

**Jika transaksi ada tapi points tidak bertambah:**
- Trigger tidak aktif
- Function error
- User ID tidak match

**Fix:** Jalankan ulang SQL fix di atas

---

## 📊 Monitoring

### Cek Trigger Status

```sql
-- List semua trigger di tabel transactions
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'transactions';
```

### Cek Function Status

```sql
-- List semua function yang ada
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%points%';
```

### Test Manual Update

```sql
-- Manual update points (untuk test)
UPDATE profiles
SET total_points = total_points + 10
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';

-- Verify
SELECT id, full_name, total_points FROM profiles
WHERE id = '9db3ac82-dc1c-4f28-abe2-a8482986735f';
```

---

## 🎯 Checklist Fix

- [ ] Jalankan SQL `fix-auto-update-points.sql`
- [ ] Verifikasi trigger aktif
- [ ] Test dengan insert transaksi manual
- [ ] Test dengan ESP32
- [ ] Refresh dashboard
- [ ] Cek points bertambah di Leaderboard
- [ ] Cek points bertambah di halaman Users

---

## 📝 File SQL

File SQL lengkap ada di: **`fix-auto-update-points.sql`**

Copy-paste ke Supabase SQL Editor dan Run!

---

## ✅ Expected Result

**Sebelum Fix:**
```
Transaksi masuk → Response 201 → Points TIDAK bertambah ❌
```

**Setelah Fix:**
```
Transaksi masuk → Response 201 → Trigger jalan → Points bertambah ✅
```

**Di Dashboard:**
- Leaderboard: Points update otomatis
- Stats: Total Points update
- Recent Transactions: Transaksi baru muncul
- Auto-refresh setiap 30 detik

---

## 🚀 Next Steps

Setelah fix ini:
1. ✅ Points otomatis update saat transaksi
2. ✅ Dashboard real-time
3. ✅ Leaderboard akurat
4. ✅ Tidak perlu manual update

**Sistem sudah production-ready!** 🎉
