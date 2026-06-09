# 🚨 Update: LED Indicator & Buzzer untuk Metal Detection

## 🎯 Fitur Baru yang Ditambahkan

### **1. LED Indicator**
- 🟢 **LED Hijau (GPIO 26)**: Botol DITERIMA (accepted)
- 🔴 **LED Merah (GPIO 27)**: Botol DITOLAK (rejected) atau LOGAM terdeteksi

### **2. Buzzer Enhancement**
- 🔔 **1x beep pendek**: Botol diterima
- 🔔 **2x beep pendek**: Ukuran salah
- 🔔 **3x beep cepat**: Logam terdeteksi! (warning pattern)

---

## 📍 Pin Configuration

### **Hardware yang Perlu Ditambahkan:**

```
ESP32 Pin Mapping:
├─ GPIO 26 → LED Hijau (+ resistor 220Ω → GND)
└─ GPIO 27 → LED Merah (+ resistor 220Ω → GND)

Wiring:
┌──────────┐
│  ESP32   │
├──────────┤
│ GPIO 26  ├──→ [220Ω] → LED Hijau (+) → GND
│ GPIO 27  ├──→ [220Ω] → LED Merah (+) → GND
│ GPIO 25  ├──← Sensor Metal (existing)
│ GPIO 23  ├──→ Buzzer (existing)
└──────────┘
```

**Catatan:**
- LED dengan resistor 220Ω untuk limit current
- LED Anode (+) ke resistor, Cathode (-) ke GND
- Gunakan LED DIP 5mm (warna hijau & merah)

---

## 🎨 Behavior Logic

### **Skenario 1: Botol Plastik Diterima** ✅
```
1. Botol masuk
2. Sensor ultrasonic ukur (height & length)
3. Klasifikasi ukuran: KECIL/SEDANG/BESAR
4. CEK metal sensor: TIDAK TERDETEKSI
5. LED HIJAU ON 🟢
6. Buzzer: 1x beep
7. LCD: "BOTOL KECIL +5 POIN"
8. Servo buka gate
9. Kirim data ke Supabase
10. LED OFF setelah botol lewat
```

---

### **Skenario 2: Ukuran Botol Salah** ❌
```
1. Botol masuk
2. Sensor ultrasonic ukur
3. Klasifikasi: NONE (di luar range)
4. LED MERAH ON 🔴
5. Buzzer: 2x beep
6. LCD: "UKURAN SALAH"
7. Gate tetap tertutup
8. LED MERAH BLINK 3x (warning visual)
9. LED OFF
```

---

### **Skenario 3: Botol Logam Terdeteksi** 🚨
```
1. Botol masuk
2. Sensor metal TERDETEKSI
3. LED MERAH ON 🔴
4. Buzzer: 3x beep cepat (metal alert!)
5. LCD: "BOTOL CACAT - ADA LOGAM"
6. Gate tetap tertutup
7. LED MERAH BLINK 5x (strong warning!)
8. LED OFF
```

---

## 💻 Code Changes Summary

### **1. New Pin Definitions**
```cpp
#define PIN_LED_GREEN 26  // LED hijau
#define PIN_LED_RED 27    // LED merah
```

### **2. New Functions**
```cpp
// LED Control
void ledGreenOn()         // Nyalakan hijau, matikan merah
void ledRedOn()           // Nyalakan merah, matikan hijau
void ledAllOff()          // Matikan semua LED
void ledRedBlink(int count) // Blink merah N kali

// Buzzer Control
void buzzLong()           // Beep panjang (500ms)
void buzzMetalAlert()     // 3x beep cepat untuk metal
```

### **3. Decision Logic Updates**

#### **Saat Botol Diterima:**
```cpp
if (currentBottleSize != NONE) {
  ledGreenOn();           // ← BARU: LED hijau ON
  openGate();
  buzzShort(1);
  // ... kirim data ...
  delay(2000);
  ledAllOff();            // ← BARU: LED OFF
}
```

