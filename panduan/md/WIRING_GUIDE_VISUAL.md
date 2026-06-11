# 🔌 Panduan Wiring IoT Bank Sampah - MUDAH DIPAHAMI!

## 📋 **Daftar Komponen Yang Dibutuhkan**

✅ 1x ESP32 DevKit v1 (30 pin)  
✅ 2x Sensor Ultrasonik HC-SR04 (5V)  
✅ 1x Servo Motor SG90 (5V)  
✅ 1x Buzzer Aktif 5V  
✅ 1x LCD I2C 16x2 (5V)  
✅ 1x Sensor Metal Proximity (3.3V atau 5V)  
✅ 1x Lampu IR LED (5V, opsional)  
✅ 4x Resistor 1kΩ (untuk voltage divider)  
✅ 4x Resistor 2kΩ (untuk voltage divider)  
✅ 1x Breadboard besar  
✅ 1x Power Supply 5V 3A (untuk servo)  
✅ Kabel jumper secukupnya  

---

## 🎯 **Pin Yang Digunakan (Dari Kode main.cpp)**

```cpp
// Sensor Ultrasonik HEIGHT (Diameter)
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18

// Sensor Ultrasonik LENGTH (Panjang)
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 12

// Actuators
#define PIN_SERVO 19
#define PIN_BUZZER 23
#define PIN_IR_LAMP 13

// Sensor Metal
#define PIN_METAL_SENSOR 25

// LCD I2C
// SDA = GPIO 21 (default)
// SCL = GPIO 22 (default)
```

---

## 🔴 **LANGKAH 1: Sambungkan Power Rails di Breadboard**

```
Breadboard Rail:
=================
[ + + + + + + + ] ← Power Rail (+) → Sambung ke VIN ESP32 (5V dari USB)
[ - - - - - - - ] ← Ground Rail (-) → Sambung ke GND ESP32

⚠️ PENTING: 
- VIN ESP32 = 5V (dapat dari USB)
- 3V3 ESP32 = 3.3V (hanya untuk sensor metal)
- Semua GND harus tersambung!
```

---

## 🟢 **LANGKAH 2: Sensor Ultrasonik HC-SR04 (HEIGHT) - Sensor 1**

**Fungsi:** Mengukur DIAMETER botol (botol horizontal/tidur)

```
HC-SR04 #1 (HEIGHT)          ESP32
===================          =====
VCC (merah)     ────────→    VIN (5V) atau Power Rail (+)
GND (hitam)     ────────→    GND atau Ground Rail (-)
TRIG (kuning)   ────────→    GPIO 4 (langsung, aman!)
ECHO (hijau)    ────[R]──→    GPIO 18 (pakai voltage divider!)

[R] = Voltage Divider Circuit:

     ECHO Pin (5V output)
            │
        [1kΩ resistor]
            │
            ├─────────→ GPIO 18 ESP32 (3.3V ✅)
            │
        [2kΩ resistor]
            │
           GND

⚠️ WAJIB pakai voltage divider di ECHO pin!
   Tanpa ini, ESP32 bisa rusak karena 5V!
```

### **Penjelasan Voltage Divider:**
- HC-SR04 output ECHO = **5V** (terlalu tinggi untuk ESP32!)
- ESP32 GPIO maksimal = **3.3V**
- Voltage divider: 5V × (2kΩ / 3kΩ) = **3.33V** ✅ Aman!

---

## 🟢 **LANGKAH 3: Sensor Ultrasonik HC-SR04 (LENGTH) - Sensor 2**

**Fungsi:** Mengukur PANJANG botol (botol horizontal/tidur)

```
HC-SR04 #2 (LENGTH)          ESP32
===================          =====
VCC (merah)     ────────→    VIN (5V) atau Power Rail (+)
GND (hitam)     ────────→    GND atau Ground Rail (-)
TRIG (kuning)   ────────→    GPIO 5 (langsung, aman!)
ECHO (hijau)    ────[R]──→    GPIO 12 (pakai voltage divider!)

[R] = Voltage Divider Circuit (sama seperti sensor 1):

     ECHO Pin (5V output)
            │
        [1kΩ resistor]
            │
            ├─────────→ GPIO 12 ESP32 (3.3V ✅)
            │
        [2kΩ resistor]
            │
           GND
```

---

## 🟠 **LANGKAH 4: Servo Motor SG90**

