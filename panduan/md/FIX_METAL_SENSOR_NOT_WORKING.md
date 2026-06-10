# 🔧 Fix: Sensor Metal Proximity Tidak Berfungsi

## ❌ Masalah
Sensor metal proximity tidak mendeteksi logam pada botol, atau selalu mendeteksi logam padahal tidak ada.

---

## 🔍 Analisis Kode Saat Ini

### Konfigurasi Pin
```cpp
#define PIN_METAL_SENSOR 25      // GPIO 25
pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);
```

### Fungsi Pembacaan
```cpp
bool readMetalSensor() {
  bool sensorValue = digitalRead(PIN_METAL_SENSOR);
  return sensorValue == LOW;  // Active LOW
}
```

### Logika Deteksi
```cpp
if (isMetalDetected) {
  closeGate();
  buzzShort(3);  // 3x buzz = warning
  lcdPrintLine(0, "BOTOL CACAT");
  lcdPrintLine(1, "ADA LOGAM");
  Serial.println("[Metal] ⚠️ LOGAM TERDETEKSI - REJECT");
  gateState = REJECT_HOLD;
}
```

---

## 🚨 Kemungkinan Penyebab

### 1. **Logika Terbalik (Paling Umum!)**
Sensor metal proximity ada 2 jenis:
- **Active LOW:** Output LOW saat deteksi metal, HIGH saat tidak ada metal
- **Active HIGH:** Output HIGH saat deteksi metal, LOW saat tidak ada metal

**Kode saat ini menggunakan Active LOW**, tapi sensor Anda mungkin Active HIGH!

### 2. **Wiring Salah**
```
Sensor Metal Proximity:
  VCC  → 5V atau 3.3V (tergantung sensor)
  OUT  → GPIO 25
  GND  → GND
```

Kemungkinan masalah:
- ❌ Kabel OUT tidak terhubung ke GPIO 25
- ❌ VCC tidak terhubung (sensor mati)
- ❌ GND tidak terhubung

### 3. **Sensor Tidak Dikalibrasi**
Beberapa sensor metal proximity perlu dikalibrasi:
- Jarak deteksi terlalu jauh/dekat
- Sensitivitas terlalu rendah/tinggi
- Potentiometer perlu disesuaikan

### 4. **Sensor Rusak atau Mati**
- Sensor tidak mendapat power
- Sensor rusak secara fisik
- LED indikator sensor tidak menyala

### 5. **Jarak Terlalu Jauh**
Sensor metal proximity biasanya hanya bisa deteksi 2-10mm dari permukaan sensor.

---

## ✅ Solusi

### Solusi 1: Test Sensor Manual (PRIORITAS!)

Saya sudah menambahkan command `TEST` dan `METAL` untuk troubleshooting. Upload kode dan test:

```bash
cd IOT/PBL
pio run -t upload
pio device monitor
```

#### Test Sekali (Snapshot)
Di Serial Monitor, ketik:
```
TEST
```

Output:
```
[Test] Reading METAL sensor...
[Test] METAL Raw Value: 1 (0=LOW, 1=HIGH)
[Test] METAL Detected: NO

⚠️ Jika terbalik, ubah logika di readMetalSensor()
   Active LOW: return sensorValue == LOW;
   Active HIGH: return sensorValue == HIGH;
```

#### Test Real-time (Monitoring)
Di Serial Monitor, ketik:
```
METAL
```

Output (update setiap 100ms):
```
[Metal] Raw: 1 | Detected: NO
```

Dekatkan logam ke sensor, seharusnya berubah:
```
[Metal] Raw: 0 | Detected: YES
```

**Interpretasi:**
- **Tanpa logam:** Raw = 1, Detected = NO → Sensor Active LOW (benar)
- **Dengan logam:** Raw = 0, Detected = YES → Sensor Active LOW (benar)

Jika terbalik (tanpa logam = YES, dengan logam = NO), lanjut ke Solusi 2.

---

### Solusi 2: Balik Logika Sensor (Jika Active HIGH)

Jika sensor Anda Active HIGH (output HIGH saat deteksi metal), ubah kode:

**Buka file:** `IOT/PBL/src/main.cpp`

**Cari fungsi:** `readMetalSensor()`

