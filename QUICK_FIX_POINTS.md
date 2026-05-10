# ⚡ Quick Fix: Points Tidak Update

## 🎯 Masalah
Transaksi berhasil (201) tapi saldo tidak bertambah di web.

## ✅ Solusi (2 Menit)

### 1. Buka Supabase SQL Editor

Dashboard → SQL Editor

### 2. Copy-Paste & Run SQL Ini:

```sql
CREATE OR REPLACE FUNCTION auto_update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = total_points + NEW.points_earned,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auto_update_points ON transactions;

CREATE TRIGGER trigger_auto_update_points
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_user_points();
```

### 3. Test

```sql
-- Cek points sekarang
SELECT id, full_name, total_points FROM profiles;

-- Insert test transaksi
INSERT INTO transactions (user_id, device_id, points_earned)
VALUES (
  (SELECT id FROM profiles LIMIT 1),
  'ESP32-BOTOL-01',
  10
);

-- Cek lagi - harus bertambah +10!
SELECT id, full_name, total_points FROM profiles;
```

### 4. Refresh Dashboard

http://localhost:3000/dashboard

Tekan **Ctrl+F5**

---

## ✅ Done!

Sekarang setiap transaksi baru, points otomatis bertambah! 🎉

**File lengkap:** `fix-auto-update-points.sql`  
**Dokumentasi:** `FIX_POINTS_NOT_UPDATING.md`
