# 🔌 Panduan Wiring Detail - Metal Sensor & Load Cell

## 📋 **Daftar Komponen yang Dibutuhkan**

### **1. Load Cell + HX711**
- Load Cell 1kg atau 5kg (4 kabel: Red, Black, White, Green)
- Module HX711 (amplifier untuk load cell)
- Kabel jumper female-to-female

### **2. Metal Proximity Sensor**
- Sensor LJ12A3-4-Z/BX (atau sejenis)
- Power supply 12V DC (untuk sensor)
- Resistor 10kΩ dan 4.7kΩ (untuk voltage divider)
- Kabel jumper

---

## ⚖️ **LOAD CELL + HX711 - Wiring Lengkap**

### **Step 1: Hubungkan Load Cell ke HX711**

```
Load Cell (4 kabel)          HX711 Module
┌─────────────────┐         ┌──────────────┐
│                 │         │              │
│  Red (E+)       ├─────────┤ E+           │
│  Black (E-)     ├─────────┤ E-           │
│  White (A-)     ├─────────┤ A-           │
│  Green (A+)     ├─────────┤ A+           │
│                 │         │              │
└─────────────────┘         └──────────────┘

Keterangan:
- E+ = Excitation+ (Power untuk load cell)
- E- = Excitation- (Ground untuk load cell)
- A+ = Signal+ (Output positif)
- A- = Signal- (Output negatif)
```

### **Step 2: Hubungkan HX711 ke ESP32**

```
HX711 Module                ESP32
┌──────────────┐           ┌─────────┐
│              │           │         │
│  VCC         ├───────────┤ 3.3V    │ ← PENTING: 3.3V, BUKAN 5V!
│  GND         ├───────────┤ GND     │
│  DT (DOUT)   ├───────────┤ GPIO 26 │
│  SCK         ├───────────┤ GPIO 27 │
│              │           │         │
└──────────────┘           └─────────┘

Keterangan:
- VCC: Power untuk HX711 (3.3V)
- GND: Ground
- DT (DOUT): Data output ke ESP32
- SCK: Clock signal dari ESP32
```

### **Wiring Lengkap Load Cell:**

```
                    ┌─────────────┐
                    │   ESP32     │
                    │             │
                    │  3.3V ●─────┼──→ HX711 VCC
                    │  GND  ●─────┼──→ HX711 GND
                    │  26   ●─────┼──→ HX711 DT
                    │  27   ●─────┼──→ HX711 SCK
                    │             │
                    └─────────────┘
                           ↑
                           │
                    ┌──────┴──────┐
                    │   HX711     │
                    │             │
                    │  E+ ●───────┼──→ Load Cell Red
                    │  E- ●───────┼──→ Load Cell Black
                    │  A+ ●───────┼──→ Load Cell Green
                    │  A- ●───────┼──→ Load Cell White
                    │             │
                    └─────────────┘
```

---

## 🔍 **METAL PROXIMITY SENSOR - Wiring Lengkap**

### **⚠️ PENTING: Sensor Butuh 12V dan Voltage Divider!**

Metal proximity sensor (LJ12A3) membutuhkan:
- **Input**: 12V DC
- **Output**: 12V (saat tidak detect) / 0V (saat detect)
- **Problem**: ESP32 hanya tahan 3.3V maksimal!
- **Solusi**: Gunakan **Voltage Divider**

---

### **Step 1: Hubungkan Sensor ke Power Supply 12V**

```
Power Supply 12V DC         Metal Sensor
┌──────────────┐           ┌──────────────┐
│              │           │              │
│  +12V        ├───────────┤ Brown (VCC)  │
│  GND         ├───────────┤ Blue (GND)   │
│              │           │              │
└──────────────┘           │ Black (OUT)  │ ← Signal output
                           │              │
                           └──────────────┘
```

### **Step 2: Buat Voltage Divider (12V → 3.3V)**

```
Metal Sensor Black (12V output)
         │
         ├────── R1 (10kΩ) ──────┬────→ ESP32 GPIO 25
         │                        │
        GND                   R2 (4.7kΩ)
                                  │
                                 GND

Formula:
Vout = Vin × (R2 / (R1 + R2))
Vout = 12V × (4.7kΩ / (10kΩ + 4.7kΩ))
Vout = 12V × 0.32
Vout = 3.84V ✅ (Safe untuk ESP32)
```

### **Step 3: Wiring Lengkap dengan Breadboard**

```
Power Supply 12V
    │
    ├──→ Metal Sensor Brown (VCC)
    │
   GND ──→ Metal Sensor Blue (GND)
            │
            └──→ ESP32 GND (common ground!)

Metal Sensor Black (Signal)
    │
    ├──── 10kΩ ────┬──→ ESP32 GPIO 25
    │              │
   GND          4.7kΩ
                   │
                  GND
```

