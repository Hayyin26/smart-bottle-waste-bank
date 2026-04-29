-- ============================================
-- VERIFY SETUP - Check Everything
-- ============================================

-- 1. Check RLS Status
SELECT 
  'RLS Status' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'transactions', 'iot_devices')
ORDER BY tablename;

-- 2. Check Policies
SELECT 
  'Policies' as check_type,
  tablename,
  policyname,
  cmd as operation,
  permissive
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'transactions', 'iot_devices')
ORDER BY tablename, policyname;

-- 3. Check Data Counts
SELECT 'Data Counts' as check_type, 'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Data Counts', 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'Data Counts', 'iot_devices', COUNT(*) FROM iot_devices
UNION ALL
SELECT 'Data Counts', 'transactions', COUNT(*) FROM transactions;

-- 4. Test Query (should work if policies are correct)
SELECT 
  'Test Query' as check_type,
  'profiles' as table_name,
  id,
  full_name,
  total_points
FROM profiles
LIMIT 3;

-- 5. Test Query - Devices
SELECT 
  'Test Query' as check_type,
  'iot_devices' as table_name,
  device_id,
  location,
  is_active
FROM iot_devices
LIMIT 3;

-- 6. Test Query - Transactions
SELECT 
  'Test Query' as check_type,
  'transactions' as table_name,
  t.id,
  p.full_name as user_name,
  t.points_earned,
  t.created_at
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC
LIMIT 3;

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- RLS Status: All tables should have rls_enabled = true
-- Policies: Should have SELECT policies for all tables
-- Data Counts: All should be > 0
-- Test Queries: Should return data without errors
