# 📏 Panduan Klasifikasi Ukuran Botol

## 🎯 Sistem Klasifikasi

Sistem IoT Bank Sampah sekarang dapat membedakan 3 kategori ukuran botol dengan poin yang berbeda:

| Kategori | Tinggi (cm) | Diameter (cm) | Poin | Contoh Botol |
|----------|-------------|---------------|------|--------------|
| **KECIL** | 8 - 15 | 3 - 6 | **5 poin** | Air mineral 330ml, botol sirup kecil |
| **SEDANG** | 15 - 22 | 6 - 9 | **10 poin** | Air mineral 600ml, minuman ringan |
| **BESAR** | 22 - 30 | 9 - 12 | **15 poin** | Air mineral 1.5L, botol detergen |

---

## 🔧 Cara Kerja Sistem

### 1. **Deteksi Botol**
- Sensor ultrasonik mengukur **tinggi** dan **diameter** botol
- Sistem mengambil **5 sampel** dan menggunakan nilai **median** untuk akurasi

### 2. **Klasifikasi**
```cpp
BottleSize classifyBottle(int height, int length) {
  // Cek apakah ukuran dalam rentang valid
  if (height < 8 || height > 30 || length < 3 || length > 12) {
    return NONE; // Ditolak
  }
  
  // Klasifikasi berdasarkan tinggi dan diameter
  if (height >= 8 && height < 15 && length >= 3 && length < 6) {
    return SMALL; // 5 poin
  }
  
  if (height >= 15 && height < 22 && length >= 6 && length < 9) {
    return MEDIUM; // 10 poin
  }
  
  if (height >= 22 && height <= 30 && length >= 9 && length <= 12) {
    return LARGE; // 15 poin
  }
  
  return NONE; // Tidak masuk kategori
}
```

### 3. **Pemberian Poin**
- **KECIL**: 5 poin
- **SEDANG**: 10 poin
- **BESAR**: 15 poin

### 4. **Penyimpanan Data**
Data yang disimpan ke database:
```json
{
  "user_id": "uuid",
  "device_id": "ESP32-BOTOL-01",
  "points_earned": 10,
  "bottle_size": "SEDANG"
}
```

---

## 📱 Tampilan LCD

### Saat Deteksi Botol:
```
┌────────────────┐
│ BOTOL SEDANG   │
│ +10 POIN       │
└────────────────┘
```

### Saat Berhasil:
```
┌────────────────┐
│ SUCCESS!       │
│ SEDANG 10PT    │
└────────────────┘
```

### Saat Ditolak:
```
┌────────────────┐
│ UKURAN SALAH   │
│ H:35 L:15      │
└────────────────┘
```

---

## 🔍 Serial Monitor Output

```
[Bottle] Size: SEDANG
[Bottle] Height: 18cm, Length: 7cm
[Bottle] Points: 10
[Supabase] Mengirim data:
{"user_id":"...","device_id":"ESP32-BOTOL-01","points_earned":10,"bottle_size":"SEDANG"}
[Supabase] ✅ Data Terkirim! Respon: 201
```

---

## ⚙️ Konfigurasi Ukuran (Dapat Disesuaikan)

Jika ingin mengubah rentang ukuran atau poin, edit bagian ini di kode ESP32:

```cpp
// Botol KECIL
#define SMALL_HEIGHT_MIN 8
#define SMALL_HEIGHT_MAX 15
#define SMALL_LENGTH_MIN 3
#define SMALL_LENGTH_MAX 6
#define SMALL_POINTS 5

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 15
#define MEDIUM_HEIGHT_MAX 22
#define MEDIUM_LENGTH_MIN 6
#define MEDIUM_LENGTH_MAX 9
#define MEDIUM_POINTS 10

// Botol BESAR
#define LARGE_HEIGHT_MIN 22
#define LARGE_HEIGHT_MAX 30
#define LARGE_LENGTH_MIN 9
#define LARGE_LENGTH_MAX 12
#define LARGE_POINTS 15
```

---

## 🧪 Cara Testing

### 1. **Upload Kode ke ESP32**
```bash
# Buka Arduino IDE
# Pilih Board: ESP32 Dev Module
# Upload ESP32_UPDATED_CODE.ino
```

### 2. **Jalankan SQL untuk Update Database**
```sql
-- Di Supabase SQL Editor
-- Run: add-bottle-size-column.sql
```

### 3. **Test dengan Botol Berbeda**

