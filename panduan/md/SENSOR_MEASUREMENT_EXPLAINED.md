# 📏 Cara Sensor Mengukur Ukuran Botol

## 🤔 **Pertanyaan:**
Bagaimana sensor ultrasonic yang mengukur **jarak** bisa menentukan **tinggi dan lebar** botol?

---

## 💡 **Konsep Dasar:**

Sensor ultrasonic mengukur **jarak dari sensor ke objek**. Dengan menempatkan sensor pada **posisi tetap**, kita bisa menghitung dimensi botol dengan cara:

```
Dimensi Botol = Jarak Maksimal - Jarak Terukur
```

---

## 🏗️ **Setup Fisik Sistem:**

### **Posisi Botol: HORIZONTAL (Tidur)**

```
┌─────────────────────────────────────────────────────┐
│                  KOTAK SENSOR                       │
│                                                     │
│  [Sensor HEIGHT]                                    │
│       ↓                                             │
│       │ ← Jarak ke botol                            │
│       ↓                                             │
│  ┌────────────────┐  ← Botol (tidur/horizontal)    │
│  │    BOTOL       │                                 │
│  │   ═══════      │                                 │
│  └────────────────┘                                 │
│       ↑                                             │
│       │ ← Jarak ke botol                            │
│       ↑                                             │
│  [Sensor LENGTH]                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📐 **Cara Kerja Pengukuran:**

### **1. Sensor HEIGHT (Mengukur DIAMETER Botol)**

**Setup:**
- Sensor dipasang di **atas** kotak
- Menghadap ke **bawah**
- Jarak dari sensor ke dasar kotak: **30 cm** (contoh)

**Cara Hitung:**
```
Diameter Botol = Jarak Maksimal - Jarak Terukur
```

**Contoh:**

#### **Tanpa Botol:**
```
[Sensor HEIGHT]
      ↓
      │ 30 cm (jarak ke dasar)
      ↓
═════════════ (dasar kotak)
```
**Jarak terukur:** 30 cm

#### **Dengan Botol Kecil (diameter 6 cm):**
```
[Sensor HEIGHT]
      ↓
      │ 24 cm (jarak ke botol)
      ↓
  ┌───────┐
  │ BOTOL │ ← 6 cm diameter
  └───────┘
═════════════ (dasar kotak)
```
**Jarak terukur:** 24 cm  
**Diameter botol:** 30 - 24 = **6 cm** ✅

#### **Dengan Botol Besar (diameter 10 cm):**
```
[Sensor HEIGHT]
      ↓
      │ 20 cm (jarak ke botol)
      ↓
  ┌─────────┐
  │  BOTOL  │ ← 10 cm diameter
  └─────────┘
