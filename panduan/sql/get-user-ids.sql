-- Query untuk mendapatkan semua user ID yang valid
-- Jalankan di Supabase SQL Editor

-- Lihat semua user yang ada di auth.users
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Atau lihat dari tabel profiles
SELECT 
  id as user_id,
  full_name,
  total_points
FROM profiles
ORDER BY updated_at DESC;
