-- ============================================
-- IOT DEVICES TABLE SETUP
-- ============================================
-- Tabel untuk menyimpan IP address ESP32 (auto-discovery)

-- Step 1: Drop existing table if needed (HATI-HATI: akan hapus data!)
-- Uncomment jika ingin reset tabel dari awal
-- DROP TABLE IF EXISTS iot_devices CASCADE;

-- Step 2: Create table (skip jika sudah ada)
CREATE TABLE IF NOT EXISTS iot_devices (
  device_id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Add last_seen column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE iot_devices ADD COLUMN last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Step 4: Create index untuk performa
CREATE INDEX IF NOT EXISTS idx_iot_devices_last_seen ON iot_devices(last_seen DESC);

-- Step 5: Enable RLS (Row Level Security)
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies jika ada (untuk re-run script)
DROP POLICY IF EXISTS "Allow public read device info" ON iot_devices;
DROP POLICY IF EXISTS "Allow service role to upsert devices" ON iot_devices;

-- Step 7: Create policies
-- Policy: Allow anyone to read device info (untuk auto-discovery)
CREATE POLICY "Allow public read device info" ON iot_devices
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert/update (untuk ESP32 register IP)
CREATE POLICY "Allow service role to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Step 8: Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'iot_devices'
ORDER BY ordinal_position;

-- Step 9: Show existing data (jika ada)
SELECT * FROM iot_devices;

-- ============================================
-- TESTING (Optional)
-- ============================================
-- Test insert/update (uncomment untuk test)
-- INSERT INTO iot_devices (device_id, ip_address) 
-- VALUES ('ESP32-BOTOL-01', '192.168.1.100')
-- ON CONFLICT (device_id) 
-- DO UPDATE SET 
--   ip_address = EXCLUDED.ip_address, 
--   last_seen = NOW();
--
-- SELECT * FROM iot_devices;