**Ubah dari:**
```cpp
bool readMetalSensor() {
  bool sensorValue = digitalRead(PIN_METAL_SENSOR);
  return sensorValue == LOW;  // Active LOW
  // return sensorValue == HIGH; // ← Uncomment jika Active HIGH
}
```

**Menjadi:**
```cpp
bool readMetalSensor() {
  bool sensorValue = digitalRead(PIN_METAL_SENSOR);
  // return sensorValue == LOW;  // Active LOW
  return sensorValue == HIGH; // ← Active HIGH
}
```

Upload ulang dan test lagi dengan command `METAL`.

---

### Solusi 3: Cek Wiring

Jika sensor masih tidak berfungsi, cek wiring:

```
┌─────────────────────┐
│  Metal Proximity    │
│     Sensor          │
├─────────────────────┤
│ VCC  → 5V (atau 3.3V) │ ⚠️ Cek datasheet sensor!
│ OUT  → GPIO 25      │ ⚠️ Cek ini!
│ GND  → GND          │
└─────────────────────┘
```

**Checklist:**
- [ ] Kabel OUT terhubung ke GPIO 25
- [ ] Kabel VCC terhubung ke 5V (atau 3.3V sesuai sensor)
- [ ] Kabel GND terhubung ke GND
- [ ] Tidak ada kabel yang longgar
- [ ] LED indikator sensor menyala (jika ada)

**Test dengan Multimeter:**
```
1. Ukur VCC sensor: Harus 5V (atau 3.3V)
2. Ukur GND sensor: Harus 0V
3. Ukur OUT sensor:
   - Tanpa logam: 5V (Active HIGH) atau 0V (Active LOW)
   - Dengan logam: 0V (Active HIGH) atau 5V (Active LOW)
```

---

### Solusi 4: Kalibrasi Sensor

Beberapa sensor metal proximity punya potentiometer untuk adjust sensitivitas:

1. **Cari potentiometer** di sensor (biasanya screw kecil)
2. **Putar searah jarum jam** untuk tingkatkan sensitivitas
3. **Putar berlawanan jarum jam** untuk kurangi sensitivitas
4. **Test dengan command `METAL`** sambil adjust

**Target:**
- Sensor harus deteksi logam pada jarak 2-10mm
- Sensor tidak boleh false positive (deteksi tanpa logam)

---

### Solusi 5: Cek Jenis Sensor

Ada beberapa jenis sensor metal proximity:

#### A. Inductive Proximity Sensor (Paling Umum)
```
- Deteksi: Logam ferrous (besi, baja)
- Jarak: 2-10mm
- Output: NPN (Active LOW) atau PNP (Active HIGH)
- Tegangan: 5V atau 12V
```

#### B. Capacitive Proximity Sensor
```
- Deteksi: Semua material (metal, plastik, air)
- Jarak: 5-15mm
- Output: NPN atau PNP
- Tegangan: 5V atau 12V
```

#### C. Hall Effect Sensor
```
- Deteksi: Magnet (bukan logam biasa!)
- Jarak: 1-5mm
- Output: Digital (HIGH/LOW)
- Tegangan: 3.3V atau 5V
```

**⚠️ PENTING:** Jika sensor Anda Hall Effect, maka hanya akan deteksi **magnet**, bukan logam biasa!

---

### Solusi 6: Test dengan LED

Untuk memastikan sensor bekerja, tambahkan LED indikator:

```cpp
#define PIN_LED_METAL 2  // LED indikator

void setup() {
  pinMode(PIN_LED_METAL, OUTPUT);
  // ... kode lainnya
}

void loop() {
  // ... kode lainnya
  
  // Update LED
  if (isMetalDetected) {
    digitalWrite(PIN_LED_METAL, HIGH);  // LED nyala
  } else {
    digitalWrite(PIN_LED_METAL, LOW);   // LED mati
  }
}
```

Jika LED nyala saat ada logam, berarti sensor bekerja!

---

## 📊 Interpretasi Output

### ✅ NORMAL (Sensor Bekerja)

**Tanpa Logam:**
```
[Metal] Raw: 1 | Detected: NO
```

**Dengan Logam:**
```
[Metal] Raw: 0 | Detected: YES
```

**Action:** Sensor bekerja normal! ✅

---

### ⚠️ TERBALIK (Logika Salah)

**Tanpa Logam:**
```
[Metal] Raw: 1 | Detected: YES  ← Salah!
```

