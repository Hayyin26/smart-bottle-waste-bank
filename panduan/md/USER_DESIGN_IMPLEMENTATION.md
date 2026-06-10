# 🎨 Implementasi Design User (Dari Gambar)

## 📸 Design Reference
Berdasarkan gambar yang Anda berikan, ini adalah layout yang **SANGAT PRAKTIS**!

---

## 🎯 Konsep Layout

```
┌─────────────────────────────────────────┐
│ [ESP32]           [LCD Display]         │  ← Control Panel (atas)
├─────────────────────────────────────────┤
│                                         │
│  [HC-SR04 LENGTH]  [HC-SR04 HEIGHT]    │  ← Sensor di atas
│         ▓▓              ▓▓              │
│         ││              ││              │
│         ↓↓              ↓↓              │
│         ↓↓              ↓↓              │
│  ══════════════════════════════         │
│  [     Platform Pengukuran     ]       │  ← Botol diletakkan
│  ══════════════════════════════         │
│                                         │
│  ────────[SERVO GATE]──────────         │  ← Gate (pintu)
│                                         │
│  ┌───────────────────────────┐         │
│  │   TEMPAT BOTOL            │         │  ← Collection box
│  │   (removable)             │         │
│  └───────────────────────────┘         │
└─────────────────────────────────────────┘
```

---

## 📍 Penempatan Komponen Detail

### **ZONA 1: Control Panel (Atas - 0-10cm)**
```
[ESP32]  [LCD 16x2]  [Power Supply]
   📡        ▓▓▓         🔌
```
**Mounting:** Panel belakang + depan

---

### **ZONA 2: Measurement Chamber (Tengah - 10-30cm)**

#### **A. Sensor Atas (mounted di plafon chamber)**
```
     ← 30cm lebar chamber →
    ┌────────────────────────┐
    │                        │
    │  [LENGTH]    [HEIGHT]  │  ← 2 sensor sejajar
    │     ▓▓          ▓▓     │
    │     ││          ││     │
    │     ↓↓  10cm    ↓↓     │
    │     ↓↓          ↓↓     │
    └────────────────────────┘
```

**Jarak sensor:**
- **LENGTH sensor** → **10cm dari sisi kiri** platform
- **HEIGHT sensor** → **10cm dari tengah** platform
- **Clearance:** 10cm dari sensor ke platform

---

#### **B. Platform (tempat botol)**
```
     ← 25cm lebar →
    ┌──────────────┐  ↑
    │              │  │
    │   Platform   │  │ 20cm
    │   Acrylic    │  │ panjang
    │   5mm        │  │
    │              │  │
    └──────────────┘  ↓
         ↑
    4 kaki spacer
    (tinggi 5cm)
```

**Spesifikasi:**
- Material: Acrylic 5mm
- Ukuran: 25x20cm
- Mounting: 4 spacer M3 (10mm) sebagai kaki
- Posisi: 20cm dari atas kotak

---

### **ZONA 3: Gate & Collection (Bawah - 30-45cm)**

```
    ┌──────────────────────┐
    │                      │
    │    ┌─── Servo        │  ← 31cm dari atas
    │    │                 │
    │    └──┐              │
    │   GATE│ (tutup)      │  ← 33cm dari atas
    │  ─────┴─────────     │
    │                      │
    │  ┌────────────────┐  │
    │  │  Tempat Botol  │  │  ← 35cm dari atas
    │  │  💧 💧 💧     │  │     (removable)
    │  │  💧 💧 💧     │  │
    │  └────────────────┘  │
    └──────────────────────┘
```

---

## 🔌 Wiring Sesuai Gambar

```
ESP32 (di kiri) ──→ Semua sensor & actuator
│
├─→ GPIO 4  → HC-SR04 LENGTH (TRIG)
├─→ GPIO 18 → HC-SR04 LENGTH (ECHO)
│
├─→ GPIO 5  → HC-SR04 HEIGHT (TRIG)
├─→ GPIO 12 → HC-SR04 HEIGHT (ECHO)
│
├─→ GPIO 19 → SERVO (PWM)
│
├─→ GPIO 21 → LCD SDA (I2C)
├─→ GPIO 22 → LCD SCL (I2C)
│
├─→ GPIO 23 → BUZZER
├─→ GPIO 25 → METAL SENSOR
├─→ GPIO 13 → IR LAMP
│
├─→ VIN (5V) ← Buck Converter
└─→ GND (Common Ground)
```

---

## 📏 Ukuran Kotak yang Cocok

Berdasarkan gambar Anda, ini dimensi ideal:

**Kotak:**
- **Tinggi:** 45 cm ✅
- **Lebar:** 40 cm ✅
- **Kedalaman:** 40 cm ✅

**Pembagian Zona:**
- Control Panel: 0-10cm (22%)
- Measurement: 10-30cm (44%)
- Collection: 30-45cm (34%)

---

## 🎨 View dari Atas (Top View)

```
         ← 40cm lebar →
    ╔════════════════════╗  ↑
    ║ [ESP32]   [LCD]    ║  │
    ║   📡       ▓▓▓     ║  │
    ╠════════════════════╣  │
    ║                    ║  │
    ║  [LENGTH] [HEIGHT] ║  │ 40cm
    ║     ▓▓       ▓▓    ║  │ kedalaman
    ║                    ║  │
    ║  ┌──────────────┐  ║  │
    ║  │   Platform   │  ║  │
    ║  │   [Bottle]   │  ║  │
    ║  └──────────────┘  ║  │
    ║                    ║  │
    ║      [Servo]       ║  │
    ║       [Gate]       ║  │
    ║                    ║  │
    ║  ┌──────────────┐  ║  │
    ║  │ Tempat Botol │  ║  │
    ║  └──────────────┘  ║  │
    ╚════════════════════╝  ↓
```

