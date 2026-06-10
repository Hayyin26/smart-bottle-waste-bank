# 🔌 Wiring Diagram Lengkap - IoT Bank Sampah

## 📐 **Diagram Koneksi ESP32**

```
                           ESP32 DevKit
                    ┌─────────────────────┐
                    │                     │
    [LCD I2C]       │  21 (SDA) ●────────┼──→ LCD SDA
                    │  22 (SCL) ●────────┼──→ LCD SCL
                    │                     │
    [Ultrasonik 1]  │   4 (TRIG) ●───────┼──→ HEIGHT TRIG
    (HEIGHT)        │  18 (ECHO) ●───────┼──→ HEIGHT ECHO
                    │                     │
    [Ultrasonik 2]  │   5 (TRIG) ●───────┼──→ LENGTH TRIG
    (LENGTH)        │  15 (ECHO) ●───────┼──→ LENGTH ECHO
                    │                     │
    [Servo]         │  19 (PWM)  ●───────┼──→ Servo Signal
                    │                     │
    [Buzzer]        │  23 (OUT)  ●───────┼──→ Buzzer +
                    │                     │
    [IR Lamp]       │  13 (OUT)  ●───────┼──→ IR Lamp +
                    │                     │
    [Metal Sensor]  │  25 (IN)   ●───────┼──→ Metal Signal
                    │                     │
    [Load Cell]     │  26 (DOUT) ●───────┼──→ HX711 DT
    (HX711)         │  27 (SCK)  ●───────┼──→ HX711 SCK
                    │                     │
    [Power]         │  3.3V      ●───────┼──→ Sensors VCC
                    │  5V        ●───────┼──→ Servo VCC
                    │  GND       ●───────┼──→ Common GND
                    │                     │
                    └─────────────────────┘
```

---

## 🔧 **Detail Koneksi Per Komponen**

### **1. LCD I2C (16x2)**
```
LCD Module          ESP32
┌─────────┐        ┌─────┐
│ VCC     ├────────┤ 5V  │
│ GND     ├────────┤ GND │
│ SDA     ├────────┤ 21  │
│ SCL     ├────────┤ 22  │
└─────────┘        └─────┘

I2C Address: 0x27 atau 0x3F
```

---

### **2. Sensor Ultrasonik HEIGHT (HC-SR04)**
```
HC-SR04             ESP32
┌─────────┐        ┌─────┐
│ VCC     ├────────┤ 5V  │
│ TRIG    ├────────┤ 4   │
│ ECHO    ├────────┤ 18  │
│ GND     ├────────┤ GND │
└─────────┘        └─────┘

Fungsi: Mengukur diameter botol
```

---

### **3. Sensor Ultrasonik LENGTH (HC-SR04)**
```
HC-SR04             ESP32
┌─────────┐        ┌─────┐
│ VCC     ├────────┤ 5V  │
│ TRIG    ├────────┤ 5   │
│ ECHO    ├────────┤ 15  │
│ GND     ├────────┤ GND │
└─────────┘        └─────┘

Fungsi: Mengukur panjang botol
```

---

### **4. Servo Motor (SG90 atau MG996R)**
```
Servo               ESP32
┌─────────┐        ┌─────┐
│ VCC     ├────────┤ 5V  │
│ Signal  ├────────┤ 19  │
│ GND     ├────────┤ GND │
└─────────┘        └─────┘

Sudut: 0° (tutup), 90° (buka)
```

---

### **5. Buzzer (Active/Passive)**
```
Buzzer              ESP32
┌─────────┐        ┌─────┐
│ +       ├────────┤ 23  │
│ -       ├────────┤ GND │
└─────────┘        └─────┘

Atau dengan transistor (untuk buzzer besar):

        ESP32 GPIO 23
             │
             ├──── 1kΩ ────┐
             │              │
            GND          Base (NPN)
                            │
                         Collector
                            │
                    Buzzer (+)
                            │
                         Emitter
                            │
                           GND
```

---

### **6. IR Lamp (Infrared LED)**
```
IR LED              ESP32
┌─────────┐        ┌─────┐
│ Anode   ├────┬───┤ 13  │
│         │    │   └─────┘
│         │  220Ω
│         │    │
│ Cathode ├────┴───┤ GND │
└─────────┘        └─────┘

Resistor: 220Ω - 330Ω
```

---

### **7. Metal Proximity Sensor (LJ12A3-4-Z/BX)**
```
Sensor              Power Supply        ESP32
┌─────────┐        ┌──────────┐       ┌─────┐
│ Brown   ├────────┤ +12V     │       │     │
│ Blue    ├────────┤ GND      ├───────┤ GND │
│ Black   ├────────┼──────────┼───────┤ 25  │
└─────────┘        └──────────┘       └─────┘

⚠️ PENTING: 
- Sensor butuh 12V DC (cek datasheet)
- Signal output 12V → Gunakan voltage divider!

Voltage Divider (12V → 3.3V):
Sensor Black ──┬── 10kΩ ──┬── GPIO 25
               │           │
              GND       4.7kΩ
                           │
                          GND

Output: 12V × (4.7kΩ / 14.7kΩ) = 3.84V ✅
```

---

