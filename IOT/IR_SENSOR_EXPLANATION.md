# 🔦 CARA KERJA SENSOR IR DI SISTEM INI

## 📋 OVERVIEW

Sistem ini menggunakan **2 jenis sensor IR yang berbeda**:

1. **IR Lamp (PIN_IR_LAMP / GPIO 13)** - Lampu infrared untuk penerangan
2. **Sensor Ultrasonik HC-SR04** - Sensor jarak yang bekerja dengan gelombang suara (bukan IR sebenarnya, tapi sering dikira sensor IR karena bentuknya mirip)

---

## 🔦 1. IR LAMP (Lampu Infrared)

### Definisi
```cpp
#define PIN_IR_LAMP 13    // GPIO 13
pinMode(PIN_IR_LAMP, OUTPUT);
digitalWrite(PIN_IR_LAMP, LOW);  // Default OFF
```

### Fungsi
- **Bukan sensor**, tapi **lampu penerangan infrared**
- Memancarkan cahaya infrared (tidak terlihat mata manusia)
- Digunakan untuk membantu sensor ultrasonik bekerja lebih akurat dalam kondisi:
  - Ruangan gelap
  - Banyak cahaya ambient yang mengganggu
  - Permukaan objek yang terlalu reflektif/transparan

### Cara Kerja
```
ESP32 (GPIO 13) → IR Lamp → Cahaya IR dipancarkan
                              ↓
                    Membantu sensor ultrasonik
                    membaca jarak lebih akurat
```

### Status Saat Ini
- ✅ **Default OFF** (tidak nyala terus)
- Bisa dinyalakan saat sensor bekerja (opsional)
- Bisa dilepas jika tidak diperlukan

---

## 📡 2. SENSOR ULTRASONIK HC-SR04 (Bukan Sensor IR!)

### ⚠️ PENTING: INI BUKAN SENSOR IR!
Banyak yang mengira HC-SR04 adalah "sensor IR" karena:
- Bentuknya mirip (ada 2 bulatan seperti mata)
- Sering dikemas bersamaan dengan sensor IR
- Warnanya mirip sensor IR

**TAPI SEBENARNYA**: HC-SR04 menggunakan **gelombang ultrasonik** (suara), bukan infrared (cahaya)!

### Pin Configuration
```cpp
// Sensor HEIGHT (mengukur diameter botol)
#define PIN_TRIG_HEIGHT 4     // Trigger pin
#define PIN_ECHO_HEIGHT 18    // Echo pin

// Sensor LENGTH (mengukur panjang botol)
#define PIN_TRIG_LENGTH 5     // Trigger pin
#define PIN_ECHO_LENGTH 12    // Echo pin
```

### Cara Kerja HC-SR04

#### 1. **Kirim Pulsa Trigger** (10-15 μs)
```cpp
digitalWrite(trigPin, LOW);
delayMicroseconds(5);
digitalWrite(trigPin, HIGH);   // ← Kirim pulsa
delayMicroseconds(15);
digitalWrite(trigPin, LOW);
```

#### 2. **Sensor Memancarkan Gelombang Ultrasonik** (40kHz)
```
HC-SR04 (TRIG)
    ↓
Gelombang suara ))))))) → Objek (botol)
```

#### 3. **Gelombang Memantul Kembali**
```
Objek (botol) → (((((( Gelombang pantul
                          ↓
                    HC-SR04 (ECHO)
```

#### 4. **Hitung Waktu = Hitung Jarak**
```cpp
unsigned long duration = pulseIn(echoPin, HIGH, 50000);
int cm = (int)(duration * 0.034f / 2.0f);
```

**Rumus**:
```
Jarak (cm) = (Waktu tempuh × Kecepatan suara) / 2

Kecepatan suara = 340 m/s = 0.034 cm/μs
Dibagi 2 karena gelombang pergi-pulang
```

### Visualisasi
```
[ESP32] ──TRIG──→ [HC-SR04] ─────────))) Suara
                      ↑                    ↓
                      │                 [Botol]
                      │                    ↓
                   ECHO ←─────────((( Pantul
                      ↓
[ESP32] ←── Duration ──┘
         (hitung jarak)
```

---

## 🔄 ALUR KERJA LENGKAP SISTEM

### Step 1: User Login (QR Code)
```
User scan QR → ESP32 terima token → Validasi user
```

### Step 2: Deteksi Botol Masuk
```cpp
// Baca jarak dari sensor HEIGHT
int distance = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);

if (distance < OBJECT_PRESENT_CM) {  // < 35cm
    // Ada botol!
}
```

### Step 3: Ukur Dimensi Botol
```cpp
// Sensor HEIGHT → Diameter botol
heightCm = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);

// Sensor LENGTH → Panjang botol
lengthCm = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
```

