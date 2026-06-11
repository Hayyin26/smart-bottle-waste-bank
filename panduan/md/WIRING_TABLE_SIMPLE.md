# 📌 Tabel Wiring IoT - COPY PASTE INI!

## 🎯 **Quick Reference Table**

| No | Komponen | Pin Komponen | Pin ESP32 | Voltase | Catatan |
|----|----------|--------------|-----------|---------|---------|
| 1 | **Sensor HEIGHT** | VCC | VIN (5V) | 5V | Ultrasonik #1 |
| 1 | **Sensor HEIGHT** | GND | GND | - | - |
| 1 | **Sensor HEIGHT** | TRIG | **GPIO 4** | - | Langsung, aman! |
| 1 | **Sensor HEIGHT** | ECHO | **GPIO 18** | - | ⚠️ **PAKAI VOLTAGE DIVIDER!** |
| | | | | | |
| 2 | **Sensor LENGTH** | VCC | VIN (5V) | 5V | Ultrasonik #2 |
| 2 | **Sensor LENGTH** | GND | GND | - | - |
| 2 | **Sensor LENGTH** | TRIG | **GPIO 5** | - | Langsung, aman! |
| 2 | **Sensor LENGTH** | ECHO | **GPIO 12** | - | ⚠️ **PAKAI VOLTAGE DIVIDER!** |
| | | | | | |
| 3 | **Servo Motor** | Signal (kuning) | **GPIO 19** | - | Signal wire |
| 3 | **Servo Motor** | VCC (merah) | **External 5V PSU** | 5V | ⚠️ **WAJIB EXTERNAL!** |
| 3 | **Servo Motor** | GND (coklat) | **GND + PSU GND** | - | Common ground! |
| | | | | | |
| 4 | **Buzzer** | (+) atau VCC | **GPIO 23** | - | Aktif 5V |
| 4 | **Buzzer** | (-) atau GND | GND | - | - |
| | | | | | |
| 5 | **LCD I2C** | VCC | VIN (5V) | 5V | Module I2C |
| 5 | **LCD I2C** | GND | GND | - | - |
| 5 | **LCD I2C** | SDA | **GPIO 21** | - | Default I2C |
| 5 | **LCD I2C** | SCL | **GPIO 22** | - | Default I2C |
| | | | | | |
| 6 | **Metal Sensor** | VCC (coklat) | **3V3** | 3.3V | Jika sensor 3.3V |
| 6 | **Metal Sensor** | GND (biru) | GND | - | - |
| 6 | **Metal Sensor** | Signal (hitam) | **GPIO 25** | - | INPUT_PULLUP mode |
| | | | | | |
| 7 | **IR LED** (opsional) | Anode (+) | **GPIO 13** | - | Pakai resistor 220Ω |
| 7 | **IR LED** | Cathode (-) | GND | - | - |

---

## ⚡ **Voltage Divider Circuit (WAJIB untuk ECHO pin!)**

```
Untuk GPIO 18 (Sensor HEIGHT ECHO):
====================================

     Pin ECHO HC-SR04 (5V output)
                │
            [Resistor 1kΩ]
                │
                ├───────────→ GPIO 18 ESP32
                │
            [Resistor 2kΩ]
                │
               GND


Untuk GPIO 12 (Sensor LENGTH ECHO):
====================================

     Pin ECHO HC-SR04 (5V output)
                │
            [Resistor 1kΩ]
                │
                ├───────────→ GPIO 12 ESP32
                │
            [Resistor 2kΩ]
                │
               GND
```

**Formula:**
- Input: 5V (dari ECHO pin)
- Output: 5V × (2kΩ / 3kΩ) = **3.33V** ✅ Aman untuk ESP32!

---

## 🔌 **Power Connection Summary**

### **5V Source (VIN ESP32):**
```
VIN ESP32 (dari USB 5V)
    │
    ├──→ Sensor HEIGHT VCC
    ├──→ Sensor LENGTH VCC
    ├──→ LCD I2C VCC
    ├──→ (IR LED via resistor)
    │
```

