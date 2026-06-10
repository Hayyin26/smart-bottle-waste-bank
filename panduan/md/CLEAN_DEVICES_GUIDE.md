# 🗑️ Panduan Hapus Device (Kecuali ESP32-BOTOL-01)

## 🎯 Tujuan
Hapus semua device dari tabel `iot_devices` kecuali `ESP32-BOTOL-01`.

---

## ⚠️ PENTING: Backup Dulu!

### 1. Backup Data Device

Jalankan di Supabase SQL Editor:

```sql
-- Lihat semua device yang akan dihapus
SELECT * FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';
```

**Copy hasil query** dan simpan di notepad (jika perlu restore nanti).

### 2. Cek Transaksi Terkait

```sql
-- Cek berapa transaksi per device
SELECT 
  device_id, 
  COUNT(*) as total_transactions,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM transactions 
GROUP BY device_id
ORDER BY total_transactions DESC;
```

---

## 🗑️ Cara Hapus Device

### Opsi 1: Hapus Langsung (Simple)

```sql
-- Hapus semua device kecuali ESP32-BOTOL-01
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- Verifikasi - hanya ESP32-BOTOL-01 yang tersisa
SELECT * FROM iot_devices;
```

### Opsi 2: Hapus dengan Konfirmasi (Aman)

```sql
-- Step 1: Lihat device yang akan dihapus
SELECT device_id, location FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 2: Jika yakin, hapus
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- Step 3: Konfirmasi hasil
SELECT COUNT(*) as total_devices FROM iot_devices;
-- Harus return: 1 (hanya ESP32-BOTOL-01)
```

### Opsi 3: Hapus Satu-Satu (Paling Aman)

```sql
-- Hapus device tertentu
DELETE FROM iot_devices WHERE device_id = 'ESP32-BOTOL-02';
DELETE FROM iot_devices WHERE device_id = 'ESP32-BOTOL-03';
-- dst...

-- Verifikasi
SELECT * FROM iot_devices;
```

---

## 🧹 Clean Up Transaksi Orphan (Opsional)

Jika ada transaksi dengan `device_id` yang sudah tidak ada di tabel `iot_devices`:

### Cek Transaksi Orphan

```sql
-- Cek transaksi dengan device yang sudah dihapus
SELECT 
  t.device_id,
  COUNT(*) as orphan_transactions
FROM transactions t
LEFT JOIN iot_devices d ON t.device_id = d.device_id
WHERE d.device_id IS NULL
GROUP BY t.device_id;
```

### Opsi A: Hapus Transaksi Orphan

```sql
-- HATI-HATI: Ini akan hapus transaksi!
DELETE FROM transactions 
WHERE device_id NOT IN (SELECT device_id FROM iot_devices);
```

### Opsi B: Update ke ESP32-BOTOL-01

```sql
-- Pindahkan transaksi orphan ke ESP32-BOTOL-01
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id NOT IN (SELECT device_id FROM iot_devices);
```

### Opsi C: Biarkan Saja

Transaksi orphan tidak masalah, hanya `device_id` nya tidak ada di tabel `iot_devices`.

---

## ✅ Verifikasi Hasil

### 1. Cek Device

```sql
-- Harus hanya ada 1 device
SELECT * FROM iot_devices;
```

Expected output:
```
device_id        | location | is_active | created_at
-----------------+----------+-----------+------------
ESP32-BOTOL-01   | ...      | true      | ...
```

### 2. Cek Transaksi

```sql
-- Cek transaksi masih ada
SELECT COUNT(*) as total_transactions FROM transactions;

-- Cek transaksi per device
SELECT device_id, COUNT(*) as total 
FROM transactions 
GROUP BY device_id;
```

### 3. Test Dashboard

1. Buka: http://localhost:3000/dashboard
2. Cek **Device Status** - hanya ESP32-BOTOL-01
3. Cek **Recent Transactions** - masih ada
4. Cek **Stats** - masih benar

---

## 🔄 Restore Device (Jika Salah Hapus)

Jika tidak sengaja hapus ESP32-BOTOL-01:

```sql
-- Insert ulang ESP32-BOTOL-01
INSERT INTO iot_devices (device_id, location, is_active)
VALUES ('ESP32-BOTOL-01', 'Lokasi Device Utama', true);
```

Jika hapus device lain dan mau restore:

```sql
-- Insert device yang terhapus
INSERT INTO iot_devices (device_id, location, is_active)
VALUES 
  ('ESP32-BOTOL-02', 'Lokasi 2', true),
  ('ESP32-BOTOL-03', 'Lokasi 3', false);
```

---

## 📊 Update Info ESP32-BOTOL-01

Setelah hapus device lain, update info device utama:

```sql
UPDATE iot_devices 
SET 
  location = 'Bank Sampah Digital - Device Utama',
  is_active = true,
  created_at = NOW()
WHERE device_id = 'ESP32-BOTOL-01';

-- Verifikasi
SELECT * FROM iot_devices;
```

---

## 🐛 Troubleshooting

### Error: "violates foreign key constraint"

**Penyebab:** Ada transaksi yang reference ke device yang mau dihapus.

**Solusi:**

**Opsi 1:** Hapus transaksi dulu
```sql
DELETE FROM transactions WHERE device_id = 'DEVICE_YANG_MAU_DIHAPUS';
DELETE FROM iot_devices WHERE device_id = 'DEVICE_YANG_MAU_DIHAPUS';
```

**Opsi 2:** Update transaksi ke ESP32-BOTOL-01
```sql
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01' 
WHERE device_id = 'DEVICE_YANG_MAU_DIHAPUS';

DELETE FROM iot_devices WHERE device_id = 'DEVICE_YANG_MAU_DIHAPUS';
```

**Opsi 3:** Disable foreign key check (tidak recommended)
```sql
-- Temporary disable
ALTER TABLE transactions DISABLE TRIGGER ALL;
DELETE FROM iot_devices WHERE device_id != 'ESP32-BOTOL-01';
ALTER TABLE transactions ENABLE TRIGGER ALL;
```

### Device Status di Dashboard Masih Tampil Device Lain

**Penyebab:** Cache atau data belum refresh.

**Solusi:**
1. Hard refresh browser: **Ctrl+F5**
2. Clear browser cache
3. Restart dev server: `npm run dev`
4. Tunggu auto-refresh (30 detik)

### Transaksi Hilang Setelah Hapus Device

**Penyebab:** Foreign key `ON DELETE CASCADE` aktif.

**Solusi:** Restore dari backup atau insert ulang device.

---

## 📋 Checklist

- [ ] Backup data device (copy hasil query)
- [ ] Cek transaksi terkait
- [ ] Jalankan DELETE query
- [ ] Verifikasi hanya ESP32-BOTOL-01 yang tersisa
- [ ] Cek transaksi masih ada
- [ ] Test dashboard
- [ ] Update info ESP32-BOTOL-01 (opsional)
- [ ] Clean up transaksi orphan (opsional)

---

## 📁 File SQL

File SQL lengkap: **`delete-other-devices.sql`**

Copy-paste ke Supabase SQL Editor dan jalankan step by step!

---

## ✅ Expected Result

**Sebelum:**
```
iot_devices:
- ESP32-BOTOL-01
- ESP32-BOTOL-02
- ESP32-BOTOL-03
- ...
```

**Setelah:**
```
iot_devices:
- ESP32-BOTOL-01 ✅
```

**Transaksi:** Tetap ada (tidak terhapus)

**Dashboard:** Hanya tampil ESP32-BOTOL-01

---

**Done!** 🎉
