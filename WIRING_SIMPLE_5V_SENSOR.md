# 🔌 Wiring Sederhana - Sensor 5V (Tanpa Power Terpisah!)

## ✅ **Opsi Paling Mudah: Sensor 5V atau 3.3V**

Jika Anda menggunakan sensor metal 5V atau 3.3V, **TIDAK PERLU** power supply terpisah!

---

## 🎯 **Pilihan Sensor**

### **Opsi 1: Sensor 5V (Recommended)**
```
Nama: Inductive Proximity Sensor 5V
Input: 5V DC
Output: 0-5V (digital)
Jarak: 4-8mm
Harga: Rp 25.000 - 40.000

✅ Tidak butuh power terpisah
⚠️ Butuh voltage divider sederhana
```

### **Opsi 2: Sensor 3.3V (Easiest)**
```
Nama: Capacitive Proximity Sensor 3.3V
Input: 3.3V DC
Output: 0-3.3V (digital)
Jarak: 2-5mm
Harga: Rp 20.000 - 35.000

✅ Tidak butuh power terpisah
✅ Tidak butuh voltage divider
✅ Paling mudah!
```

---

## ⚖️ **LOAD CELL (Sama seperti sebelumnya)**

```
Load Cell → HX711 → ESP32

Load Cell          HX711
─────────          ──────
Merah    ────────→ E+
Hitam    ────────→ E-
Putih    ────────→ A-
Hijau    ────────→ A+

HX711             ESP32
─────             ─────
VCC     ────────→ 3.3V
GND     ────────→ GND
DT      ────────→ GPIO 26
SCK     ────────→ GPIO 27
```

---

## 🔍 **METAL SENSOR 5V (Dengan Voltage Divider Sederhana)**

### **Wiring:**
```
USB 5V ──┬──→ ESP32 VIN
         │
         └──→ Sensor VCC (5V)

Sensor 5V         ESP32
─────────         ─────
VCC     ────────→ 5V (dari ESP32)
GND     ────────→ GND
OUT     ────────→ Voltage Divider → GPIO 25

Voltage Divider (5V → 3.3V):
Sensor OUT ──[2.2kΩ]──┬──→ GPIO 25
                      │
                   [3.3kΩ]
                      │
                     GND

Output: 5V × (3.3kΩ / 5.5kΩ) = 3V ✅
```

### **Diagram Visual:**
```
┌─────────────┐
│   ESP32     │
│             │
│  5V  ●──────┼──→ Sensor VCC
│  GND ●──────┼──→ Sensor GND
│  25  ●──────┼──→ Voltage Divider
│             │
└─────────────┘
       ↑
       │
┌──────┴──────┐
│  Voltage    │
│  Divider    │
│  2.2kΩ +    │
│  3.3kΩ      │
└──────┬──────┘
       ↑
       │
┌──────┴──────┐
│ Metal       │
│ Sensor 5V   │
│             │
│ VCC ●───────┼──→ ESP32 5V
│ GND ●───────┼──→ ESP32 GND
│ OUT ●───────┼──→ Divider
└─────────────┘
```

---

## 🔍 **METAL SENSOR 3.3V (Paling Mudah!)**

### **Wiring:**
```
USB 5V ──→ ESP32 VIN
         │
         └──→ ESP32 3.3V regulator
              │
              └──→ Sensor VCC (3.3V)

Sensor 3.3V       ESP32
───────────       ─────
VCC     ────────→ 3.3V
GND     ────────→ GND
OUT     ────────→ GPIO 25 (LANGSUNG!)

✅ TIDAK butuh voltage divider!
```

### **Diagram Visual:**
```
┌─────────────┐
│   ESP32     │
│             │
│  3.3V ●─────┼──→ Sensor VCC
│  GND  ●─────┼──→ Sensor GND
│  25   ●─────┼──→ Sensor OUT (LANGSUNG!)
│             │
└─────────────┘
       ↑
       │
┌──────┴──────┐
│ Metal       │
│ Sensor 3.3V │
│             │
│ VCC ●───────┼──→ ESP32 3.3V
│ GND ●───────┼──→ ESP32 GND
│ OUT ●───────┼──→ ESP32 GPIO 25
└─────────────┘
```

---