### **3.3V Source (3V3 ESP32):**
```
3V3 ESP32
    │
    └──→ Metal Sensor VCC (jika sensor 3.3V)
```

### **External PSU 5V 2A:**
```
External PSU 5V 2A
    (+) ──→ Servo VCC (merah)
    (-) ──→ Servo GND (coklat) + GND ESP32 (WAJIB COMMON!)
```

### **GND (Common Ground):**
```
GND ESP32
    │
    ├──→ Sensor HEIGHT GND
    ├──→ Sensor LENGTH GND
    ├──→ LCD I2C GND
    ├──→ Buzzer GND
    ├──→ Metal Sensor GND
    ├──→ IR LED GND
    ├──→ Servo GND
    └──→ External PSU GND ⚠️ (WAJIB!)
```

---

## 📋 **Shopping List - Copy Paste Ini!**

**Komponen Utama:**
- [ ] 1x ESP32 DevKit v1 (30 pin)
- [ ] 2x HC-SR04 Ultrasonik 5V
- [ ] 1x SG90 Servo Motor 5V
- [ ] 1x Buzzer Aktif 5V
- [ ] 1x LCD I2C 16x2 (5V)
- [ ] 1x Sensor Metal Proximity NPN/PNP 3-wire
- [ ] 1x LED IR 5mm (opsional)

**Power & Accessories:**
- [ ] 1x Power Supply 5V 3A (untuk servo)
- [ ] 1x Breadboard 830 lubang
- [ ] 1x Kabel USB Micro (untuk ESP32)

**Resistor:**
- [ ] 4x Resistor 1kΩ (untuk voltage divider)
- [ ] 4x Resistor 2kΩ (untuk voltage divider)
- [ ] 1x Resistor 220Ω atau 330Ω (untuk IR LED)

**Kabel Jumper:**
- [ ] 10x Male-to-Male
- [ ] 10x Male-to-Female
- [ ] 5x Female-to-Female

---

## ✅ **Checklist Wiring (Print & Ceklis!)**

### **Power Rails:**
- [ ] VIN ESP32 → Power Rail (+) breadboard
- [ ] GND ESP32 → Ground Rail (-) breadboard
- [ ] External PSU (+) → Servo VCC (merah)
- [ ] External PSU (-) → Servo GND + GND ESP32 (common!)

### **Sensor HEIGHT (Ultrasonik #1):**
- [ ] VCC → VIN (5V)
- [ ] GND → GND
- [ ] TRIG → GPIO 4 (langsung)
- [ ] ECHO → GPIO 18 (pakai voltage divider 1kΩ+2kΩ)

### **Sensor LENGTH (Ultrasonik #2):**
- [ ] VCC → VIN (5V)
- [ ] GND → GND
- [ ] TRIG → GPIO 5 (langsung)
- [ ] ECHO → GPIO 12 (pakai voltage divider 1kΩ+2kΩ)

### **Servo Motor:**
- [ ] Signal (kuning) → GPIO 19
- [ ] VCC (merah) → External PSU 5V (BUKAN dari ESP32!)
- [ ] GND (coklat) → GND ESP32 + PSU GND

### **Buzzer:**
- [ ] (+) → GPIO 23
- [ ] (-) → GND

### **LCD I2C:**
- [ ] VCC → VIN (5V)
- [ ] GND → GND
- [ ] SDA → GPIO 21
- [ ] SCL → GPIO 22

### **Sensor Metal:**
- [ ] VCC (coklat) → 3V3 (jika sensor 3.3V)
- [ ] GND (biru) → GND
- [ ] Signal (hitam) → GPIO 25

### **IR LED (Opsional):**
- [ ] Anode (+) → GPIO 13 via resistor 220Ω
- [ ] Cathode (-) → GND

---

## 🎯 **Pin ESP32 Summary (Copy Paste Ini!)**

