-- ========================================
-- FIX: Hapus Device dengan Transaksi
-- ========================================
-- Jalankan di Supabase SQL Editor

-- Step 1: Lihat semua device dan jumlah transaksinya
SELECT 
  d.device_id,
  d.location,
  COUNT(t.id) as total_transactions
FROM iot_devices d
LEFT JOIN transactions t ON d.device_id = t.device_id
GROUP BY d.device_id, d.location
ORDER BY total_transactions DESC;

-- Step 2: Lihat transaksi yang pakai device selain ESP32-BOTOL-01
SELECT 
  device_id,
  COUNT(*) as total_transactions,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM transactions
WHERE device_id != 'ESP32-BOTOL-01'
GROUP BY device_id;

-- Step 3: PINDAHKAN semua transaksi ke ESP32-BOTOL-01
-- (Ini akan mempertahankan history transaksi)
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 4: Verifikasi - semua transaksi sekarang pakai ESP32-BOTOL-01
SELECT 
  device_id,
  COUNT(*) as total_transactions
FROM transactions
GROUP BY device_id;

-- Step 5: Sekarang HAPUS device lain (aman karena tidak ada reference)
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 6: Verifikasi hasil akhir
SELECT * FROM iot_devices;

-- Step 7: Cek total transaksi masih sama
SELECT COUNT(*) as total_transactions FROM transactions;

-- ✅ Done! Semua transaksi dipindah ke ESP32-BOTOL-01, device lain dihapus.
