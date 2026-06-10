-- Cek Struktur Tabel Profiles
-- Run this in Supabase SQL Editor

-- 1. Cek kolom apa saja yang ada di tabel profiles
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Cek sample data
SELECT * FROM profiles LIMIT 5;

-- 3. Cek relasi dengan auth.users
SELECT 
  p.id,
  p.full_name,
  p.role,
  p.total_points,
  u.email,
  u.created_at as user_created_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
LIMIT 5;

-- 4. Cek apakah ada user di auth.users yang belum punya profile
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.created_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ORDER BY u.created_at DESC;

-- 5. Jika ada user tanpa profile, buat profilenya
-- UNCOMMENT dan RUN jika ada user tanpa profile:
/*
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  'user',
  0
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;
*/