**Fungsi:** Membuka/menutup pintu gerbang botol

```
Servo SG90                   ESP32 + External PSU
==========                   =====================
Signal (kuning/putih) ──→    GPIO 19 ESP32
VCC (merah)           ──→    5V External Power Supply (+)
GND (coklat/hitam)    ──→    GND (sambung dengan GND ESP32!)

⚠️ PENTING: 
- Servo butuh arus 1-2A, JANGAN ambil dari ESP32!
- Gunakan power supply eksternal 5V 2A
- GND power supply HARUS tersambung dengan GND ESP32!

Diagram:
========
External PSU 5V 2A
    (+) ────────→ Servo VCC (merah)
    (-) ────┬───→ Servo GND (coklat)
            │
            └───→ GND ESP32 (WAJIB!)

ESP32
    GPIO 19 ────→ Servo Signal (kuning)
```

---

## 🔵 **LANGKAH 5: Buzzer Aktif 5V**

**Fungsi:** Notifikasi suara (1x beep = OK, 2x = reject, 3x cepat = metal)

```
Buzzer                       ESP32
======                       =====
(+) atau VCC    ────────→    GPIO 23
(-) atau GND    ────────→    GND

⚠️ OPSIONAL: Jika buzzer terlalu keras, tambah resistor 100Ω
   di kaki (+):

   GPIO 23 ──[100Ω]── Buzzer (+) ── Buzzer (-) ── GND
```

---

## 🟣 **LANGKAH 6: LCD I2C 16x2**

**Fungsi:** Display informasi (nama user, poin, ukuran botol)

```
LCD I2C Module               ESP32
==============               =====
VCC     ────────────────→    VIN (5V) atau Power Rail (+)
GND     ────────────────→    GND atau Ground Rail (-)
SDA     ────────────────→    GPIO 21 (default I2C SDA)
SCL     ────────────────→    GPIO 22 (default I2C SCL)

✅ Module I2C sudah ada level shifter built-in
   Aman langsung 5V, tidak butuh voltage divider!

📌 I2C Address biasanya: 0x27 atau 0x3F
   Kode akan auto-detect address saat startup.

🔧 Adjust contrast LCD dengan potentiometer di belakang module
   (putar searah/berlawanan jarum jam sampai text terlihat jelas)
```

---

## 🟤 **LANGKAH 7: Sensor Metal Proximity (Inductive Sensor)**

**Fungsi:** Mendeteksi botol logam/kaleng (ditolak otomatis)

### **Opsi A: Sensor 3.3V (Recommended)**
```
Metal Sensor                 ESP32
============                 =====
VCC (coklat/merah)  ────→    3V3 (3.3V)
GND (biru/hitam)    ────→    GND
Signal (hitam)      ────→    GPIO 25 (langsung, aman!)

✅ Tidak butuh voltage divider
```

### **Opsi B: Sensor 5V**
```
Metal Sensor                 ESP32
============                 =====
VCC (coklat/merah)  ────→    VIN (5V)
GND (biru/hitam)    ────→    GND
Signal (hitam)      ─[R]─→    GPIO 25 (pakai voltage divider!)

[R] = Voltage Divider (sama seperti sensor ultrasonik)
```

**Mode Pull-up:**
```cpp
pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);
// Logic: LOW = metal detected, HIGH = no metal
```

---

## 🟡 **LANGKAH 8: Lampu IR LED (Opsional)**

**Fungsi:** Penerangan untuk sensor (jika ruangan gelap)

```
IR LED                       ESP32
======                       =====
Anode (+) panjang   ────[R]──→ GPIO 13
Cathode (-) pendek  ─────────→ GND

[R] = Resistor 220Ω atau 330Ω (current limiting)

⚠️ Jika arus IR LED besar (>40mA), gunakan transistor:

         ESP32                Transistor NPN (BC547)
         GPIO 13 ──[1kΩ]── Base
                             │
                          Emitter ── GND
                             │
                         Collector ── IR LED (-) ── [220Ω] ── 5V
```

---

## 🎨 **DIAGRAM LENGKAP - Overview**

