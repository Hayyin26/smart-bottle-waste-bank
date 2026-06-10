# 📦 Desain Sederhana IoT Bank Sampah (Tanpa Load Cell)

## 🎯 Konsep Simpel

**Sensor yang dipakai:**
- ✅ **2x Ultrasonic HC-SR04** - Ukur diameter & panjang botol
- ✅ **1x Metal Sensor** - Tolak botol kaleng/logam
- ❌ **Load Cell** - TIDAK DIPAKAI (hemat Rp 50.000)

**Kriteria Accept/Reject:**
- ✅ **ACCEPT:** Botol plastik dengan ukuran sesuai (small/medium/large)
- ❌ **REJECT:** Botol logam/kaleng (terdeteksi metal sensor)

---

## 📐 Ukuran Kotak: 45cm × 40cm × 40cm

```
┌────────────────────────────────────────┐  ← 40cm lebar
│         [LCD 16x2 Display]             │  ↑
│        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │  │
│                                        │  │
│     SMART BOTTLE WASTE BANK            │  │
│                                        │  │ 45cm
│     [QR CODE - Scan untuk login]      │  │ tinggi
│                                        │  │
│         ╔════════════╗                 │  │
│         ║  SLOT IN   ║  ← Lubang      │  │
│         ║  ▼ ▼ ▼     ║     masuk      │  │
│         ╚════════════╝     botol      │  │
│                                        │  ↓
└────────────────────────────────────────┘
```

---

## 🔧 Sensor Placement (Simplified)

```
           ← 40cm kedalaman →
    ┌──────────────────────────────┐  ↑
    │ [ESP32] [Power Supply]       │  │
    ├──────────────────────────────┤  │
    │                              │  │
    │ [Ultrasonic HEIGHT]          │  │
    │  ▓▓ ← sensor di atas         │  │ 45cm
    │   ↕ 10cm jarak               │  │ tinggi
    │  ════════════════            │  │
    │  [Platform Sederhana]        │  │
    │  ┌──────────────┐            │  │
    │  │ [Bottle]     │            │  │
    │  └──────────────┘            │  │
    │         ↑                    │  │
    │    [Metal Sensor]            │  │
    │         ↑                    │  │
    │  ┌──────────────┐            │  │
    │  │ [Servo Gate] │            │  │
    │  └──────────────┘            │  │
    │  [Box Penampung]             │  │
    └──────────────────────────────┘  ↓

▓▓ ← [Ultrasonic LENGTH] (samping kiri)
```

---

## 📍 Komponen List (Simplified)

| No | Komponen | Fungsi | Harga |
|----|----------|--------|-------|
| 1 | ESP32 DevKit | Brain system | Rp 60.000 |
| 2 | LCD 16x2 I2C | Display | Rp 35.000 |
| 3 | Ultrasonic HC-SR04 (2x) | Ukur diameter & panjang | Rp 20.000 |
| 4 | Metal Sensor LJ12A3 | Tolak kaleng | Rp 30.000 |
| 5 | Servo MG996R | Buka/tutup gate | Rp 45.000 |
| 6 | Buzzer 5V | Feedback suara | Rp 5.000 |
| 7 | IR Lamp 12V | Penerangan | Rp 15.000 |
| 8 | Power Supply 12V 3A | Power | Rp 40.000 |
| 9 | Buck Converter 12V→5V | Step down | Rp 15.000 |
| 10 | Kabel Jumper | Wiring | Rp 10.000 |
| **TOTAL ELEKTRONIK** | | | **Rp 275.000** |

**Hemat:** Rp 80.000 (tidak pakai load cell + HX711 + breadboard)

---

## ⚙️ Cara Kerja (Simplified)

