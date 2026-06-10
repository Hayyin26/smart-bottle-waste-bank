-- ========================================
-- Hapus Semua Device Kecuali ESP32-BOTOL-01
-- ========================================
-- Jalankan di Supabase SQL Editor

-- 1. Lihat semua device yang ada sekarang
SELECT device_id, location, is_active, created_at 
FROM iot_devices 
ORDER BY created_at;

-- 2. Hapus semua device KECUALI ESP32-BOTOL-01
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- 3. Verifikasi - hanya ESP32-BOTOL-01 yang tersisa
SELECT device_id, location, is_active, created_at 
FROM iot_devices;

-- 4. (Opsional) Update info device ESP32-BOTOL-01 jika perlu
-- UPDATE iot_devices 
-- SET 
--   location = 'Lokasi Device Utama',
--   is_active = true
-- WHERE device_id = 'ESP32-BOTOL-01';

-- 5. Cek transaksi yang terkait dengan device yang dihapus
-- (Transaksi tidak akan terhapus karena foreign key ON DELETE CASCADE tidak diset)
SELECT 
  device_id, 
  COUNT(*) as total_transactions 
FROM transactions 
GROUP BY device_id;

-- CATATAN:
-- - Jika ada transaksi dengan device_id yang sudah dihapus, 
--   transaksi tersebut akan tetap ada tapi device_id nya jadi "orphan"
-- - Untuk clean up transaksi orphan (opsional):
-- DELETE FROM transactions WHERE device_id NOT IN (SELECT device_id FROM iot_devices);
