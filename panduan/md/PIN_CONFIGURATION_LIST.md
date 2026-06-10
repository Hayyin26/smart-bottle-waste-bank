# 📌 LIST KONFIGURASI PIN - IoT Bank Sampah

## 🔌 **KONFIGURASI PIN ESP32**

### **1. SENSOR ULTRASONIK HEIGHT (Diameter Botol)**
```
GPIO 4   →  TRIG (Trigger)
GPIO 18  →  ECHO (Echo)
5V       →  VCC
GND      →  GND
```

### **2. SENSOR ULTRASONIK LENGTH (Panjang Botol)**
```
GPIO 5   →  TRIG (Trigger)
GPIO 15  →  ECHO (Echo)
5V       →  VCC
GND      →  GND
```

### **3. SERVO MOTOR (Pintu Gerbang)**
```
GPIO 19  →  Signal (PWM)
5V       →  VCC
GND      →  GND
```

### **4. BUZZER (Notifikasi Suara)**
```
GPIO 23  →  Positive (+)
GND      →  Negative (-)
```

### **5. LAMPU IR (Infrared)**
```
GPIO 13  →  Positive (+) via 220Ω resistor
GND      →  Negative (-)
```

### **6. LCD I2C (Display 16x2)**
```
GPIO 21  →  SDA (Data)
GPIO 22  →  SCL (Clock)
5V       →  VCC
GND      →  GND
```

### **7. METAL PROXIMITY SENSOR (Deteksi Logam)** ⭐ BARU
```
GPIO 25  →  Signal (Hitam)
3.3V     →  VCC (Coklat)
GND      →  GND (Biru)
```

### **8. LOAD CELL + HX711 (Sensor Berat)** ⭐ BARU
```
GPIO 26  →  HX711 DT (Data)
GPIO 27  →  HX711 SCK (Clock)
3.3V     →  HX711 VCC
GND      →  HX711 GND

Load Cell ke HX711:
Merah    →  E+ (Excitation+)
Hitam    →  E- (Excitation-)
Putih    →  A- (Signal-)
Hijau    →  A+ (Signal+)
```

---

## 📊 **TABEL RINGKASAN PIN**

| No | Komponen | Pin GPIO | Fungsi | Voltase |
|----|----------|----------|--------|---------|
| 1 | Sensor HEIGHT TRIG | 4 | Output | 5V |
| 2 | Sensor HEIGHT ECHO | 18 | Input | 5V |
| 3 | Sensor LENGTH TRIG | 5 | Output | 5V |
| 4 | Sensor LENGTH ECHO | 15 | Input | 5V |
| 5 | Servo Motor | 19 | PWM | 5V |
| 6 | Buzzer | 23 | Output | 5V |
| 7 | IR Lamp | 13 | Output | 5V |
| 8 | LCD SDA | 21 | I2C Data | 5V |
| 9 | LCD SCL | 22 | I2C Clock | 5V |
| 10 | **Metal Sensor** | **25** | **Input** | **3.3V** |
| 11 | **Load Cell DT** | **26** | **Input** | **3.3V** |
| 12 | **Load Cell SCK** | **27** | **Output** | **3.3V** |

---

## 🎯 **PIN BERDASARKAN FUNGSI**

### **INPUT PINS (Sensor):**
```
GPIO 18  →  Ultrasonik HEIGHT ECHO
GPIO 15  →  Ultrasonik LENGTH ECHO
GPIO 25  →  Metal Proximity Sensor
GPIO 26  →  Load Cell HX711 DT
```

### **OUTPUT PINS (Aktuator):**
```
GPIO 4   →  Ultrasonik HEIGHT TRIG
GPIO 5   →  Ultrasonik LENGTH TRIG
GPIO 19  →  Servo Motor (PWM)
GPIO 23  →  Buzzer
GPIO 13  →  IR Lamp
GPIO 27  →  Load Cell HX711 SCK
```

### **I2C PINS (Komunikasi):**
```
GPIO 21  →  SDA (LCD)
GPIO 22  →  SCL (LCD)
```

---

## 🔋 **POWER PINS**

### **3.3V (Sensor Sensitif):**
```
3.3V  →  Metal Proximity Sensor VCC
3.3V  →  HX711 VCC
```

### **5V (Sensor & Aktuator):**
```
5V  →  Ultrasonik HEIGHT VCC
5V  →  Ultrasonik LENGTH VCC
5V  →  Servo Motor VCC
5V  →  LCD VCC
```

### **GND (Common Ground):**
```
GND  →  Semua komponen GND (common ground)
```

---

## 📝 **KODE KONFIGURASI PIN**

```cpp
// --- KONFIGURASI PIN ---
#define PIN_TRIG_HEIGHT 4       // Sensor HEIGHT TRIG
#define PIN_ECHO_HEIGHT 18      // Sensor HEIGHT ECHO
#define PIN_TRIG_LENGTH 5       // Sensor LENGTH TRIG
#define PIN_ECHO_LENGTH 15      // Sensor LENGTH ECHO
#define PIN_SERVO 19            // Servo Motor
#define PIN_BUZZER 23           // Buzzer
#define PIN_IR_LAMP 13          // IR Lamp
#define PIN_METAL_SENSOR 25     // Metal Proximity Sensor
#define PIN_LOADCELL_DOUT 26    // Load Cell Data (HX711)
#define PIN_LOADCELL_SCK 27     // Load Cell Clock (HX711)

// I2C Pins (Default)
#define PIN_SDA 21              // LCD SDA
#define PIN_SCL 22              // LCD SCL
```

---

## 🎨 **DIAGRAM PIN ESP32**

