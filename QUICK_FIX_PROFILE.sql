-- ⚡ QUICK FIX: Profile Creation Error
-- Copy-paste semua query ini ke Supabase SQL Editor dan Run

-- ============================================
-- STEP 1: Fix RLS Policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles for IoT" ON public.profiles;

-- Create new policies
CREATE POLICY "Allow authenticated users to insert own profile"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public insert profiles for IoT"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

-- ============================================
-- STEP 2: Create Missing Profiles
-- ============================================

-- Auto-create profiles untuk semua existing users
INSERT INTO profiles (id, full_name, role, total_points)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1)
  ) as full_name,
  'user' as role,
  0 as total_points
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Verify
-- ============================================

-- Cek hasil
SELECT 
  'Total Users' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total Profiles',
  COUNT(*)
FROM profiles
UNION ALL
SELECT 
  'Missing Profiles',
  (SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM profiles);

-- Tampilkan user dengan profile
SELECT 
  u.email,
  p.full_name,
  p.total_points,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- SUCCESS! ✅
-- ============================================
-- Sekarang test register user baru di web app
-- http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
