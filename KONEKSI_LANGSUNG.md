# 🔌 Koneksi Langsung - Metal Sensor & Load Cell

## 📌 **METAL PROXIMITY SENSOR (3 Kabel)**

### **Jika Sensor 3.3V (Paling Mudah):**

```
┌─────────────────────────────────────┐
│  METAL SENSOR      →    ESP32       │
├─────────────────────────────────────┤
│  Coklat (VCC)      →    3.3V        │
│  Biru (GND)        →    GND         │
│  Hitam (Signal)    →    GPIO 25     │
└─────────────────────────────────────┘

✅ LANGSUNG COLOK! Tidak butuh resistor!
```

---

### **Jika Sensor 5V:**

```
┌─────────────────────────────────────────────────┐
│  METAL SENSOR      →    RESISTOR    →   ESP32   │
├─────────────────────────────────────────────────┤
│  Coklat (VCC)      →    -           →   5V      │
│  Biru (GND)        →    -           →   GND     │
│  Hitam (Signal)    →    2.2kΩ       →   GPIO 25 │
│                         ↓                        │
│                       3.3kΩ                      │
│                         ↓                        │
│                        GND                       │
└─────────────────────────────────────────────────┘

⚠️ Butuh 2 resistor untuk voltage divider
```

---

### **Jika Sensor 12V:**

```
┌──────────────────────────────────────────────────────┐
│  METAL SENSOR      →    RESISTOR    →   ESP32        │
├──────────────────────────────────────────────────────┤
│  Coklat (VCC)      →    -           →   12V (Power   │
│                                          Supply       │
│                                          Terpisah)    │
│  Biru (GND)        →    -           →   GND (Common) │
│  Hitam (Signal)    →    10kΩ        →   GPIO 25     │
│                         ↓                             │
│                       4.7kΩ                           │
│                         ↓                             │
│                        GND                            │
└──────────────────────────────────────────────────────┘

⚠️ Butuh power supply 12V terpisah + voltage divider
```

---

## ⚖️ **LOAD CELL (4 Kabel) + HX711**

### **Step 1: Load Cell → HX711**

```
┌─────────────────────────────────────┐
│  LOAD CELL         →    HX711       │
├─────────────────────────────────────┤
│  Merah (E+)        →    E+          │
│  Hitam (E-)        →    E-          │
│  Putih (A-)        →    A-          │
│  Hijau (A+)        →    A+          │
└─────────────────────────────────────┘
```

### **Step 2: HX711 → ESP32**

```
┌─────────────────────────────────────┐
│  HX711             →    ESP32       │
├─────────────────────────────────────┤
│  VCC               →    3.3V        │
│  GND               →    GND         │
│  DT (DOUT)         →    GPIO 26     │
│  SCK               →    GPIO 27     │
└─────────────────────────────────────┘

⚠️ PENTING: VCC ke 3.3V, BUKAN 5V!
```

---

## 🎨 **DIAGRAM VISUAL LENGKAP**

### **Opsi 1: Sensor Metal 3.3V (PALING MUDAH)**

```
                    ┌─────────────┐
                    │   ESP32     │
                    ├─────────────┤
                    │             │
    Load Cell ──→ HX711           │
    Merah ──→ E+    │             │
    Hitam ──→ E-    │             │
    Putih ──→ A-    │             │
    Hijau ──→ A+    │             │
                    │             │
    HX711 VCC ──────┤ 3.3V        │
    HX711 GND ──────┤ GND         │
    HX711 DT ───────┤ GPIO 26     │
    HX711 SCK ──────┤ GPIO 27     │
                    │             │
    Metal Sensor    │             │
    Coklat ─────────┤ 3.3V        │
    Biru ───────────┤ GND         │
    Hitam ──────────┤ GPIO 25     │
                    │             │
                    └─────────────┘
                         │
                    USB 5V Power
```

---

## 📋 **CHECKLIST KONEKSI**

### **Metal Sensor 3.3V:**
```
[ ] Coklat  →  ESP32 3.3V
[ ] Biru    →  ESP32 GND
[ ] Hitam   →  ESP32 GPIO 25
```

### **Load Cell:**
```
[ ] Merah   →  HX711 E+
[ ] Hitam   →  HX711 E-
[ ] Putih   →  HX711 A-
[ ] Hijau   →  HX711 A+
```

### **HX711:**
```
[ ] VCC     →  ESP32 3.3V (BUKAN 5V!)
[ ] GND     →  ESP32 GND
[ ] DT      →  ESP32 GPIO 26
[ ] SCK     →  ESP32 GPIO 27
```

### **Power:**
```
[ ] ESP32 powered via USB 5V
[ ] Semua GND terhubung (common ground)
```

---

## 🎯 **TABEL RINGKASAN**

| Komponen | Kabel | Warna | Ke ESP32 |
|----------|-------|-------|----------|
| **Metal Sensor** | 1 | Coklat | 3.3V |
| **Metal Sensor** | 2 | Biru | GND |
| **Metal Sensor** | 3 | Hitam | GPIO 25 |
| **Load Cell** | 1 | Merah | HX711 E+ |
| **Load Cell** | 2 | Hitam | HX711 E- |
| **Load Cell** | 3 | Putih | HX711 A- |
| **Load Cell** | 4 | Hijau | HX711 A+ |
| **HX711** | 1 | VCC | ESP32 3.3V |
| **HX711** | 2 | GND | ESP32 GND |
| **HX711** | 3 | DT | ESP32 GPIO 26 |
| **HX711** | 4 | SCK | ESP32 GPIO 27 |

