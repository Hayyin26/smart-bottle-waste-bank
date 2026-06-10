# 📸 Visualisasi Penempatan Komponen IoT Bank Sampah

## 🎯 Quick Reference

**Box:** 45cm (T) x 40cm (L) x 40cm (D)  
**3 Zona:** Control Panel → Measurement Chamber → Collection Box

---

## 🎨 VIEW 1: Tampak Depan User

```
        SMART BOTTLE WASTE BANK
        IoT Collection System
    ╔════════════════════════════════╗
    ║                                ║
    ║  ┌────────────────────────┐    ║  ← 5cm dari atas
    ║  │ SCAN QR TO LOGIN       │    ║
    ║  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │    ║  ← LCD 16x2
    ║  │ Point: 150  User: Budi │    ║     Display
    ║  └────────────────────────┘    ║
    ║                                ║
    ║   ┌──────────────────────┐     ║
    ║   │ CARA PENGGUNAAN:     │     ║
    ║   │ 1. Scan QR Login     │     ║
    ║   │ 2. Masukkan Botol    │     ║  ← 15cm dari atas
    ║   │ 3. Ambil Point       │     ║     Instruksi
    ║   └──────────────────────┘     ║
    ║                                ║
    ║      [Scan QR di sini]         ║  ← 25cm dari atas
    ║          [QR CODE]             ║     Sticker QR
    ║                                ║
    ║   ╔══════════════════════╗     ║
    ║   ║   INSERT BOTTLE      ║     ║  ← 32cm dari atas
    ║   ║      ▼  ▼  ▼         ║     ║     Slot masuk
    ║   ║   (Horizontal/Tidur) ║     ║     20x8cm
    ║   ╚══════════════════════╝     ║
    ║                                ║
    ║                                ║
    ║         [⚡ POWERED ON]        ║  ← LED indicator
    ╚════════════════════════════════╝
```

---

## 🔧 VIEW 2: Potongan Samping (Internal View)

```
    ╔════════════════════════════════╗  ← 0cm (TOP)
    ║ ZONA 1: CONTROL PANEL          ║
    ║ ┌────┐ ┌─────┐ ┌────┐         ║
    ║ │PWR │ │ESP32│ │BUZ │         ║  ← 3cm: Power, ESP32, Buzzer
    ║ └────┘ └─────┘ └────┘         ║     mounted di panel belakang
    ╠════════════════════════════════╣  ← 10cm
    ║ ZONA 2: MEASUREMENT CHAMBER    ║
    ║                                ║
    ║    ▓▓ ← Ultrasonic HEIGHT      ║  ← 12cm: Sensor atas
    ║    ││    (di atas)             ║     mounted di bracket
    ║    ↓↓ 10cm clearance           ║
    ║    ↓↓                          ║
    ║  ══╪╪═══════════════════       ║  ← 22cm: Platform
    ║  [💧Platform + Bottle 💧]      ║     25x20cm dengan
    ║  ══════════════════════════    ║     Load Cell di bawah
    ║        ↑                       ║
    ║    Load Cell (bawah platform)  ║
    ║                                ║
▓▓  ║  [M] ← Metal Sensor            ║  ← 23cm: Metal sensor
║   ║  [💡] ← IR Lamp                ║  ← 15cm: IR Lamp
U   ║                                ║
L   ║                                ║
T   ╠════════════════════════════════╣  ← 30cm
R   ║ ZONA 3: COLLECTION AREA        ║
A   ║                                ║
S   ║    ┌─── Servo Motor            ║  ← 31cm: Servo
O   ║    │                           ║     mounted di bracket
N   ║    └──┐                        ║
I   ║   GATE│ ← Pintu (tutup)        ║  ← 33cm: Gate
C   ║  ─────┴────────────────        ║     (akrilik + servo horn)
    ║                                ║
L   ║  ┌──────────────────────┐     ║  ← 35cm: Box
E   ║  │                      │     ║     penampung
N   ║  │   Collection Box     │     ║     (removable)
G   ║  │   💧 💧 💧 💧        │     ║
T   ║  │   💧 💧 💧 💧        │     ║
H   ║  │                      │     ║
    ║  └──────────────────────┘     ║
    ╚════════════════════════════════╝  ← 45cm (BOTTOM)
```

---

## 📐 VIEW 3: Tampak Atas (Top View - Internal)

