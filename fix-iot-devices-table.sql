-- ============================================
-- FIX: IOT_DEVICES TABLE - Add Missing Columns
-- ============================================
-- Error: "Could not find the 'ip_address' column"
-- Solution: Add ip_address column if not exists

-- Step 1: Check if table exists, if not create it
CREATE TABLE IF NOT EXISTS iot_devices (
  device_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Add ip_address column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE iot_devices ADD COLUMN ip_address TEXT NOT NULL DEFAULT '0.0.0.0';
    RAISE NOTICE 'Column ip_address added successfully';
  ELSE
    RAISE NOTICE 'Column ip_address already exists';
  END IF;
END $$;

-- Step 3: Add last_seen column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE iot_devices ADD COLUMN last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
    RAISE NOTICE 'Column last_seen added successfully';
  ELSE
    RAISE NOTICE 'Column last_seen already exists';
  END IF;
END $$;

-- Step 4: Remove default from ip_address (allow NULL or require value)
ALTER TABLE iot_devices ALTER COLUMN ip_address DROP DEFAULT;

-- Step 5: Create index untuk performa
CREATE INDEX IF NOT EXISTS idx_iot_devices_last_seen ON iot_devices(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_iot_devices_device_id ON iot_devices(device_id);

-- Step 6: Enable RLS (Row Level Security)
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop existing policies jika ada
DROP POLICY IF EXISTS "Allow public read device info" ON iot_devices;
DROP POLICY IF EXISTS "Allow service role to upsert devices" ON iot_devices;
DROP POLICY IF EXISTS "Allow anon to upsert devices" ON iot_devices;

-- Step 8: Create policies
-- Policy 1: Allow anyone to read device info (untuk auto-discovery)
CREATE POLICY "Allow public read device info" ON iot_devices
  FOR SELECT
  USING (true);

-- Policy 2: Allow service role to insert/update
CREATE POLICY "Allow service role to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 3: Allow anon to insert/update (for ESP32 without auth)
CREATE POLICY "Allow anon to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'anon')
  WITH CHECK (auth.role() = 'anon');

-- Step 9: Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'iot_devices'
ORDER BY ordinal_position;

-- Step 10: Show existing data
SELECT * FROM iot_devices;

-- ============================================
-- Expected Output:
-- ============================================
-- column_name  | data_type | is_nullable | column_default
-- device_id    | text      | NO          | 
-- ip_address   | text      | NO          | 
-- created_at   | timestamp | NO          | now()
-- last_seen    | timestamp | NO          | now()

-- ============================================
-- Test Insert (Uncomment to test)
-- ============================================
-- INSERT INTO iot_devices (device_id, ip_address) 
-- VALUES ('ESP32-TEST', '192.168.1.100')
-- ON CONFLICT (device_id) 
-- DO UPDATE SET 
--   ip_address = EXCLUDED.ip_address, 
--   last_seen = NOW();
--
-- SELECT * FROM iot_devices WHERE device_id = 'ESP32-TEST';
