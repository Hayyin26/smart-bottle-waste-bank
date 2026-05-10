# 🔧 Fix: Foreign Key Constraint Error

## ❌ Error

```
ERROR: 23503: update or delete on table "iot_devices" 
violates foreign key constraint "transactions_device_id_fkey" 
on table "transactions"

DETAIL: Key (device_id)=(device-001) is still referenced 
from table "transactions".
```

## 🔍 Penyebab

Ada transaksi di tabel `transactions` yang masih reference ke device yang mau dihapus (contoh: `device-001`).

Foreign key constraint mencegah penghapusan device yang masih digunakan oleh transaksi.

## ✅ Solusi

Ada 2 opsi:

### **Opsi 1: Pindahkan Transaksi ke ESP32-BOTOL-01** (RECOMMENDED)

Ini akan **mempertahankan history transaksi** tapi pindahkan ke device utama.

```sql
-- 1. Lihat transaksi yang akan dipindah
SELECT 
  device_id,
  COUNT(*) as total_transactions
FROM transactions
WHERE device_id != 'ESP32-BOTOL-01'
GROUP BY device_id;

-- 2. Pindahkan semua transaksi ke ESP32-BOTOL-01
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id != 'ESP32-BOTOL-01';

-- 3. Verifikasi - semua transaksi sekarang pakai ESP32-BOTOL-01
SELECT device_id, COUNT(*) as total 
FROM transactions 
GROUP BY device_id;

-- 4. Sekarang hapus device lain (aman!)
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- 5. Verifikasi hasil
SELECT * FROM iot_devices;
```

### **Opsi 2: Hapus Transaksi** (HATI-HATI!)

Ini akan **menghapus history transaksi** dari device lain.

```sql
-- 1. Backup dulu! Copy hasil query ini
SELECT * FROM transactions 
WHERE device_id != 'ESP32-BOTOL-01';

-- 2. Hapus transaksi dari device lain
DELETE FROM transactions 
WHERE device_id != 'ESP32-BOTOL-01';

-- 3. Sekarang hapus device
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';

-- 4. Verifikasi
SELECT * FROM iot_devices;
SELECT COUNT(*) FROM transactions;
```

---

## 🎯 Rekomendasi: Gunakan Opsi 1

**Keuntungan:**
- ✅ History transaksi tetap ada
- ✅ Total points user tidak berubah
- ✅ Statistik tetap akurat
- ✅ Tidak kehilangan data

**Kekurangan:**
- ⚠️ Semua transaksi seolah-olah dari ESP32-BOTOL-01
- ⚠️ Tidak bisa tracking device mana yang scan

---

## 📊 Penjelasan

### Sebelum Fix

```
iot_devices:
├── ESP32-BOTOL-01
├── device-001
└── device-002

transactions:
├── id: 1, device_id: ESP32-BOTOL-01, points: 10
├── id: 2, device_id: device-001, points: 10  ← Masih reference!
└── id: 3, device_id: device-002, points: 10  ← Masih reference!
```

**Tidak bisa hapus** `device-001` dan `device-002` karena masih ada transaksi yang pakai!

### Setelah Fix (Opsi 1)

```
iot_devices:
└── ESP32-BOTOL-01 ✅

transactions:
├── id: 1, device_id: ESP32-BOTOL-01, points: 10
├── id: 2, device_id: ESP32-BOTOL-01, points: 10  ← Dipindah!
└── id: 3, device_id: ESP32-BOTOL-01, points: 10  ← Dipindah!
```

**Bisa hapus** device lain karena semua transaksi sudah pakai `ESP32-BOTOL-01`!

---

## 🔄 Step-by-Step (Opsi 1)

### 1. Cek Transaksi per Device

```sql
SELECT 
  device_id,
  COUNT(*) as total_transactions,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM transactions
GROUP BY device_id
ORDER BY total_transactions DESC;
```

Output contoh:
```
device_id        | total_transactions | first_transaction | last_transaction
-----------------+--------------------+-------------------+------------------
device-001       | 15                 | 2024-01-01        | 2024-01-15
ESP32-BOTOL-01   | 5                  | 2024-01-10        | 2024-01-20
device-002       | 3                  | 2024-01-05        | 2024-01-08
```

### 2. Pindahkan Transaksi

```sql
-- Pindahkan semua transaksi ke ESP32-BOTOL-01
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id != 'ESP32-BOTOL-01';
```

Output: `UPDATE 18` (15 + 3 transaksi dipindah)

### 3. Verifikasi

```sql
SELECT device_id, COUNT(*) as total 
FROM transactions 
GROUP BY device_id;
```

Output:
```
device_id        | total
-----------------+-------
ESP32-BOTOL-01   | 23     ← Semua transaksi sekarang disini!
```

### 4. Hapus Device Lain

```sql
DELETE FROM iot_devices 
WHERE device_id != 'ESP32-BOTOL-01';
```

Output: `DELETE 2` (device-001 dan device-002 dihapus)

### 5. Final Check

```sql
-- Cek device
SELECT * FROM iot_devices;

-- Cek transaksi
SELECT COUNT(*) as total_transactions FROM transactions;

-- Cek points user (harus tetap sama)
SELECT id, full_name, total_points FROM profiles;
```

---

## 🐛 Troubleshooting

### Error: "column device_id does not exist"

**Penyebab:** Typo atau tabel salah.

**Fix:** Cek nama kolom yang benar:
```sql
\d transactions  -- PostgreSQL
-- atau
DESCRIBE transactions;  -- MySQL
```

### Transaksi Hilang Setelah Update

**Penyebab:** WHERE clause salah.

**Fix:** Cek dulu sebelum update:
```sql
-- Cek berapa yang akan diupdate
SELECT COUNT(*) FROM transactions 
WHERE device_id != 'ESP32-BOTOL-01';

-- Baru update
UPDATE transactions 
SET device_id = 'ESP32-BOTOL-01'
WHERE device_id != 'ESP32-BOTOL-01';
```

### Points User Berubah

**Penyebab:** Tidak mungkin, karena kita hanya update `device_id`, bukan `points_earned`.

**Verify:**
```sql
-- Cek total points sebelum dan sesudah
SELECT SUM(points_earned) as total_points FROM transactions;
```

Harus sama!

---

## 📋 Checklist

- [ ] Backup data transaksi (copy hasil query)
- [ ] Cek jumlah transaksi per device
- [ ] Pindahkan transaksi ke ESP32-BOTOL-01
- [ ] Verifikasi semua transaksi sudah pindah
- [ ] Hapus device lain
- [ ] Verifikasi hanya ESP32-BOTOL-01 yang tersisa
- [ ] Cek total transaksi masih sama
- [ ] Cek points user masih sama
- [ ] Refresh dashboard

---

## 📁 File SQL

- **Quick Fix:** `QUICK_DELETE_DEVICES.sql` (sudah diupdate)
- **Detailed Fix:** `fix-delete-devices-with-transactions.sql`
- **Guide:** `FIX_FOREIGN_KEY_ERROR.md` (file ini)

---

## ✅ Expected Result

**Sebelum:**
```
iot_devices: 3 devices
transactions: 23 transaksi (dari berbagai device)
```

**Setelah:**
```
iot_devices: 1 device (ESP32-BOTOL-01) ✅
transactions: 23 transaksi (semua dari ESP32-BOTOL-01) ✅
```

**Points user:** Tetap sama ✅  
**History transaksi:** Tetap ada ✅  
**Dashboard:** Hanya tampil ESP32-BOTOL-01 ✅

---

**Done! Sekarang bisa hapus device tanpa error!** 🎉