#### **Saat Ukuran Salah:**
```cpp
else {
  ledRedOn();             // ← BARU: LED merah ON
  closeGate();
  buzzShort(2);
  lcdPrintLine(0, "UKURAN SALAH");
  delay(1000);
  ledRedBlink(3);         // ← BARU: Blink 3x
  ledAllOff();
}
```

#### **Saat Logam Terdeteksi:**
```cpp
if (isMetalDetected) {
  ledRedOn();             // ← BARU: LED merah ON
  closeGate();
  buzzMetalAlert();       // ← BARU: 3x beep cepat
  lcdPrintLine(0, "BOTOL CACAT");
  lcdPrintLine(1, "ADA LOGAM");
  delay(1000);
  ledRedBlink(5);         // ← BARU: Blink 5x (strong warning)
  ledAllOff();
}
```

---

## 🔧 Installation Steps

### **1. Update Code**
File sudah diupdate di: `IOT/PBL/src/main.cpp`

Changes:
- ✅ Added LED pin definitions
- ✅ Added LED control functions
- ✅ Added buzzer metal alert function
- ✅ Updated decision logic with LED indicators
- ✅ pinMode setup for GPIO 26 & 27

### **2. Hardware Assembly**

**Beli Komponen:**
- 1x LED Hijau 5mm DIP
- 1x LED Merah 5mm DIP
- 2x Resistor 220Ω (atau 330Ω)
- Jumper wires

**Wiring:**
```
LED Hijau:
ESP32 GPIO 26 → Resistor 220Ω → LED Anode (+) 
LED Cathode (-) → GND

LED Merah:
ESP32 GPIO 27 → Resistor 220Ω → LED Anode (+)
LED Cathode (-) → GND
```

**Tips:**
- LED panjang = Anode (+)
- LED pendek = Cathode (-)
- Test dengan multimeter jika tidak yakin

### **3. Upload Code**

```bash
# Di PlatformIO
pio run --target upload

# Atau di Arduino IDE
# Compile & Upload
```

### **4. Testing**

**Test 1: LED Hijau (Botol Normal)**
```
1. Masukkan botol plastik ukuran normal
2. Expected:
   - LED hijau ON
   - Buzzer 1x beep
   - Gate buka
   - LCD: "BOTOL KECIL +5 POIN"
   - LED OFF setelah botol lewat
```

**Test 2: LED Merah (Ukuran Salah)**
```
1. Masukkan botol terlalu besar/kecil
2. Expected:
   - LED merah ON
   - Buzzer 2x beep
   - Gate tetap tutup
   - LCD: "UKURAN SALAH"
   - LED blink 3x
   - LED OFF
```

**Test 3: LED Merah + Buzzer (Logam)**
```
1. Masukkan botol kaleng atau bawa magnet dekat sensor
2. Expected:
   - LED merah ON
   - Buzzer 3x beep CEPAT
   - Gate tetap tutup
   - LCD: "BOTOL CACAT - ADA LOGAM"
   - LED blink 5x (strong)
   - LED OFF
```

---

## 🎥 Visual Behavior

### **State Diagram:**
```
┌─────────────────────────────────────────────┐
│          IDLE (Tunggu Botol)                │
│          LEDs: OFF                          │
└───────────────┬─────────────────────────────┘
                │
        Botol Masuk
                │
                ▼
┌─────────────────────────────────────────────┐
│       CEK SENSOR METAL                      │
└───┬─────────────────────────────────┬───────┘
    │                                 │
    │ Metal? NO                       │ Metal? YES
    ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│ CEK UKURAN   │              │ 🔴 LED MERAH ON  │
└──┬───────┬───┘              │ 🔔 3x BEEP       │
   │       │                   │ 🚫 GATE TUTUP   │
   │       │                   │ Blink 5x        │
   │       │                   └──────────────────┘
   │       │
Valid  Invalid
   │       │
   ▼       ▼
┌──────────┐  ┌──────────────┐
│🟢LED HIJAU│  │🔴 LED MERAH  │
│🔔 1x BEEP │  │🔔 2x BEEP    │
│✅ BUKA    │  │🚫 TUTUP      │
│Send Data  │  │Blink 3x      │
└──────────┘  └──────────────┘
```

