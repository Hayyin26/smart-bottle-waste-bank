# ✅ BOX 20CM CALIBRATION - SETUP COMPLETE

## 📋 KONFIGURASI BOX KAMU

```
┌────────────────────────────────────────┐
│      [SENSOR HEIGHT]                   │
│            ↓↓↓                         │
│      ══════════════                    │
│            ↓ 20cm (offset)             │
│            ↓                           │
│        ┌───────┐                       │
│   [S]  │ BOTOL │                      │
│   [E]  │       │  ← Diameter (height) │
│   [N]  └───────┘                      │
│   [S]  ← 20cm → [DINDING]             │
│   [O]   (offset)                       │
│   [R]                                  │
│                                        │
│  [SENSOR LENGTH]                       │
└────────────────────────────────────────┘

Jarak sensor ke botol saat KOSONG: 20cm (keduanya)
```

## 🎯 KONFIGURASI YANG SUDAH DITERAPKAN

### 1. Offset Constants (SUDAH DISET)
```cpp
// --- KONFIGURASI JARAK SENSOR (OFFSET CALIBRATION) ---
#define SENSOR_HEIGHT_OFFSET 20  // cm - Jarak sensor atas ke dasar box
#define SENSOR_LENGTH_OFFSET 20  // cm - Jarak sensor samping ke dinding
```

### 2. Fungsi Konversi (SUDAH DITAMBAHKAN)
```cpp
int sensorDistanceToBottleSize(int sensorReading, int sensorOffset) {
  // Validasi reading
  if (sensorReading < 2 || sensorReading >= sensorOffset) {
    return -1;  // Invalid: tidak ada botol
  }
  
  // Ukuran botol = offset - reading
  int bottleSize = sensorOffset - sensorReading;
  
  // Validasi ukuran (3-35cm)
  if (bottleSize < 3 || bottleSize > 35) {
    return -1;  // Invalid size
  }
  
  return bottleSize;
}
```

### 3. Update Loop Sensor Reading (SUDAH DIUPDATE)
```cpp
// Baca jarak RAW dari sensor
int rawHeight = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
int rawLength = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);

// Convert ke ukuran botol SEBENARNYA
heightCm = sensorDistanceToBottleSize(rawHeight, SENSOR_HEIGHT_OFFSET);
lengthCm = sensorDistanceToBottleSize(rawLength, SENSOR_LENGTH_OFFSET);
```

### 4. Update TEST Command (SUDAH DIUPDATE)
```cpp
else if (command == "TEST") {
  // Tampilkan RAW reading DAN bottle size
  Serial.printf("HEIGHT: %d cm (raw) → %d cm (bottle)\n", rawHeight, heightBottle);
  Serial.printf("LENGTH: %d cm (raw) → %d cm (bottle)\n", rawLength, lengthBottle);
}
```

## 📊 CARA KERJA PERHITUNGAN

### Formula:
```
Ukuran Botol = Offset Sensor - Raw Reading

Contoh:
- Offset HEIGHT = 20cm (jarak sensor ke dasar saat kosong)
- Sensor baca = 14cm (jarak sensor ke botol)
- Diameter botol = 20 - 14 = 6cm ✅
```

### Contoh Kasus Nyata:

#### Botol KECIL (330ml): Diameter 6cm, Panjang 15cm
```
Sensor HEIGHT:
  Raw reading: 20 - 6 = 14cm
  Calculate: 20 - 14 = 6cm ✅ (diameter)

Sensor LENGTH:
  Raw reading: 20 - 15 = 5cm
  Calculate: 20 - 5 = 15cm ✅ (panjang)

Result: KECIL (5-11cm diameter, 8-13cm panjang)
        → Rejected! Length 15cm > max 13cm
```

⚠️ **PENTING**: Dengan offset 20cm, botol panjang >20cm **TIDAK BISA DIUKUR**!

#### Botol SEDANG (600ml): Diameter 7cm, Panjang 20cm
```
Sensor HEIGHT:
  Raw reading: 20 - 7 = 13cm
  Calculate: 20 - 13 = 7cm ✅

Sensor LENGTH:
  Raw reading: 20 - 20 = 0cm
  Calculate: INVALID! (reading < 2cm)

Result: REJECTED (tidak bisa ukur panjang)
```

⚠️ **MASALAH**: Botol sepanjang 20cm **TEPAT** sama dengan offset, sensor tidak bisa detect!

