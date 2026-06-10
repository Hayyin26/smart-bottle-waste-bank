-- ============================================
-- DEBUG: Check Current QR Login Status
-- Copy hasil query ini untuk diagnosa
-- ============================================

-- 1. Check ESP32 device registration
SELECT 
  '=== DEVICE STATUS ===' as info,
  device_id,
  ip_address,
  last_seen,
  CASE 
    WHEN last_seen > NOW() - INTERVAL '5 minutes' THEN '✅ ONLINE'
    WHEN last_seen > NOW() - INTERVAL '1 hour' THEN '⚠️ IDLE'
    ELSE '❌ OFFLINE'
  END as status,
  NOW() - last_seen as offline_duration
FROM iot_devices
WHERE device_id = 'ESP32-BOTOL-01';

-- 2. Check recent valid sessions (last 5)
SELECT 
  '=== RECENT SESSIONS ===' as info,
  LEFT(session_token, 16) || '...' as token_preview,
  device_id,
  user_id,
  CASE 
    WHEN expires_at > NOW() THEN '✅ VALID'
    ELSE '❌ EXPIRED'
  END as status,
  expires_at,
  EXTRACT(EPOCH FROM (expires_at - NOW())) / 3600 as hours_remaining,
  created_at
FROM iot_sessions
ORDER BY created_at DESC
LIMIT 5;

-- 3. Count sessions by status
SELECT 
  '=== SESSION SUMMARY ===' as info,
  COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as valid_sessions,
  COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired_sessions,
  COUNT(*) as total_sessions
FROM iot_sessions;

-- 4. Get latest valid session for ESP32-BOTOL-01
SELECT 
  '=== LATEST VALID SESSION ===' as info,
  session_token,
  user_id,
  device_id,
  expires_at,
  created_at
FROM iot_sessions
WHERE device_id = 'ESP32-BOTOL-01'
  AND expires_at > NOW()
ORDER BY created_at DESC
LIMIT 1;

-- 5. Get user info for latest session
SELECT 
  '=== USER INFO ===' as info,
  p.id as user_id,
  p.full_name,
  p.role,
  p.total_points,
  COUNT(t.id) as total_transactions
FROM profiles p
LEFT JOIN transactions t ON t.user_id = p.id
WHERE p.id IN (
  SELECT user_id 
  FROM iot_sessions 
  WHERE device_id = 'ESP32-BOTOL-01' 
    AND expires_at > NOW()
  ORDER BY created_at DESC 
  LIMIT 1
)
GROUP BY p.id, p.full_name, p.role, p.total_points;

-- 6. Clean up expired sessions (OPTIONAL - uncomment to run)
-- DELETE FROM iot_sessions WHERE expires_at < NOW();
-- SELECT 'Cleaned up expired sessions' as info;
