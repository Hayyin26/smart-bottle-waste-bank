# 📏 KALIBRASI SENSOR DENGAN JARAK 10CM

## 📋 SETUP FISIK KAMU

```
┌─────────────────────────────────────┐
│         TOP OF BOX                  │
│                                     │
│   [SENSOR HEIGHT] ← 10cm ke botol   │
│         ↓↓↓                         │
│   ═════════════ ← Sensor mounting   │
│         ↓ 10cm                      │
│     ┌───────┐ ← Botol (diameter)    │
│ [S] │ BOTOL │                       │
│ [E] │       │                       │
│ [N] └───────┘                       │
│ [S]   ↑                             │
│ [O]   │ 10cm                        │
│ [R]   │                             │
│     [SENSOR LENGTH]                 │
└─────────────────────────────────────┘

SENSOR HEIGHT  = Di atas botol (ukur diameter/tinggi)
SENSOR LENGTH  = Di samping botol (ukur panjang)
Jarak sensor ke botol = 10cm (saat tidak ada botol)
```

## 🔢 RUMUS PERHITUNGAN

### Konsep Dasar
```
Jarak sensor ke botol KOSONG = 10cm
Jarak sensor ke botol ISI    = X cm (lebih kecil)
Ukuran botol = 10cm - X cm
```

### Formula
```cpp
// Sensor HEIGHT (ukur diameter/tinggi botol)
int rawHeight = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
int bottleHeight = 10 - rawHeight;  // Ukuran sebenarnya

// Sensor LENGTH (ukur panjang botol)
int rawLength = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
int bottleLength = 10 - rawLength;  // Ukuran sebenarnya
```

### Contoh Perhitungan

#### Botol KECIL (330ml)
```
Diameter sebenarnya: 6cm
Panjang sebenarnya:  15cm

Sensor HEIGHT baca: 10 - 6 = 4cm
Sensor LENGTH baca: 10 - 15 = -5cm (TIDAK VALID!)
                    Botol lebih panjang dari jarak sensor!
```

⚠️ **MASALAH**: Jarak 10cm **terlalu pendek** untuk botol panjang!

## 🚨 PROBLEM: JARAK 10CM TERLALU PENDEK!

### Analisis Ukuran Botol
```
Botol KECIL (330ml):
- Diameter: 5-6cm   → Sensor butuh ≥6cm jarak
- Panjang:  15cm    → Sensor butuh ≥15cm jarak  ❌

Botol SEDANG (600ml):
- Diameter: 6-7cm   → Sensor butuh ≥7cm jarak
- Panjang:  20cm    → Sensor butuh ≥20cm jarak  ❌

Botol BESAR (1.5L):
- Diameter: 8-9cm   → Sensor butuh ≥9cm jarak
- Panjang:  30cm    → Sensor butuh ≥30cm jarak  ❌
```

**Kesimpulan**: Jarak 10cm **hanya cukup untuk diameter**, **TIDAK CUKUP untuk panjang**!

## ✅ SOLUSI: DYNAMIC OFFSET CALCULATION

### Option 1: FIXED OFFSET (Simple, Recommended)
Set jarak sensor sesuai botol terbesar, lalu hitung offset.

```cpp
// KONFIGURASI JARAK SENSOR (sesuaikan dengan box kamu)
#define SENSOR_HEIGHT_DISTANCE 15   // Jarak sensor HEIGHT ke dasar (cm)
#define SENSOR_LENGTH_DISTANCE 35   // Jarak sensor LENGTH ke dinding (cm)

// Fungsi untuk convert jarak sensor ke ukuran botol
int calculateBottleHeight(int sensorReading) {
    // Botol diameter = jarak sensor kosong - jarak sensor ada botol
    return SENSOR_HEIGHT_DISTANCE - sensorReading;
}

int calculateBottleLength(int sensorReading) {
    // Botol panjang = jarak sensor kosong - jarak sensor ada botol
    return SENSOR_LENGTH_DISTANCE - sensorReading;
}
```

### Option 2: CALIBRATION MODE (Advanced)
Sistem otomatis hitung jarak sensor saat tidak ada botol.