### Step 4: Cek Metal
```cpp
// Sensor metal (proximity sensor)
isMetalDetected = readMetalSensor();  // LOW = terdeteksi metal

if (isMetalDetected) {
    // REJECT botol (ada logam)
    buzzMetalAlert();  // 3x beep
}
```

### Step 5: Klasifikasi Ukuran
```cpp
BottleSize size = classifyBottle(heightCm, lengthCm);

// SMALL:  5-11cm diameter, 8-13cm panjang  → 5 poin
// MEDIUM: 12-16cm diameter, 15-20cm panjang → 10 poin
// LARGE:  18-22cm diameter, 21-30cm panjang → 15 poin
```

### Step 6: Buka Gate / Reject
```cpp
if (size != NONE && !isMetalDetected) {
    openGate();   // Terima botol
    addPoints();  // Tambah poin user
} else {
    buzzMetalAlert();  // Reject (3x beep)
}
```

---

## 📊 PERBANDINGAN SENSOR IR vs ULTRASONIK

| Aspek | Sensor IR | Sensor Ultrasonik (HC-SR04) |
|-------|-----------|----------------------------|
| **Gelombang** | Cahaya infrared | Gelombang suara (40kHz) |
| **Jarak Max** | 20-80cm (tergantung tipe) | 2-400cm |
| **Akurasi** | ±2cm | ±0.3cm |
| **Terpengaruh Cahaya** | ✅ Ya (sangat) | ❌ Tidak |
| **Terpengaruh Suara** | ❌ Tidak | ✅ Ya (sedikit) |
| **Permukaan Gelap** | ❌ Sulit detect | ✅ Bisa detect |
| **Permukaan Transparan** | ✅ Bisa detect | ❌ Sulit detect |
| **Harga** | Rp 5.000-15.000 | Rp 15.000-30.000 |
| **Power** | 3.3V - 5V | 5V (wajib!) |

---

## 🎯 KAPAN IR LAMP DIPERLUKAN?

### ✅ Perlu IR Lamp:
- Ruangan sangat gelap
- Sensor sering gagal baca jarak
- Permukaan botol terlalu reflektif (mengkilap)
- Ada banyak cahaya ambient yang mengganggu

### ❌ Tidak Perlu IR Lamp:
- Sensor sudah akurat tanpa IR lamp
- Ruangan cukup terang
- Botol permukaan matte (tidak mengkilap)
- Sistem bekerja normal

---

## 🔧 TROUBLESHOOTING

### Problem: Sensor Sering Timeout
**Solusi**:
1. Nyalakan IR lamp saat sensor bekerja
2. Cek wiring sensor (ECHO pin harus pakai voltage divider)
3. Pastikan sensor 5V dapat power cukup
4. Cek jarak objek (2-400cm range)

### Problem: Sensor Baca Jarak Tidak Akurat
**Solusi**:
1. Nyalakan IR lamp untuk stabilisasi
2. Tingkatkan jumlah sample readings
3. Pastikan permukaan objek tidak terlalu miring
4. Cek noise elektrik dari komponen lain

### Problem: IR Lamp Tidak Membantu
**Solusi**:
1. Matikan IR lamp (tidak diperlukan)
2. Fokus pada stabilisasi sensor ultrasonik
3. Improve filtering dan averaging
4. Cek apakah sensor benar-benar HC-SR04 (bukan fake)

---

## 📝 KESIMPULAN

### Sistem Kamu Pakai:

1. **IR Lamp (GPIO 13)**
   - Fungsi: Lampu penerangan infrared
   - Status: Default OFF (bisa dinyalakan jika perlu)
   - Optional: Bisa dilepas jika tidak diperlukan

2. **HC-SR04 Ultrasonik (BUKAN IR!)**
   - 2 sensor: HEIGHT (GPIO 4/18) dan LENGTH (GPIO 5/12)
   - Fungsi: Ukur dimensi botol (diameter & panjang)
   - Wajib: Harus ada untuk sistem bekerja

3. **Metal Proximity Sensor (GPIO 25)**
   - Fungsi: Deteksi logam dalam botol
   - Output: LOW = terdeteksi, HIGH = tidak

---

## 🚀 NEXT STEPS

### Test IR Lamp (Opsional):
1. Upload code (sudah default OFF)
2. Cek apakah sensor akurat tanpa IR lamp
3. Jika perlu, tambahkan logic nyala saat sensor bekerja

### Test Sensor Ultrasonik:
```
Serial Monitor → TEST
[Sensor] Height: XX cm
[Sensor] Length: XX cm
[Sensor] Metal: DETECTED / NOT DETECTED
```

### Optimize System:
1. Jika sensor akurat → Lepas IR lamp
2. Jika sensor sering error → Pakai IR lamp
3. Monitor Serial output untuk debugging

---

**Sekarang kamu paham cara kerja sensor IR di sistem ini!** 🎓
