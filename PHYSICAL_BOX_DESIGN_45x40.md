# 📦 Desain Fisik IoT Bank Sampah - Kotak 45x40cm

## 📐 Spesifikasi Kotak

**Dimensi:**
- **Tinggi:** 45 cm
- **Lebar:** 40 cm  
- **Kedalaman:** 40 cm (diasumsikan sama dengan lebar untuk bentuk kotak)
- **Material:** Akrilik / MDF / Plywood (minimal 5mm)

---

## 🎨 Tampak Depan (Front View)

```
┌────────────────────────────────────────┐  ← 40cm lebar
│         [LCD 16x2 Display]             │  ↑
│        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │  │
│                                        │  │
│     ┌──────────────────────┐          │  │
│     │                      │          │  │  
│     │   SMART BOTTLE       │          │  │
│     │   WASTE BANK         │          │  │ 45cm
│     │                      │          │  │ tinggi
│     │   [QR CODE]          │          │  │
│     │   Scan untuk login   │          │  │
│     │                      │          │  │
│     └──────────────────────┘          │  │
│                                        │  │
│         ╔════════════╗                 │  │
│         ║  SLOT IN   ║  ← Lubang      │  │
│         ║  ▼ ▼ ▼     ║     masuk      │  │
│         ╚════════════╝     botol      │  │
│                                        │  ↓
└────────────────────────────────────────┘
```

---

## 🔧 Tampak Samping (Side View - Potongan)

```
           ← 40cm kedalaman →
    ┌──────────────────────────────┐  ↑
    │ [ESP32] [Power Supply]       │  │
    │  📡WiFi   🔌 12V/5V          │  │
    ├──────────────────────────────┤  │
    │ [LCD Display - mounted]      │  │
    ├──────────────────────────────┤  │ 45cm
    │                              │  │
    │ [Ultrasonic HEIGHT]          │  │ tinggi
    │  ▓▓ ← sensor di atas         │  │
    │   ↕ 10cm jarak ke platform   │  │
    │  ════════════════            │  │
    │  [Platform/Timbangan]        │  │
    │  ┌─ Load Cell ─────┐         │  │
    │  │ [Bottle Here]    │         │  │
    │  └──────────────────┘         │  │
    │         ↑                     │  │
    │    [Ultrasonic LENGTH]        │  │
    │     ▓▓ sensor di samping     │  │
    │                              │  │
    │  ┌──────────────┐            │  │
    │  │ [Servo Gate] │            │  │
    │  │   \_____/    │            │  │
    │  └──────────────┘            │  │
    │       [Box Penampung]        │  │
    │         Botol                │  │
    │          💧💧                │  │
    └──────────────────────────────┘  ↓
```

---

## 📍 Layout Komponen - Tampak Atas (Top View)

```
           ← 40cm lebar →
    ┌──────────────────────────────┐  ↑
    │  [Power]  [ESP32]  [Buzzer]  │  │
    │    🔌      📡        🔊      │  │
    ├──────────────────────────────┤  │
    │                              │  │
    │      ▓▓  ← Ultrasonic        │  │ 40cm
    │      HEIGHT Sensor           │  │ kedalaman
    │         (TOP)                │  │
    │                              │  │
    │    ┌──────────────┐          │  │
    │ ▓▓ │   Platform   │          │  │
    │ U  │   + Bottle   │          │  │
    │ L  │ (Measurement │          │  │
    │ T  │    Area)     │          │  │
    │ R  └──────────────┘          │  │
    │ A    ↑ Load Cell             │  │
    │ S                            │  │
    │ O  [Metal Sensor]            │  │
    │ N  [IR Lamp]                 │  │
    │ I                            │  │
    │ C    [Servo Motor]           │  │
    │         └─ Gate              │  │
    │ L                            │  │
    │ E   ┌────────────────┐       │  │
    │ N   │  Box Penampung │       │  │
    │ G   │     Botol      │       │  │
    │ T   └────────────────┘       │  │
    │ H                            │  │
    └──────────────────────────────┘  ↓
```