```cpp
// Global variables untuk calibration
int heightOffset = 0;
int lengthOffset = 0;
bool isCalibrated = false;

void calibrateSensors() {
    Serial.println("[Calibration] Pastikan box KOSONG (tidak ada botol)!");
    delay(3000);
    
    // Baca jarak sensor saat kosong
    heightOffset = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
    lengthOffset = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
    
    Serial.printf("[Calibration] Height offset: %d cm\n", heightOffset);
    Serial.printf("[Calibration] Length offset: %d cm\n", lengthOffset);
    
    isCalibrated = true;
}

int calculateBottleHeight(int sensorReading) {
    if (!isCalibrated) return -1;
    return heightOffset - sensorReading;
}

int calculateBottleLength(int sensorReading) {
    if (!isCalibrated) return -1;
    return lengthOffset - sensorReading;
}
```

## 🔧 IMPLEMENTASI KE KODE KAMU

### Step 1: Update Constants
```cpp
// --- KONFIGURASI JARAK SENSOR (TAMBAHKAN!) ---
// Ukur jarak dari sensor ke:
// - HEIGHT: Jarak sensor ke dasar box (tempat botol diletakkan)
// - LENGTH: Jarak sensor ke dinding berlawanan

#define SENSOR_HEIGHT_OFFSET 15   // cm (sesuaikan!)
#define SENSOR_LENGTH_OFFSET 35   // cm (sesuaikan!)
```

### Step 2: Tambahkan Fungsi Konversi
```cpp
// --- FUNGSI KONVERSI JARAK KE UKURAN BOTOL ---
int sensorDistanceToBottleSize(int sensorReading, int sensorOffset) {
    // Validasi reading
    if (sensorReading < 2 || sensorReading > sensorOffset) {
        return -1;  // Invalid reading
    }
    
    // Ukuran botol = offset - reading
    return sensorOffset - sensorReading;
}
```

### Step 3: Update Logika Baca Sensor
```cpp
// Baca sensor RAW (jarak dari sensor ke botol)
int rawHeight = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
int rawLength = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);

// Convert ke ukuran botol SEBENARNYA
int heightCm = sensorDistanceToBottleSize(rawHeight, SENSOR_HEIGHT_OFFSET);
int lengthCm = sensorDistanceToBottleSize(rawLength, SENSOR_LENGTH_OFFSET);

// Debug output
Serial.printf("[Sensor] Raw HEIGHT: %d cm → Bottle: %d cm\n", rawHeight, heightCm);
Serial.printf("[Sensor] Raw LENGTH: %d cm → Bottle: %d cm\n", rawLength, lengthCm);
```

## 📊 TABEL KALIBRASI

### Cara Mengukur Offset:
1. **Kosongkan box** (tidak ada botol)
2. Upload code dan cek Serial Monitor
3. Catat jarak sensor saat kosong:
   ```
   [Sensor] Height (kosong): 15 cm → Offset HEIGHT = 15
   [Sensor] Length (kosong): 35 cm → Offset LENGTH = 35
   ```
4. Update constants di code

### Contoh Kalibrasi:

| Setup | Height Offset | Length Offset | Notes |
|-------|---------------|---------------|-------|
| **Box Kecil** | 10-15 cm | 25-30 cm | Untuk botol kecil-sedang |
| **Box Sedang** | 15-20 cm | 30-40 cm | Untuk semua ukuran |
| **Box Besar** | 20-25 cm | 40-50 cm | Untuk botol besar + margin |

## 🧪 TESTING & VALIDATION

### Test Case 1: Botol Kecil (330ml)
```
Ukuran sebenarnya: Diameter 6cm, Panjang 15cm

SETUP: Height offset = 15cm, Length offset = 35cm

Sensor reading:
- Height: 15 - 6 = 9cm  ← Sensor baca 9cm
- Length: 35 - 15 = 20cm ← Sensor baca 20cm

Calculate:
- bottleHeight = 15 - 9 = 6cm   ✅ BENAR!
- bottleLength = 35 - 20 = 15cm ✅ BENAR!
```

