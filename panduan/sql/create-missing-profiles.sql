-- Create Missing Profiles
-- Run this in Supabase SQL Editor
-- Ini akan membuat profile untuk semua user di auth.users yang belum punya profile

-- 1. Cek user yang belum punya profile
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

-- 2. Auto-create profiles untuk semua existing users
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1)  -- Gunakan email prefix jika full_name tidak ada
  ) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- 3. Verifikasi - semua user harus punya profile
SELECT 
  COUNT(*) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  COUNT(*) - (SELECT COUNT(*) FROM profiles) as missing_profiles
FROM auth.users;

-- 4. Cek hasil
SELECT 
  p.id,
  u.email,
  p.full_name,
  p.role,
  p.total_points,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;
