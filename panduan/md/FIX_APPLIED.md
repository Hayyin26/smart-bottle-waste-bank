# ✅ Fix Applied - Foreign Key Error Resolved

## 🐛 Error yang Anda Alami

```
ERROR: 23503: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL: Key (id)=(11111111-1111-1111-1111-111111111111) is not present in table "users".
```

## ✅ Solusi yang Sudah Diterapkan

### 1. **Updated `test-data.sql`**
File sudah diupdate untuk:
- ✅ Auto-detect existing users dari `auth.users`
- ✅ Auto-create profiles untuk users yang sudah ada
- ✅ Tidak perlu hardcode UUID lagi
- ✅ Menggunakan dynamic queries

### 2. **Updated `supabase-functions.sql`**
Ditambahkan:
- ✅ Trigger `on_auth_user_created` - Auto-create profile saat user baru register
- ✅ Function `handle_new_user()` - Handle profile creation

### 3. **Created `CREATE_USERS.md`**
Panduan lengkap cara membuat users untuk testing

---

## 🚀 Cara Menggunakan (Step by Step)

### **Step 1: Buat Users di Supabase Dashboard**

1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Authentication** → **Users**
4. Klik **Add User** → **Create new user**
5. Isi:
   - Email: `test1@example.com`
   - Password: `password123`
   - ✅ **Centang "Auto Confirm User"**
6. Klik **Create User**
7. **Ulangi** untuk membuat 3-5 users

**Contoh Users:**
- budi@test.com
- siti@test.com
- ahmad@test.com
- eka@test.com (bisa dijadikan admin)
- roni@test.com

---

### **Step 2: Jalankan `supabase-functions.sql`**

Di Supabase SQL Editor:

```sql
-- Copy semua isi file supabase-functions.sql
-- Paste dan Run
```

Ini akan membuat:
- ✅ Function `increment_user_points`
- ✅ Function `handle_new_user`
- ✅ Trigger auto-create profile
- ✅ Views untuk leaderboard

---

### **Step 3: Jalankan `test-data.sql`**

Di Supabase SQL Editor:

```sql
-- Copy semua isi file test-data.sql (yang sudah diupdate)
-- Paste dan Run
```

File ini akan:
1. ✅ Insert IoT devices
2. ✅ Auto-create profiles untuk existing users
3. ✅ Insert sample transactions
4. ✅ Update total points
5. ✅ Verify data

---

### **Step 4: Verify Data**

Jalankan query ini untuk verify:

```sql
-- Check users dengan profiles
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.role,
  p.total_points
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY p.total_points DESC;

-- Check transactions
SELECT 
  t.id,
  p.full_name as user_name,
  t.device_id,
  t.points_earned,
  t.created_at
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC
LIMIT 10;

-- Check devices
SELECT * FROM iot_devices;

-- Check statistics
SELECT 
  COUNT(*) as total_transactions,
  SUM(points_earned) as total_points_distributed,
  COUNT(DISTINCT user_id) as unique_users
FROM transactions;
```

---

### **Step 5: Test Aplikasi**

```bash
npm run dev
```

Buka browser:
- **Dashboard**: http://localhost:3000/dashboard
- **QR Generator**: http://localhost:3000/qr-generator
- **History**: http://localhost:3000/history

---

## 🎯 Apa yang Berubah?

### **Before (Error):**
```sql
-- Hardcoded UUID yang tidak ada di auth.users ❌
INSERT INTO profiles (id, full_name, role, total_points) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Budi', 'user', 0);
-- ERROR: Foreign key constraint violation
```

### **After (Fixed):**
```sql
-- Auto-detect dan gunakan UUID dari auth.users ✅
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  split_part(u.email, '@', 1) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);
-- SUCCESS: Profiles created untuk existing users
```

---

## 🔄 Bonus: Auto-Create Profile untuk User Baru

Setelah trigger dibuat, setiap user baru yang register akan **otomatis** punya profile!

**Test:**
1. Buat user baru via Dashboard
2. Check profiles table
3. Profile sudah otomatis dibuat! ✅

---

## 📝 Quick Reference

### Buat User Baru
```
Dashboard → Authentication → Users → Add User
Email: test@example.com
Password: password123
✅ Auto Confirm User
```

### Check Existing Users
```sql
SELECT id, email FROM auth.users;
```

### Manual Create Profile (jika perlu)
```sql
INSERT INTO profiles (id, full_name, role, total_points)
SELECT id, split_part(email, '@', 1), 'user', 0
FROM auth.users
WHERE id = 'PASTE-UUID-HERE'
ON CONFLICT (id) DO NOTHING;
```

### Test Transaction
```sql
-- Get first user
SELECT id FROM profiles LIMIT 1;

-- Insert transaction (ganti UUID)
INSERT INTO transactions (user_id, device_id, points_earned) VALUES
  ('PASTE-UUID-HERE', 'device-001', 10);

-- Check points updated
SELECT id, full_name, total_points FROM profiles;
```

---

## ✅ Checklist

- [ ] Buat 3-5 users via Supabase Dashboard
- [ ] Jalankan `supabase-functions.sql`
- [ ] Jalankan `test-data.sql` (yang sudah diupdate)
- [ ] Verify data dengan query di atas
- [ ] Start development server: `npm run dev`
- [ ] Test dashboard: http://localhost:3000/dashboard
- [ ] Generate QR codes: http://localhost:3000/qr-generator
- [ ] Test real-time dengan insert transaction baru

---

## 🎉 Done!

Error sudah fixed! File `test-data.sql` dan `supabase-functions.sql` sudah diupdate.

**Next:** Buat users via Dashboard, lalu jalankan SQL files. 🚀

Baca `CREATE_USERS.md` untuk panduan lengkap!