---

## 🔌 Posisi Komponen Detail

### **ZONA 1: Control Panel (Bagian Atas)**
**Posisi:** 0-10cm dari atas

| Komponen | Posisi | Mounting | Keterangan |
|----------|--------|----------|------------|
| **LCD 16x2** | Depan, 5cm dari atas | Panel mount | User interface utama |
| **ESP32** | Belakang, 3cm dari atas | PCB mount/box | Brain system |
| **Power Supply** | Belakang, di samping ESP32 | Screw mount | 12V/5V converter |
| **Buzzer** | Belakang, pojok kanan | Hot glue | Feedback audio |

---

### **ZONA 2: Measurement Chamber (Bagian Tengah)**
**Posisi:** 10-30cm dari atas

| Komponen | Posisi | Mounting | Keterangan |
|----------|--------|----------|------------|
| **Ultrasonic HEIGHT** | Atas chamber, tengah | Bracket mount | Ukur diameter botol (jarak 10cm ke platform) |
| **Ultrasonic LENGTH** | Samping kiri chamber | Bracket mount | Ukur panjang botol |
| **Platform/Tray** | Tengah, 20cm dari atas | Load cell support | Tempat botol diletakkan |
| **Load Cell (HX711)** | Bawah platform | Load cell mount | Timbang berat botol |
| **Metal Sensor** | Samping kanan chamber | Bracket mount | Deteksi logam |
| **IR Lamp** | Atas chamber | Adjustable mount | Penerangan untuk sensor |

---

### **ZONA 3: Collection Box (Bagian Bawah)**
**Posisi:** 30-45cm dari atas

| Komponen | Posisi | Mounting | Keterangan |
|----------|--------|----------|------------|
| **Servo Motor** | Atas box, tengah | Servo bracket | Buka/tutup gate |
| **Gate** | Sambungan ke servo | Servo horn + acrylic | Pintu otomatis |
| **Collection Box** | Bawah, removable | Slide-in tray | Penampung botol accepted |

---

## 🎯 Cara Kerja Sistem

### **1. User Login (QR Code)**
```
User → Scan QR di HP → ESP32 terima token → LCD tampil nama user
```

### **2. Pengukuran Botol**
```
┌─────────────────────────────────────────┐
│ 1. User masukkan botol HORIZONTAL       │
│    (tidur) ke slot                      │
│         ↓                               │
│ 2. Botol jatuh ke Platform              │
│         ↓                               │
│ 3. SENSOR AKTIF:                        │
│    - Ultrasonic HEIGHT → Diameter       │
│    - Ultrasonic LENGTH → Panjang        │
│    - Load Cell → Berat                  │
│    - Metal Sensor → Material            │
│         ↓                               │
│ 4. ESP32 KLASIFIKASI:                   │
│    - KECIL (5 point)                    │
│    - SEDANG (10 point)                  │
│    - BESAR (15 point)                   │
│         ↓                               │
│ 5. LCD TAMPIL: "BOTOL SEDANG +10 PT"   │
│         ↓                               │
│ 6. SERVO BUKA GATE (90°)                │
│         ↓                               │
│ 7. Botol jatuh ke box penampung         │
│         ↓                               │
│ 8. SERVO TUTUP GATE (0°)                │
│         ↓                               │
│ 9. Data terkirim ke Supabase            │
│         ↓                               │
│ 10. Point user terupdate di web app    │
└─────────────────────────────────────────┘
```

---

## 📏 Ukuran Detail Komponen

### **Measurement Chamber**
```
     ← 30cm lebar chamber →
    ┌────────────────────────┐  ↑
    │  [Ultrasonic HEIGHT]   │  │
    │         ▓▓             │  │
    │         ↓              │  │
    │        10cm jarak      │  │ 20cm
    │         ↓              │  │ tinggi
    │  ════════════════      │  │ chamber
    │  [Platform 25x20cm]    │  │
    │   dengan Load Cell     │  │
▓▓  │   [Botol di sini]      │  │
↑   └────────────────────────┘  ↓
Ultrasonic
LENGTH
(samping)
```