---

## 📊 Comparison: Before vs After

### **BEFORE (No LED):**
```
✅ Botol Accepted → Buzzer beep, Gate buka
❌ Botol Rejected → Buzzer beep, Gate tutup
🚨 Metal Detected → Buzzer beep, Gate tutup

Problem: Semua pakai buzzer yang sama, 
         susah dibedakan dari jauh!
```

### **AFTER (With LED):**
```
✅ Botol Accepted → 🟢 HIJAU + 1x beep + Gate buka
❌ Botol Rejected → 🔴 MERAH + 2x beep + Blink 3x
🚨 Metal Detected → 🔴 MERAH + 3x beep CEPAT + Blink 5x

Benefit: 
- Visual feedback jelas dari jauh
- Beda pattern untuk beda kondisi
- Lebih professional & user-friendly
```

---

## 🎯 Benefits

### **1. User Experience**
- ✅ Jelas dari jauh (tidak perlu dengar buzzer)
- ✅ Warna intuitif (hijau=OK, merah=ERROR)
- ✅ Feedback immediate

### **2. Operational**
- ✅ Mengurangi confusion user
- ✅ Operator bisa monitor dari jauh
- ✅ Lebih professional

### **3. Safety**
- ✅ Warning visual untuk metal (bahaya)
- ✅ Jelas botol ditolak
- ✅ User tidak paksa masukkan botol salah

---

## 🐛 Troubleshooting

### **LED Tidak Menyala**
**Problem:** LED tidak menyala sama sekali

**Solusi:**
1. Check wiring: GPIO → Resistor → LED → GND
2. Check polaritas LED (panjang = +, pendek = -)
3. Test LED dengan multimeter
4. Cek resistor value (220Ω atau 330Ω)
5. Print debug:
   ```cpp
   Serial.println("LED Green ON");
   digitalWrite(PIN_LED_GREEN, HIGH);
   ```

---

### **LED Selalu Menyala**
**Problem:** LED terus nyala, tidak mati

**Solusi:**
1. Check `ledAllOff()` dipanggil
2. Check tidak ada short circuit
3. Add delay setelah decision:
   ```cpp
   delay(2000);
   ledAllOff();
   ```

---

### **Buzzer Tidak Bunyi untuk Metal**
**Problem:** Metal terdeteksi tapi buzzer tidak bunyi

**Solusi:**
1. Check sensor metal wiring
2. Test sensor:
   ```cpp
   Serial.println("Metal: " + String(isMetalDetected));
   ```
3. Check `buzzMetalAlert()` function

---

### **LED Berkedip Terus**
**Problem:** LED flicker/berkedip terus

**Solusi:**
1. Add `static` state variable untuk prevent re-trigger
2. Check loop delay
3. Add cooldown:
   ```cpp
   static unsigned long lastLedChange = 0;
   if (millis() - lastLedChange > 500) {
     ledGreenOn();
     lastLedChange = millis();
   }
   ```

---

## 📋 Checklist

**Hardware:**
- [ ] LED hijau terpasang di GPIO 26
- [ ] LED merah terpasang di GPIO 27
- [ ] Resistor 220Ω untuk masing-masing LED
- [ ] Wiring ke GND benar
- [ ] Polaritas LED benar (panjang=+, pendek=-)

**Software:**
- [ ] Code diupdate dengan LED functions
- [ ] pinMode setup untuk GPIO 26 & 27
- [ ] Decision logic updated
- [ ] Upload code ke ESP32
- [ ] Serial monitor check output

**Testing:**
- [ ] Test LED hijau (botol normal)
- [ ] Test LED merah (ukuran salah)
- [ ] Test LED merah + buzzer (metal)
- [ ] Test LED blink pattern
- [ ] Test LED OFF setelah selesai

---

**Status:** ✅ Ready to implement  
**Hardware Required:** 2x LED, 2x Resistor  
**Code Status:** Already updated in main.cpp  
**Last Updated:** June 9, 2026