---

## 🔧 **CARA MERAKIT (Step-by-Step)**

### **Langkah 1: Siapkan Komponen**
- ESP32
- Load Cell (4 kabel)
- HX711 Module
- Metal Sensor 3.3V (3 kabel)
- Breadboard
- Kabel jumper

### **Langkah 2: Pasang ESP32 di Breadboard**
- Letakkan ESP32 di tengah breadboard

### **Langkah 3: Hubungkan Load Cell ke HX711**
```
Load Cell Merah  →  HX711 E+
Load Cell Hitam  →  HX711 E-
Load Cell Putih  →  HX711 A-
Load Cell Hijau  →  HX711 A+
```

### **Langkah 4: Hubungkan HX711 ke ESP32**
```
HX711 VCC  →  ESP32 3.3V
HX711 GND  →  ESP32 GND
HX711 DT   →  ESP32 GPIO 26
HX711 SCK  →  ESP32 GPIO 27
```

### **Langkah 5: Hubungkan Metal Sensor ke ESP32**
```
Sensor Coklat  →  ESP32 3.3V
Sensor Biru    →  ESP32 GND
Sensor Hitam   →  ESP32 GPIO 25
```

### **Langkah 6: Cek Koneksi**
- Pastikan semua kabel terpasang dengan benar
- Cek tidak ada kabel yang lepas
- Pastikan tidak ada short circuit

### **Langkah 7: Power On**
- Colokkan USB ke ESP32
- Buka Serial Monitor
- Test sensor

---

## 🧪 **PROGRAM TEST**

```cpp
#include <HX711.h>

#define PIN_METAL 25
#define PIN_LOADCELL_DOUT 26
#define PIN_LOADCELL_SCK 27

HX711 scale;

void setup() {
  Serial.begin(115200);
  
  // Setup Metal Sensor
  pinMode(PIN_METAL, INPUT_PULLUP);
  
  // Setup Load Cell
  scale.begin(PIN_LOADCELL_DOUT, PIN_LOADCELL_SCK);
  scale.set_scale(420.0983);
  scale.tare();
  
  Serial.println("=== SENSOR TEST ===");
  Serial.println("Metal Sensor: GPIO 25");
  Serial.println("Load Cell: GPIO 26, 27");
  Serial.println("==================");
}

void loop() {
  // Test Metal Sensor
  int metal = digitalRead(PIN_METAL);
  Serial.print("Metal: ");
  if (metal == LOW) {
    Serial.print("DETECTED! ❌");
  } else {
    Serial.print("OK ✅");
  }
  
  // Test Load Cell
  float weight = scale.get_units(5);
  Serial.print(" | Weight: ");
  Serial.print(weight, 1);
  Serial.println(" g");
  
  delay(500);
}
```

---

## 📸 **FOTO REFERENSI**

### **Breadboard Layout:**
```
     [ESP32]
        │
    ┌───┴───┐
    │       │
 [HX711] [Metal]
    │       │
[LoadCell] [3.3V]
```

### **Pin ESP32 (Dari Atas):**
```
ESP32 DevKit:
┌─────────────┐
│ 3.3V  ●     │ ← Metal Coklat, HX711 VCC
│ GND   ●     │ ← Metal Biru, HX711 GND
│ GPIO25 ●    │ ← Metal Hitam
│ GPIO26 ●    │ ← HX711 DT
│ GPIO27 ●    │ ← HX711 SCK
└─────────────┘
```

---

## ⚠️ **KESALAHAN UMUM**

### **❌ JANGAN:**
1. Hubungkan HX711 VCC ke 5V (harus 3.3V!)
2. Terbalik kabel load cell (ikuti warna!)
3. Lupa common ground
4. Sensor metal langsung ke 5V (harus 3.3V!)

### **✅ HARUS:**
1. HX711 VCC ke 3.3V
2. Semua GND terhubung
3. Ikuti warna kabel load cell
4. Sensor metal 3.3V (bukan 5V atau 12V)

---

## 🎯 **KESIMPULAN**

### **Metal Sensor (3 kabel):**
```
Coklat  →  3.3V
Biru    →  GND
Hitam   →  GPIO 25
```

### **Load Cell (4 kabel) → HX711:**
```
Merah   →  E+
Hitam   →  E-
Putih   →  A-
Hijau   →  A+
```

### **HX711 (4 kabel) → ESP32:**
```
VCC     →  3.3V
GND     →  GND
DT      →  GPIO 26
SCK     →  GPIO 27
```

---

## 📞 **BANTUAN**

**Q: Sensor metal saya 5V, bukan 3.3V?**
A: Butuh voltage divider (2 resistor). Lihat file WIRING_SIMPLE_5V_SENSOR.md

**Q: Sensor metal saya 12V?**
A: Butuh power supply 12V terpisah + voltage divider. Lihat file WIRING_DETAIL_METAL_LOADCELL.md

**Q: Load cell tidak terbaca?**
A: Cek HX711 VCC ke 3.3V (bukan 5V!)

**Q: Metal sensor tidak detect?**
A: Cek voltase sensor (harus 3.3V)

---

**✅ Print file ini dan gunakan saat merakit!**
