# Cara Membuat Users untuk Testing

## ❗ Error yang Anda Alami

```
ERROR: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
Key (id)=(11111111-1111-1111-1111-111111111111) is not present in table "users".
```

**Penyebab**: Tabel `profiles` memiliki foreign key ke `auth.users`. Anda harus membuat user di Supabase Auth dulu sebelum bisa insert ke `profiles`.

---

## ✅ Solusi: 3 Cara Membuat Users

### **Cara 1: Buat User via Supabase Dashboard** (Paling Mudah)

1. **Buka Supabase Dashboard**
   - https://supabase.com/dashboard
   - Pilih project Anda

2. **Klik "Authentication"** di sidebar kiri

3. **Klik "Users"**

4. **Klik "Add User"** → **"Create new user"**

5. **Isi Form:**
   - Email: `test1@example.com`
   - Password: `password123`
   - Auto Confirm User: ✅ (centang ini)

6. **Klik "Create User"**

7. **Copy UUID** yang muncul di kolom ID

8. **Ulangi** untuk membuat lebih banyak user (minimal 3-5 user untuk testing)

---

### **Cara 2: Auto-Create Profiles untuk Existing Users** (Paling Cepat)

Jika Anda sudah punya user di `auth.users`, jalankan query ini di SQL Editor:

```sql
-- Auto-create profiles untuk semua user yang belum punya profile
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT p.id, p.full_name, p.role, p.total_points, u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id;
```

---

### **Cara 3: Buat User via SQL** (Advanced)

```sql
-- CATATAN: Ini hanya untuk development/testing
-- Untuk production, gunakan Supabase Auth API

-- 1. Insert user ke auth.users (simplified)
-- Ini tidak akan bekerja karena auth.users dikelola oleh Supabase Auth
-- Gunakan Cara 1 atau 2 saja

-- 2. Setelah user dibuat via Dashboard, buat profile:
INSERT INTO profiles (id, full_name, role, total_points) VALUES
  ('PASTE-UUID-DARI-AUTH-USERS', 'Nama User', 'user', 0);
```

---

## 🚀 Quick Start (Recommended)

### Step 1: Buat 5 Test Users

Via Supabase Dashboard → Authentication → Users → Add User:

| Email | Password | Role |
|-------|----------|------|
| budi@test.com | password123 | user |
| siti@test.com | password123 | user |
| ahmad@test.com | password123 | user |
| eka@test.com | password123 | admin |
| roni@test.com | password123 | user |

**PENTING**: Centang "Auto Confirm User" untuk setiap user!

### Step 2: Jalankan Updated test-data.sql

File `test-data.sql` sudah saya update untuk:
- ✅ Auto-detect existing users
- ✅ Auto-create profiles
- ✅ Auto-create transactions

Jalankan di SQL Editor:

```sql
-- File sudah diupdate, tinggal copy paste dan run!
```

### Step 3: Verify

```sql
-- Check users
SELECT u.id, u.email, p.full_name, p.total_points
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY p.total_points DESC;

-- Check transactions
SELECT COUNT(*) as total_transactions FROM transactions;

-- Check devices
SELECT * FROM iot_devices;
```

---

## 🔧 Troubleshooting

### "No users found"
**Solusi**: Buat user dulu via Dashboard (Cara 1)

### "Profile already exists"
**Solusi**: Itu bagus! Berarti profile sudah dibuat. Lanjut ke insert transactions.

### "Foreign key constraint violation"
**Solusi**: UUID yang Anda gunakan tidak ada di `auth.users`. Gunakan UUID yang valid dari query:
```sql
SELECT id, email FROM auth.users;
```

---

## 📝 Alternative: Trigger Auto-Create Profile

Agar profile otomatis dibuat saat user register, tambahkan trigger ini:

```sql
-- Function untuk auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, total_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger saat user baru dibuat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Setelah trigger ini dibuat, setiap user baru akan otomatis punya profile!

---

## ✅ Summary

1. **Buat user** via Supabase Dashboard (Authentication → Users)
2. **Jalankan** `test-data.sql` yang sudah diupdate
3. **Verify** data muncul di dashboard
4. **Test** real-time dengan insert transaction baru

**File `test-data.sql` sudah saya update untuk handle ini!** 🚀
