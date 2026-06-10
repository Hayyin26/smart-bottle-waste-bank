# 🔧 Fix Profile Creation Error - Complete Guide

## ❌ Error yang Terjadi:
```
ERROR: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL: Key (id)=(xxx) is not present in table "users"
```

## 🎯 Penyebab:
Tabel `profiles` punya **foreign key constraint** ke `auth.users`:
- `profiles.id` HARUS ada di `auth.users.id`
- Tidak bisa insert profile dengan random UUID
- Profile hanya bisa dibuat untuk user yang sudah ada di `auth.users`

---

## ✅ Solusi (2 Langkah):

### **Step 1: Fix RLS Policies**
```sql
-- Run di Supabase SQL Editor
-- File: fix-profile-creation-error.sql
```

### **Step 2: Create Missing Profiles**
```sql
-- Run di Supabase SQL Editor
-- File: create-missing-profiles.sql
```

Ini akan auto-create profiles untuk semua user yang sudah ada di `auth.users` tapi belum punya profile.

---

## 🔍 Verifikasi

### Cek di Database:
```sql
-- Cek user baru di auth.users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Cek profile baru
SELECT id, full_name, role, total_points 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Cek relasi (join)
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.total_points
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Error: "duplicate key value violates unique constraint"
**Artinya**: User sudah ada, profile sudah ada
**Solusi**: Login saja, jangan register lagi

### Error: "new row violates row-level security policy"
**Artinya**: RLS policy terlalu ketat
**Solusi**: Run `fix-profile-creation-error.sql` lagi

### Error: "permission denied for table profiles"
**Artinya**: Supabase client tidak punya akses
**Solusi**: Cek RLS policies, pastikan ada policy untuk INSERT

---

## 📊 Struktur Data yang Benar

### Tabel `auth.users` (Supabase Auth):
```
id (UUID)
email (TEXT)
encrypted_password
raw_user_meta_data (JSONB) → { "full_name": "John Doe" }
created_at
```

### Tabel `profiles` (Custom):
```
id (UUID) → Foreign key ke auth.users.id
full_name (TEXT)
role (TEXT) → 'user' atau 'admin'
total_points (INTEGER)
created_at
updated_at
```

### Relasi:
```
auth.users.id ←→ profiles.id (One-to-One)
```

---

## 💡 Kenapa Email Tidak di Profiles?

**Alasan:**
1. **Supabase Auth** sudah menyimpan email di `auth.users`
2. **Tidak perlu duplikasi** data
3. **Lebih aman** - email management di-handle Supabase
4. **Best practice** - separation of concerns

**Cara Akses Email:**
```sql
-- Join dengan auth.users
SELECT 
  p.id,
  p.full_name,
  u.email  -- ← Email dari auth.users
FROM profiles p
JOIN auth.users u ON p.id = u.id;
```

---

## ✅ Checklist

- [ ] Run `check-profiles-structure.sql` - Cek struktur tabel
- [ ] Pastikan TIDAK ada kolom `email` di profiles (ini normal!)
- [ ] Run `fix-profile-creation-error.sql` - Fix RLS policies
- [ ] Test register user baru di web app
- [ ] Cek database - user dan profile harus ada
- [ ] Test login dengan user yang baru dibuat
- [ ] Test kirim token ke ESP32
- [ ] Test transaksi

---

## 🚀 Quick Fix (Copy-Paste)

### 1. Run SQL ini di Supabase:
```sql
-- Drop policies yang conflict
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles for IoT" ON public.profiles;

-- Buat policy baru
CREATE POLICY "Allow authenticated users to insert own profile"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public insert profiles for IoT"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);
```

### 2. Test Insert:
```sql
-- Test insert (harus berhasil)
INSERT INTO public.profiles (id, full_name, role, total_points)
VALUES (
  gen_random_uuid(),
  'Test User',
  'user',
  0
);

-- Cek hasil
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;

-- Hapus test data
DELETE FROM profiles WHERE full_name = 'Test User';
```

### 3. Test Register di Web App:
```
http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
→ Daftar
→ Isi form
→ Harus berhasil! ✅
```

---

## 📞 Still Having Issues?

### Cek Log Browser Console:
```
F12 → Console
Lihat error message detail
```

### Cek Supabase Logs:
```
Supabase Dashboard → Logs → API Logs
Lihat error saat insert profile
```

### Manual Create Profile:
```sql
-- Jika register gagal terus, buat manual:
-- 1. Register user dulu (akan dapat UUID)
-- 2. Copy UUID dari auth.users
-- 3. Insert profile manual:

INSERT INTO profiles (id, full_name, role, total_points)
VALUES (
  'PASTE-UUID-DISINI',
  'Full Name',
  'user',
  0
)
ON CONFLICT (id) DO NOTHING;
```

---

## 🎉 Success Indicators

✅ Register berhasil tanpa error  
✅ User ada di `auth.users`  
✅ Profile ada di `profiles`  
✅ Bisa login  
✅ Token muncul setelah login  
✅ Bisa kirim token ke ESP32  
✅ Bisa transaksi  

---

## 📝 Summary

**Masalah**: Kode mencoba insert kolom `email` yang tidak ada  
**Solusi**: Hapus kolom `email` dari insert statement  
**Hasil**: Register berhasil, profile dibuat dengan benar  

Email tetap ada, tapi di tabel `auth.users`, bukan di `profiles`! ✅