#### Botol yang Bisa Diukur dengan Akurat
```
Diameter: 5-17cm (max 17cm untuk margin 3cm)
Panjang:  5-17cm (max 17cm untuk margin 3cm)

Contoh OK:
- Botol kecil: 6cm x 12cm ✅
- Botol sedang: 7cm x 15cm ✅
- Botol custom: 8cm x 10cm ✅
```

## 🚨 LIMITASI OFFSET 20CM

### Range Botol yang Bisa Dideteksi:
```
Diameter (HEIGHT sensor):
  Min: 3cm (sensor reading 17cm)
  Max: 17cm (sensor reading 3cm)
  Ideal: 5-15cm

Panjang (LENGTH sensor):
  Min: 3cm (sensor reading 17cm)
  Max: 17cm (sensor reading 3cm)
  Ideal: 8-15cm

⚠️ Botol >17cm TIDAK BISA diukur dengan akurat!
```

### Ukuran Botol Standar vs Offset 20cm:
| Botol | Diameter | Panjang | Bisa Diukur? |
|-------|----------|---------|--------------|
| **330ml** | 6cm | 15cm | ✅ Keduanya OK |
| **600ml** | 7cm | 20cm | ❌ Panjang = offset! |
| **1.5L** | 9cm | 30cm | ❌ Panjang > offset! |

**Kesimpulan**: Offset 20cm **hanya cocok untuk botol KECIL** (<17cm)!

## 💡 SOLUSI & REKOMENDASI

### Option 1: NAIKKAN OFFSET (Recommended!)
Pindahkan sensor LENGTH lebih jauh:

```cpp
// Update offset LENGTH ke 35cm
#define SENSOR_HEIGHT_OFFSET 20  // OK untuk diameter
#define SENSOR_LENGTH_OFFSET 35  // Untuk botol panjang
```

**Keuntungan:**
- Bisa ukur botol sampai 32cm panjang
- Coverage lengkap: 330ml, 600ml, 1.5L
- Akurasi tetap bagus

**Kerugian:**
- Perlu ubah posisi sensor LENGTH di box
- Box harus lebih lebar (min 40cm)

### Option 2: BATASI UKURAN BOTOL (Simple)
Hanya terima botol kecil (<17cm):

```cpp
// Update threshold classifier
#define SMALL_LENGTH_MAX 12    // cm
#define MEDIUM_LENGTH_MIN 13   // cm
#define MEDIUM_LENGTH_MAX 16   // cm
#define LARGE_LENGTH_MIN 17    // cm (akan rejected)
```

**Keuntungan:**
- Tidak perlu ubah hardware
- Offset 20cm sudah cukup
- Simple implementation

**Kerugian:**
- Tidak bisa terima botol besar (1.5L)
- Hanya untuk botol 330ml-600ml kecil

### Option 3: SISTEM 2 SENSOR LENGTH (Advanced)
Pakai 2 sensor LENGTH di posisi berbeda:

```
Sensor LENGTH_1: 20cm (untuk botol pendek)
Sensor LENGTH_2: 35cm (untuk botol panjang)
```

**Keuntungan:**
- Coverage maksimal
- Auto-select sensor terbaik

**Kerugian:**
- Perlu sensor tambahan
- Code lebih kompleks

## 🧪 TESTING DENGAN OFFSET 20CM

### Step 1: Upload Code
1. Upload code yang sudah dikalibrasi
2. Buka Serial Monitor (115200 baud)
3. Tunggu ESP32 boot up

### Step 2: Test Box Kosong
```
Serial Monitor → TEST
```

**Expected Output:**
```
[Test] HEIGHT: 20 cm (raw) → -1 cm (bottle)
[Test] LENGTH: 20 cm (raw) → -1 cm (bottle)
[Test] Note: Negative bottle size = no bottle detected
```

✅ **Benar**: Nilai -1 karena tidak ada botol (raw = offset)

### Step 3: Test Botol Kecil (6cm x 12cm)
Taruh botol, lalu:
```
Serial Monitor → TEST
```

**Expected Output:**
```
[Test] HEIGHT: 14 cm (raw) → 6 cm (bottle diameter)
[Test] LENGTH: 8 cm (raw) → 12 cm (bottle length)
[Test] Metal: NO
```

✅ **Klasifikasi**: KECIL (5-11cm x 8-13cm)

### Step 4: Test Botol Sedang (7cm x 15cm)
```
[Test] HEIGHT: 13 cm (raw) → 7 cm (bottle)
[Test] LENGTH: 5 cm (raw) → 15 cm (bottle)
```