```
┌─────────────────────────────────────────┐
│ 1. User scan QR → Login                 │
│         ↓                               │
│ 2. User masukkan botol HORIZONTAL       │
│         ↓                               │
│ 3. METAL SENSOR CEK:                    │
│    - Logam? → REJECT! ❌                │
│    - Plastik? → Lanjut ✅               │
│         ↓                               │
│ 4. ULTRASONIC UKUR:                     │
│    - HEIGHT → Diameter (5-22cm)         │
│    - LENGTH → Panjang (8-30cm)          │
│         ↓                               │
│ 5. KLASIFIKASI SIZE:                    │
│    - KECIL: 5-11cm × 8-13cm → 5 point   │
│    - SEDANG: 12-16cm × 15-20cm → 10 pt  │
│    - BESAR: 18-22cm × 21-30cm → 15 pt   │
│         ↓                               │
│ 6. LCD TAMPIL: "BOTOL SEDANG +10 PT"   │
│         ↓                               │
│ 7. SERVO BUKA GATE                      │
│         ↓                               │
│ 8. Botol jatuh ke box                   │
│         ↓                               │
│ 9. SERVO TUTUP GATE                     │
│         ↓                               │
│ 10. Data ke Supabase                    │
└─────────────────────────────────────────┘
```

---

## 🔌 Wiring Diagram (Simplified)

```
┌──────────────────────────────────────────────┐
│              ESP32 (30 PIN)                  │
│                                              │
│  GPIO  4  →  TRIG (Ultrasonic HEIGHT)       │
│  GPIO 18  →  ECHO (Ultrasonic HEIGHT)       │
│  GPIO  5  →  TRIG (Ultrasonic LENGTH)       │
│  GPIO 12  →  ECHO (Ultrasonic LENGTH)       │
│  GPIO 19  →  SERVO (PWM)                     │
│  GPIO 23  →  BUZZER                          │
│  GPIO 13  →  IR LAMP (via MOSFET)            │
│  GPIO 25  →  METAL SENSOR (digital input)    │
│  GPIO 21  →  LCD SDA (I2C)                   │
│  GPIO 22  →  LCD SCL (I2C)                   │
│                                              │
│  VIN      →  5V (from Buck Converter)        │
│  GND      →  Common Ground                   │
└──────────────────────────────────────────────┘

Power:
  220V AC → 12V 3A Power Supply
           ├→ Buck Converter → 5V → ESP32
           └→ 12V → IR Lamp (via MOSFET)
```

**PIN yang TIDAK DIPAKAI lagi:**
- ~~GPIO 26~~ (Load Cell DOUT)
- ~~GPIO 27~~ (Load Cell SCK)

---

## 🎨 Platform Sederhana (Tanpa Load Cell)

```
     ← 25cm lebar →
    ┌────────────────┐  ↑
    │                │  │
    │   Platform     │  │ 20cm
    │   Akrilik 5mm  │  │ panjang
    │                │  │
    │  [Botol di sini]  │
    │                │  │
    └────────────────┘  ↓
         ↑
    4 kaki penyangga
    (spacer M3 10mm)
```

**Tidak perlu:**
- ❌ Load cell mounting
- ❌ HX711 module
- ❌ Kalibrasi berat
- ❌ Complex wiring

**Platform simpel:**
- ✅ Acrylic 25x20cm
- ✅ 4 spacer M3 sebagai kaki
- ✅ Hot glue ke dasar kotak

---

## 📋 Klasifikasi Botol (Tanpa Berat)

### **Kriteria SIZE (hanya ukuran fisik)**

| Size | Diameter (HEIGHT) | Panjang (LENGTH) | Point | Contoh |
|------|------------------|------------------|-------|--------|
| **KECIL** | 5-11 cm | 8-13 cm | **5 point** | Aqua 330ml |
| **SEDANG** | 12-16 cm | 15-20 cm | **10 point** | Aqua 600ml |
| **BESAR** | 18-22 cm | 21-30 cm | **15 point** | Aqua 1.5L |

### **Kriteria MATERIAL (metal sensor)**

| Material | Detected | Action |
|----------|----------|--------|
| **Plastik** | NO | ✅ ACCEPT → Ukur size → Point |
| **Kaleng/Logam** | YES | ❌ REJECT → Buzzer 3x → No point |

---

## 💰 Budget Update

### **Elektronik (Rp 275.000)**
- ESP32: Rp 60.000
- LCD: Rp 35.000
- Ultrasonic (2x): Rp 20.000
- Metal Sensor: Rp 30.000
- Servo: Rp 45.000
- Buzzer: Rp 5.000
- IR Lamp: Rp 15.000
- Power Supply: Rp 40.000
- Buck Converter: Rp 15.000
- Kabel: Rp 10.000

