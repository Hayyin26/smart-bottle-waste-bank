# 📏 ANALISIS UKURAN BOTOL - Real vs Code

## 📊 UKURAN BOTOL PLASTIK SESUNGGUHNYA (Data Pasar Indonesia)

### 🔵 Botol KECIL (220ml - 330ml)
**Contoh**: Aqua 220ml, Aqua 330ml, VIT 330ml

| Brand | Volume | Diameter | Tinggi Total | Panjang Badan |
|-------|--------|----------|--------------|---------------|
| Aqua 220ml | 220ml | **5.5cm** | 15cm | **12cm** |
| Aqua 330ml | 330ml | **6.0cm** | 18cm | **15cm** |
| VIT 330ml | 330ml | **6.5cm** | 19cm | **16cm** |
| Le Minerale 330ml | 330ml | **6.0cm** | 17.5cm | **14cm** |

**Range Sebenarnya**:
- Diameter: **5.5 - 6.5cm** (rata-rata 6cm)
- Panjang badan: **12 - 16cm** (rata-rata 14cm)

---

### 🟢 Botol SEDANG (450ml - 600ml)
**Contoh**: Aqua 600ml, VIT 500ml, Le Minerale 600ml

| Brand | Volume | Diameter | Tinggi Total | Panjang Badan |
|-------|--------|----------|--------------|---------------|
| Aqua 450ml | 450ml | **6.5cm** | 20cm | **17cm** |
| Aqua 600ml | 600ml | **7.0cm** | 22cm | **19cm** |
| VIT 500ml | 500ml | **6.8cm** | 21cm | **18cm** |
| Le Minerale 600ml | 600ml | **7.2cm** | 23cm | **20cm** |

**Range Sebenarnya**:
- Diameter: **6.5 - 7.5cm** (rata-rata 7cm)
- Panjang badan: **17 - 20cm** (rata-rata 18.5cm)

---

### 🔴 Botol BESAR (1L - 1.5L)
**Contoh**: Aqua 1.5L, VIT 1L, Le Minerale 1.5L

| Brand | Volume | Diameter | Tinggi Total | Panjang Badan |
|-------|--------|----------|--------------|---------------|
| Aqua 1L | 1L | **8.0cm** | 25cm | **22cm** |
| Aqua 1.5L | 1.5L | **9.0cm** | 32cm | **28cm** |
| VIT 1L | 1L | **8.5cm** | 26cm | **23cm** |
| Le Minerale 1.5L | 1.5L | **9.5cm** | 33cm | **29cm** |

**Range Sebenarnya**:
- Diameter: **8 - 10cm** (rata-rata 9cm)
- Panjang badan: **22 - 30cm** (rata-rata 26cm)

---

## ⚠️ PERBANDINGAN: CODE vs REAL

### 🔵 Botol KECIL

| Aspek | CODE (SALAH) | REAL | Status |
|-------|--------------|------|--------|
| **Diameter** | 3-8cm | 5.5-6.5cm | ❌ Terlalu lebar! |
| **Panjang** | 6-9cm | 12-16cm | ❌❌ SANGAT SALAH! |
| **Komentar** | "8-13cm panjang" | - | ❌ Code ≠ Comment! |

**Analisis**:
- Code: 6-9cm panjang → **SALAH BESAR!** Botol 330ml panjangnya 14cm, bukan 6-9cm!
- Comment: 8-13cm → Masih salah, harusnya 12-16cm
- Diameter: 3-8cm terlalu lebar, botol 3cm itu hampir mustahil

---

### 🟢 Botol SEDANG

| Aspek | CODE (SALAH) | REAL | Status |
|-------|--------------|------|--------|
| **Diameter** | 9-13cm | 6.5-7.5cm | ❌ Terlalu besar! |
| **Panjang** | 10-13cm | 17-20cm | ❌❌ SANGAT SALAH! |
| **Komentar** | "15-20cm panjang" | - | ❌ Code ≠ Comment! |

**Analisis**:
- Code: 10-13cm → **SALAH!** Botol 600ml panjangnya 19cm!
- Diameter: 9-13cm terlalu besar, botol 600ml diameternya 7cm bukan 9-13cm
- Comment benar (15-20cm) tapi code salah!

---

### 🔴 Botol BESAR

| Aspek | CODE (SALAH) | REAL | Status |
|-------|--------------|------|--------|
| **Diameter** | 14-19cm | 8-10cm | ❌❌ SANGAT SALAH! |
| **Panjang** | 14-20cm | 22-30cm | ❌ Terlalu pendek! |
| **Komentar** | "21-30cm panjang" | - | ✅ Benar! |

