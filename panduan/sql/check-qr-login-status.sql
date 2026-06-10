-- ============================================
-- QR Login System Status Check
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check if iot_sessions table exists
SELECT 
  '✅ iot_sessions table exists' as status
WHERE EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'iot_sessions'
)
UNION ALL
SELECT 
  '❌ iot_sessions table NOT FOUND - Run create-iot-sessions-table.sql' as status
WHERE NOT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'iot_sessions'
);

-- 2. Check if iot_devices table exists and has ip_address column
SELECT 
  '✅ iot_devices table exists with ip_address column' as status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'iot_devices'
  AND column_name = 'ip_address'
)
UNION ALL
SELECT 
  '❌ iot_devices table missing ip_address column - Run fix-iot-devices-table.sql' as status
WHERE NOT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'iot_devices'
  AND column_name = 'ip_address'
);

-- 3. Check recent sessions (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_sessions'
  ) THEN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Recent Sessions (last 5):';
    RAISE NOTICE '============================================';
  END IF;
END $$;

SELECT 
  session_token,
  device_id,
  user_id,
  CASE 
    WHEN expires_at > NOW() THEN '✅ VALID'
    ELSE '❌ EXPIRED'
  END as status,
  expires_at - NOW() as time_remaining,
  created_at
FROM iot_sessions
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check device registration
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Device Registration:';
  RAISE NOTICE '============================================';
END $$;

SELECT 
  device_id,
  ip_address,
  CASE 
    WHEN last_seen > NOW() - INTERVAL '5 minutes' THEN '✅ ONLINE'
    WHEN last_seen > NOW() - INTERVAL '1 hour' THEN '⚠️ IDLE'
    ELSE '❌ OFFLINE'
  END as status,
  last_seen,
  NOW() - last_seen as offline_duration,
  created_at
FROM iot_devices
WHERE device_id = 'ESP32-BOTOL-01';

-- 5. Check profiles table
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'User Profiles:';
  RAISE NOTICE '============================================';
END $$;

SELECT 
  id,
  full_name,
  role,
  total_points,
  created_at
FROM profiles
WHERE role = 'user'
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check RLS policies on iot_sessions
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_sessions'
  ) THEN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RLS Policies on iot_sessions:';
    RAISE NOTICE '============================================';
  END IF;
END $$;

SELECT 
  policyname,
  CASE cmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    ELSE cmd
  END as operation,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'iot_sessions';

-- 7. Summary Report
DO $$
DECLARE
  sessions_count INT;
  devices_count INT;
  users_count INT;
  valid_sessions INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'SUMMARY REPORT';
  RAISE NOTICE '============================================';
  
  -- Count sessions (if table exists)
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_sessions'
  ) THEN
    SELECT COUNT(*) INTO sessions_count FROM iot_sessions;
    SELECT COUNT(*) INTO valid_sessions FROM iot_sessions WHERE expires_at > NOW();
    RAISE NOTICE 'Total Sessions: %', sessions_count;
    RAISE NOTICE 'Valid Sessions: %', valid_sessions;
    RAISE NOTICE 'Expired Sessions: %', sessions_count - valid_sessions;
  ELSE
    RAISE NOTICE '❌ iot_sessions table not found';
  END IF;
  
  -- Count devices (if table exists)
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_devices'
  ) THEN
    SELECT COUNT(*) INTO devices_count FROM iot_devices;
    RAISE NOTICE 'Total Devices: %', devices_count;
  ELSE
    RAISE NOTICE '❌ iot_devices table not found';
  END IF;
  
  -- Count users
  SELECT COUNT(*) INTO users_count FROM profiles WHERE role = 'user';
  RAISE NOTICE 'Total Users: %', users_count;
  
  RAISE NOTICE '============================================';
END $$;

-- 8. Test session creation (simulate web app)
DO $$
DECLARE
  test_token TEXT;
  test_user_id UUID;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Testing Session Creation:';
  RAISE NOTICE '============================================';
  
  -- Check if we can create a test session
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_sessions'
  ) THEN
    -- Get first user
    SELECT id INTO test_user_id FROM profiles WHERE role = 'user' LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
      RAISE NOTICE '✅ Can create test sessions';
      RAISE NOTICE 'Test user ID: %', test_user_id;
    ELSE
      RAISE NOTICE '⚠️ No users found with role = user';
    END IF;
  ELSE
    RAISE NOTICE '❌ Cannot test - iot_sessions table missing';
  END IF;
END $$;

-- 9. Cleanup old sessions
DO $$
DECLARE
  deleted_count INT;
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'iot_sessions'
  ) THEN
    DELETE FROM iot_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    IF deleted_count > 0 THEN
      RAISE NOTICE '';
      RAISE NOTICE '🧹 Cleaned up % expired session(s)', deleted_count;
    END IF;
  END IF;
END $$;