```
                        ESP32 DevKit v1 (30 pin)
    ┌───────────────────────────────────────────────────────┐
    │                                                         │
    │  3V3 ────→ Metal Sensor VCC (jika 3.3V sensor)         │
    │  GND ────→ Ground Rail (-) di breadboard               │
    │  VIN ────→ Power Rail (+) di breadboard (5V)           │
    │                                                         │
    │  GPIO 4  ────→ Sensor HEIGHT TRIG (langsung)           │
    │  GPIO 18 ─[VD]→ Sensor HEIGHT ECHO (voltage divider)   │
    │  GPIO 5  ────→ Sensor LENGTH TRIG (langsung)           │
    │  GPIO 12 ─[VD]→ Sensor LENGTH ECHO (voltage divider)   │
    │                                                         │
    │  GPIO 19 ────→ Servo Signal                            │
    │  GPIO 23 ────→ Buzzer (+)                              │
    │  GPIO 13 ────→ IR LED Anode                            │
    │  GPIO 25 ────→ Metal Sensor Signal                     │
    │                                                         │
    │  GPIO 21 ────→ LCD SDA (I2C)                           │
    │  GPIO 22 ────→ LCD SCL (I2C)                           │
    │                                                         │
    └───────────────────────────────────────────────────────┘

[VD] = Voltage Divider (1kΩ + 2kΩ resistor)

Power Supply:
=============
USB 5V → ESP32 VIN → Power Rail (+) → Semua sensor 5V
External PSU 5V 2A → Servo VCC (GND terhubung dengan ESP32 GND!)
```

---

## ✅ **Checklist Sebelum Nyalakan ESP32**

### **Power:**
- [ ] Power Rail (+) tersambung dengan VIN ESP32
- [ ] Ground Rail (-) tersambung dengan GND ESP32
- [ ] Semua GND komponen tersambung (common ground!)
- [ ] External PSU servo GND tersambung dengan GND ESP32

### **Sensor Ultrasonik:**
- [ ] TRIG pins langsung ke GPIO (tidak pakai voltage divider)
- [ ] ECHO pins pakai voltage divider (1kΩ + 2kΩ)
- [ ] Sensor HEIGHT: TRIG=GPIO4, ECHO=GPIO18
- [ ] Sensor LENGTH: TRIG=GPIO5, ECHO=GPIO12

### **Actuators:**
- [ ] Servo signal ke GPIO 19
- [ ] Servo VCC ke external PSU 5V (BUKAN dari ESP32!)
- [ ] Buzzer ke GPIO 23
- [ ] IR LED ke GPIO 13 (pakai resistor current limiting)

### **Sensor Metal:**
- [ ] VCC ke 3V3 (jika sensor 3.3V) atau VIN (jika sensor 5V)
- [ ] Signal ke GPIO 25 (pakai voltage divider jika sensor 5V)
- [ ] Mode: INPUT_PULLUP

### **LCD I2C:**
- [ ] VCC ke VIN (5V)
- [ ] SDA ke GPIO 21
- [ ] SCL ke GPIO 22
- [ ] Contrast potentiometer sudah di-adjust

---

## 🧪 **Testing Setelah Wiring**

Upload kode ke ESP32, buka Serial Monitor (115200 baud), lalu test:

### **1. Test I2C Scan (untuk LCD)**
Ketik command: `SCAN`

Output yang benar:
```
[I2C] Device found at 0x27  ✅
```

Jika tidak ada device:
- ❌ Cek kabel SDA/SCL
- ❌ Cek VCC 5V dan GND LCD
- ❌ Adjust potentiometer LCD

---

### **2. Test LCD Display**
Ketik command: `LCD`

LCD akan menampilkan:
```
Line 0: LCD TEST 1234
Line 1: ABCDEFGHIJKLMNOP
```

Jika LCD blank:
- ❌ Adjust potentiometer (putar perlahan)
- ❌ Cek I2C address (0x27 atau 0x3F?)

---

### **3. Test Semua Sensor**
Ketik command: `TEST`

Output yang benar:
```
[Test] HEIGHT (stable): 15 cm     ← Jarak objek di depan sensor
[Test] LENGTH (stable): 20 cm     ← Jarak objek di depan sensor
[Test] METAL: NOT DETECTED        ← Tidak ada logam
[Test] METAL: DETECTED            ← Ada logam (dekatkan ke sensor)
```

Jika sensor timeout:
- ❌ Cek voltage divider di ECHO pin (WAJIB!)
- ❌ Cek kabel TRIG/ECHO
- ❌ Coba ganti pin ECHO ke pin lain

---

### **4. Test Servo**
Servo akan otomatis tutup (0°) saat startup.