### **Diagram Visual:**

```
                    ┌─────────────┐
                    │   ESP32     │
                    │             │
                    │  25   ●─────┼──→ Voltage Divider Output
                    │  GND  ●─────┼──→ Common GND
                    │             │
                    └─────────────┘
                           ↑
                           │
                    ┌──────┴──────┐
                    │  Voltage    │
                    │  Divider    │
                    │  10kΩ+4.7kΩ │
                    └──────┬──────┘
                           ↑
                           │
                    ┌──────┴──────┐
                    │Metal Sensor │
                    │             │
                    │ Brown ●─────┼──→ 12V+
                    │ Blue  ●─────┼──→ GND
                    │ Black ●─────┼──→ Signal (12V)
                    │             │
                    └─────────────┘
                           ↑
                           │
                    ┌──────┴──────┐
                    │ 12V Power   │
                    │ Supply      │
                    └─────────────┘
```

---

## 🔧 **Wiring di Breadboard (Praktis)**

### **Layout Breadboard:**

```
                    ESP32
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    │  GPIO 26 ───────┼──→ HX711 DT    │
    │  GPIO 27 ───────┼──→ HX711 SCK   │
    │  3.3V ──────────┼──→ HX711 VCC   │
    │                 │                 │
    │  GPIO 25 ───────┼──→ Voltage Div │
    │                 │                 │
    │  GND ───────────┼──→ Common GND  │
    │                 │                 │
    └─────────────────┴─────────────────┘

Breadboard:
Row 1: ESP32 3.3V → HX711 VCC
Row 2: ESP32 GPIO 26 → HX711 DT
Row 3: ESP32 GPIO 27 → HX711 SCK
Row 4: HX711 E+, E-, A+, A- → Load Cell
Row 5: Metal Sensor Brown → 12V+
Row 6: Metal Sensor Blue → GND
Row 7: Metal Sensor Black → 10kΩ → GPIO 25
Row 8: 10kΩ & 4.7kΩ junction → GPIO 25
Row 9: 4.7kΩ → GND
Row 10: Common GND (ESP32, HX711, Metal Sensor, 12V Supply)
```

---

## 📸 **Foto Referensi Wiring**

### **Load Cell Wiring:**
```
Load Cell → HX711 → ESP32

[Load Cell]
  Red ──────→ [HX711 E+]
  Black ────→ [HX711 E-]
  White ────→ [HX711 A-]
  Green ────→ [HX711 A+]

[HX711]
  VCC ──────→ [ESP32 3.3V]
  GND ──────→ [ESP32 GND]
  DT ───────→ [ESP32 GPIO 26]
  SCK ──────→ [ESP32 GPIO 27]
```

### **Metal Sensor Wiring:**
```
12V Supply → Metal Sensor → Voltage Divider → ESP32

[12V Supply]
  +12V ─────→ [Sensor Brown]
  GND ──────→ [Sensor Blue] ──→ [ESP32 GND]

[Sensor Black] ──→ [10kΩ] ──┬──→ [ESP32 GPIO 25]
                             │
                          [4.7kΩ]
                             │
                           [GND]
```

---

## 🛠️ **Cara Merakit di Breadboard**

### **Step-by-Step:**

1. **Pasang ESP32 di breadboard**
   - Letakkan di tengah breadboard
   - Pastikan pin tidak bengkok

2. **Pasang HX711 Module**
   - Letakkan di samping ESP32
   - Hubungkan dengan kabel jumper:
     - HX711 VCC → ESP32 3.3V
     - HX711 GND → ESP32 GND
     - HX711 DT → ESP32 GPIO 26
     - HX711 SCK → ESP32 GPIO 27

3. **Hubungkan Load Cell ke HX711**
   - Red → E+
   - Black → E-
   - White → A-
   - Green → A+

4. **Pasang Resistor untuk Voltage Divider**
   - Resistor 10kΩ: Satu kaki ke breadboard row A, kaki lain ke row B
   - Resistor 4.7kΩ: Satu kaki ke row B, kaki lain ke GND rail

5. **Hubungkan Metal Sensor**
   - Brown → 12V+ (dari power supply terpisah)
   - Blue → GND rail (common dengan ESP32)
   - Black → Row A (ujung resistor 10kΩ)

6. **Hubungkan ke ESP32**
   - Row B (junction resistor) → ESP32 GPIO 25

7. **Cek Koneksi**
   - Gunakan multimeter untuk cek continuity
   - Pastikan tidak ada short circuit

---

## ⚡ **Power Supply**

### **Opsi 1: Dual Power Supply (Recommended)**

