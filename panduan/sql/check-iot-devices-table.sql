-- ============================================
-- CHECK IOT_DEVICES TABLE STRUCTURE
-- ============================================
-- Run this to verify table exists and has correct columns

-- Check 1: Does table exist?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'iot_devices'
) AS table_exists;

-- Check 2: What columns does it have?
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'iot_devices'
ORDER BY ordinal_position;

-- Expected output:
-- column_name  | data_type                   | is_nullable | column_default
-- device_id    | text                       | NO          | 
-- ip_address   | text                       | NO          | 
-- created_at   | timestamp with time zone   | NO          | now()
-- last_seen    | timestamp with time zone   | NO          | now()

-- Check 3: What policies are enabled?
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'iot_devices';

-- Check 4: Show existing data
SELECT * FROM iot_devices ORDER BY last_seen DESC;

-- ============================================
-- Quick Diagnostic
-- ============================================
DO $$
DECLARE
  table_exists BOOLEAN;
  ip_column_exists BOOLEAN;
  last_seen_column_exists BOOLEAN;
  row_count INT;
BEGIN
  -- Check table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'iot_devices'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE '❌ Table iot_devices does NOT exist!';
    RAISE NOTICE '→ Run: fix-iot-devices-table.sql';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Table iot_devices exists';
  
  -- Check ip_address column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'ip_address'
  ) INTO ip_column_exists;
  
  IF NOT ip_column_exists THEN
    RAISE NOTICE '❌ Column ip_address does NOT exist!';
    RAISE NOTICE '→ Run: ALTER TABLE iot_devices ADD COLUMN ip_address TEXT NOT NULL;';
  ELSE
    RAISE NOTICE '✅ Column ip_address exists';
  END IF;
  
  -- Check last_seen column
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'last_seen'
  ) INTO last_seen_column_exists;
  
  IF NOT last_seen_column_exists THEN
    RAISE NOTICE '❌ Column last_seen does NOT exist!';
    RAISE NOTICE '→ Run: ALTER TABLE iot_devices ADD COLUMN last_seen TIMESTAMPTZ DEFAULT NOW();';
  ELSE
    RAISE NOTICE '✅ Column last_seen exists';
  END IF;
  
  -- Check row count
  SELECT COUNT(*) INTO row_count FROM iot_devices;
  RAISE NOTICE '📊 Total devices registered: %', row_count;
  
  IF table_exists AND ip_column_exists AND last_seen_column_exists THEN
    RAISE NOTICE '🎉 Table structure is correct!';
  ELSE
    RAISE NOTICE '⚠️  Table structure needs fixing!';
  END IF;
END $$;
