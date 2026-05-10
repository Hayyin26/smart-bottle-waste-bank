-- ========================================
-- FIX: Auto-Update Points Saat Transaksi
-- ========================================
-- Jalankan di Supabase SQL Editor

-- Function untuk auto-update points saat transaksi baru
CREATE OR REPLACE FUNCTION auto_update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_points di tabel profiles
  UPDATE profiles
  SET 
    total_points = total_points + NEW.points_earned,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger lama jika ada
DROP TRIGGER IF EXISTS trigger_auto_update_points ON transactions;

-- Buat trigger baru
CREATE TRIGGER trigger_auto_update_points
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_user_points();

-- Test: Lihat current points
SELECT id, full_name, total_points FROM profiles;

-- Test: Insert transaksi dummy (opsional - hapus jika tidak perlu)
-- INSERT INTO transactions (user_id, device_id, points_earned)
-- VALUES (
--   (SELECT id FROM profiles LIMIT 1),
--   'ESP32-BOTOL-01',
--   10
-- );

-- Verify: Cek points setelah insert
-- SELECT id, full_name, total_points FROM profiles;

COMMENT ON FUNCTION auto_update_user_points() IS 'Auto-increment user points when new transaction is created';
COMMENT ON TRIGGER trigger_auto_update_points ON transactions IS 'Automatically update user total_points when transaction is inserted';