```
         ← 40cm lebar →
    ╔════════════════════════════╗  ↑
    ║ [PWR]  [ESP32]    [BUZ]    ║  │
    ║  🔌      📡         🔊     ║  │
    ║ (belakang - control panel) ║  │
    ╠════════════════════════════╣  │
    ║                            ║  │
    ║         ▓▓  ← Ultrasonic   ║  │
    ║         ││    HEIGHT        ║  │ 40cm
    ║         ││   (tengah atas) ║  │ kedalaman
    ║                            ║  │
    ║    ┌──────────────────┐    ║  │
    ║    │                  │    ║  │
 ▓▓ ║    │    PLATFORM      │    ║  │
 ││ ║    │   (pengukuran)   │    ║  │
 ││ ║    │                  │    ║  │
 U  ║    │   [Bottle 💧]    │    ║  │
 L  ║    │    di sini       │    ║  │
 T  ║    │                  │    ║  │
 R  ║    └──────────────────┘    ║  │
 A  ║         ↑ Load Cell        ║  │
 S  ║           (bawah)          ║  │
 O  ║                            ║  │
 N  ║    [M] ← Metal Sensor      ║  │
 I  ║    [💡] ← IR Lamp          ║  │
 C  ║                            ║  │
    ║         [Servo]            ║  │
 L  ║           │                ║  │
 E  ║         [GATE]             ║  │
 N  ║      (pintu tutup)         ║  │
 G  ║                            ║  │
 T  ║   ┌──────────────────┐     ║  │
 H  ║   │  Box Penampung   │     ║  │
    ║   │   💧💧💧💧💧    │     ║  │
(→) ║   │   💧💧💧💧💧    │     ║  │
    ║   └──────────────────┘     ║  │
    ╚════════════════════════════╝  ↓
```

---

## 🎯 VIEW 4: Flow Pengukuran Botol

```
     USER MEMASUKKAN BOTOL
              ↓
    ╔═══════════════════════╗
    ║   SLOT MASUK BOTOL    ║  ← Horizontal/Tidur
    ║      ▼  ▼  ▼          ║
    ╚═══════════════════════╝
              ↓
    ┌─────────────────────────┐
    │                         │
    │    ▓▓ ← HEIGHT sensor   │  ← Ukur DIAMETER
    │    ││   mengukur        │
    │    ↓↓   diameter        │
    │    ↓↓                   │
    │  ══════════════════     │
    │  [  🍾 Botol Tidur  ]   │  ← POSISI PENGUKURAN
    │  ══════════════════     │     - Panjang: LENGTH sensor
 ▓▓ │      ↑ Load Cell        │     - Diameter: HEIGHT sensor
 ││ │    (berat)              │     - Berat: Load Cell
 ↓↓ │                         │     - Material: Metal sensor
    │  [M] Metal Sensor       │
    └─────────────────────────┘
              ↓
       KLASIFIKASI SIZE
              ↓
    ┌─────────────────────────┐
    │ KECIL:   5-11cm x 8-13cm│ → 5 point
    │ SEDANG: 12-16cm x 15-20cm│ → 10 point
    │ BESAR:  18-22cm x 21-30cm│ → 15 point
    └─────────────────────────┘
              ↓
         ACCEPT/REJECT
              ↓
    ╔═══════════════════════╗
    ║   SERVO BUKA GATE     ║  ← 90° open
    ╚═══════════════════════╝
              ↓
         Botol jatuh ke
       Collection Box
              ↓
    ╔═══════════════════════╗
    ║  SERVO TUTUP GATE     ║  ← 0° close
    ╚═══════════════════════╝
              ↓
    Data → Supabase → Web App
```

---

## 🔌 VIEW 5: Wiring Schematic (Simplified)

```
┌─────────────────────────────────────────────┐
│        220V AC INPUT                        │
│             ↓                               │
│    ┌────────────────┐                       │
│    │ Power Supply   │                       │
│    │   12V 3A       │                       │
│    └────────┬───────┘                       │
│             ├──→ 12V to IR Lamp (+ MOSFET)  │
│             │                               │
│    ┌────────▼───────┐                       │
│    │ Buck Converter │                       │
│    │   12V → 5V 3A  │                       │
│    └────────┬───────┘                       │
│             ↓ 5V                            │
│    ┌─────────────────────────────┐          │
│    │      ESP32 (VIN/GND)        │          │
│    │                             │          │
│    │  GPIO Connections:          │          │
│    │  ├─ 4  → TRIG (HEIGHT)      │          │
│    │  ├─ 18 → ECHO (HEIGHT)      │          │
│    │  ├─ 5  → TRIG (LENGTH)      │          │
│    │  ├─ 12 → ECHO (LENGTH)      │          │
│    │  ├─ 19 → SERVO (PWM)        │          │
│    │  ├─ 23 → BUZZER             │          │
│    │  ├─ 13 → IR LAMP (MOSFET)   │          │
│    │  ├─ 25 → METAL SENSOR       │          │
│    │  ├─ 26 → LOAD CELL (DOUT)   │          │
│    │  ├─ 27 → LOAD CELL (SCK)    │          │
│    │  ├─ 21 → LCD (SDA)          │          │
│    │  └─ 22 → LCD (SCL)          │          │
│    │                             │          │
│    │  Common GND ───────────────┐│          │
│    └────────────────────────────┼┘          │
│                                 │           │
│    All sensors/actuators share  │           │
│    common ground (GND) ─────────┘           │
└─────────────────────────────────────────────┘

⚠️ IMPORTANT:
- Servo perlu kapasitor 1000µF untuk stabilisasi
- IR Lamp gunakan MOSFET (bukan langsung dari GPIO)
- Load Cell butuh HX711 module sebagai ADC
```

