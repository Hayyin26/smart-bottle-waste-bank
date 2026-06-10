# 🔌 Wiring Diagram - LED & Buzzer Enhancement

## 📊 Complete Pin Mapping

```
┌─────────────────────────────────────────────────────┐
│              ESP32 DevKit v1                        │
│                                                      │
│  [3.3V]  [EN]  [VP]  [VN]  [34]  [35]  [32]  [33] │
│    │                                                 │
│  [GND]  [23]  [22]  [TX]  [RX]  [21]  [GND]  [19] │
│           │     │                   │           │   │
│           │     │                   │           └───┼─→ SERVO (PWM)
│           │     │                   └───────────────┼─→ LCD SDA
│           │     └───────────────────────────────────┼─→ LCD SCL
│           └─────────────────────────────────────────┼─→ BUZZER
│                                                      │
│  [18]  [5]   [17]  [16]  [4]   [0]   [2]   [15]   │
│    │    │                  │                        │
│    │    │                  └────────────────────────┼─→ TRIG_HEIGHT
│    │    └───────────────────────────────────────────┼─→ TRIG_LENGTH
│    └────────────────────────────────────────────────┼─→ ECHO_HEIGHT
│                                                      │
│  [GND] [13]  [12]  [14]  [27]  [26]  [25]  [GND]  │
│         │     │           │     │     │             │
│         │     │           │     │     └─────────────┼─→ METAL SENSOR
│         │     │           │     └───────────────────┼─→ LED HIJAU
│         │     │           └─────────────────────────┼─→ LED MERAH  
│         │     └─────────────────────────────────────┼─→ ECHO_LENGTH
│         └───────────────────────────────────────────┼─→ IR LAMP
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 LED Wiring Detail

### **LED Hijau (GPIO 26)**
```
ESP32                    LED Hijau           Ground
┌────┐                   ┌─────┐            ┌────┐
│ 26 ├──→ [220Ω] ───→   │  +  │            │GND │
└────┘   Resistor        │  -  ├────────────┤    │
                         └─────┘            └────┘
                       (5mm DIP LED)
```

### **LED Merah (GPIO 27)**
```
ESP32                    LED Merah           Ground
┌────┐                   ┌─────┐            ┌────┐
│ 27 ├──→ [220Ω] ───→   │  +  │            │GND │
└────┘   Resistor        │  -  ├────────────┤    │
                         └─────┘            └────┘
                       (5mm DIP LED)
```

**PENTING:**
- LED panjang = Anode (+) → ke Resistor
- LED pendek = Cathode (-) → ke GND
- Gunakan resistor 220Ω atau 330Ω

---

## 🔊 Buzzer Wiring (Existing)

```
ESP32               Buzzer            Ground
┌────┐             ┌─────┐            ┌────┐
│ 23 ├────────────→│  +  │            │GND │
└────┘             │  -  ├────────────┤    │
                   └─────┘            └────┘
              (Active Buzzer)
```

---

## 🔍 Metal Sensor Wiring (Existing)

```
ESP32              Metal Sensor
┌────┐             ┌──────────┐
│ 25 ├────────────→│ Signal   │
│VCC ├────────────→│ VCC      │
│GND ├────────────→│ GND      │
└────┘             └──────────┘
           (Proximity/Inductive Sensor)
```

---

## 📐 Complete Breadboard Layout

```
                    ┌─────────────────┐
                    │   ESP32 DevKit  │
                    └─────────────────┘
                           │││││
        ┌──────────────────┘│││└──────────────────┐
        │                   ││└───────────────┐   │
        │                   │└────────────┐   │   │
        │                   └─────────┐   │   │   │
        │                             │   │   │   │
    ┌───▼───┐                     ┌───▼───┐ │   │
    │ LED   │                     │ LED   │ │   │
    │HIJAU  │                     │ MERAH │ │   │
    │ (26)  │                     │ (27)  │ │   │
    └───┬───┘                     └───┬───┘ │   │
        │                             │     │   │
    ┌───▼───┐                     ┌───▼───┐ │   │
    │220Ω R │                     │220Ω R │ │   │
    └───┬───┘                     └───┬───┘ │   │
        │                             │     │   │
        └─────────────────┬───────────┘     │   │
                          │                 │   │
                      ┌───▼─────┐       ┌───▼───┐
                      │   GND   │       │BUZZER │
                      └─────────┘       │ (23)  │
                                        └───┬───┘
                                            │
                                        ┌───▼───┐
                                        │  GND  │
                                        └───────┘
