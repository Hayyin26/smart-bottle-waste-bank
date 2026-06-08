# 🔌 CHEATSHEET WIRING - Print & Tempel!

## 📌 **METAL SENSOR (3 Kabel)**

```
┌─────────────────────────────────┐
│  SENSOR        →      ESP32     │
├─────────────────────────────────┤
│  COKLAT        →      3.3V      │
│  BIRU          →      GND       │
│  HITAM         →      GPIO 25   │
└─────────────────────────────────┘
```

---

## ⚖️ **LOAD CELL (4 Kabel) → HX711**

```
┌─────────────────────────────────┐
│  LOAD CELL     →      HX711     │
├─────────────────────────────────┤
│  MERAH         →      E+        │
│  HITAM         →      E-        │
│  PUTIH         →      A-        │
│  HIJAU         →      A+        │
└─────────────────────────────────┘
```

---

## 🔧 **HX711 → ESP32**

```
┌─────────────────────────────────┐
│  HX711         →      ESP32     │
├─────────────────────────────────┤
│  VCC           →      3.3V      │
│  GND           →      GND       │
│  DT            →      GPIO 26   │
│  SCK           →      GPIO 27   │
└─────────────────────────────────┘
```

---

## 📊 **TABEL LENGKAP**

| Dari | Warna | Ke |
|------|-------|-----|
| **Metal Sensor** | Coklat | ESP32 3.3V |
| **Metal Sensor** | Biru | ESP32 GND |
| **Metal Sensor** | Hitam | ESP32 GPIO 25 |
| **Load Cell** | Merah | HX711 E+ |
| **Load Cell** | Hitam | HX711 E- |
| **Load Cell** | Putih | HX711 A- |
| **Load Cell** | Hijau | HX711 A+ |
| **HX711** | VCC | ESP32 3.3V ⚠️ |
| **HX711** | GND | ESP32 GND |
| **HX711** | DT | ESP32 GPIO 26 |
| **HX711** | SCK | ESP32 GPIO 27 |

---

## ✅ **CHECKLIST**

```
[ ] Metal Coklat  →  3.3V
[ ] Metal Biru    →  GND
[ ] Metal Hitam   →  GPIO 25

[ ] Load Merah    →  HX711 E+
[ ] Load Hitam    →  HX711 E-
[ ] Load Putih    →  HX711 A-
[ ] Load Hijau    →  HX711 A+

[ ] HX711 VCC     →  3.3V (BUKAN 5V!)
[ ] HX711 GND     →  GND
[ ] HX711 DT      →  GPIO 26
[ ] HX711 SCK     →  GPIO 27

[ ] USB Power     →  ESP32
[ ] Test dengan Serial Monitor
```

---

## ⚠️ **PENTING!**

```
✅ HX711 VCC ke 3.3V (BUKAN 5V!)
✅ Metal Sensor 3.3V (bukan 5V/12V)
✅ Semua GND terhubung (common ground)
✅ Ikuti warna kabel load cell
```

---

## 🎯 **PIN SUMMARY**

```
GPIO 25  →  Metal Sensor (Hitam)
GPIO 26  →  HX711 DT
GPIO 27  →  HX711 SCK
3.3V     →  Metal Sensor (Coklat) + HX711 VCC
GND      →  Metal Sensor (Biru) + HX711 GND
```

---

**📌 Print & tempel di meja kerja Anda!**
