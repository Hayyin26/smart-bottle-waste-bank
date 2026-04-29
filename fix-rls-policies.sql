-- ============================================
-- FIX RLS POLICIES
-- Jalankan ini di Supabase SQL Editor
-- ============================================

-- 1. Drop existing policies (jika ada yang conflict)
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON iot_devices;
DROP POLICY IF EXISTS "Enable read access for all users" ON transactions;
DROP POLICY IF EXISTS "Enable insert for all users" ON transactions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON transactions;

-- 2. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies untuk public access
CREATE POLICY "Allow public read profiles" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Allow public read devices" 
ON iot_devices FOR SELECT 
USING (true);

CREATE POLICY "Allow public read transactions" 
ON transactions FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert transactions" 
ON transactions FOR INSERT 
WITH CHECK (true);

-- 4. Verify policies created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'transactions', 'iot_devices')
ORDER BY tablename, policyname;

-- 5. Test query (should return data)
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_devices FROM iot_devices;
SELECT COUNT(*) as total_transactions FROM transactions;
