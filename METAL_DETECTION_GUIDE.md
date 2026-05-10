# 🔍 Panduan Sensor Deteksi Logam

## ✅ Fitur Baru: Tolak Botol Logam/Kaleng

Sistem sekarang dapat mendeteksi dan **MENOLAK** botol logam/kaleng. Hanya botol **PLASTIK** yang diterima.

---

## 🛠️ Hardware yang Digunakan

### Sensor: ROKO Metal Proximity Sensor (Inductive Switch)
- **Tipe**: Inductive Proximity Sensor
- **Fungsi**: Mendeteksi logam (besi, aluminium, kaleng, dll)
- **Output**: Active LOW (LOW = Logam terdeteksi, HIGH = Tidak ada logam)
- **Jarak Deteksi**: 2-10mm (tergantung model)
- **Voltage**: 5V DC (kompatibel dengan ESP32)

### Spesifikasi Umum:
- **Model**: LJ12A3-4-Z/BX atau sejenisnya
- **Warna Kabel**:
  - **Coklat (Brown)**: VCC (+5V)
  - **Biru (Blue)**: GND (Ground)
  - **Hitam (Black)**: Signal (Output ke ESP32)

---

## 📐 Koneksi Hardware

### Wiring Diagram:
```
ROKO Metal Sensor          ESP32
─────────────────          ─────────────
Coklat (Brown)    ────→    5V (VIN)
Biru (Blue)       ────→    GND
Hitam (Black)     ────→    GPIO 14 (PIN_METAL_SENSOR)
```

### Pin ESP32 yang Digunakan:
```cpp
#define PIN_METAL_SENSOR 14  // GPIO 14 untuk sensor logam
```

**Catatan**: Anda bisa ubah ke pin lain (misal: GPIO 12, 13, 25, 26, 27, 32, 33) jika GPIO 14 sudah dipakai.

---

## 🔧 Cara Kerja

### 1. Deteksi Logam
```
Sensor Logam
     ↓
     ║
     ║  ← Jarak deteksi 2-10mm
     ▼
┌─────────┐
│ KALENG  │  ← Logam terdeteksi → Output LOW
└─────────┘

┌─────────┐
│ PLASTIK │  ← Tidak ada logam → Output HIGH
└─────────┘
```

### 2. Logika Sistem
```
User memasukkan botol
         ↓
Sensor ultrasonik deteksi objek
         ↓
Cek sensor logam
         ↓
    ┌────┴────┐
    │         │
  LOGAM?    PLASTIK?
    │         │
    ↓         ↓
 TOLAK!    Cek ukuran
 (3x beep)     ↓
           TERIMA/TOLAK
```

### 3. Output LCD & Buzzer
| Kondisi | LCD Line 1 | LCD Line 2 | Buzzer | Servo |
|---------|------------|------------|--------|-------|
| Logam terdeteksi | DITOLAK! | BOTOL LOGAM | 3x beep | TUTUP |
| Plastik OK | BOTOL SEDANG | +10 POIN | 1x beep | BUKA |
| Ukuran salah | UKURAN SALAH | H:X L:Y | 2x beep | TUTUP |

---

## 📝 Kode yang Ditambahkan

### 1. Definisi Pin
```cpp
#define PIN_METAL_SENSOR 14  // GPIO 14 untuk sensor logam
```

### 2. Setup Pin
```cpp
pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);  // Active LOW sensor
```

### 3. Baca Sensor
```cpp
// Sensor logam: LOW = Logam terdeteksi, HIGH = Tidak ada logam
bool metalDetected = (digitalRead(PIN_METAL_SENSOR) == LOW);
```

### 4. Logika Penolakan
```cpp
if (metalDetected) {
  // TOLAK! Botol logam/kaleng terdeteksi
  closeGate();
  buzzShort(3);  // 3x beep = logam terdeteksi
  lcdPrintLine(0, "DITOLAK!");
  lcdPrintLine(1, "BOTOL LOGAM");
  
  Serial.println("[Metal] ❌ REJECTED - Metal bottle detected!");
  Serial.println("[Metal] Only PLASTIC bottles accepted");
  
  gateState = REJECT_HOLD;
  stateStartedAt = millis();
  lastDecisionAt = millis();
}
```

---

## 🧪 Testing

### Langkah 1: Upload Kode
1. Buka Arduino IDE
2. Buka file `ESP32_UPDATED_CODE.ino`
3. Pastikan sensor sudah terhubung ke GPIO 14
4. Upload kode ke ESP32

