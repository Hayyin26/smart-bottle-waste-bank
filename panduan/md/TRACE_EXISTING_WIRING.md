# 🔍 Panduan Trace Wiring IoT Yang Sudah Terpasang

## 🎯 **Cara Cek Wiring Tanpa Bongkar**

Anda bilang sebelumnya aman semua, berarti wiring sudah benar! Ini cara trace balik tanpa bongkar:

---

## 📍 **Step 1: Identifikasi Pin ESP32 DevKit v1**

ESP32 DevKit v1 punya 30 pin (2 baris, masing-masing 15 pin).

### **Baris KIRI (dari atas ke bawah):**
```
Pin 1  → 3V3     (Power 3.3V OUTPUT)
Pin 2  → GND     (Ground)
Pin 3  → GPIO 15
Pin 4  → GPIO 2
Pin 5  → GPIO 4  ← SENSOR HEIGHT TRIG 🟢
Pin 6  → GPIO 16
Pin 7  → GPIO 17
Pin 8  → GPIO 5  ← SENSOR LENGTH TRIG 🟢
Pin 9  → GPIO 18 ← SENSOR HEIGHT ECHO 🔴 (pakai voltage divider!)
Pin 10 → GPIO 19 ← SERVO SIGNAL 🟡
Pin 11 → GPIO 21 ← LCD SDA 🔵
Pin 12 → GPIO 22 ← LCD SCL 🔵
Pin 13 → GPIO 23 ← BUZZER 🟠
Pin 14 → GND     (Ground)
Pin 15 → (tidak ada pin)
```

### **Baris KANAN (dari atas ke bawah):**
```
Pin 1  → VIN     (Power 5V INPUT dari USB)
Pin 2  → GPIO 36
Pin 3  → GPIO 39
Pin 4  → GPIO 34
Pin 5  → GPIO 35
Pin 6  → GPIO 32
Pin 7  → GPIO 33
Pin 8  → GPIO 25 ← METAL SENSOR 🟤
Pin 9  → GPIO 26
Pin 10 → GPIO 27
Pin 11 → GPIO 14
Pin 12 → GPIO 12 ← SENSOR LENGTH ECHO 🔴 (pakai voltage divider!)
Pin 13 → GPIO 13 ← IR LED (opsional) 🟣
Pin 14 → GND     (Ground)
Pin 15 → (tidak ada pin)
```

---

## 🔌 **Step 2: Trace Pin POWER (VIN, 3V3, GND)**

### **1. Pin VIN (5V) - Baris KANAN paling atas**
**Lokasi:** Pojok kanan atas ESP32

**Cari kabel yang tersambung ke VIN:**
- 🔴 Biasanya kabel **MERAH** atau **ORANGE**
- Kemungkinan sambung ke:
  - Power rail (+) breadboard
  - Sensor ultrasonik VCC (2 buah)
  - LCD I2C VCC
  - Buzzer VCC (kadang langsung ke GPIO 23)

**Cara Cek:**
```
VIN ESP32 → Breadboard Power Rail (+) → Sensor-sensor 5V
```

---

### **2. Pin 3V3 (3.3V) - Baris KIRI paling atas**
**Lokasi:** Pojok kiri atas ESP32

**Cari kabel yang tersambung ke 3V3:**
- 🟢 Biasanya kabel **HIJAU MUDA** atau **PUTIH**
- Kemungkinan sambung ke:
  - **Sensor Metal VCC** (jika sensor 3.3V)

**Cara Cek:**
```
3V3 ESP32 → Metal Sensor VCC (kabel coklat atau merah sensor)
```

⚠️ **PENTING:** Jika metal sensor pakai 5V, maka VCC-nya sambung ke VIN, bukan 3V3!

---