```cpp
// Dari kode main.cpp:

GPIO 4  = Sensor HEIGHT TRIG (output)
GPIO 18 = Sensor HEIGHT ECHO (input + voltage divider)
GPIO 5  = Sensor LENGTH TRIG (output)
GPIO 12 = Sensor LENGTH ECHO (input + voltage divider)
GPIO 19 = Servo Signal
GPIO 23 = Buzzer
GPIO 13 = IR LED (opsional)
GPIO 25 = Metal Sensor (INPUT_PULLUP)
GPIO 21 = LCD SDA (I2C)
GPIO 22 = LCD SCL (I2C)

VIN = 5V dari USB (untuk semua sensor 5V)
3V3 = 3.3V (untuk metal sensor 3.3V)
GND = Ground (common untuk semua)
```

---

## 🧪 **Testing Commands**

Setelah wiring, upload kode ke ESP32, buka Serial Monitor (115200 baud), ketik:

| Command | Fungsi | Output Yang Benar |
|---------|--------|-------------------|
| `TEST` | Test semua sensor | Height: X cm, Length: Y cm, Metal: YES/NO |
| `LCD` | Test LCD display | LCD menampilkan "LCD TEST 1234" |
| `SCAN` | Scan I2C devices | "I2C device found at 0x27" (LCD) |
| `CHECK` | Check user session | Status login user |
| `CLEAR` | Clear session | Session cleared |

---

## 🔥 **PENTING! Baca Ini Sebelum Nyalakan!**

### ✅ **DO (Lakukan):**
1. Cek semua koneksi 2x (VCC, GND, Signal)
2. Pastikan voltage divider di ECHO pin (WAJIB!)
3. Gunakan external PSU untuk servo
4. Common ground (ESP32 GND = PSU GND)
5. Test dengan command `TEST`, `LCD`, `SCAN`

### ❌ **DON'T (Jangan Lakukan):**
1. Jangan langsung sambung ECHO 5V ke GPIO ESP32 (RUSAK!)
2. Jangan ambil power servo dari ESP32 VIN (overload!)
3. Jangan lupa voltage divider (ESP32 akan rusak!)
4. Jangan lupa GND common (servo tidak jalan!)
5. Jangan upload kode sebelum cek wiring!

---

## 📸 **Gambar Referensi (Contoh Breadboard Layout)**

```
       ESP32 DevKit v1
       ┌──────────┐
    3V3│●        ●│VIN ────→ Power Rail (+) 5V
    GND│●        ●│GPIO 36
   GPIO│15       23│ ──────→ Buzzer (+)
   GPIO│2        22│ ──────→ LCD SCL
   GPIO│4        21│ ──────→ LCD SDA
   GPIO│16       19│ ──────→ Servo Signal
   GPIO│17       18│ ←[VD]── Sensor HEIGHT ECHO
   GPIO│5        05│ ──────→ Sensor LENGTH TRIG
   GPIO│18       12│ ←[VD]── Sensor LENGTH ECHO
   GPIO│19       13│ ──────→ IR LED
   GPIO│21       25│ ──────→ Metal Sensor
   GPIO│22       26│
   GPIO│23       27│
    GND│●        ●│GND ────→ Ground Rail (-)
       └──────────┘

[VD] = Voltage Divider (1kΩ + 2kΩ)

Breadboard Power Rails:
=======================
[+++++++++++++] ← Sambung ke VIN ESP32 (5V)
[--------------] ← Sambung ke GND ESP32
```

---

## 🎉 **Selesai!**

Print tabel ini dan ceklis satu per satu saat wiring! 

**File referensi:**
- 📄 `WIRING_TABLE_SIMPLE.md` ← **File ini (tabel ringkas)**
- 📄 `WIRING_GUIDE_VISUAL.md` ← **Panduan detail dengan troubleshooting**
- 📄 `IOT_PIN_CONFIGURATION.md` ← **Dokumentasi teknis lengkap**

Good luck! 🚀
