-- Test Data untuk IoT QR System
-- Jalankan di Supabase SQL Editor untuk insert sample data

-- ============================================
-- 1. INSERT SAMPLE IOT DEVICES
-- ============================================

INSERT INTO iot_devices (device_id, location, is_active) VALUES
  ('device-001', 'Gedung A Lantai 1', true),
  ('device-002', 'Gedung B Lantai 2', true),
  ('device-003', 'Gedung C Lantai 3', true),
  ('device-004', 'Parkiran Utara', false)
ON CONFLICT (device_id) DO NOTHING;

-- ============================================
-- 2. CHECK EXISTING USERS & INSERT PROFILES
-- ============================================

-- OPTION A: Lihat user yang sudah ada di auth.users
-- Jalankan query ini dulu untuk melihat UUID user yang sudah ada:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- OPTION B: Jika belum ada user, buat dulu via Supabase Dashboard:
-- 1. Buka Supabase Dashboard
-- 2. Klik "Authentication" → "Users"
-- 3. Klik "Add User" → "Create new user"
-- 4. Isi email & password
-- 5. Copy UUID yang di-generate
-- 6. Gunakan UUID tersebut di query INSERT profiles di bawah

-- OPTION C: Insert profiles untuk user yang SUDAH ADA
-- Ganti UUID di bawah dengan UUID dari auth.users yang sudah ada
-- Contoh: Jika Anda punya user dengan email test@example.com, 
-- copy UUID-nya dan ganti di query ini:

-- INSERT INTO profiles (id, full_name, role, total_points) VALUES
--   ('PASTE-UUID-DARI-AUTH-USERS-DISINI', 'Budi Santoso', 'user', 0)
-- ON CONFLICT (id) DO NOTHING;

-- OPTION D: Auto-create profiles untuk semua existing users
-- Query ini akan membuat profile untuk semua user di auth.users yang belum punya profile
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. INSERT SAMPLE TRANSACTIONS
-- ============================================

-- CATATAN: Query ini akan membuat transaksi untuk user yang sudah ada di profiles
-- Pastikan sudah ada profiles sebelum menjalankan ini

-- Get first user ID untuk testing
DO $$
DECLARE
  first_user_id UUID;
  second_user_id UUID;
BEGIN
  -- Get first two users
  SELECT id INTO first_user_id FROM profiles LIMIT 1;
  SELECT id INTO second_user_id FROM profiles OFFSET 1 LIMIT 1;
  
  -- Insert transactions for first user
  IF first_user_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, device_id, points_earned, created_at) VALUES
      (first_user_id, 'device-001', 10, NOW() - INTERVAL '5 days'),
      (first_user_id, 'device-001', 10, NOW() - INTERVAL '4 days'),
      (first_user_id, 'device-002', 10, NOW() - INTERVAL '3 days'),
      (first_user_id, 'device-001', 10, NOW() - INTERVAL '2 days'),
      (first_user_id, 'device-001', 10, NOW() - INTERVAL '1 day');
  END IF;
  
  -- Insert transactions for second user
  IF second_user_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, device_id, points_earned, created_at) VALUES
      (second_user_id, 'device-002', 10, NOW() - INTERVAL '4 days'),
      (second_user_id, 'device-002', 10, NOW() - INTERVAL '3 days'),
      (second_user_id, 'device-001', 10, NOW() - INTERVAL '2 days'),
      (second_user_id, 'device-002', 10, NOW() - INTERVAL '1 day');
  END IF;
END $$;

-- ============================================
-- 4. UPDATE TOTAL POINTS (Manual)
-- ============================================

-- Update total points untuk setiap user berdasarkan transaksi
UPDATE profiles p
SET total_points = (
  SELECT COALESCE(SUM(points_earned), 0)
  FROM transactions t
  WHERE t.user_id = p.id
);

-- ============================================
-- 5. VERIFY DATA
-- ============================================

-- Check devices
SELECT * FROM iot_devices ORDER BY device_id;

-- Check profiles with points
SELECT id, full_name, role, total_points 
FROM profiles 
ORDER BY total_points DESC;

-- Check transactions
SELECT 
  t.id,
  p.full_name as user_name,
  t.device_id,
  t.points_earned,
  t.created_at
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
ORDER BY t.created_at DESC
LIMIT 20;

-- Check statistics
SELECT 
  COUNT(*) as total_transactions,
  SUM(points_earned) as total_points_distributed,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT device_id) as devices_used
FROM transactions;

-- ============================================
-- 6. TEST REAL-TIME TRANSACTION
-- ============================================

-- Simulate new transaction dengan user yang ada
-- Jalankan ini untuk test real-time update di dashboard
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get first user
  SELECT id INTO test_user_id FROM profiles LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    INSERT INTO transactions (user_id, device_id, points_earned) VALUES
      (test_user_id, 'device-001', 10);
    
    RAISE NOTICE 'Transaction created for user: %', test_user_id;
  ELSE
    RAISE NOTICE 'No users found in profiles table';
  END IF;
END $$;

-- Check if points updated
SELECT id, full_name, total_points 
FROM profiles 
ORDER BY total_points DESC;

-- ============================================
-- NOTES
-- ============================================

-- 1. Ganti semua UUID dengan ID real dari auth.users
-- 2. Atau buat user dulu via Supabase Auth
-- 3. Pastikan function increment_user_points sudah dibuat
-- 4. Test real-time dengan insert transaction baru
-- 5. Monitor dashboard untuk melihat update real-time