```
USB 5V (untuk ESP32)
    │
    └──→ ESP32 VIN
         │
         └──→ ESP32 3.3V regulator
              │
              └──→ HX711 VCC

12V DC Adapter (untuk Metal Sensor)
    │
    ├──→ Metal Sensor Brown
    │
    └──→ GND (common dengan ESP32)
```

### **Opsi 2: Single 12V Supply + Buck Converter**

```
12V DC Adapter
    │
    ├──→ Metal Sensor Brown
    │
    └──→ Buck Converter (12V → 5V)
         │
         └──→ ESP32 VIN
              │
              └──→ ESP32 3.3V regulator
                   │
                   └──→ HX711 VCC
```

---

## 🧪 **Testing Koneksi**

### **Test 1: Cek Voltase dengan Multimeter**

```
1. Cek HX711 VCC:
   Multimeter: 3.3V ✅

2. Cek Metal Sensor VCC:
   Multimeter: 12V ✅

3. Cek Voltage Divider Output:
   Multimeter: 3.5-4V ✅ (saat sensor tidak detect)
   Multimeter: 0V ✅ (saat sensor detect metal)

4. Cek Common Ground:
   Continuity test antara ESP32 GND, HX711 GND, Metal Sensor GND ✅
```

### **Test 2: Test dengan Serial Monitor**

```cpp
void setup() {
  Serial.begin(115200);
  pinMode(25, INPUT_PULLUP);
  scale.begin(26, 27);
}

void loop() {
  // Test metal sensor
  Serial.print("Metal: ");
  Serial.println(digitalRead(25));
  
  // Test load cell
  Serial.print("Weight: ");
  Serial.println(scale.get_units(5));
  
  delay(500);
}
```

---

## 📊 **Tabel Pin Summary**

| Komponen | Pin Komponen | Pin ESP32 | Voltase | Keterangan |
|----------|--------------|-----------|---------|------------|
| HX711 VCC | VCC | 3.3V | 3.3V | Power HX711 |
| HX711 GND | GND | GND | 0V | Ground |
| HX711 DT | DT | GPIO 26 | 3.3V | Data |
| HX711 SCK | SCK | GPIO 27 | 3.3V | Clock |
| Load Cell Red | Red | HX711 E+ | - | Excitation+ |
| Load Cell Black | Black | HX711 E- | - | Excitation- |
| Load Cell White | White | HX711 A- | - | Signal- |
| Load Cell Green | Green | HX711 A+ | - | Signal+ |
| Metal Sensor Brown | Brown | 12V+ | 12V | Power sensor |
| Metal Sensor Blue | Blue | GND | 0V | Ground |
| Metal Sensor Black | Black | GPIO 25 | 3.3V | Signal (via divider) |

---

## ⚠️ **Kesalahan Umum & Solusi**

### **❌ Kesalahan 1: HX711 VCC ke 5V**
**Solusi**: Hubungkan ke 3.3V, bukan 5V!

### **❌ Kesalahan 2: Metal Sensor langsung ke GPIO 25**
**Solusi**: WAJIB pakai voltage divider! 12V akan merusak ESP32!

### **❌ Kesalahan 3: Tidak ada common ground**
**Solusi**: Semua GND harus terhubung (ESP32, HX711, Metal Sensor, Power Supply)

### **❌ Kesalahan 4: Load Cell kabel terbalik**
**Solusi**: Ikuti warna kabel: Red=E+, Black=E-, White=A-, Green=A+

### **❌ Kesalahan 5: Resistor salah nilai**
**Solusi**: Gunakan 10kΩ dan 4.7kΩ, bukan nilai lain!

---

## 🎯 **Checklist Wiring**

- [ ] HX711 VCC ke ESP32 3.3V (BUKAN 5V!)
- [ ] HX711 GND ke ESP32 GND
- [ ] HX711 DT ke ESP32 GPIO 26
- [ ] HX711 SCK ke ESP32 GPIO 27
- [ ] Load Cell Red ke HX711 E+
- [ ] Load Cell Black ke HX711 E-
- [ ] Load Cell White ke HX711 A-
- [ ] Load Cell Green ke HX711 A+
- [ ] Metal Sensor Brown ke 12V+
- [ ] Metal Sensor Blue ke GND (common)
- [ ] Metal Sensor Black ke Voltage Divider
- [ ] Voltage Divider output ke GPIO 25
- [ ] Semua GND terhubung (common ground)
- [ ] Test dengan multimeter
- [ ] Test dengan Serial Monitor

---

## 📞 **Support**

Jika masih bingung:
1. Lihat foto referensi di Google: "HX711 ESP32 wiring"
2. Lihat foto referensi: "LJ12A3 voltage divider"
3. Gunakan multimeter untuk cek koneksi
4. Test satu sensor dulu (HX711 atau Metal Sensor)

---

**✅ Selamat merakit! Pastikan semua koneksi benar sebelum power on!**