### Test Case 2: Botol Sedang (600ml)
```
Ukuran sebenarnya: Diameter 7cm, Panjang 20cm

Sensor reading:
- Height: 15 - 7 = 8cm  ← Sensor baca 8cm
- Length: 35 - 20 = 15cm ← Sensor baca 15cm

Calculate:
- bottleHeight = 15 - 8 = 7cm   ✅ BENAR!
- bottleLength = 35 - 15 = 20cm ✅ BENAR!
```

### Test Case 3: Botol Besar (1.5L)
```
Ukuran sebenarnya: Diameter 9cm, Panjang 30cm

Sensor reading:
- Height: 15 - 9 = 6cm  ← Sensor baca 6cm
- Length: 35 - 30 = 5cm ← Sensor baca 5cm

Calculate:
- bottleHeight = 15 - 6 = 9cm   ✅ BENAR!
- bottleLength = 35 - 5 = 30cm  ✅ BENAR!
```

## ⚠️ VALIDASI READING

### Cek Reading Valid
```cpp
bool isValidReading(int sensorReading, int offset) {
    // Reading harus lebih kecil dari offset (ada botol)
    if (sensorReading >= offset) return false;
    
    // Reading tidak boleh terlalu kecil (botol terlalu besar)
    if (sensorReading < 2) return false;
    
    // Ukuran botol hasil calculate tidak boleh negatif
    int bottleSize = offset - sensorReading;
    if (bottleSize <= 0 || bottleSize > 40) return false;
    
    return true;
}
```

### Handle Error Reading
```cpp
int rawHeight = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);

if (!isValidReading(rawHeight, SENSOR_HEIGHT_OFFSET)) {
    Serial.println("[Error] Invalid HEIGHT reading!");
    Serial.printf("[Error] Raw: %d cm, Offset: %d cm\n", 
                  rawHeight, SENSOR_HEIGHT_OFFSET);
    return;  // Skip this reading
}

int heightCm = SENSOR_HEIGHT_OFFSET - rawHeight;
```

## 🎯 REKOMENDASI SETUP BOX

### Dimensi Box Ideal:
```
Tinggi box (untuk sensor HEIGHT):
- Minimum: 15cm (sensor 10cm + botol 5cm max)
- Recommended: 20cm (sensor 15cm + botol 5cm max + margin)

Lebar box (untuk sensor LENGTH):
- Minimum: 35cm (sensor 10cm + botol 25cm + margin)
- Recommended: 45cm (sensor 10cm + botol 35cm + margin)
```

### Posisi Sensor:
```
Sensor HEIGHT:
- Mounting: 15cm dari dasar box
- Coverage: Botol diameter 5-12cm
- Margin: 3cm untuk toleransi

Sensor LENGTH:
- Mounting: 35cm dari dinding berlawanan
- Coverage: Botol panjang 8-30cm
- Margin: 5cm untuk toleransi
```

## 📝 LANGKAH IMPLEMENTASI

### 1. Ukur Box Kamu
```
[ ] Ukur tinggi dari dasar ke sensor HEIGHT
[ ] Ukur lebar dari dinding ke sensor LENGTH
[ ] Catat kedua angka ini
```

### 2. Update Code
```cpp
#define SENSOR_HEIGHT_OFFSET [angka_kamu]  // cm
#define SENSOR_LENGTH_OFFSET [angka_kamu]  // cm
```

### 3. Upload & Test
```
[ ] Upload code ke ESP32
[ ] Kosongkan box
[ ] Cek Serial: sensor harus baca = offset
[ ] Taruh botol kecil → test
[ ] Taruh botol sedang → test
[ ] Taruh botol besar → test
```

### 4. Fine-tune Classification
```cpp
// Update threshold sesuai hasil test
#define SMALL_HEIGHT_MIN 5
#define SMALL_HEIGHT_MAX 7
// dst...
```

## 🚀 NEXT STEP

Berikan saya informasi:
1. **Jarak sensor HEIGHT** dari dasar box (tempat botol): ___ cm
2. **Jarak sensor LENGTH** dari dinding berlawanan: ___ cm

Saya akan buatkan code yang sudah disesuaikan dengan setup box kamu!

---

**Dengan offset calculation yang benar, sistem akan akurat! 🎯**