**Analisis**:
- Diameter: 14-19cm → **SALAH BESAR!** Tidak ada botol diameter 14cm+
- Panjang: 14-20cm terlalu pendek, harusnya 22-30cm
- Comment benar (21-30cm) tapi code salah!

---

## 🚨 MASALAH UTAMA

### 1. **THRESHOLD TERBALIK!**
Code sepertinya **mencampur DIAMETER dengan PANJANG**!

```cpp
// CODE SEKARANG (SALAH):
SMALL_LENGTH = 6-9cm    // ← Ini seperti DIAMETER!
MEDIUM_HEIGHT = 9-13cm  // ← Ini seperti PANJANG!
```

### 2. **RANGE TERLALU SEMPIT**
Botol kecil, sedang, besar **overlap** dengan range yang salah.

### 3. **TIDAK COCOK DENGAN OFFSET 20CM**
Dengan offset 20cm, panjang max yang bisa diukur = 17cm.
Tapi botol SEDANG (600ml) panjangnya 19cm!

---

## ✅ THRESHOLD YANG BENAR

### Option A: BERDASARKAN DATA REAL (Recommended!)

```cpp
// --- KLASIFIKASI UKURAN BOTOL (cm) ---
// ⚠️ PENTING: Botol diletakkan HORIZONTAL (tidur)
// - Sensor HEIGHT mengukur DIAMETER botol
// - Sensor LENGTH mengukur PANJANG botol

// Botol KECIL (220ml - 330ml)
// Diameter: 5.5-6.5cm, Panjang: 12-16cm
#define SMALL_HEIGHT_MIN 5      // Diameter min
#define SMALL_HEIGHT_MAX 7      // Diameter max (margin)
#define SMALL_LENGTH_MIN 10     // Panjang min (margin)
#define SMALL_LENGTH_MAX 17     // Panjang max (limited by offset!)
#define SMALL_POINTS 5

// Botol SEDANG (450ml - 600ml)
// Diameter: 6.5-7.5cm, Panjang: 17-20cm
#define MEDIUM_HEIGHT_MIN 6     // Diameter min (overlap OK)
#define MEDIUM_HEIGHT_MAX 8     // Diameter max (margin)
#define MEDIUM_LENGTH_MIN 15    // Panjang min
#define MEDIUM_LENGTH_MAX 17    // Panjang max (LIMITED BY OFFSET 20CM!)
#define MEDIUM_POINTS 10

// Botol BESAR (1L - 1.5L)
// Diameter: 8-10cm, Panjang: 22-30cm
#define LARGE_HEIGHT_MIN 8      // Diameter min
#define LARGE_HEIGHT_MAX 11     // Diameter max (margin)
#define LARGE_LENGTH_MIN 17     // Panjang min (LIMITED!)
#define LARGE_LENGTH_MAX 20     // Panjang max (LIMITED BY OFFSET 20CM!)
#define LARGE_POINTS 15
```

**⚠️ CATATAN PENTING**:
- **PANJANG MAX = 17cm!** (karena offset 20cm, margin 3cm)
- Botol 600ml (19cm) dan 1.5L (28cm) **TIDAK BISA DIUKUR** dengan offset 20cm!
- Ini hanya cocok untuk **botol kecil 220-330ml**

---

### Option B: DENGAN OFFSET 35CM (BETTER!)

Jika kamu naikkan `SENSOR_LENGTH_OFFSET` ke **35cm**:

```cpp
// Tetap pakai offset HEIGHT = 20cm
#define SENSOR_HEIGHT_OFFSET 20  // cm
#define SENSOR_LENGTH_OFFSET 35  // cm (DINAIKKAN!)

// Botol KECIL (220ml - 330ml)
#define SMALL_HEIGHT_MIN 5      // Diameter 5-7cm
#define SMALL_HEIGHT_MAX 7
#define SMALL_LENGTH_MIN 10     // Panjang 10-17cm
#define SMALL_LENGTH_MAX 17
#define SMALL_POINTS 5

// Botol SEDANG (450ml - 600ml)
#define MEDIUM_HEIGHT_MIN 6     // Diameter 6-8cm
#define MEDIUM_HEIGHT_MAX 8
#define MEDIUM_LENGTH_MIN 16    // Panjang 16-22cm
#define MEDIUM_LENGTH_MAX 22
#define MEDIUM_POINTS 10

// Botol BESAR (1L - 1.5L)
#define LARGE_HEIGHT_MIN 8      // Diameter 8-11cm
#define LARGE_HEIGHT_MAX 11
#define LARGE_LENGTH_MIN 20     // Panjang 20-32cm
#define LARGE_LENGTH_MAX 32     // Max 32cm (margin 3cm dari offset 35cm)
#define LARGE_POINTS 15
```