### **Struktur (Rp 180.000)**
- Acrylic 5mm: Rp 150.000
- Bracket + Sekrup: Rp 30.000

### **TOTAL: Rp 455.000** 🎉

**Hemat dari design sebelumnya:**
- ❌ Load Cell + HX711: Rp 50.000
- ❌ Breadboard: Rp 10.000
- ❌ Komponen load cell mounting: Rp 20.000
- **Total hemat: Rp 80.000**

---

## ✅ Keuntungan Design Simplified

### **Pros:**
- ✅ **Lebih murah** (Rp 455.000 vs Rp 615.000)
- ✅ **Lebih sederhana** (2 sensor vs 4 sensor)
- ✅ **Tidak perlu kalibrasi berat** (load cell ribet)
- ✅ **Lebih cepat dirakit** (less wiring)
- ✅ **Lebih mudah di-maintain**
- ✅ **Platform lebih simpel** (tidak perlu load cell mounting)

### **Cons:**
- ❌ Tidak ada data berat botol
- ❌ Tidak bisa deteksi botol isi/kosong berdasarkan berat
- ❌ Kurang akurat untuk identifikasi (hanya ukuran)

### **Trade-off:**
**Untuk Bank Sampah sederhana, design ini SUDAH CUKUP!** ✅

---

## 🔧 Assembly Steps (Simplified)

### **Step 1: Rakit Kotak (2 jam)**
- Potong & rakit akrilik 45x40x40cm
- Buat lubang LCD, slot masuk

### **Step 2: Mount Elektronik (1.5 jam)**
- Pasang ESP32, power supply (belakang atas)
- Mount LCD (depan atas)
- Pasang ultrasonic HEIGHT (atas, tengah)
- Pasang ultrasonic LENGTH (samping kiri)
- Mount metal sensor (dekat platform)
- Install servo motor (atas box penampung)
- Pasang IR lamp (atas chamber)

### **Step 3: Platform Sederhana (15 menit)**
- Potong akrilik 25x20cm
- Pasang 4 spacer M3 sebagai kaki
- Hot glue ke dasar kotak

### **Step 4: Wiring (1.5 jam)**
- Sambungkan semua sensor ke ESP32
- Test dengan multimeter
- Cable management

### **Step 5: Upload Kode (30 menit)**
- Upload main.cpp (simplified version)
- Test WiFi connection
- Verify sensor readings

### **Step 6: Testing (30 menit)**
- Test metal sensor
- Test ultrasonic readings
- Test servo gate
- Test full flow

**Total waktu:** ~6 jam (vs 8 jam dengan load cell)

---

## 🎯 Testing Checklist (Simplified)

- [ ] Power 12V dan 5V stabil
- [ ] ESP32 connect WiFi
- [ ] LCD display OK
- [ ] Ultrasonic HEIGHT baca akurat
- [ ] Ultrasonic LENGTH baca akurat
- [ ] Metal sensor deteksi logam
- [ ] Servo buka/tutup smooth
- [ ] Buzzer bunyi
- [ ] IR lamp nyala
- [ ] QR login berhasil
- [ ] Klasifikasi size benar
- [ ] Reject kaleng berhasil
- [ ] Accept plastik berhasil
- [ ] Data tersimpan ke database

---

## 📝 Notes

### **Metal Sensor Sensitivity**
- Jarak deteksi: 2-4mm (tergantung sensor)
- Test dengan kaleng Coca-Cola
- Adjust posisi sensor agar reliable

### **Ultrasonic Accuracy**
- ±1cm untuk jarak < 30cm
- Hindari permukaan miring
- Botol harus horizontal (tidur)

### **Platform Height**
- 10cm dari ultrasonic HEIGHT
- 10cm dari ultrasonic LENGTH
- Pastikan stabil (tidak goyang)

---

**Design:** Simplified (No Load Cell)  
**Budget:** Rp 455.000  
**Status:** ✅ Recommended for students  
**Last Updated:** June 9, 2026