### **3. Pin GND (Ground) - Ada 3 pin GND di ESP32**
**Lokasi:** 
- GND 1: Baris KIRI pin ke-2 dari atas
- GND 2: Baris KIRI pin ke-14 dari atas (paling bawah)
- GND 3: Baris KANAN pin ke-14 dari atas (paling bawah)

**Cari kabel yang tersambung ke GND:**
- ⚫ Biasanya kabel **HITAM** atau **COKLAT TUA**
- Kemungkinan sambung ke:
  - Ground rail (-) breadboard
  - Semua sensor GND
  - Buzzer GND
  - LCD I2C GND
  - Servo GND
  - Metal sensor GND

**Cara Cek:**
```
GND ESP32 → Breadboard Ground Rail (-) → Semua GND sensor
          → Servo GND (sambung juga ke GND PSU eksternal!)
```

---

## 🎯 **Step 3: Trace Pin OUTPUT (GPIO yang mengirim sinyal)**

### **GPIO 4 - Sensor HEIGHT TRIG**
**Lokasi:** Baris KIRI, pin ke-5 dari atas

**Cari kabel dari GPIO 4:**
- Warna: Bebas (tidak ada standar)
- Tujuan: Pin **TRIG** sensor ultrasonik pertama (HEIGHT)
- Sensor ini mengukur **diameter** botol

**Cara Cek:**
```
GPIO 4 → Sensor Ultrasonik #1 pin TRIG (biasanya 4 pin: VCC, TRIG, ECHO, GND)
```

---

### **GPIO 5 - Sensor LENGTH TRIG**
**Lokasi:** Baris KIRI, pin ke-8 dari atas

**Cari kabel dari GPIO 5:**
- Warna: Bebas
- Tujuan: Pin **TRIG** sensor ultrasonik kedua (LENGTH)
- Sensor ini mengukur **panjang** botol

**Cara Cek:**
```
GPIO 5 → Sensor Ultrasonik #2 pin TRIG
```

---

### **GPIO 19 - Servo Signal**
**Lokasi:** Baris KIRI, pin ke-10 dari atas

**Cari kabel dari GPIO 19:**
- Warna: Biasanya **KUNING** atau **PUTIH** (signal wire servo)
- Tujuan: Pin **Signal** servo motor (kabel kuning/putih)

**Cara Cek:**
```
GPIO 19 → Servo pin Signal (kabel kuning/putih/orange)

Servo motor punya 3 kabel:
- Merah/Orange → External PSU 5V (BUKAN dari ESP32!)
- Coklat/Hitam → GND (sambung ESP32 GND + PSU GND)
- Kuning/Putih → GPIO 19 (signal)
```

---

### **GPIO 21 - LCD SDA (I2C Data)**
**Lokasi:** Baris KIRI, pin ke-11 dari atas

**Cari kabel dari GPIO 21:**
- Warna: Bebas
- Tujuan: Pin **SDA** di LCD I2C module

**Cara Cek:**
```
GPIO 21 → LCD I2C pin SDA
```

---

### **GPIO 22 - LCD SCL (I2C Clock)**
**Lokasi:** Baris KIRI, pin ke-12 dari atas

**Cari kabel dari GPIO 22:**
- Warna: Bebas
- Tujuan: Pin **SCL** di LCD I2C module

**Cara Cek:**
```
GPIO 22 → LCD I2C pin SCL

LCD I2C punya 4 pin:
- VCC → VIN 5V
- GND → GND
- SDA → GPIO 21
- SCL → GPIO 22
```

---

### **GPIO 23 - Buzzer**
**Lokasi:** Baris KIRI, pin ke-13 dari atas

**Cari kabel dari GPIO 23:**
- Warna: Bebas
- Tujuan: Pin **(+)** buzzer aktif

**Cara Cek:**
```
GPIO 23 → Buzzer (+)
          Buzzer (-) → GND

Buzzer punya 2 pin:
- (+) panjang → GPIO 23
- (-) pendek → GND
```

---