**Platform Specifications:**
- **Size:** 25cm x 20cm
- **Material:** Acrylic 5mm
- **Load Cell:** 5kg capacity
- **Clearance:** 10cm dari sensor atas, 10cm dari sensor samping

---

## 🔩 Material List (Bill of Materials)

### **Struktur Utama**
| Item | Qty | Spec | Harga Est. |
|------|-----|------|------------|
| Acrylic/MDF 5mm | 1 set | 45x40x40cm | Rp 150.000 |
| Bracket L | 8 pcs | Stainless | Rp 20.000 |
| Sekrup M3 | 50 pcs | + mur | Rp 10.000 |

### **Elektronik**
| Item | Qty | Spec | Harga Est. |
|------|-----|------|------------|
| ESP32 DevKit | 1 | 30 pin | Rp 60.000 |
| LCD 16x2 I2C | 1 | Blue backlight | Rp 35.000 |
| Ultrasonic HC-SR04 | 2 | 2-400cm range | Rp 20.000 |
| Load Cell 5kg | 1 | + HX711 module | Rp 50.000 |
| Metal Proximity Sensor | 1 | NPN/PNP | Rp 30.000 |
| Servo Motor MG996R | 1 | 180° rotation | Rp 45.000 |
| Buzzer 5V | 1 | Active | Rp 5.000 |
| IR Lamp LED | 1 | 12V 3W | Rp 15.000 |
| Power Supply | 1 | 12V 3A | Rp 40.000 |
| Buck Converter | 1 | 12V→5V 3A | Rp 15.000 |
| Kabel Jumper | 1 set | Male-Female | Rp 20.000 |

### **Mekanik**
| Item | Qty | Spec | Harga Est. |
|------|-----|------|------------|
| Servo Bracket | 1 | Alloy | Rp 15.000 |
| Platform Acrylic | 1 | 25x20cm | Rp 20.000 |
| Gate (Pintu) | 1 | Acrylic custom | Rp 25.000 |
| Box Penampung | 1 | Plastic/Acrylic | Rp 30.000 |

**Total Estimasi:** Rp 605.000 - Rp 700.000

---

## 🔌 Wiring Diagram

```
┌──────────────────────────────────────────────┐
│              ESP32 (30 PIN)                  │
│  3V3 ┌──┬──┬─────────────┬───────┬─────┐    │
│      │  │  │             │       │     │    │
│  GND ┼──┼──┼─────────────┼───────┼─────┤    │
│      │  │  │             │       │     │    │
│  GPIO├──┘  │             │       │     │    │
│   4  │TRIG │             │       │     │    │
│  18  ├─────┘ECHO (HEIGHT)│       │     │    │
│      │                   │       │     │    │
│   5  ├───────────────────┘TRIG   │     │    │
│  12  ├─────────────────────ECHO  │     │    │
│      │                  (LENGTH) │     │    │
│  19  ├────────────────────────────┘SERVO│    │
│  23  ├──────────────────────────────────┘    │
│      │                             BUZZER    │
│  13  ├──────────────IR LAMP (via transistor) │
│  25  ├──────────────METAL SENSOR             │
│  26  ├──────────────LOADCELL DOUT            │
│  27  ├──────────────LOADCELL SCK             │
│  21  ├──────────────LCD SDA (I2C)            │
│  22  ├──────────────LCD SCL (I2C)            │
│      │                                        │
│  VIN ├──────────────5V (from Buck Converter) │
│  GND ├──────────────GND (Common Ground)      │
└──────────────────────────────────────────────┘

Power Distribution:
  220V AC → Power Supply 12V 3A
           ├─→ Buck Converter → 5V 3A → ESP32 (VIN)
           ├─→ 12V → IR Lamp (via MOSFET)
           └─→ 5V → Servo Motor (dengan kapasitor 1000µF)
```

