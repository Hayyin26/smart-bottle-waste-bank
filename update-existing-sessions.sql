-- ============================================
-- UPDATE EXISTING SESSIONS TO 30 DAYS
-- ============================================
-- Script ini untuk memperpanjang expiry session yang sudah ada
-- Run di Supabase SQL Editor

-- 1. Check existing sessions
SELECT 
  session_token,
  user_id,
  device_id,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at > NOW() THEN '✅ VALID'
    ELSE '❌ EXPIRED'
  END as status,
  expires_at - NOW() as time_remaining
FROM iot_sessions
ORDER BY created_at DESC;

-- 2. Delete expired sessions (cleanup)
DELETE FROM iot_sessions
WHERE expires_at < NOW();

-- 3. Update all remaining sessions to 30 days
UPDATE iot_sessions
SET expires_at = NOW() + INTERVAL '30 days'
WHERE expires_at < NOW() + INTERVAL '30 days';

-- 4. Verify update
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE expires_at > NOW()) as valid_sessions,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_sessions,
  MIN(expires_at - NOW()) as shortest_remaining,
  MAX(expires_at - NOW()) as longest_remaining
FROM iot_sessions;

-- Expected result:
-- total_sessions: X
-- valid_sessions: X
-- expired_sessions: 0
-- shortest_remaining: ~29 days (if just updated)
-- longest_remaining: ~30 days