### **GPIO 13 - IR LED (Opsional)**
**Lokasi:** Baris KANAN, pin ke-13 dari atas

**Cari kabel dari GPIO 13:**
- Warna: Bebas
- Tujuan: **Anode (+)** IR LED via resistor 220Ω

**Cara Cek:**
```
GPIO 13 → [Resistor 220Ω] → IR LED Anode (+)
                             IR LED Cathode (-) → GND
```

⚠️ Jika tidak ada IR LED, pin ini tidak dipakai (opsional).

---

## 🎯 **Step 4: Trace Pin INPUT (GPIO yang menerima sinyal)**

### **GPIO 18 - Sensor HEIGHT ECHO (⚠️ PAKAI VOLTAGE DIVIDER!)**
**Lokasi:** Baris KIRI, pin ke-9 dari atas

**Cari kabel dari GPIO 18:**
- ⚠️ **HARUS ada voltage divider** (2 resistor: 1kΩ + 2kΩ)
- Tujuan: Pin **ECHO** sensor ultrasonik pertama (HEIGHT)

**Cara Cek:**
```
Sensor HEIGHT pin ECHO → [Resistor 1kΩ] → GPIO 18
                                      ↓
                               [Resistor 2kΩ]
                                      ↓
                                    GND

⚠️ Jika tidak ada voltage divider, ESP32 bisa rusak!
   (karena ECHO output 5V, ESP32 max 3.3V)
```

**Visual:**
- Lihat di breadboard, dari pin ECHO sensor ada **2 resistor** sebelum ke GPIO 18
- Resistor pertama (1kΩ) antara ECHO dan GPIO 18
- Resistor kedua (2kΩ) dari GPIO 18 ke GND

---

### **GPIO 12 - Sensor LENGTH ECHO (⚠️ PAKAI VOLTAGE DIVIDER!)**
**Lokasi:** Baris KANAN, pin ke-12 dari atas

**Cari kabel dari GPIO 12:**
- ⚠️ **HARUS ada voltage divider** (2 resistor: 1kΩ + 2kΩ)
- Tujuan: Pin **ECHO** sensor ultrasonik kedua (LENGTH)

**Cara Cek:**
```
Sensor LENGTH pin ECHO → [Resistor 1kΩ] → GPIO 12
                                      ↓
                               [Resistor 2kΩ]
                                      ↓
                                    GND
```

---

### **GPIO 25 - Metal Sensor**
**Lokasi:** Baris KANAN, pin ke-8 dari atas

**Cari kabel dari GPIO 25:**
- Warna: Bebas
- Tujuan: Pin **Signal** sensor metal proximity (biasanya kabel hitam)

**Cara Cek:**
```
GPIO 25 → Metal Sensor pin Signal (hitam)

Metal Sensor 3-wire punya 3 kabel:
- Coklat/Merah → 3V3 (jika sensor 3.3V) atau VIN (jika sensor 5V)
- Biru/Hitam → GND
- Hitam → GPIO 25 (signal)

Mode: INPUT_PULLUP
Logic: LOW = metal detected, HIGH = no metal
```

---

## 📊 **Step 5: Tabel Lengkap - COPY PASTE INI!**

| Pin ESP32 | Fungsi | Sambung Ke | Kabel Warna | Catatan |
|-----------|--------|------------|-------------|---------|
| **VIN** | Power 5V | Power Rail (+) | 🔴 Merah | Dari USB 5V |
| **3V3** | Power 3.3V | Metal Sensor VCC | 🟢 Hijau Muda | Jika sensor 3.3V |
| **GND** | Ground | Ground Rail (-) | ⚫ Hitam | Common ground |
| | | | | |
| **GPIO 4** | Output | Sensor HEIGHT TRIG | Bebas | Langsung |
| **GPIO 5** | Output | Sensor LENGTH TRIG | Bebas | Langsung |
| **GPIO 18** | Input | Sensor HEIGHT ECHO | Bebas | ⚠️ Voltage Divider! |
| **GPIO 12** | Input | Sensor LENGTH ECHO | Bebas | ⚠️ Voltage Divider! |
| | | | | |
| **GPIO 19** | Output PWM | Servo Signal | 🟡 Kuning | Signal wire |
| **GPIO 21** | I2C SDA | LCD SDA | Bebas | Data |
| **GPIO 22** | I2C SCL | LCD SCL | Bebas | Clock |
| **GPIO 23** | Output | Buzzer (+) | Bebas | Aktif 5V |
| **GPIO 13** | Output | IR LED Anode | Bebas | Opsional |
| **GPIO 25** | Input | Metal Sensor Signal | Bebas | INPUT_PULLUP |