### **8. Load Cell + HX711**
```
Load Cell           HX711
┌─────────┐        ┌─────────┐
│ Red     ├────────┤ E+      │
│ Black   ├────────┤ E-      │
│ White   ├────────┤ A-      │
│ Green   ├────────┤ A+      │
└─────────┘        └─────────┘

HX711               ESP32
┌─────────┐        ┌─────┐
│ VCC     ├────────┤ 3.3V│
│ GND     ├────────┤ GND │
│ DT      ├────────┤ 26  │
│ SCK     ├────────┤ 27  │
└─────────┘        └─────┘

⚠️ PENTING: HX711 VCC = 3.3V (BUKAN 5V!)
```

---

## 🔋 **Power Supply**

### **Opsi 1: USB Power (Recommended untuk Testing)**
```
USB 5V ──┬──→ ESP32 VIN (5V)
         │
         └──→ Servo VCC (5V)
         
ESP32 3.3V ──┬──→ HX711 VCC
             ├──→ LCD VCC (atau 5V)
             └──→ Ultrasonik VCC (atau 5V)

⚠️ Arus maksimal USB: 500mA - 1A
```

### **Opsi 2: External Power Supply (Recommended untuk Production)**
```
12V DC Adapter
    │
    ├──→ Metal Sensor (12V)
    │
    ├──→ Buck Converter (12V → 5V)
    │         │
    │         ├──→ ESP32 VIN
    │         ├──→ Servo VCC
    │         └──→ Ultrasonik VCC
    │
    └──→ Buck Converter (12V → 3.3V)
              │
              ├──→ HX711 VCC
              └──→ LCD VCC (optional)

⚠️ Arus minimal: 2A untuk semua komponen
```

---

## 📊 **Tabel Konsumsi Daya**

| Komponen | Voltase | Arus | Daya |
|----------|---------|------|------|
| ESP32 | 3.3V | 80-240mA | 0.26-0.79W |
| LCD I2C | 5V | 20mA | 0.1W |
| HC-SR04 (x2) | 5V | 30mA | 0.15W |
| Servo SG90 | 5V | 100-500mA | 0.5-2.5W |
| Buzzer | 5V | 30mA | 0.15W |
| IR LED | 5V | 20mA | 0.1W |
| Metal Sensor | 12V | 10mA | 0.12W |
| HX711 | 3.3V | 1.5mA | 0.005W |
| **TOTAL** | - | **~500mA** | **~4W** |

**Rekomendasi Power Supply: 12V 2A**

---

## 🛠️ **Tips Wiring**

### **1. Gunakan Kabel Berkualitas**
- Kabel power: AWG 22-24
- Kabel signal: AWG 26-28
- Panjang maksimal: 30cm (untuk signal)

### **2. Common Ground**
- Semua GND harus terhubung
- Gunakan breadboard atau PCB
- Hindari ground loop

### **3. Voltage Divider untuk Metal Sensor**
- Wajib jika sensor output > 5V
- Gunakan resistor 1% tolerance
- Test dengan multimeter

### **4. Capacitor untuk Stabilitas**
- 100µF di VCC ESP32
- 10µF di VCC HX711
- 100nF di signal metal sensor

### **5. Isolasi Kabel**
- Gunakan heat shrink
- Label setiap kabel
- Hindari kabel bersilangan

---

## 🧪 **Testing Checklist**

### **Sebelum Power On:**
- [ ] Cek semua koneksi dengan multimeter
- [ ] Pastikan tidak ada short circuit
- [ ] Verifikasi voltase power supply
- [ ] Cek polaritas (+/-)

### **Setelah Power On:**
- [ ] Cek voltase di setiap komponen
- [ ] Test LCD (harus menyala)
- [ ] Test buzzer (harus bunyi)
- [ ] Test servo (harus bergerak)
- [ ] Test sensor satu per satu

---

## ⚠️ **Safety Warning**

### **JANGAN:**
- ❌ Hubungkan 5V ke pin 3.3V
- ❌ Hubungkan 12V langsung ke ESP32
- ❌ Lupa common ground
- ❌ Gunakan kabel terlalu panjang
- ❌ Power on tanpa cek wiring

### **HARUS:**
- ✅ Cek datasheet setiap komponen
- ✅ Gunakan voltage divider jika perlu
- ✅ Test dengan multimeter
- ✅ Isolasi semua koneksi
- ✅ Gunakan fuse untuk proteksi

---

## 📸 **Foto Referensi Wiring**

### **Breadboard Layout:**
```
     ESP32
       │
   ┌───┴───┐
   │       │
  LCD    Sensors
   │       │
   └───┬───┘
       │
    Common GND
```

### **PCB Layout (Recommended):**
```
┌─────────────────────────────┐
│  [ESP32]    [HX711]         │
│                              │
│  [Buck 5V]  [Buck 3.3V]     │
│                              │
│  [Terminal Blocks]           │
│   VCC  GND  S1  S2  S3  S4  │
└─────────────────────────────┘
```

---

## 📞 **Support**

Jika ada masalah wiring:
1. Cek dengan multimeter (continuity test)
2. Verifikasi voltase di setiap pin
3. Test komponen satu per satu
4. Baca datasheet komponen

---

## 📚 **Referensi**

- [ESP32 Pinout](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)
- [HC-SR04 Datasheet](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf)
- [HX711 Datasheet](https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf)
- [LJ12A3 Datasheet](https://www.google.com/search?q=LJ12A3+datasheet)
- [Voltage Divider Calculator](https://ohmslawcalculator.com/voltage-divider-calculator)

---

**✅ Wiring selesai! Pastikan semua koneksi sudah benar sebelum power on.**
