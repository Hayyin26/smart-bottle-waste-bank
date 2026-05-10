-- ⚡ QUICK: Hapus Semua Device Kecuali ESP32-BOTOL-01
-- Copy-paste ke Supabase SQL Editor dan Run!

-- Step 1: Lihat device dan jumlah transaksinya
SELECT 
  d.device_id,
  d.location,
  COUNT(t.id) as total_transactions
FROM iot_devices d
LEFT JOIN transactions t ON d.device_id = t.device_id
GROUP BY d.device_id, d.location;

-- Step 2: PINDAHKAN semua transaksi ke ESP32-BOTOL-01
-- (Ini penting agar tidak error foreign key constraint)
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 3: Verifikasi - semua transaksi sekarang pakai ESP32-BOTOL-01
SELECT device_id, COUNT(*) as total 
FROM transactions 
GROUP BY device_id;

-- Step 4: Hapus device lain (sekarang aman)
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 5: Verifikasi - hanya ESP32-BOTOL-01 yang tersisa
SELECT * FROM iot_devices;

-- Step 6: (Opsional) Update info ESP32-BOTOL-01
UPDATE iot_devices 
SET 
  location = 'Bank Sampah Digital - Device Utama',
  is_active = true
WHERE device_id = 'ESP32-BOTOL-01';

-- ✅ Done! Refresh dashboard untuk lihat hasilnya.