---

## 🔧 Cara Kerja (Sesuai Gambar)

```
┌─────────────────────────────────┐
│ 1. Botol masuk dari SAMPING     │  ← Slot di sisi kanan
│         ↓                       │
│ 2. Botol jatuh ke PLATFORM      │
│         ↓                       │
│ 3. SENSOR UKUR:                 │
│    - LENGTH (kiri) → Panjang    │
│    - HEIGHT (kanan) → Diameter  │
│         ↓                       │
│ 4. ESP32 KLASIFIKASI SIZE       │
│         ↓                       │
│ 5. SERVO BUKA GATE              │
│         ↓                       │
│ 6. Botol jatuh ke TEMPAT BOTOL  │
│         ↓                       │
│ 7. SERVO TUTUP GATE             │
└─────────────────────────────────┘
```

---

## 💡 Keunggulan Design Ini

### **Pros:**
- ✅ **Sangat simpel** - layout straightforward
- ✅ **Mudah dirakit** - komponen tidak terlalu rapat
- ✅ **Akses mudah** - tempat botol removable
- ✅ **Maintenance gampang** - semua komponen accessible
- ✅ **Compact** - fit di 45x40cm

### **Improvement Suggestions:**
1. **Tambah LCD** di depan (user interface)
2. **Tambah Metal Sensor** dekat platform (reject kaleng)
3. **Tambah Buzzer** (feedback audio)
4. **Tambah IR Lamp** (penerangan)

---

## 🛠️ Modifikasi dari Gambar

### **Tambahan Komponen (tidak di gambar):**

```
┌─────────────────────────────────────┐
│ [ESP32]  [LCD Display]  [Power]     │  ← LCD untuk user
├─────────────────────────────────────┤
│                                     │
│  [LENGTH]      [HEIGHT]             │
│     ▓▓            ▓▓                │
│                                     │
│  ══════════════════════             │
│  [   Platform   ]                   │
│  [M] ← Metal Sensor (di sini)       │  ← Reject kaleng
│  ══════════════════════             │
│                                     │
│  [💡] ← IR Lamp (opsional)          │
│  [🔊] ← Buzzer (opsional)           │
│                                     │
│  ────────[SERVO]──────────          │
│                                     │
│  ┌─────────────────────┐            │
│  │   Tempat Botol      │            │
│  └─────────────────────┘            │
└─────────────────────────────────────┘
```

---

## 📦 Shopping List (Sesuai Design)

| No | Item | Qty | Harga |
|----|------|-----|-------|
| 1 | ESP32 DevKit | 1 | Rp 60.000 |
| 2 | LCD 16x2 I2C | 1 | Rp 35.000 |
| 3 | HC-SR04 (2x) | 2 | Rp 20.000 |
| 4 | Servo MG996R | 1 | Rp 45.000 |
| 5 | Metal Sensor | 1 | Rp 30.000 |
| 6 | Buzzer 5V | 1 | Rp 5.000 |
| 7 | IR Lamp 12V | 1 | Rp 15.000 |
| 8 | Power 12V 3A | 1 | Rp 40.000 |
| 9 | Buck Converter | 1 | Rp 15.000 |
| 10 | Acrylic 5mm | 1 set | Rp 150.000 |
| 11 | Kabel + Hardware | 1 set | Rp 40.000 |
| **TOTAL** | | | **Rp 455.000** |

---

## ✅ Checklist Implementation

### **Hardware:**
- [ ] Rakit kotak 45x40x40cm
- [ ] Mount ESP32 di kiri (belakang)
- [ ] Pasang LCD di depan
- [ ] Install 2x HC-SR04 di atas platform
  - [ ] LENGTH di kiri
  - [ ] HEIGHT di kanan
- [ ] Buat platform acrylic 25x20cm
- [ ] Pasang metal sensor dekat platform
- [ ] Mount servo di atas collection box
- [ ] Pasang gate ke servo
- [ ] Install collection box (removable)

### **Software:**
- [ ] Upload kode ESP32 (main.cpp)
- [ ] Test WiFi connection
- [ ] Kalibrasi sensor ultrasonic
- [ ] Test metal sensor
- [ ] Test servo gate
- [ ] Test full flow

### **Integration:**
- [ ] Deploy web app ke Vercel
- [ ] Setup database Supabase
- [ ] Test QR login
- [ ] Test data transmission
- [ ] Verify point calculation

---

## 🎯 Hasil Akhir

Design Anda **SANGAT COCOK** untuk IoT Bank Sampah sederhana!

**Kelebihan:**
- ✅ Layout jelas dan mudah dipahami
- ✅ Komponen tidak terlalu kompleks
- ✅ Cocok untuk budget mahasiswa
- ✅ Maintenance mudah

**Yang perlu ditambah:**
- LCD Display (user interface)
- Metal Sensor (reject kaleng)
- Buzzer (feedback)

**Status:** ✅ **READY TO BUILD!**

---

**Design Implementation v1.0**  
**Based on:** User sketch  
**Budget:** Rp 455.000  
**Last Updated:** June 9, 2026
