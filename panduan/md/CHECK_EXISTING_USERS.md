# Cara Mendapatkan User ID yang Valid

## Error yang Terjadi:
```
Error 409: Foreign key constraint violation
User ID "11111111-1111-1111-1111-111111111111" tidak ada di tabel auth.users
```

## Solusi: Gunakan User ID yang Benar

### LANGKAH 1: Cek User yang Ada

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. Pilih project: **dsdtxqpzofrvzxpyktoo**
3. Klik **SQL Editor** (di sidebar kiri)
4. Paste query ini:

```sql
-- Lihat semua user yang ada
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

5. Klik **Run**
6. **Copy salah satu `user_id`** yang muncul (format UUID panjang)

### LANGKAH 2: Update Code IoT

Ganti baris 18 di code ESP32:

```cpp
// GANTI INI dengan user_id yang Anda copy dari query di atas
const char* default_user_id = "PASTE-USER-ID-DISINI";
```

Contoh:
```cpp
const char* default_user_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
```

### LANGKAH 3: Upload Ulang ke ESP32

1. Save code
2. Upload ke ESP32
3. Test lagi dengan memasukkan botol

---

## Jika Belum Ada User Sama Sekali

### Cara Membuat User Baru:

1. **Buka Supabase Dashboard**
2. Klik **Authentication** → **Users**
3. Klik tombol **Add User** atau **Invite**
4. Isi form:
   - **Email**: `iot-test@example.com`
   - **Password**: `password123`
   - **Auto Confirm User**: ✅ **CENTANG INI** (penting!)
5. Klik **Create User** atau **Send Invite**
6. User baru akan muncul di list
7. **Klik user tersebut** untuk melihat detail
8. **Copy User ID** (ada di bagian atas, format UUID)
9. Paste ke code IoT

---

## Atau Gunakan SQL untuk Buat User

Jika cara di atas tidak berhasil, jalankan SQL ini di **SQL Editor**:

```sql
-- Buat user baru dengan ID spesifik
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), -- Generate UUID otomatis
  'authenticated',
  'authenticated',
  'iot-user@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
)
RETURNING id; -- Ini akan menampilkan User ID yang baru dibuat
```

**Copy User ID yang muncul** dan paste ke code IoT!

---

## Verifikasi User Sudah Ada

Setelah membuat user, cek apakah profile juga sudah dibuat:

```sql
-- Cek profile
SELECT * FROM profiles;

-- Jika kosong, profile belum dibuat otomatis
-- Jalankan trigger manual atau insert manual:
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

---

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
- User dengan email tersebut sudah ada
- Gunakan email lain atau gunakan user yang sudah ada

### Profile tidak otomatis dibuat
- Trigger mungkin belum aktif
- Jalankan `supabase-functions.sql` lagi
- Atau insert profile manual dengan SQL di atas

### Masih error 409
- Pastikan User ID yang Anda copy benar-benar ada di `auth.users`
- Jangan gunakan User ID dummy seperti `11111111-1111-1111-1111-111111111111`
- User ID harus format UUID yang valid dan ada di database
