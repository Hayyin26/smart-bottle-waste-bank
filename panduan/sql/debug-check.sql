-- ============================================
-- QUICK DEBUG CHECK
-- Jalankan di Supabase SQL Editor untuk check data
-- ============================================

-- 1. Check apakah ada users
SELECT 
  'Users in auth.users' as check_name,
  COUNT(*) as count
FROM auth.users;

-- 2. Check apakah ada profiles
SELECT 
  'Profiles' as check_name,
  COUNT(*) as count
FROM profiles;

-- 3. Check apakah ada devices
SELECT 
  'IoT Devices' as check_name,
  COUNT(*) as count
FROM iot_devices;

-- 4. Check apakah ada transactions
SELECT 
  'Transactions' as check_name,
  COUNT(*) as count
FROM transactions;

-- 5. Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'transactions', 'iot_devices');

-- 6. Check policies
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'transactions', 'iot_devices');

-- 7. Sample data check
SELECT 
  'Sample Profiles' as data_type,
  id,
  full_name,
  total_points
FROM profiles
LIMIT 5;

SELECT 
  'Sample Transactions' as data_type,
  t.id,
  p.full_name as user_name,
  t.device_id,
  t.points_earned,
  t.created_at
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC
LIMIT 5;

SELECT 
  'Sample Devices' as data_type,
  device_id,
  location,
  is_active
FROM iot_devices;

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- Users in auth.users: > 0
-- Profiles: > 0 (should match users count)
-- IoT Devices: > 0
-- Transactions: > 0
-- RLS enabled: true for all tables
-- Policies: Should have SELECT policies for all tables
-- Sample data: Should show actual data

-- ============================================
-- IF ALL COUNTS ARE 0
-- ============================================
-- 1. Buat users via Dashboard (Authentication → Users)
-- 2. Jalankan supabase-functions.sql
-- 3. Jalankan test-data.sql