═════════════ (dasar kotak)
```
**Jarak terukur:** 20 cm  
**Diameter botol:** 30 - 20 = **10 cm** ✅

---

### **2. Sensor LENGTH (Mengukur PANJANG Botol)**

**Setup:**
- Sensor dipasang di **samping** kotak
- Menghadap ke **dalam**
- Jarak dari sensor ke dinding berlawanan: **40 cm** (contoh)

**Cara Hitung:**
```
Panjang Botol = Jarak Maksimal - Jarak Terukur
```

**Contoh:**

#### **Tanpa Botol:**
```
[Sensor LENGTH] ←─────── 40 cm ───────→ │ (dinding)
```
**Jarak terukur:** 40 cm

#### **Dengan Botol Pendek (panjang 15 cm):**
```
[Sensor LENGTH] ←─ 25 cm ─→ [═══BOTOL═══] ← 15 cm → │
```
**Jarak terukur:** 25 cm  
**Panjang botol:** 40 - 25 = **15 cm** ✅

#### **Dengan Botol Panjang (panjang 30 cm):**
```
[Sensor LENGTH] ←─ 10 cm ─→ [═══════BOTOL═══════] ← 30 cm → │
```
**Jarak terukur:** 10 cm  
**Panjang botol:** 40 - 10 = **30 cm** ✅

---

## 🎯 **Klasifikasi Ukuran Botol:**

Setelah mendapat **diameter** dan **panjang**, sistem mengklasifikasikan botol:

### **Botol KECIL (330ml)**
```cpp
#define SMALL_HEIGHT_MIN 5      // Diameter min: 5 cm
#define SMALL_HEIGHT_MAX 11     // Diameter max: 11 cm
#define SMALL_LENGTH_MIN 8      // Panjang min: 8 cm
#define SMALL_LENGTH_MAX 13     // Panjang max: 13 cm
#define SMALL_POINTS 5          // Poin: 5
```

**Contoh:**
- Diameter: 6 cm ✅ (dalam range 5-11)
- Panjang: 12 cm ✅ (dalam range 8-13)
- **Klasifikasi: KECIL** → **5 poin**

---

### **Botol SEDANG (600ml)**
```cpp
#define MEDIUM_HEIGHT_MIN 12    // Diameter min: 12 cm
#define MEDIUM_HEIGHT_MAX 16    // Diameter max: 16 cm
#define MEDIUM_LENGTH_MIN 15    // Panjang min: 15 cm
#define MEDIUM_LENGTH_MAX 20    // Panjang max: 20 cm
#define MEDIUM_POINTS 10        // Poin: 10
```

**Contoh:**
- Diameter: 14 cm ✅ (dalam range 12-16)
- Panjang: 18 cm ✅ (dalam range 15-20)
- **Klasifikasi: SEDANG** → **10 poin**

---

### **Botol BESAR (1.5L)**
```cpp
#define LARGE_HEIGHT_MIN 18     // Diameter min: 18 cm
#define LARGE_HEIGHT_MAX 22     // Diameter max: 22 cm
#define LARGE_LENGTH_MIN 21     // Panjang min: 21 cm
#define LARGE_LENGTH_MAX 30     // Panjang max: 30 cm
#define LARGE_POINTS 15         // Poin: 15
```

**Contoh:**
- Diameter: 20 cm ✅ (dalam range 18-22)
- Panjang: 25 cm ✅ (dalam range 21-30)
- **Klasifikasi: BESAR** → **15 poin**

---

## 🔍 **Fungsi Klasifikasi di Kode:**

```cpp
BottleSize classifyBottle(int height, int length, float weight) {
  // Validasi input
  if (height < HEIGHT_MIN_CM || height > HEIGHT_MAX_CM || 
      length < LENGTH_MIN_CM || length > LENGTH_MAX_CM) {
    return NONE;  // Ukuran tidak valid
  }
  
  // Botol KECIL
  if (height >= SMALL_HEIGHT_MIN && height < SMALL_HEIGHT_MAX && 
      length >= SMALL_LENGTH_MIN && length < SMALL_LENGTH_MAX) {
    return SMALL;  // 5 poin
  }
  
  // Botol SEDANG
  if (height >= MEDIUM_HEIGHT_MIN && height < MEDIUM_HEIGHT_MAX && 
      length >= MEDIUM_LENGTH_MIN && length < MEDIUM_LENGTH_MAX) {
    return MEDIUM;  // 10 poin
  }
  
  // Botol BESAR
  if (height >= LARGE_HEIGHT_MIN && height <= LARGE_HEIGHT_MAX && 
      length >= LARGE_LENGTH_MIN && length <= LARGE_LENGTH_MAX) {
    return LARGE;  // 15 poin
  }
  
  return NONE;  // Tidak masuk kategori
}
```

---

## 📊 **Diagram Lengkap:**

```
┌─────────────────────────────────────────────────────────────┐
│                    KOTAK PENGUKURAN                         │
│                                                             │
│  [Sensor HEIGHT] ← Dipasang di atas, menghadap ke bawah    │
│         ↓                                                   │
│         │ Jarak A (misal: 24 cm)                            │
│         ↓                                                   │
│    ┌─────────────────────┐                                 │
│    │                     │ ← Botol (horizontal)            │
│    │   ═══════════════   │                                 │
│    │                     │                                 │
│    └─────────────────────┘                                 │
│         ↑                                                   │
│         │ Jarak B (misal: 6 cm dari dasar)                 │
│         ↓                                                   │
│  ═══════════════════════════════ (dasar kotak)             │
│                                                             │
│  [Sensor LENGTH] ←─ Jarak C (misal: 25 cm) ─→ [BOTOL]     │
│  (samping kiri)                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Perhitungan:
- Diameter Botol = 30 cm (tinggi kotak) - 24 cm (jarak A) = 6 cm
- Panjang Botol = 40 cm (lebar kotak) - 25 cm (jarak C) = 15 cm