**Dengan Logam:**
```
[Metal] Raw: 0 | Detected: NO   ← Salah!
```

**Action:** Ubah logika di `readMetalSensor()` dari `== LOW` ke `== HIGH`

---

### ❌ TIDAK BERUBAH (Sensor Mati)

**Tanpa Logam:**
```
[Metal] Raw: 1 | Detected: NO
```

**Dengan Logam:**
```
[Metal] Raw: 1 | Detected: NO   ← Tidak berubah!
```

**Action:**
1. Cek wiring (prioritas tinggi!)
2. Cek power supply (VCC = 5V?)
3. Cek sensor dengan multimeter
4. Ganti sensor jika rusak

---

### ⚠️ SELALU TERDETEKSI (False Positive)

**Tanpa Logam:**
```
[Metal] Raw: 0 | Detected: YES  ← Selalu YES!
```

**Dengan Logam:**
```
[Metal] Raw: 0 | Detected: YES
```

**Action:**
1. Kurangi sensitivitas (putar potentiometer)
2. Jauhkan sensor dari logam lain
3. Cek apakah ada logam di sekitar sensor

---

## 🛠️ Hardware Troubleshooting

### Test 1: Visual Check
```
[ ] LED indikator sensor menyala
[ ] Tidak ada kerusakan fisik
[ ] Kabel tidak putus
[ ] Breadboard kontak baik
```

### Test 2: Voltage Check
```
[ ] VCC = 5V (atau 3.3V sesuai sensor)
[ ] GND = 0V
[ ] OUT = berubah saat ada logam
```

### Test 3: Isolation Test
```
1. Disconnect semua sensor kecuali metal sensor
2. Test dengan command METAL
3. Jika normal → Ada interferensi dari sensor lain
4. Jika masih error → Masalah di sensor/wiring
```

### Test 4: Swap Test
```
1. Ganti dengan sensor metal lain (jika ada)
2. Test dengan command METAL
3. Jika normal → Sensor lama rusak
4. Jika masih error → Masalah di wiring/pin ESP32
```

---

## 🎯 Quick Fix Checklist

Jika sensor metal tidak berfungsi, coba langkah ini secara berurutan:

1. **[2 menit]** Upload kode baru dan test dengan command `TEST`
2. **[2 menit]** Test real-time dengan command `METAL`
3. **[5 menit]** Cek wiring: VCC, OUT, GND
4. **[5 menit]** Cek tegangan dengan multimeter
5. **[5 menit]** Balik logika jika terbalik (Active HIGH)
6. **[10 menit]** Kalibrasi sensitivitas (potentiometer)
7. **[10 menit]** Test dengan LED indikator
8. **[15 menit]** Ganti sensor baru

**Total waktu troubleshooting: 15-30 menit**

---

## 📚 Referensi

### Jenis Sensor Metal Proximity

| Jenis | Deteksi | Jarak | Output | Tegangan |
|-------|---------|-------|--------|----------|
| Inductive (NPN) | Logam ferrous | 2-10mm | Active LOW | 5V/12V |
| Inductive (PNP) | Logam ferrous | 2-10mm | Active HIGH | 5V/12V |
| Capacitive | Semua material | 5-15mm | NPN/PNP | 5V/12V |
| Hall Effect | Magnet | 1-5mm | Digital | 3.3V/5V |

### Wiring Diagram

```
ESP32                    Metal Sensor
                         ┌─────────┐
5V  ────────────────────>│ VCC     │
                         │         │
GPIO 25 <────────────────│ OUT     │
                         │         │
GND ────────────────────>│ GND     │
                         └─────────┘
```

---

## ✅ Success Criteria

Sensor metal bekerja normal jika:
- ✅ Command `TEST` menunjukkan raw value berubah saat ada logam
- ✅ Command `METAL` menunjukkan "Detected: YES" saat ada logam
- ✅ Command `METAL` menunjukkan "Detected: NO" saat tidak ada logam
- ✅ Botol dengan logam ditolak (3x buzz, LCD "BOTOL CACAT")
- ✅ Botol tanpa logam diterima (1x buzz, LCD "BOTOL KECIL/SEDANG/BESAR")

**Expected Output:**
```
[Metal] Raw: 0 | Detected: YES
[Metal] ⚠️ LOGAM TERDETEKSI - REJECT
[LCD] BOTOL CACAT
[LCD] ADA LOGAM
```