Ketika ada botol valid:
- ✅ Servo buka 90°
- ✅ Buzzer beep 1x
- ✅ LCD: "BOTOL KECIL/SEDANG/BESAR"

---

### **5. Test Buzzer**
- ✅ Botol accepted: 1x beep
- ✅ Botol rejected (ukuran salah): 2x beep
- ✅ Metal detected: 3x beep cepat (150ms interval)

---

### **6. Test Metal Sensor**
Dekatkan objek logam (koin, sendok, kaleng) ke sensor:

Output:
```
[Metal] ⚠️ LOGAM TERDETEKSI - REJECT
```

LCD:
```
Line 0: BOTOL CACAT
Line 1: ADA LOGAM
```

Buzzer: 3x beep cepat ⚠️

---

## 🔥 **Troubleshooting**

### **Problem 1: Sensor Ultrasonik Timeout**
❌ **Penyebab:** ECHO pin tidak ada voltage divider

✅ **Solusi:**
```
ECHO pin ─┬─[1kΩ]─ GPIO ESP32
          │
          └─[2kΩ]─ GND
```

---

### **Problem 2: Servo Tidak Bergerak**
❌ **Penyebab:** Power tidak cukup

✅ **Solusi:**
- Gunakan external PSU 5V 2A
- JANGAN ambil dari VIN ESP32 (max 500mA)
- GND PSU HARUS tersambung dengan GND ESP32

---

### **Problem 3: LCD Blank/Tidak Terdeteksi**
❌ **Penyebab:** I2C address salah atau contrast kurang

✅ **Solusi:**
1. Jalankan command `SCAN` untuk cek address
2. Adjust potentiometer di belakang LCD (putar perlahan)
3. Cek kabel SDA/SCL (GPIO 21/22)

---

### **Problem 4: Metal Sensor Selalu Triggered**
❌ **Penyebab:** Mode pull-up salah atau ada logam di dekat sensor

✅ **Solusi:**
1. Pastikan mode: `INPUT_PULLUP`
2. Jauhkan sensor dari benda logam (min 5cm)
3. Cek voltase sensor (3.3V atau 5V?)

---

### **Problem 5: ESP32 Restart Terus**
❌ **Penyebab:** Arus tidak cukup atau short circuit

✅ **Solusi:**
1. Cek semua koneksi (jangan ada short VCC-GND!)
2. Gunakan USB charger 5V 2A (bukan USB laptop)
3. Lepas servo dulu, test tanpa servo
4. Cek voltage divider tidak short

---

## 📸 **Foto Referensi (Tips)**

### **Voltage Divider di Breadboard:**
```
     ECHO pin (kabel hijau dari HC-SR04)
            │
            │ ← Insert ke lubang breadboard
         [1kΩ] ← Resistor 1
            │
      ──────┼────── ← Ambil dari sini ke GPIO ESP32
            │
         [2kΩ] ← Resistor 2
            │
           GND ← Ke ground rail
```

### **Urutan Wiring (Recommended):**
1. ✅ Setup power rails dulu (VCC 5V dan GND)
2. ✅ Pasang LCD I2C (paling mudah)
3. ✅ Pasang buzzer (test dengan beep)
4. ✅ Pasang sensor ultrasonik (1 dulu, test, baru pasang ke-2)
5. ✅ Pasang sensor metal
6. ✅ Pasang servo (TERAKHIR, butuh external power)

---

## 🎓 **Kesimpulan**

### **Voltage Summary:**
- **5V (VIN ESP32):** Sensor ultrasonik, LCD I2C, buzzer, IR LED
- **3.3V (3V3 ESP32):** Sensor metal (jika sensor 3.3V)
- **External 5V 2A:** Servo motor (WAJIB!)

### **Voltage Divider (WAJIB!):**
- ✅ ECHO pin sensor ultrasonik #1 (GPIO 18)
- ✅ ECHO pin sensor ultrasonik #2 (GPIO 12)
- ✅ Signal sensor metal (jika sensor 5V)

### **Langsung Aman:**
- ✅ TRIG pin sensor ultrasonik (output dari ESP32)
- ✅ SDA/SCL LCD I2C (module ada level shifter)
- ✅ Servo signal (toleran 3.3V)

---

**🎉 Selamat! Wiring selesai! Upload kode dan mulai test dengan command `TEST`, `LCD`, `SCAN`**

📌 **Simpan panduan ini untuk referensi!**