### Langkah 2: Test dengan Kaleng
1. Buka Serial Monitor (115200 baud)
2. Masukkan **KALENG** (botol logam)
3. Lihat output:
   ```
   [Metal] ❌ REJECTED - Metal bottle detected!
   [Metal] Only PLASTIC bottles accepted
   ```
4. LCD menampilkan: "DITOLAK! / BOTOL LOGAM"
5. Buzzer berbunyi 3x
6. Servo tetap TUTUP

### Langkah 3: Test dengan Botol Plastik
1. Masukkan **BOTOL PLASTIK**
2. Lihat output:
   ```
   [Bottle] ✅ PLASTIC bottle detected
   [Bottle] Size: SEDANG
   [Bottle] Height: 7cm, Length: 22cm
   [Bottle] Points: 10
   ```
3. LCD menampilkan: "BOTOL SEDANG / +10 POIN"
4. Buzzer berbunyi 1x
5. Servo BUKA

---

## ⚠️ Troubleshooting

### Problem 1: Semua Botol Ditolak (Termasuk Plastik)
**Gejala**: Botol plastik juga terdeteksi sebagai logam

**Penyebab**:
1. Sensor terlalu sensitif
2. Ada logam di sekitar sensor (sekrup, bracket, dll)
3. Kabel sensor terlalu dekat dengan kabel power

**Solusi**:
1. Jauhkan sensor dari logam lain (minimal 5cm)
2. Cek apakah ada sekrup/bracket logam di dekat sensor
3. Pisahkan kabel sensor dari kabel power
4. Coba ubah posisi sensor
5. Cek koneksi kabel (pastikan tidak ada short circuit)

---

### Problem 2: Kaleng Tidak Terdeteksi
**Gejala**: Kaleng/botol logam tidak ditolak, malah diterima

**Penyebab**:
1. Sensor terlalu jauh dari botol (>10mm)
2. Kabel sensor tidak terhubung dengan benar
3. Sensor rusak

**Solusi**:
1. Dekatkan sensor ke botol (2-5mm ideal)
2. Cek koneksi kabel:
   - Coklat → 5V
   - Biru → GND
   - Hitam → GPIO 14
3. Test sensor dengan multimeter (cek output LOW/HIGH)
4. Ganti sensor jika rusak

---

### Problem 3: Sensor Tidak Stabil (Kadang Terdeteksi, Kadang Tidak)
**Gejala**: Hasil deteksi tidak konsisten

**Penyebab**:
1. Koneksi kabel longgar
2. Power supply tidak stabil
3. Interferensi elektromagnetik

**Solusi**:
1. Pastikan semua kabel terpasang kuat
2. Gunakan power supply yang stabil (5V 2A)
3. Tambahkan kapasitor 100uF di VCC sensor (optional)
4. Jauhkan dari motor/relay yang bisa menimbulkan noise

---

### Problem 4: Serial Monitor Tidak Menampilkan "[Metal]"
**Gejala**: Tidak ada log deteksi logam di Serial Monitor

**Penyebab**:
1. Kode belum diupload
2. Pin salah (bukan GPIO 14)

**Solusi**:
1. Upload ulang kode
2. Cek definisi pin di kode:
   ```cpp
   #define PIN_METAL_SENSOR 14
   ```
3. Pastikan sensor terhubung ke GPIO 14

---

## 🔍 Cara Test Sensor Secara Manual

### Test 1: Cek Output Sensor
1. Upload kode ini untuk test:
   ```cpp
   void setup() {
     Serial.begin(115200);
     pinMode(14, INPUT_PULLUP);
   }
   
   void loop() {
     int value = digitalRead(14);
     Serial.print("Sensor value: ");
     Serial.println(value);  // 0 = Logam, 1 = Tidak ada logam
     delay(500);
   }
   ```
2. Dekatkan logam ke sensor
3. Lihat Serial Monitor:
   - Tanpa logam: `Sensor value: 1` (HIGH)
   - Ada logam: `Sensor value: 0` (LOW)

### Test 2: Cek dengan LED
1. Tambahkan LED ke GPIO 2 (built-in LED ESP32)
2. Upload kode ini:
   ```cpp
   void setup() {
     pinMode(14, INPUT_PULLUP);  // Sensor
     pinMode(2, OUTPUT);          // LED
   }
   
   void loop() {
     int value = digitalRead(14);
     digitalWrite(2, !value);  // LED nyala jika logam terdeteksi
     delay(100);
   }
   ```
3. Dekatkan logam → LED nyala
4. Jauhkan logam → LED mati

---

## 📐 Posisi Sensor yang Ideal