---

## 📸 Assembly Steps

### **Step 1: Struktur Kotak**
1. Potong material (akrilik/MDF) sesuai ukuran
2. Rakit dengan bracket L dan sekrup
3. Buat lubang:
   - Depan atas: LCD (8x4cm)
   - Depan tengah: Slot masuk botol (20x8cm)
   - Samping: Ventilasi (opsional)

### **Step 2: Mounting Elektronik**
1. **Control Panel** (atas):
   - Mount LCD dengan spacer M3
   - Pasang ESP32 di box PCB
   - Install power supply

2. **Measurement Chamber** (tengah):
   - Pasang ultrasonic HEIGHT di atas (bracket adjustable)
   - Pasang ultrasonic LENGTH di samping kiri
   - Install platform di atas load cell
   - Mount metal sensor di samping kanan
   - Install IR lamp dengan adjustable bracket

3. **Collection Area** (bawah):
   - Mount servo motor di atas box
   - Pasang gate ke servo horn
   - Letakkan box penampung (slide-in)

### **Step 3: Wiring**
1. Sambungkan semua sensor ke ESP32 sesuai pin diagram
2. Test koneksi dengan multimeter
3. Pasang kabel rapi dengan cable ties
4. Ground common untuk semua komponen

### **Step 4: Kalibrasi**
1. **Load Cell:** Run kalibrasi script (calibrate_loadcell.cpp)
2. **Ultrasonic:** Test dengan command `TEST` di Serial Monitor
3. **Servo:** Adjust sudut buka/tutup gate
4. **LCD:** Test alamat I2C (biasanya 0x27 atau 0x3F)

---

## 🎨 Finishing & Estetika

### **Eksternal**
- Sticker logo "SMART BOTTLE WASTE BANK"
- Instruksi penggunaan (print di akrilik depan)
- QR Code untuk login (di depan, 15cm dari atas)
- LED strip untuk efek visual (opsional)

### **Internal**
- Cable management dengan ties
- Label setiap kabel
- Spacer untuk ESP32 (hindari short circuit)
- Grounding proper

---

## 🔋 Power Management

**Konsumsi Daya:**
- ESP32: ~500mA (WiFi aktif)
- LCD: ~100mA
- Servo (aktif): ~1A
- Ultrasonic (2x): ~30mA
- Load Cell: ~10mA
- IR Lamp: ~250mA
- Buzzer: ~30mA

**Total Max:** ~2A @ 5V + IR Lamp @ 12V

**Power Supply:** 12V 3A (36W) **✓ Cukup**

---

## 📐 CAD Files (Untuk Laser Cutting)

### **Panel Depan (40x45cm)**
- Lubang LCD: 8x4cm @ posisi (16, 5)
- Lubang Slot: 20x8cm @ posisi (10, 20)
- Mounting holes: ⌀3mm di 4 pojok

### **Panel Samping (40x45cm) x2**
- Ventilasi: 5x5cm @ posisi (5, 5)
- Mounting holes: ⌀3mm di 4 pojok

### **Platform (25x20cm)**
- Lubang load cell: ⌀5mm di 4 pojok
- Thickness: 5mm acrylic

---

## ✅ Testing Checklist

- [ ] Power supply 12V dan 5V stabil
- [ ] ESP32 boot dan connect WiFi
- [ ] LCD menampilkan text dengan benar
- [ ] Ultrasonic HEIGHT baca jarak akurat
- [ ] Ultrasonic LENGTH baca jarak akurat
- [ ] Load cell baca berat akurat (±5g)
- [ ] Metal sensor deteksi logam
- [ ] Servo buka tutup gate smooth
- [ ] Buzzer bunyi saat trigger
- [ ] IR lamp menyala
- [ ] QR login berhasil
- [ ] Transaksi tersimpan ke database
- [ ] Point user terupdate

---

**Dokumentasi:** v1.0 - Box 45x40cm
**Status:** ✅ Ready for prototyping
**Last Updated:** June 9, 2026