```

---

## 🛠️ Shopping List

### **Komponen Baru yang Perlu Dibeli:**

| No | Item | Qty | Spec | Harga Est. |
|----|------|-----|------|------------|
| 1 | LED Hijau 5mm DIP | 1 | 3.0-3.2V, 20mA | Rp 500 |
| 2 | LED Merah 5mm DIP | 1 | 2.0-2.2V, 20mA | Rp 500 |
| 3 | Resistor 220Ω | 2 | 1/4W | Rp 200 |
| 4 | Jumper Wires | 5 | Male-Male | Rp 1,000 |
| **TOTAL** | | | | **Rp 2,200** |

**Catatan:** Harga sangat murah, komponen basic!

---

## 🔧 Assembly Steps

### **Step 1: Prepare Components**
```
✓ LED Hijau 5mm x1
✓ LED Merah 5mm x1
✓ Resistor 220Ω x2
✓ Jumper wires x5
✓ Breadboard (optional, bisa langsung solder)
```

### **Step 2: LED Hijau**
```
1. Pasang resistor 220Ω di GPIO 26
2. Sambung ke kaki PANJANG LED hijau (+)
3. Sambung kaki PENDEK LED hijau (-) ke GND
4. Test dengan command: ledGreenOn()
```

### **Step 3: LED Merah**
```
1. Pasang resistor 220Ω di GPIO 27
2. Sambung ke kaki PANJANG LED merah (+)
3. Sambung kaki PENDEK LED merah (-) ke GND
4. Test dengan command: ledRedOn()
```

### **Step 4: Testing**
```cpp
// Di Serial Monitor, ketik:
TEST  // Test semua sensor + LED
```

---

## 🧪 Testing Commands

### **Test Individual LED:**

```cpp
// Di setup(), tambahkan temporary test code:
void setup() {
  // ... existing code ...
  
  // LED Test
  Serial.println("[TEST] Testing LEDs...");
  
  ledGreenOn();
  delay(1000);
  Serial.println("[TEST] Green ON");
  
  ledRedOn();
  delay(1000);
  Serial.println("[TEST] Red ON");
  
  ledAllOff();
  delay(1000);
  Serial.println("[TEST] All OFF");
  
  ledRedBlink(3);
  Serial.println("[TEST] Red Blink 3x");
  
  Serial.println("[TEST] LED Test Complete!");
}
```

### **Expected Output:**
```
[TEST] Testing LEDs...
[TEST] Green ON        ← LED hijau menyala 1 detik
[TEST] Red ON          ← LED merah menyala 1 detik
[TEST] All OFF         ← Semua LED mati
[TEST] Red Blink 3x    ← LED merah kedip 3x
[TEST] LED Test Complete!
```

---

## ⚡ Power Consumption

### **Current Draw per Component:**

| Component | Voltage | Current | Power |
|-----------|---------|---------|-------|
| ESP32 | 3.3V | ~80-160mA | 0.5W |
| LED Hijau | 3.0V | 20mA | 0.06W |
| LED Merah | 2.0V | 20mA | 0.04W |
| Buzzer | 5V | ~30mA | 0.15W |
| **TOTAL** | | **~150-230mA** | **~0.75W** |

**Conclusion:** Power consumption sangat rendah, USB power (500mA) lebih dari cukup!

---

## 🔍 Troubleshooting

### **LED Tidak Menyala**

**Checklist:**
- [ ] Wiring benar? (GPIO → R → LED+ → LED- → GND)
- [ ] Polaritas LED benar? (panjang=+, pendek=-)
- [ ] Resistor terpasang?
- [ ] Code sudah diupload?
- [ ] pinMode sudah di-set?

**Debug:**
```cpp
Serial.println("Testing GPIO 26...");
digitalWrite(PIN_LED_GREEN, HIGH);
delay(2000);
digitalWrite(PIN_LED_GREEN, LOW);
```

---

### **LED Terlalu Terang/Redup**

**Solusi:**
- Terlalu terang → Ganti resistor ke 330Ω atau 470Ω
- Terlalu redup → Ganti resistor ke 100Ω atau 150Ω
- Standard: 220Ω (recommended)

---

### **LED Terbalik (Merah nyala saat Hijau)**

**Penyebab:** Pin definition salah

**Fix:**
```cpp
// Swap pin definitions
#define PIN_LED_GREEN 27  // ← Tukar
#define PIN_LED_RED 26    // ← Tukar
```

---

## 📊 Behavior Matrix

| Kondisi | LED Hijau | LED Merah | Buzzer | Gate |
|---------|-----------|-----------|--------|------|
| **Idle** | OFF | OFF | Silent | Closed |
| **Botol OK** | ON | OFF | 1x beep | Open |
| **Ukuran Salah** | OFF | ON + Blink 3x | 2x beep | Closed |
| **Metal Detect** | OFF | ON + Blink 5x | 3x fast beep | Closed |
| **Sending Data** | ON | OFF | Silent | Open |
| **Success** | OFF | OFF | Silent | Closed |

---

## 🎯 Final Checklist

### **Hardware:**
- [ ] LED hijau terpasang di GPIO 26
- [ ] LED merah terpasang di GPIO 27
- [ ] Resistor 220Ω untuk masing-masing LED
- [ ] Wiring ke GND benar
- [ ] Polaritas LED benar

### **Software:**
- [ ] Code updated dengan LED functions
- [ ] pinMode setup di setup()
- [ ] LED control di decision logic
- [ ] Upload ke ESP32 berhasil

### **Testing:**
- [ ] LED hijau test: `ledGreenOn()` ✅
- [ ] LED merah test: `ledRedOn()` ✅
- [ ] LED blink test: `ledRedBlink(3)` ✅
- [ ] Integrated test: masukkan botol ✅

---

**Status:** ✅ Ready to implement  
**Difficulty:** ⭐⭐ (Easy - hanya 2 LED)  
**Time:** ~15 menit assembly + testing  
**Cost:** Rp 2,200  

**Last Updated:** June 9, 2026
