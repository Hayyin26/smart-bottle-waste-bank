-- Fix Profile Creation Error
-- Run this in Supabase SQL Editor

-- Cek struktur tabel profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Cek foreign key constraints
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

-- 3. Cek RLS policies yang ada
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- 4. Drop existing policies yang mungkin conflict
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert profiles for IoT" ON public.profiles;

-- 5. Buat policy baru yang lebih permissive untuk insert
CREATE POLICY "Allow authenticated users to insert own profile"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 6. Allow public insert (untuk IoT auth - jika diperlukan)
CREATE POLICY "Allow public insert profiles for IoT"
  ON public.profiles
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 7. Verifikasi policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- 8. Test insert dengan user yang SUDAH ADA di auth.users
DO $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Ambil user yang sudah ada
  SELECT id INTO existing_user_id 
  FROM auth.users 
  LIMIT 1;
  
  IF existing_user_id IS NULL THEN
    RAISE NOTICE 'No users found in auth.users. Please create a user first via Supabase Auth.';
  ELSE
    -- Cek apakah profile sudah ada
    IF EXISTS (SELECT 1 FROM profiles WHERE id = existing_user_id) THEN
      RAISE NOTICE 'Profile already exists for user: %', existing_user_id;
    ELSE
      -- Insert profile untuk user yang sudah ada
      INSERT INTO public.profiles (id, full_name, role, total_points)
      VALUES (
        existing_user_id,
        'Test User',
        'user',
        0
      );
      
      RAISE NOTICE 'Test insert successful! ID: %', existing_user_id;
      
      -- Cleanup test data
      DELETE FROM public.profiles WHERE id = existing_user_id AND full_name = 'Test User';
      RAISE NOTICE 'Test data cleaned up';
    END IF;
  END IF;
END $$;
