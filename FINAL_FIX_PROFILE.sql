-- ⚡ FINAL FIX: Profile Creation Error
-- Copy-paste SEMUA query ini ke Supabase SQL Editor dan Run sekali

-- ============================================
-- STEP 1: Cek Struktur Tabel (Info Only)
-- ============================================
SELECT 
  'Checking profiles table structure...' as status;

SELECT 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Fix RLS Policies
-- ============================================
SELECT 'Fixing RLS policies...' as status;

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

SELECT 'RLS policies fixed!' as status;

-- ============================================
-- STEP 3: Create Missing Profiles
-- ============================================
SELECT 'Creating missing profiles...' as status;

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

SELECT 'Missing profiles created!' as status;

-- ============================================
-- STEP 4: Verify Results
-- ============================================
SELECT 'Verifying results...' as status;

-- Count comparison
SELECT 
  'Total Users in auth.users' as metric,
  COUNT(*)::text as count
FROM auth.users
UNION ALL
SELECT 
  'Total Profiles',
  COUNT(*)::text
FROM profiles
UNION ALL
SELECT 
  'Missing Profiles',
  ((SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM profiles))::text;

-- Show users with profiles
SELECT 
  'User List' as section,
  u.email,
  p.full_name,
  p.role,
  p.total_points
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- SUCCESS! ✅
-- ============================================
SELECT '✅ ALL DONE! Now test register at: http://localhost:3000/iot-auth?device=ESP32-BOTOL-01' as status;