---

## 📋 Quick Assembly Checklist

### **Fase 1: Struktur (1-2 jam)**
- [ ] Potong material sesuai ukuran
- [ ] Rakit kotak dengan bracket L
- [ ] Buat lubang LCD, slot masuk, ventilasi
- [ ] Cat/finishing (opsional)

### **Fase 2: Mounting Elektronik (2-3 jam)**
- [ ] Pasang power supply + buck converter (belakang atas)
- [ ] Mount ESP32 di PCB box
- [ ] Install LCD di panel depan
- [ ] Pasang ultrasonic HEIGHT (atas, bracket adjustable)
- [ ] Pasang ultrasonic LENGTH (samping kiri)
- [ ] Install platform + load cell (tengah)
- [ ] Mount metal sensor (samping kanan)
- [ ] Install servo motor (atas box penampung)
- [ ] Pasang IR lamp (atas chamber)
- [ ] Install buzzer (belakang)

### **Fase 3: Wiring (2-3 jam)**
- [ ] Sambungkan semua power (5V/GND common)
- [ ] Wiring ultrasonic sensors → ESP32
- [ ] Wiring load cell + HX711 → ESP32
- [ ] Wiring servo motor → ESP32 (+ kapasitor!)
- [ ] Wiring LCD I2C → ESP32
- [ ] Wiring metal sensor → ESP32
- [ ] Wiring IR lamp + MOSFET → ESP32
- [ ] Wiring buzzer → ESP32
- [ ] Cable management dengan ties
- [ ] Test koneksi dengan multimeter

### **Fase 4: Software Upload (30 menit)**
- [ ] Upload kode ESP32 (`main.cpp`)
- [ ] Test WiFi connection
- [ ] Check Serial Monitor output
- [ ] Verify IP registration ke database

### **Fase 5: Kalibrasi (1 jam)**
- [ ] Kalibrasi load cell (run `calibrate_loadcell.cpp`)
- [ ] Test ultrasonic readings (command `TEST`)
- [ ] Adjust servo angles (buka/tutup gate)
- [ ] Test LCD address (0x27 atau 0x3F)
- [ ] Kalibrasi metal sensor threshold

### **Fase 6: Testing (1 jam)**
- [ ] Test QR login flow
- [ ] Test pengukuran botol (small/medium/large)
- [ ] Test klasifikasi dan point calculation
- [ ] Test servo gate operation
- [ ] Test data transmission ke Supabase
- [ ] Verify point update di web app

---

## 💡 Pro Tips

### **Penempatan Sensor**
1. **Ultrasonic HEIGHT:** Jarak ideal 10cm dari platform (terlalu dekat = error, terlalu jauh = tidak akurat)
2. **Ultrasonic LENGTH:** Jarak 10cm dari sisi botol, mounted di bracket adjustable
3. **Load Cell:** Pastikan platform stabil dan tidak goyang
4. **Metal Sensor:** Jarak 2-3cm dari botol untuk deteksi optimal

### **Power Management**
- Gunakan kapasitor 1000µF untuk servo (cegah brownout ESP32)
- Pisahkan power supply untuk motor/actuator jika perlu
- Test konsumsi daya dengan multimeter

### **Mechanical**
- Gate servo harus smooth (tidak macet)
- Platform load cell harus rata (tidak miring)
- Box penampung mudah dilepas untuk kosongkan botol

### **Software**
- Set WiFi credentials sebelum upload
- Enable serial debug untuk troubleshooting
- Backup kode sebelum modifikasi

---

**Dokumentasi Visual v1.0**  
**Box Size:** 45cm x 40cm x 40cm  
**Status:** ✅ Ready for prototyping  
**Last Updated:** June 9, 2026