```
                    ESP32 DevKit
         ┌─────────────────────────────┐
         │                             │
    GND  │ ●                         ● │ 3.3V
    GPIO4│ ●  (HEIGHT TRIG)          ● │ GPIO5  (LENGTH TRIG)
   GPIO18│ ●  (HEIGHT ECHO)          ● │ GPIO15 (LENGTH ECHO)
   GPIO19│ ●  (SERVO)                ● │ GPIO21 (LCD SDA)
   GPIO23│ ●  (BUZZER)               ● │ GPIO22 (LCD SCL)
   GPIO13│ ●  (IR LAMP)              ● │ GPIO25 (METAL SENSOR)
   GPIO26│ ●  (LOAD CELL DT)         ● │ GPIO27 (LOAD CELL SCK)
      5V │ ●                         ● │ GND
         │                             │
         └─────────────────────────────┘
```

---

## 🔧 **CHECKLIST KONEKSI**

### **Sensor Ultrasonik:**
```
[ ] GPIO 4  → HEIGHT TRIG
[ ] GPIO 18 → HEIGHT ECHO
[ ] GPIO 5  → LENGTH TRIG
[ ] GPIO 15 → LENGTH ECHO
[ ] 5V      → VCC (kedua sensor)
[ ] GND     → GND (kedua sensor)
```

### **Aktuator:**
```
[ ] GPIO 19 → Servo Signal
[ ] GPIO 23 → Buzzer +
[ ] GPIO 13 → IR Lamp +
[ ] 5V      → Servo VCC
[ ] GND     → Servo, Buzzer, IR Lamp GND
```

### **LCD I2C:**
```
[ ] GPIO 21 → LCD SDA
[ ] GPIO 22 → LCD SCL
[ ] 5V      → LCD VCC
[ ] GND     → LCD GND
```

### **Metal Sensor:**
```
[ ] GPIO 25 → Sensor Signal (Hitam)
[ ] 3.3V    → Sensor VCC (Coklat)
[ ] GND     → Sensor GND (Biru)
```

### **Load Cell:**
```
[ ] GPIO 26 → HX711 DT
[ ] GPIO 27 → HX711 SCK
[ ] 3.3V    → HX711 VCC
[ ] GND     → HX711 GND
[ ] Merah   → HX711 E+
[ ] Hitam   → HX711 E-
[ ] Putih   → HX711 A-
[ ] Hijau   → HX711 A+
```

---

## ⚠️ **CATATAN PENTING**

### **Voltase:**
```
✅ HX711 VCC        →  3.3V (BUKAN 5V!)
✅ Metal Sensor VCC →  3.3V (BUKAN 5V!)
✅ Ultrasonik VCC   →  5V
✅ Servo VCC        →  5V
✅ LCD VCC          →  5V (atau 3.3V)
```

### **Common Ground:**
```
✅ Semua GND harus terhubung
✅ ESP32 GND = Sensor GND = Aktuator GND
```

### **Pin yang Tidak Boleh Digunakan:**
```
❌ GPIO 0  → Boot mode
❌ GPIO 2  → Boot mode
❌ GPIO 6-11 → Flash memory
❌ GPIO 12 → Boot voltage
```

---

## 📊 **KONSUMSI ARUS**

| Komponen | Voltase | Arus | Daya |
|----------|---------|------|------|
| ESP32 | 3.3V | 80-240mA | 0.26-0.79W |
| Ultrasonik (x2) | 5V | 30mA | 0.15W |
| Servo | 5V | 100-500mA | 0.5-2.5W |
| LCD | 5V | 20mA | 0.1W |
| Buzzer | 5V | 30mA | 0.15W |
| IR Lamp | 5V | 20mA | 0.1W |
| Metal Sensor | 3.3V | 10mA | 0.03W |
| HX711 | 3.3V | 1.5mA | 0.005W |
| **TOTAL** | - | **~500mA** | **~4W** |

**Rekomendasi Power Supply: USB 5V 2A atau 12V 2A dengan buck converter**

---

## 🎯 **PIN YANG TERSISA (Untuk Ekspansi)**

```
GPIO 2   →  Available (LED onboard)
GPIO 12  →  Available (hati-hati boot voltage)
GPIO 14  →  Available
GPIO 16  →  Available
GPIO 17  →  Available
GPIO 32  →  Available (ADC)
GPIO 33  →  Available (ADC)
GPIO 34  →  Available (Input only, ADC)
GPIO 35  →  Available (Input only, ADC)
```

---

## 📚 **REFERENSI**

### **Datasheet:**
- ESP32: https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf
- HC-SR04: https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf
- HX711: https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf

### **Pinout:**
- ESP32 Pinout: https://randomnerdtutorials.com/esp32-pinout-reference-gpios/

---

## 🛒 **SHOPPING LIST**

```
[ ] ESP32 DevKit (1 pcs)
[ ] HC-SR04 Ultrasonik (2 pcs)
[ ] Servo SG90 atau MG996R (1 pcs)
[ ] Buzzer 5V (1 pcs)
[ ] IR LED (1 pcs)
[ ] LCD I2C 16x2 (1 pcs)
[ ] Metal Proximity Sensor 3.3V (1 pcs)
[ ] Load Cell 1kg (1 pcs)
[ ] HX711 Module (1 pcs)
[ ] Breadboard (1 pcs)
[ ] Kabel Jumper (20-30 pcs)
[ ] Resistor 220Ω (1 pcs untuk IR LED)
[ ] Power Supply USB 5V 2A (1 pcs)
```

---

**✅ Print file ini untuk referensi saat merakit!**
