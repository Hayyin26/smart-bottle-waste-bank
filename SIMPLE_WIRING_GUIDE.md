# 🔌 Panduan Wiring Sederhana - Metal Sensor & Load Cell

## 📦 **Yang Anda Butuhkan**

### **Komponen:**
1. ✅ ESP32
2. ✅ Load Cell (4 kabel: Merah, Hitam, Putih, Hijau)
3. ✅ Module HX711 (amplifier load cell)
4. ✅ Metal Proximity Sensor LJ12A3 (3 kabel: Coklat, Biru, Hitam)
5. ✅ Power Supply 12V DC
6. ✅ Resistor 10kΩ (1 buah)
7. ✅ Resistor 4.7kΩ (1 buah)
8. ✅ Breadboard
9. ✅ Kabel jumper

---

## ⚖️ **LOAD CELL - 3 Langkah Mudah**

### **Langkah 1: Load Cell → HX711**
```
Load Cell          HX711
─────────          ──────
Merah    ────────→ E+
Hitam    ────────→ E-
Putih    ────────→ A-
Hijau    ────────→ A+
```

### **Langkah 2: HX711 → ESP32**
```
HX711             ESP32
─────             ─────
VCC     ────────→ 3.3V  ⚠️ PENTING: 3.3V, bukan 5V!
GND     ────────→ GND
DT      ────────→ GPIO 26
SCK     ────────→ GPIO 27
```

### **Langkah 3: Selesai!**
```
Load Cell → HX711 → ESP32
   ✅        ✅       ✅
```

---

## 🔍 **METAL SENSOR - 4 Langkah Mudah**

### **Langkah 1: Metal Sensor → Power 12V**
```
Metal Sensor      Power 12V
────────────      ─────────
Coklat   ───────→ +12V
Biru     ───────→ GND
Hitam    ───────→ (belum sambung)
```

### **Langkah 2: Buat Voltage Divider**
```
Sensor Hitam (12V)
      │
      │
   [10kΩ]  ← Resistor 1
      │
      ├─────────→ ESP32 GPIO 25
      │
   [4.7kΩ] ← Resistor 2
      │
     GND
```

### **Langkah 3: Sambungkan ke ESP32**
```
Voltage Divider   ESP32
───────────────   ─────
Output (3.3V) ──→ GPIO 25
GND ────────────→ GND (common dengan sensor!)
```

### **Langkah 4: Selesai!**
```
12V → Metal Sensor → Voltage Divider → ESP32
✅         ✅              ✅            ✅
```

---

## 🎨 **Diagram Visual Sederhana**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              SISTEM LENGKAP                     │
│                                                 │
│  ┌──────────┐                                   │
│  │  ESP32   │                                   │
│  │          │                                   │
│  │ 3.3V ●───┼──→ HX711 VCC                      │
│  │ GND  ●───┼──→ HX711 GND & Common GND         │
│  │ 26   ●───┼──→ HX711 DT                       │
│  │ 27   ●───┼──→ HX711 SCK                      │
│  │          │                                   │
│  │ 25   ●───┼──→ Voltage Divider Output         │
│  │ GND  ●───┼──→ Common GND                     │
│  │          │                                   │
│  └──────────┘                                   │
│       ↑                                         │
│       │                                         │
│  ┌────┴─────┐         ┌──────────┐             │
│  │  HX711   │         │ Voltage  │             │
│  │          │         │ Divider  │             │
│  │ E+ ●─────┼──→ Load │ 10kΩ +   │             │
│  │ E- ●─────┼──→ Cell │ 4.7kΩ    │             │
│  │ A+ ●─────┼──→ 4    │          │             │
│  │ A- ●─────┼──→ Kabel│          │             │
│  │          │         │          │             │
│  └──────────┘         └────┬─────┘             │
│                            │                   │
│                       ┌────┴──────┐            │
│                       │  Metal    │            │
│                       │  Sensor   │            │
│                       │           │            │
│                       │ Coklat ●──┼──→ 12V+    │
│                       │ Biru   ●──┼──→ GND     │
│                       │ Hitam  ●──┼──→ Divider │
│                       │           │            │
│                       └───────────┘            │
│                            ↑                   │
│                       ┌────┴──────┐            │
│                       │ 12V Power │            │
│                       │  Supply   │            │
│                       └───────────┘            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📝 **Checklist Wiring (Print & Centang)**

### **Load Cell:**
- [ ] Kabel Merah Load Cell → HX711 E+
- [ ] Kabel Hitam Load Cell → HX711 E-
- [ ] Kabel Putih Load Cell → HX711 A-
- [ ] Kabel Hijau Load Cell → HX711 A+
- [ ] HX711 VCC → ESP32 3.3V (BUKAN 5V!)
- [ ] HX711 GND → ESP32 GND
- [ ] HX711 DT → ESP32 GPIO 26
- [ ] HX711 SCK → ESP32 GPIO 27

### **Metal Sensor:**
- [ ] Kabel Coklat Sensor → Power 12V+
- [ ] Kabel Biru Sensor → GND (common dengan ESP32)
- [ ] Kabel Hitam Sensor → Resistor 10kΩ
- [ ] Resistor 10kΩ → Junction → ESP32 GPIO 25
- [ ] Junction → Resistor 4.7kΩ → GND

### **Power:**
- [ ] ESP32 powered (USB atau 5V)
- [ ] Metal Sensor powered (12V)
- [ ] Semua GND terhubung (common ground)