---

## 🔍 **Step 6: Cara Trace Setiap Komponen**

### **1. Sensor Ultrasonik HC-SR04 (2 buah)**
**Ciri-ciri:** 
- Bentuk kotak dengan 2 tabung bulat (transducer ultrasonik)
- Punya 4 pin: VCC, TRIG, ECHO, GND

**Sensor #1 (HEIGHT - Diameter):**
```
Pin VCC  → VIN (5V) atau Power Rail (+)
Pin GND  → GND atau Ground Rail (-)
Pin TRIG → GPIO 4 (langsung)
Pin ECHO → GPIO 18 (via voltage divider 1kΩ+2kΩ)
```

**Sensor #2 (LENGTH - Panjang):**
```
Pin VCC  → VIN (5V) atau Power Rail (+)
Pin GND  → GND atau Ground Rail (-)
Pin TRIG → GPIO 5 (langsung)
Pin ECHO → GPIO 12 (via voltage divider 1kΩ+2kΩ)
```

---

### **2. Servo Motor SG90**
**Ciri-ciri:**
- Motor kecil dengan 3 kabel keluar
- Punya lengan (horn) yang bisa berputar

**Wiring:**
```
Kabel Kuning/Putih/Orange (Signal) → GPIO 19
Kabel Merah (VCC)                  → External PSU 5V (bukan ESP32!)
Kabel Coklat/Hitam (GND)           → GND ESP32 + GND PSU (common!)
```

⚠️ **Cek:** Apakah ada power supply eksternal 5V terpisah untuk servo?

---

### **3. LCD I2C 16x2**
**Ciri-ciri:**
- LCD biru/hijau dengan 16 kolom x 2 baris
- Ada module I2C kecil di belakang (PCB hijau)
- Punya 4 pin: VCC, GND, SDA, SCL

**Wiring:**
```
Pin VCC → VIN (5V) atau Power Rail (+)
Pin GND → GND atau Ground Rail (-)
Pin SDA → GPIO 21
Pin SCL → GPIO 22
```

**Cek potentiometer:** Di belakang module I2C ada potentiometer kecil (baut biru) untuk adjust contrast.

---

### **4. Buzzer Aktif**
**Ciri-ciri:**
- Komponen bulat kecil dengan 2 pin
- Ada sticker di atas (biasanya tulisan frequency)

**Wiring:**
```
Pin (+) panjang  → GPIO 23
Pin (-) pendek   → GND
```

**Cara tahu (+) dan (-):**
- Pin lebih panjang = (+)
- Pin lebih pendek = (-)
- Atau lihat sticker di bawah (ada tanda + dan -)

---

### **5. Sensor Metal Proximity**
**Ciri-ciri:**
- Sensor silinder/kotak dengan 3 kabel keluar
- Biasanya warna: Coklat, Biru, Hitam

**Wiring (standar sensor NPN 3-wire):**
```
Kabel Coklat/Merah → 3V3 (jika sensor 3.3V) atau VIN (jika 5V)
Kabel Biru/Hitam   → GND
Kabel Hitam        → GPIO 25 (signal)
```