### Tampak Atas (Top View)
```
    ═══════════════════════════════════════
    
    Sensor Ultrasonik LENGTH
           ↓
        [TRIG] [ECHO]
           ↓
           ║
           ▼
    ┌──────────────────────────┐
    │      BOTOL HORIZONTAL    │  ← [SENSOR LOGAM] (di samping)
    └──────────────────────────┘
           ↑
           ║
        [TRIG] [ECHO]
           ↑
    Sensor Ultrasonik HEIGHT
    
    ═══════════════════════════════════════
```

### Posisi Sensor Logam:
- **Lokasi**: Di samping jalur botol (dekat dengan sensor LENGTH)
- **Jarak**: 2-5mm dari botol (tidak terlalu dekat, tidak terlalu jauh)
- **Orientasi**: Menghadap ke botol (tegak lurus)
- **Tinggi**: Sejajar dengan tengah botol

### Tips Pemasangan:
1. Pasang sensor di bracket/holder yang kuat
2. Pastikan sensor tidak bergerak/goyang
3. Jauhkan dari logam lain (minimal 5cm)
4. Arahkan sensor tepat ke jalur botol

---

## 📊 Perbandingan Deteksi

### Botol PLASTIK (Diterima)
| Sensor | Hasil | Aksi |
|--------|-------|------|
| Ultrasonik | Objek terdeteksi | ✅ Lanjut |
| Logam | Tidak terdeteksi (HIGH) | ✅ Lanjut |
| Klasifikasi | SEDANG (7cm × 22cm) | ✅ Terima |
| **Output** | **+10 POIN** | **BUKA SERVO** |

### Botol LOGAM/Kaleng (Ditolak)
| Sensor | Hasil | Aksi |
|--------|-------|------|
| Ultrasonik | Objek terdeteksi | ✅ Lanjut |
| Logam | Terdeteksi (LOW) | ❌ TOLAK! |
| Klasifikasi | - (tidak dicek) | - |
| **Output** | **DITOLAK!** | **TUTUP SERVO** |

---

## 🎯 Keuntungan Fitur Ini

### 1. Keamanan
- ✅ Hanya menerima botol plastik (sesuai tujuan bank sampah)
- ✅ Mencegah kerusakan sistem (kaleng bisa merusak sensor/servo)
- ✅ Mencegah penyalahgunaan (user memasukkan benda logam lain)

### 2. Akurasi
- ✅ Deteksi logam sangat akurat (sensor inductive)
- ✅ Tidak terpengaruh warna/bentuk botol
- ✅ Respon cepat (<100ms)

### 3. User Experience
- ✅ Feedback jelas (LCD + Buzzer 3x)
- ✅ User langsung tahu kenapa ditolak
- ✅ Mencegah kebingungan user

---

## 📝 Checklist Setup

- [ ] Sensor logam sudah dibeli (ROKO Metal Proximity Sensor)
- [ ] Kabel sensor terhubung ke ESP32:
  - [ ] Coklat → 5V
  - [ ] Biru → GND
  - [ ] Hitam → GPIO 14
- [ ] Kode sudah diupload ke ESP32
- [ ] Test dengan kaleng → Ditolak (3x beep)
- [ ] Test dengan botol plastik → Diterima (1x beep)
- [ ] Posisi sensor sudah optimal (2-5mm dari botol)
- [ ] Tidak ada logam lain di dekat sensor

---

## 💡 Tips Optimasi

### 1. Jarak Deteksi
- **Terlalu dekat** (<2mm): Bisa tidak stabil
- **Ideal** (2-5mm): Deteksi akurat dan stabil
- **Terlalu jauh** (>10mm): Tidak terdeteksi

### 2. Posisi Sensor
- Pasang di samping jalur botol (sejajar dengan sensor LENGTH)
- Arahkan tegak lurus ke botol
- Pastikan semua botol melewati area deteksi sensor

### 3. Kalibrasi
- Test dengan berbagai jenis kaleng (Coca-Cola, Sprite, dll)
- Test dengan botol plastik berbagai ukuran
- Sesuaikan posisi sensor jika perlu

---

## 🔗 File Terkait

- `ESP32_UPDATED_CODE.ino` - Kode ESP32 (sudah update)
- `HORIZONTAL_BOTTLE_SUMMARY.md` - Panduan botol horizontal
- `SENSOR_POSITIONING_HORIZONTAL.md` - Diagram posisi sensor

---

## 📞 Butuh Bantuan?

Jika sensor logam tidak bekerja dengan baik:
1. Screenshot Serial Monitor output
2. Foto koneksi kabel sensor
3. Foto posisi sensor terhadap botol
4. Catat jenis sensor yang digunakan (model/tipe)
5. Tanyakan ke developer

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.1 (Metal Detection)
**Status**: ✅ READY TO USE