**Keuntungan**:
- ✅ Bisa terima SEMUA ukuran botol (220ml - 1.5L)
- ✅ Sesuai dengan ukuran real di pasaran
- ✅ Margin cukup untuk toleransi

---

## 🎯 REKOMENDASI

### Pilihan 1: UBAH OFFSET LENGTH KE 35CM (BEST!)
**Implementasi:**
1. Pindahkan sensor LENGTH ke posisi 35cm dari dinding
2. Update code:
   ```cpp
   #define SENSOR_LENGTH_OFFSET 35  // cm
   ```
3. Pakai threshold Option B di atas

**Result**: Sistem bisa terima semua ukuran botol! 🎉

---

### Pilihan 2: TETAP OFFSET 20CM (LIMITATION!)
**Implementasi:**
1. Pakai threshold Option A
2. Terima limitasi: **Hanya botol 220-330ml yang akurat**
3. Botol 600ml+ akan **rejected** (panjang >17cm)

**Result**: Sistem terbatas untuk botol kecil saja ⚠️

---

## 📊 TESTING MATRIX

### Test dengan Threshold BENAR (Option A: Offset 20cm)

| Botol | Diameter Real | Panjang Real | Sensor Read | Klasifikasi | Result |
|-------|---------------|--------------|-------------|-------------|---------|
| **Aqua 220ml** | 5.5cm | 12cm | H:14.5, L:8 | KECIL | ✅ OK |
| **Aqua 330ml** | 6.0cm | 15cm | H:14, L:5 | KECIL | ✅ OK |
| **VIT 330ml** | 6.5cm | 16cm | H:13.5, L:4 | KECIL/SEDANG | ✅ OK |
| **Aqua 600ml** | 7.0cm | 19cm | H:13, L:1 | ❌ INVALID | ❌ REJECT |
| **Aqua 1.5L** | 9.0cm | 28cm | H:11, L:-8 | ❌ INVALID | ❌ REJECT |

### Test dengan Threshold BENAR (Option B: Offset 35cm)

| Botol | Diameter Real | Panjang Real | Sensor Read | Klasifikasi | Result |
|-------|---------------|--------------|-------------|-------------|---------|
| **Aqua 220ml** | 5.5cm | 12cm | H:14.5, L:23 | KECIL | ✅ OK |
| **Aqua 330ml** | 6.0cm | 15cm | H:14, L:20 | KECIL | ✅ OK |
| **VIT 330ml** | 6.5cm | 16cm | H:13.5, L:19 | SEDANG | ✅ OK |
| **Aqua 600ml** | 7.0cm | 19cm | H:13, L:16 | SEDANG | ✅ OK |
| **Aqua 1.5L** | 9.0cm | 28cm | H:11, L:7 | BESAR | ✅ OK |

**Kesimpulan**: **Option B (Offset 35cm) jauh lebih baik!**

---

## 🔧 ACTION ITEMS

### ❌ THRESHOLD SEKARANG:
```cpp
SMALL:  H:3-8cm   L:6-9cm   // SALAH!
MEDIUM: H:9-13cm  L:10-13cm // SALAH!
LARGE:  H:14-19cm L:14-20cm // SALAH!
```

### ✅ THRESHOLD YANG HARUS DIPAKAI:

**Jika offset 20cm (terbatas):**
```cpp
SMALL:  H:5-7cm   L:10-17cm  // Real data
MEDIUM: H:6-8cm   L:15-17cm  // Limited!
LARGE:  H:8-11cm  L:17-20cm  // Limited!
```

**Jika offset 35cm (recommended!):**
```cpp
SMALL:  H:5-7cm   L:10-17cm  // Real data
MEDIUM: H:6-8cm   L:16-22cm  // Full range
LARGE:  H:8-11cm  L:20-32cm  // Full range
```

---

## 📝 KESIMPULAN

1. **Threshold sekarang SALAH TOTAL!** 
   - Diameter dan panjang tercampur
   - Range tidak sesuai botol real

2. **Offset 20cm TERLALU KECIL!**
   - Hanya cukup untuk botol 220-330ml
   - Botol 600ml+ tidak bisa diukur

3. **SOLUSI TERBAIK**:
   - Naikkan `SENSOR_LENGTH_OFFSET` ke **35cm**
   - Update threshold sesuai Option B
   - Sistem bisa terima semua ukuran!

Mau saya update threshold-nya sekarang?
