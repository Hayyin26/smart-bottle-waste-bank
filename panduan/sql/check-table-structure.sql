-- Cek Struktur Tabel Lengkap
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Struktur Tabel Profiles
-- ============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================
-- 2. Foreign Key Constraints
-- ============================================
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'profiles'
  AND tc.constraint_type = 'FOREIGN KEY';

-- ============================================
-- 3. Sample Data
-- ============================================
SELECT * FROM profiles LIMIT 5;

-- ============================================
-- 4. Count Users vs Profiles
-- ============================================
SELECT 
  'auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'profiles',
  COUNT(*)
FROM profiles;

-- ============================================
-- 5. Users Without Profiles
-- ============================================
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);