⚠️ **Masalah**: Length 15cm > SMALL_LENGTH_MAX (13cm)
→ Tidak masuk kategori KECIL
→ Tapi juga tidak masuk SEDANG (min 15cm, max 20cm)
→ **REJECTED!**

### Step 5: Fine-tune Threshold
Jika botol 15cm mau diterima:

```cpp
// Update threshold
#define SMALL_LENGTH_MAX 16    // Dari 13 → 16
#define MEDIUM_LENGTH_MIN 17   // Dari 15 → 17
```

## 📝 THRESHOLD YANG SESUAI OFFSET 20CM

### Threshold Recommended (untuk offset 20cm):
```cpp
// Botol KECIL (330ml kecil)
#define SMALL_HEIGHT_MIN 5     // cm
#define SMALL_HEIGHT_MAX 7     // cm
#define SMALL_LENGTH_MIN 8     // cm
#define SMALL_LENGTH_MAX 12    // cm
#define SMALL_POINTS 5

// Botol SEDANG (330ml besar, 600ml kecil)
#define MEDIUM_HEIGHT_MIN 6    // cm (overlap OK)
#define MEDIUM_HEIGHT_MAX 9    // cm
#define MEDIUM_LENGTH_MIN 12   // cm (overlap OK)
#define MEDIUM_LENGTH_MAX 16   // cm
#define MEDIUM_POINTS 10

// Botol BESAR (600ml besar) - LIMITED!
#define LARGE_HEIGHT_MIN 8     // cm
#define LARGE_HEIGHT_MAX 12    // cm
#define LARGE_LENGTH_MIN 15    // cm
#define LARGE_LENGTH_MAX 17    // cm (MAX offset 20cm!)
#define LARGE_POINTS 15
```

**Catatan**: 
- Ada overlap di threshold (misal 6-7cm bisa KECIL atau SEDANG)
- Sistem pilih kategori berdasarkan HEIGHT DAN LENGTH
- Botol >17cm panjang akan **REJECTED**

## 🎯 DECISION TREE

### Alur Klasifikasi:
```
1. Baca sensor → Convert dengan offset
2. Cek range:
   - Height: 5-7cm, Length: 8-12cm  → KECIL
   - Height: 6-9cm, Length: 12-16cm → SEDANG
   - Height: 8-12cm, Length: 15-17cm → BESAR
   - Lainnya → REJECTED

3. Cek metal → Jika detected → REJECTED
4. Buka gate / Reject
```

## 🔧 TROUBLESHOOTING

### Problem: Sensor Baca 20cm Terus
**Penyebab**: Tidak ada botol atau sensor terlalu jauh
**Solusi**: 
1. Cek posisi botol (harus di dalam range sensor)
2. Cek wiring sensor
3. Test dengan tangan di depan sensor

### Problem: Bottle Size Negatif
**Penyebab**: Raw reading ≥ offset (tidak ada botol)
**Solusi**: Normal! -1 = tidak ada botol

### Problem: Botol Tidak Masuk Kategori
**Penyebab**: Ukuran botol di luar threshold
**Solusi**: 
1. Update threshold sesuai botol yang mau diterima
2. Atau naikkan offset sensor

### Problem: Sensor Baca 2cm (Error)
**Penyebab**: Botol terlalu dekat ke sensor (>18cm)
**Solusi**: Botol terlalu besar untuk offset 20cm!

## ✅ STATUS IMPLEMENTASI

- ✅ **Offset configured**: 20cm untuk HEIGHT dan LENGTH
- ✅ **Conversion function**: Added `sensorDistanceToBottleSize()`
- ✅ **Loop updated**: Raw reading → Bottle size conversion
- ✅ **TEST command**: Updated untuk tampilkan raw + bottle size
- ⚠️ **Threshold**: Perlu fine-tune sesuai botol yang mau diterima
- ⚠️ **Limitation**: Max bottle length 17cm!

## 🚀 NEXT STEPS

1. **Upload code** ke ESP32
2. **Test dengan box kosong** → Harus baca -1 (no bottle)
3. **Test dengan botol kecil** → Cek akurasi ukuran
4. **Adjust threshold** jika perlu
5. **Consider naikkan offset LENGTH** jika mau terima botol besar

---

**System sudah dikalibrasi untuk offset 20cm!** 🎯
**Tapi untuk hasil optimal, recommended naikkan LENGTH offset ke 35cm!**