Klasifikasi:
- Diameter: 6 cm → dalam range SMALL (5-11 cm) ✅
- Panjang: 15 cm → dalam range SMALL (8-13 cm)? TIDAK! ❌
- Panjang: 15 cm → dalam range MEDIUM (15-20 cm) ✅

Hasil: MEDIUM (10 poin)
```

---

## ⚙️ **Cara Kalibrasi:**

### **1. Ukur Dimensi Kotak**

Ukur jarak dari sensor ke:
- **Sensor HEIGHT:** Jarak ke dasar kotak (misal: 30 cm)
- **Sensor LENGTH:** Jarak ke dinding berlawanan (misal: 40 cm)

---

### **2. Test Tanpa Botol**

```cpp
// Jalankan command di Serial Monitor
TEST
```

**Expected:**
```
[Test] HEIGHT (stable): 30 cm  ← Jarak ke dasar
[Test] LENGTH (stable): 40 cm  ← Jarak ke dinding
```

---

### **3. Test Dengan Botol**

Letakkan botol di kotak, lalu jalankan:
```cpp
TEST
```

**Expected:**
```
[Test] HEIGHT (stable): 24 cm  ← Jarak ke botol
[Test] LENGTH (stable): 25 cm  ← Jarak ke botol

Diameter Botol = 30 - 24 = 6 cm
Panjang Botol = 40 - 25 = 15 cm
```

---

### **4. Sesuaikan Range Klasifikasi**

Jika hasil tidak sesuai, edit nilai di `main.cpp`:

```cpp
// Botol KECIL
#define SMALL_HEIGHT_MIN 5      // ← Sesuaikan
#define SMALL_HEIGHT_MAX 11     // ← Sesuaikan
#define SMALL_LENGTH_MIN 8      // ← Sesuaikan
#define SMALL_LENGTH_MAX 13     // ← Sesuaikan

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 12    // ← Sesuaikan
#define MEDIUM_HEIGHT_MAX 16    // ← Sesuaikan
#define MEDIUM_LENGTH_MIN 15    // ← Sesuaikan
#define MEDIUM_LENGTH_MAX 20    // ← Sesuaikan

// Botol BESAR
#define LARGE_HEIGHT_MIN 18     // ← Sesuaikan
#define LARGE_HEIGHT_MAX 22     // ← Sesuaikan
#define LARGE_LENGTH_MIN 21     // ← Sesuaikan
#define LARGE_LENGTH_MAX 30     // ← Sesuaikan
```

---

## 🎯 **Tips Akurasi:**

### **1. Posisi Sensor Harus Tetap**
- Pasang sensor dengan kuat (tidak goyang)
- Gunakan bracket atau holder

### **2. Botol Harus Posisi Konsisten**
- Selalu letakkan botol **horizontal** (tidur)
- Posisi botol di **tengah** kotak

### **3. Hindari Interferensi**
- Jangan ada objek lain di kotak
- Permukaan botol harus bersih (tidak basah)

### **4. Kalibrasi Berkala**
- Test sensor setiap hari
- Cek jarak tanpa botol (harus konsisten)

---

## 📝 **Summary:**

| Sensor | Mengukur | Cara Hitung | Hasil |
|--------|----------|-------------|-------|
| **HEIGHT** | Diameter botol | `Tinggi Kotak - Jarak Terukur` | Diameter (cm) |
| **LENGTH** | Panjang botol | `Lebar Kotak - Jarak Terukur` | Panjang (cm) |

**Klasifikasi:**
- **KECIL:** Diameter 5-11 cm, Panjang 8-13 cm → 5 poin
- **SEDANG:** Diameter 12-16 cm, Panjang 15-20 cm → 10 poin
- **BESAR:** Diameter 18-22 cm, Panjang 21-30 cm → 15 poin

---

## 🚀 **Kesimpulan:**

Sensor ultrasonic mengukur **jarak**, tapi dengan **setup yang tepat**, kita bisa mengubah jarak menjadi **dimensi fisik** botol (diameter dan panjang). Sistem kemudian mengklasifikasikan botol berdasarkan dimensi tersebut.

**Kunci sukses:**
1. ✅ Posisi sensor tetap
2. ✅ Botol posisi konsisten
3. ✅ Kalibrasi yang tepat
4. ✅ Range klasifikasi yang sesuai

**Selamat mencoba! 🎉**