| Test Case | Tinggi | Diameter | Expected Result |
|-----------|--------|----------|-----------------|
| Botol kecil | 12 cm | 5 cm | KECIL - 5 poin |
| Botol sedang | 18 cm | 7 cm | SEDANG - 10 poin |
| Botol besar | 25 cm | 10 cm | BESAR - 15 poin |
| Botol terlalu besar | 35 cm | 15 cm | DITOLAK |
| Botol terlalu kecil | 5 cm | 2 cm | DITOLAK |

### 4. **Cek Serial Monitor**
```
[Bottle] Size: SEDANG
[Bottle] Height: 18cm, Length: 7cm
[Bottle] Points: 10
```

### 5. **Cek Database**
```sql
SELECT 
  created_at,
  bottle_size,
  points_earned,
  device_id
FROM transactions
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📊 Statistik Ukuran Botol

Query untuk melihat distribusi ukuran botol:

```sql
-- Total transaksi per ukuran
SELECT 
  bottle_size,
  COUNT(*) as total_transactions,
  SUM(points_earned) as total_points
FROM transactions
WHERE bottle_size IS NOT NULL
GROUP BY bottle_size
ORDER BY total_points DESC;

-- Ukuran botol paling populer per user
SELECT 
  p.full_name,
  t.bottle_size,
  COUNT(*) as count,
  SUM(t.points_earned) as total_points
FROM transactions t
JOIN profiles p ON t.user_id = p.id
WHERE t.bottle_size IS NOT NULL
GROUP BY p.full_name, t.bottle_size
ORDER BY count DESC;
```

---

## 🎨 Visualisasi di Web App (Opsional)

Untuk menampilkan statistik ukuran botol di dashboard user:

```typescript
// src/app/(user)/dashboard/page.tsx
const bottleSizeStats = await supabase
  .from('transactions')
  .select('bottle_size, points_earned')
  .eq('user_id', userId);

const stats = {
  small: bottleSizeStats.filter(t => t.bottle_size === 'KECIL').length,
  medium: bottleSizeStats.filter(t => t.bottle_size === 'SEDANG').length,
  large: bottleSizeStats.filter(t => t.bottle_size === 'BESAR').length,
};
```

---

## 🐛 Troubleshooting

### Botol Selalu Ditolak
- **Cek sensor ultrasonik**: Pastikan tidak ada penghalang
- **Cek Serial Monitor**: Lihat nilai height dan length yang terbaca
- **Kalibrasi sensor**: Ukur botol manual dan bandingkan dengan pembacaan sensor

### Klasifikasi Salah
- **Sesuaikan rentang ukuran**: Edit `#define` di kode
- **Cek posisi botol**: Pastikan botol tegak lurus
- **Cek jarak sensor**: Sensor harus mengukur dari titik yang sama

### Poin Tidak Sesuai
- **Cek konfigurasi poin**: Edit `SMALL_POINTS`, `MEDIUM_POINTS`, `LARGE_POINTS`
- **Cek database**: Pastikan kolom `bottle_size` sudah ada

---

## 📝 Checklist Deployment

- [ ] Upload kode ESP32 yang sudah diupdate
- [ ] Jalankan SQL `add-bottle-size-column.sql` di Supabase
- [ ] Test dengan botol kecil (5 poin)
- [ ] Test dengan botol sedang (10 poin)
- [ ] Test dengan botol besar (15 poin)
- [ ] Test dengan botol yang tidak valid (ditolak)
- [ ] Cek data di database (kolom `bottle_size` terisi)
- [ ] Cek Serial Monitor (log klasifikasi muncul)
- [ ] Cek LCD (tampilan ukuran dan poin benar)

---

## 🚀 Fitur Lanjutan (Opsional)

### 1. **Dynamic Pricing**
Ubah poin berdasarkan waktu atau stok:
```cpp
int getBottlePoints(BottleSize size) {
  int basePoints = 0;
  switch (size) {
    case SMALL: basePoints = 5; break;
    case MEDIUM: basePoints = 10; break;
    case LARGE: basePoints = 15; break;
  }
  
  // Bonus poin di akhir pekan
  if (isWeekend()) {
    basePoints *= 1.5;
  }
  
  return basePoints;
}
```

### 2. **Material Detection**
Tambahkan sensor untuk deteksi jenis material (plastik, kaca, aluminium)

### 3. **Weight Measurement**
Tambahkan load cell untuk mengukur berat botol

---

## 📞 Support

Jika ada pertanyaan atau masalah, cek:
1. Serial Monitor untuk log detail
2. Database untuk verifikasi data
3. LCD untuk feedback real-time