### **Testing:**
- [ ] Cek voltase HX711 VCC = 3.3V
- [ ] Cek voltase Metal Sensor = 12V
- [ ] Cek voltase GPIO 25 = 3-4V (saat tidak detect)
- [ ] Upload program test
- [ ] Buka Serial Monitor
- [ ] Test load cell dengan beban
- [ ] Test metal sensor dengan kaleng

---

## 🎯 **Tips Penting**

### **1. Load Cell:**
- ✅ HX711 VCC **HARUS** ke 3.3V
- ✅ Jangan terbalik kabel load cell
- ✅ Kalibrasi sebelum digunakan

### **2. Metal Sensor:**
- ✅ Sensor **HARUS** pakai 12V
- ✅ **WAJIB** pakai voltage divider
- ✅ Tanpa voltage divider = ESP32 rusak!

### **3. Common Ground:**
- ✅ Semua GND harus terhubung
- ✅ ESP32 GND = HX711 GND = Metal Sensor GND = Power Supply GND

---

## 🔧 **Cara Merakit di Breadboard**

### **Posisi Komponen:**
```
Breadboard Layout:

Row 1-10:  ESP32
Row 12-15: HX711
Row 17-18: Resistor 10kΩ
Row 19-20: Resistor 4.7kΩ
Row 22:    Junction (GPIO 25)

Rail +:    12V (untuk metal sensor)
Rail -:    Common GND
```

### **Urutan Merakit:**
1. Pasang ESP32 di breadboard
2. Pasang HX711 di breadboard
3. Hubungkan HX711 ke ESP32 (4 kabel)
4. Hubungkan Load Cell ke HX711 (4 kabel)
5. Pasang resistor 10kΩ di breadboard
6. Pasang resistor 4.7kΩ di breadboard
7. Hubungkan resistor (voltage divider)
8. Hubungkan metal sensor ke voltage divider
9. Hubungkan voltage divider ke GPIO 25
10. Hubungkan semua GND (common ground)
11. Cek dengan multimeter
12. Power on & test!

---

## 📸 **Foto Referensi**

### **Load Cell Wiring:**
Cari di Google Images:
- "HX711 ESP32 wiring"
- "Load cell HX711 connection"

### **Metal Sensor Wiring:**
Cari di Google Images:
- "LJ12A3 voltage divider"
- "Proximity sensor ESP32"

### **Voltage Divider:**
Cari di Google Images:
- "Voltage divider breadboard"
- "12V to 3.3V divider"

---

## ⚠️ **BAHAYA! Jangan Lakukan Ini:**

### **❌ JANGAN:**
1. Hubungkan HX711 VCC ke 5V (harus 3.3V!)
2. Hubungkan Metal Sensor langsung ke GPIO 25 (harus pakai voltage divider!)
3. Lupa common ground
4. Power on sebelum cek wiring
5. Gunakan resistor nilai lain (harus 10kΩ + 4.7kΩ)

### **✅ HARUS:**
1. HX711 VCC ke 3.3V
2. Metal Sensor pakai voltage divider
3. Semua GND terhubung
4. Cek dengan multimeter dulu
5. Test satu sensor dulu

---

## 🧪 **Program Test Sederhana**

```cpp
#include <HX711.h>

#define PIN_METAL 25
#define PIN_LOADCELL_DOUT 26
#define PIN_LOADCELL_SCK 27

HX711 scale;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_METAL, INPUT_PULLUP);
  scale.begin(PIN_LOADCELL_DOUT, PIN_LOADCELL_SCK);
  scale.set_scale(420.0983);
  scale.tare();
  
  Serial.println("=== TEST SENSOR ===");
}

void loop() {
  // Test Metal Sensor
  int metal = digitalRead(PIN_METAL);
  Serial.print("Metal: ");
  Serial.print(metal);
  Serial.print(metal == LOW ? " DETECTED! ❌" : " OK ✅");
  
  // Test Load Cell
  float weight = scale.get_units(5);
  Serial.print(" | Weight: ");
  Serial.print(weight, 1);
  Serial.println(" g");
  
  delay(500);
}
```

**Expected Output:**
```
Metal: 1 OK ✅ | Weight: 0.0 g
Metal: 1 OK ✅ | Weight: 15.3 g  ← Botol diletakkan
Metal: 0 DETECTED! ❌ | Weight: 0.0 g  ← Kaleng didekatkan
```

---

## 📞 **Butuh Bantuan?**

### **Problem: Load cell tidak terbaca**
**Cek:**
- [ ] HX711 VCC ke 3.3V (bukan 5V)
- [ ] Kabel DT dan SCK tidak terbalik
- [ ] Load cell kabel sesuai warna

### **Problem: Metal sensor tidak detect**
**Cek:**
- [ ] Sensor dapat 12V
- [ ] Voltage divider sudah benar
- [ ] Jarak sensor 2-5mm dari metal

### **Problem: ESP32 restart terus**
**Cek:**
- [ ] Mungkin short circuit
- [ ] Cek voltase GPIO 25 (harus < 3.3V)
- [ ] Lepas metal sensor, test ESP32 saja

---

## ✅ **Selesai!**

Jika semua checklist sudah dicentang:
1. ✅ Wiring sudah benar
2. ✅ Test dengan multimeter OK
3. ✅ Program test berjalan
4. ✅ Sensor berfungsi

**Anda siap upload program utama!**

---

**📌 Simpan file ini dan print untuk referensi saat merakit!**
