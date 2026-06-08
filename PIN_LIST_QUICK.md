# 📌 PIN LIST - Quick Reference

## 🔌 **SEMUA PIN YANG DIGUNAKAN**

```
GPIO 4   →  Ultrasonik HEIGHT TRIG
GPIO 5   →  Ultrasonik LENGTH TRIG
GPIO 13  →  IR Lamp
GPIO 15  →  Ultrasonik LENGTH ECHO
GPIO 18  →  Ultrasonik HEIGHT ECHO
GPIO 19  →  Servo Motor
GPIO 21  →  LCD SDA (I2C)
GPIO 22  →  LCD SCL (I2C)
GPIO 23  →  Buzzer
GPIO 25  →  Metal Proximity Sensor ⭐
GPIO 26  →  Load Cell HX711 DT ⭐
GPIO 27  →  Load Cell HX711 SCK ⭐
```

---

## 📊 **TABEL CEPAT**

| GPIO | Komponen | Fungsi |
|------|----------|--------|
| 4 | Ultrasonik HEIGHT | TRIG |
| 5 | Ultrasonik LENGTH | TRIG |
| 13 | IR Lamp | Output |
| 15 | Ultrasonik LENGTH | ECHO |
| 18 | Ultrasonik HEIGHT | ECHO |
| 19 | Servo Motor | PWM |
| 21 | LCD | SDA |
| 22 | LCD | SCL |
| 23 | Buzzer | Output |
| **25** | **Metal Sensor** | **Input** |
| **26** | **Load Cell** | **DT** |
| **27** | **Load Cell** | **SCK** |

---

## 🔋 **POWER**

```
3.3V  →  Metal Sensor, HX711
5V    →  Ultrasonik (x2), Servo, LCD
GND   →  Semua komponen (common ground)
```

---

## 📝 **KODE**

```cpp
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 15
#define PIN_SERVO 19
#define PIN_BUZZER 23
#define PIN_IR_LAMP 13
#define PIN_METAL_SENSOR 25
#define PIN_LOADCELL_DOUT 26
#define PIN_LOADCELL_SCK 27
#define PIN_SDA 21
#define PIN_SCL 22
```

---

## ✅ **CHECKLIST**

```
[ ] GPIO 4, 18  → Ultrasonik HEIGHT
[ ] GPIO 5, 15  → Ultrasonik LENGTH
[ ] GPIO 19     → Servo
[ ] GPIO 23     → Buzzer
[ ] GPIO 13     → IR Lamp
[ ] GPIO 21, 22 → LCD I2C
[ ] GPIO 25     → Metal Sensor
[ ] GPIO 26, 27 → Load Cell HX711
[ ] 3.3V, 5V, GND → Power
```

---

**📌 Print & tempel di meja!**