## 🎨 **Sistem Lengkap (Sensor 5V)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              SISTEM LENGKAP (5V)                │
│                                                 │
│  ┌──────────┐                                   │
│  │  ESP32   │                                   │
│  │          │                                   │
│  │ 3.3V ●───┼──→ HX711 VCC                      │
│  │ 5V   ●───┼──→ Metal Sensor VCC               │
│  │ GND  ●───┼──→ Common GND                     │
│  │ 26   ●───┼──→ HX711 DT                       │
│  │ 27   ●───┼──→ HX711 SCK                      │
│  │ 25   ●───┼──→ Voltage Divider                │
│  │          │                                   │
│  └──────────┘                                   │
│       ↑                                         │
│       │                                         │
│  ┌────┴─────┐         ┌──────────┐             │
│  │  HX711   │         │ Voltage  │             │
│  │          │         │ Divider  │             │
│  │ E+ ●─────┼──→ Load │ 2.2kΩ +  │             │
│  │ E- ●─────┼──→ Cell │ 3.3kΩ    │             │
│  │ A+ ●─────┼──→ 4    │          │             │
│  │ A- ●─────┼──→ Kabel│          │             │
│  │          │         │          │             │
│  └──────────┘         └────┬─────┘             │
│                            │                   │
│                       ┌────┴──────┐            │
│                       │  Metal    │            │
│                       │  Sensor   │            │
│                       │  5V       │            │
│                       │           │            │
│                       │ VCC ●─────┼──→ ESP32 5V│
│                       │ GND ●─────┼──→ GND     │
│                       │ OUT ●─────┼──→ Divider │
│                       │           │            │
│                       └───────────┘            │
│                                                 │
│  Power: USB 5V (CUKUP!)                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎨 **Sistem Lengkap (Sensor 3.3V)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            SISTEM LENGKAP (3.3V)                │
│                                                 │
│  ┌──────────┐                                   │
│  │  ESP32   │                                   │
│  │          │                                   │
│  │ 3.3V ●───┼──→ HX711 VCC                      │
│  │ 3.3V ●───┼──→ Metal Sensor VCC               │
│  │ GND  ●───┼──→ Common GND                     │
│  │ 26   ●───┼──→ HX711 DT                       │
│  │ 27   ●───┼──→ HX711 SCK                      │
│  │ 25   ●───┼──→ Metal Sensor OUT (LANGSUNG!)   │
│  │          │                                   │
│  └──────────┘                                   │
│       ↑                                         │
│       │                                         │
│  ┌────┴─────┐         ┌──────────┐             │
│  │  HX711   │         │  Metal   │             │
│  │          │         │  Sensor  │             │
│  │ E+ ●─────┼──→ Load │  3.3V    │             │
│  │ E- ●─────┼──→ Cell │          │             │
│  │ A+ ●─────┼──→ 4    │ VCC ●────┼──→ 3.3V     │
│  │ A- ●─────┼──→ Kabel│ GND ●────┼──→ GND      │
│  │          │         │ OUT ●────┼──→ GPIO 25  │
│  └──────────┘         └──────────┘             │
│                                                 │
│  Power: USB 5V (CUKUP!)                        │
│  ✅ Tidak butuh voltage divider!               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📝 **Checklist Wiring (Sensor 5V)**

### **Load Cell:**
- [ ] Kabel Merah Load Cell → HX711 E+
- [ ] Kabel Hitam Load Cell → HX711 E-
- [ ] Kabel Putih Load Cell → HX711 A-
- [ ] Kabel Hijau Load Cell → HX711 A+
- [ ] HX711 VCC → ESP32 3.3V
- [ ] HX711 GND → ESP32 GND
- [ ] HX711 DT → ESP32 GPIO 26
- [ ] HX711 SCK → ESP32 GPIO 27

### **Metal Sensor 5V:**
- [ ] Sensor VCC → ESP32 5V
- [ ] Sensor GND → ESP32 GND (common ground)
- [ ] Sensor OUT → Resistor 2.2kΩ
- [ ] Resistor 2.2kΩ → Junction → ESP32 GPIO 25
- [ ] Junction → Resistor 3.3kΩ → GND

### **Power:**
- [ ] ESP32 powered via USB 5V
- [ ] Semua GND terhubung (common ground)

---

## 📝 **Checklist Wiring (Sensor 3.3V)**

### **Load Cell:**
- [ ] Kabel Merah Load Cell → HX711 E+
- [ ] Kabel Hitam Load Cell → HX711 E-
- [ ] Kabel Putih Load Cell → HX711 A-
- [ ] Kabel Hijau Load Cell → HX711 A+
- [ ] HX711 VCC → ESP32 3.3V
- [ ] HX711 GND → ESP32 GND
- [ ] HX711 DT → ESP32 GPIO 26
- [ ] HX711 SCK → ESP32 GPIO 27

### **Metal Sensor 3.3V:**
- [ ] Sensor VCC → ESP32 3.3V
- [ ] Sensor GND → ESP32 GND (common ground)
- [ ] Sensor OUT → ESP32 GPIO 25 (LANGSUNG!)

### **Power:**
- [ ] ESP32 powered via USB 5V
- [ ] Semua GND terhubung (common ground)

---

## 💰 **Estimasi Biaya**

### **Sensor 5V:**
```
Load Cell 1kg:         Rp 15.000
HX711 Module:          Rp 10.000
Metal Sensor 5V:       Rp 30.000
Resistor 2.2kΩ + 3.3kΩ: Rp 1.000
Breadboard:            Rp 15.000
Kabel jumper:          Rp 10.000
─────────────────────────────────
TOTAL:                 Rp 81.000
```

### **Sensor 3.3V:**
```
Load Cell 1kg:         Rp 15.000
HX711 Module:          Rp 10.000
Metal Sensor 3.3V:     Rp 25.000
Breadboard:            Rp 15.000
Kabel jumper:          Rp 10.000
─────────────────────────────────
TOTAL:                 Rp 75.000 ✅
```

**Hemat Rp 11.000 dibanding pakai sensor 12V + power supply!**

---

## 🎯 **Kesimpulan**

### **Rekomendasi:**
1. **Beli sensor 5V atau 3.3V** (lebih mudah, lebih murah)
2. **Tidak perlu power supply terpisah** (cukup USB 5V)
3. **Sensor 3.3V paling mudah** (tidak butuh voltage divider)

### **Keuntungan:**
- ✅ Lebih murah (hemat Rp 50.000 untuk power supply)
- ✅ Lebih sederhana (wiring lebih sedikit)
- ✅ Lebih aman (voltase rendah)
- ✅ Lebih portable (cukup USB power)

---

## 🛒 **Link Pembelian**

### **Tokopedia/Shopee:**
- Cari: "Proximity Sensor 5V NPN"
- Cari: "Capacitive Touch Sensor 3.3V"
- Cari: "Inductive Sensor 5V Arduino"

### **Rekomendasi:**
- **Sensor 5V**: LJ12A3-4-Z/BY (5V version)
- **Sensor 3.3V**: TTP223 Capacitive Touch

---

**✅ Gunakan sensor 5V atau 3.3V untuk kemudahan dan penghematan!**