**Cara cek voltase sensor:**
- Lihat datasheet atau label di sensor
- Jika ada tulisan "DC 6-36V" → sensor 5V
- Jika ada tulisan "DC 3.3V" → sensor 3.3V

---

### **6. IR LED (Opsional)**
**Ciri-ciri:**
- LED kecil (biasanya warna ungu gelap/hitam)
- Punya 2 kaki

**Wiring:**
```
Kaki panjang (Anode +)  → Resistor 220Ω → GPIO 13
Kaki pendek (Cathode -) → GND
```

⚠️ Jika tidak ada, berarti tidak dipakai (opsional).

---

## ✅ **Step 7: Checklist Akhir**

Print checklist ini dan cek satu per satu:

### **Power:**
- [ ] VIN tersambung ke Power Rail (+)
- [ ] 3V3 tersambung ke Metal Sensor VCC (jika sensor 3.3V)
- [ ] GND tersambung ke Ground Rail (-)
- [ ] Semua GND komponen terhubung (common ground)
- [ ] Servo VCC ke External PSU 5V (bukan dari ESP32!)
- [ ] Servo GND + ESP32 GND + PSU GND terhubung (common!)

### **Sensor Ultrasonik:**
- [ ] Sensor HEIGHT: TRIG=GPIO4, ECHO=GPIO18+VD
- [ ] Sensor LENGTH: TRIG=GPIO5, ECHO=GPIO12+VD
- [ ] **Voltage Divider ada di ECHO pin (WAJIB!)**

### **Actuators:**
- [ ] Servo Signal → GPIO 19
- [ ] Buzzer (+) → GPIO 23
- [ ] IR LED (jika ada) → GPIO 13

### **LCD I2C:**
- [ ] SDA → GPIO 21
- [ ] SCL → GPIO 22
- [ ] VCC → 5V
- [ ] GND → GND

### **Sensor Metal:**
- [ ] Signal → GPIO 25
- [ ] VCC → 3V3 atau VIN (sesuai sensor)
- [ ] GND → GND

---

## 📸 **Step 8: Foto Dokumentasi (Untuk Backup)**

Ambil foto dari berbagai sudut:

1. **Foto seluruh breadboard** (bird's eye view)
2. **Foto ESP32 dari atas** (lihat semua kabel yang tertancap)
3. **Foto setiap sensor** (close-up connection)
4. **Foto voltage divider** (resistor di breadboard)
5. **Foto servo connection** (3 kabelnya)
6. **Foto LCD I2C** (4 pin connection)

Simpan foto-foto ini untuk referensi nanti!

---

## 🧪 **Step 9: Verifikasi dengan Serial Monitor**

Upload kode ke ESP32, buka Serial Monitor (115200 baud), ketik:

### **Command: `TEST`**
Output:
```
[Test] HEIGHT (stable): 15 cm
[Test] LENGTH (stable): 20 cm
[Test] METAL: NOT DETECTED
```

✅ Jika output seperti ini, **wiring Anda 100% BENAR!**

---

### **Command: `SCAN`**
Output:
```
[I2C] Device found at 0x27
```

✅ LCD I2C terdeteksi dengan benar!

---

### **Command: `LCD`**
LCD menampilkan:
```
Line 0: LCD TEST 1234
Line 1: ABCDEFGHIJKLMNOP
```

✅ LCD I2C berfungsi dengan benar!

---

## 🎉 **Selesai!**

Sekarang Anda tahu pinout lengkap tanpa harus bongkar! 

**File referensi:**
- 📄 `TRACE_EXISTING_WIRING.md` ← **File ini (reverse engineering)**
- 📄 `WIRING_TABLE_SIMPLE.md` ← **Tabel wiring baru (jika bongkar)**
- 📄 `WIRING_GUIDE_VISUAL.md` ← **Panduan detail lengkap**

**Tips:** Print halaman ini dan tandai setiap kabel dengan label stiker!

Good luck! 🚀
