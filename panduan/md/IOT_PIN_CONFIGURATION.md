# 📌 Konfigurasi Pin IoT ESP32 - Bank Sampah Digital

## ⚡ **PENTING: Voltase Komponen (3.3V vs 5V)**

### **🔴 Komponen 5V (Menggunakan VIN atau 5V pin)**
1. **Sensor Ultrasonik HC-SR04** (2 buah) - VCC ke **5V**
2. **Servo Motor SG90** - VCC ke **5V** (external power source recommended)
3. **LCD I2C 16x2** - VCC ke **5V**
4. **Buzzer Aktif** - VCC ke **5V**

### **� Komponen 3.3V (Menggunakan 3V3 pin)**
1. **Sensor Metal Proximity** - VCC ke **3.3V** (tergantung sensor, cek datasheet)

### **⚠️ Catatan Voltase:**
- ESP32 GPIO **hanya toleran 3.3V**
- Sensor 5V yang output HIGH ke GPIO bisa merusak ESP32
- Gunakan **level shifter** atau **voltage divider** jika sensor output 5V
- Untuk HC-SR04: TRIG (output ESP32) aman, ECHO (input ESP32) gunakan voltage divider 5V→3.3V

---

## �🔌 **Daftar Pin yang Digunakan**

### **1. Sensor Ultrasonik (2 buah) - 5V**

#### **Sensor HEIGHT (Mengukur Diameter Botol)**
- **VCC**: **5V** (dari VIN ESP32)
- **GND**: GND
- **TRIG Pin**: GPIO **4**
- **ECHO Pin**: GPIO **18** (⚠️ gunakan voltage divider 5V→3.3V)
- **Fungsi**: Mengukur diameter botol (botol horizontal)

#### **Sensor LENGTH (Mengukur Panjang Botol)**
- **VCC**: **5V** (dari VIN ESP32)
- **GND**: GND
- **TRIG Pin**: GPIO **5**
- **ECHO Pin**: GPIO **12** (⚠️ gunakan voltage divider 5V→3.3V)
- **Fungsi**: Mengukur panjang botol (botol horizontal)

---

### **2. Sensor Metal Proximity (Inductive Sensor) - 3.3V atau 5V**
- **VCC**: **3.3V** atau **5V** (cek datasheet sensor)
- **GND**: GND
- **Signal Pin**: GPIO **25**
- **Fungsi**: Mendeteksi botol logam/kaleng (ditolak)
- **Logika**: LOW = Metal terdeteksi, HIGH = Tidak ada metal
- **Tipe**: Digital input dengan pull-up resistor (`INPUT_PULLUP`)

---

### **3. Servo Motor (Pintu Gerbang) - 5V**
- **VCC**: **5V** (external power source 5V 2A recommended)
- **GND**: GND (sambung dengan GND ESP32)
- **Servo Pin**: GPIO **19**
- **Sudut Buka**: 90°
- **Sudut Tutup**: 0°
- **PWM**: Timer 0, 50Hz

---

### **4. Buzzer (Notifikasi Suara) - 5V**
- **VCC**: **5V** (dari VIN ESP32)
- **GND**: GND
- **Buzzer Pin**: GPIO **23**
- **Fungsi**: 
  - 1x beep = Botol diterima
  - 2x beep = Ukuran salah
  - 3x beep cepat = Botol logam terdeteksi

---

### **5. Lampu IR (Infrared Lamp) - 5V**
- **VCC**: **5V** (dari VIN ESP32)
- **GND**: GND
- **IR Lamp Pin**: GPIO **13**
- **Fungsi**: Penerangan untuk sensor (opsional)

---

### **6. LCD I2C (Display 16x2) - 5V**
- **VCC**: **5V** (dari VIN ESP32)
- **GND**: GND
- **SDA Pin**: GPIO **21** (default I2C)
- **SCL Pin**: GPIO **22** (default I2C)
- **I2C Address**: 0x27 atau 0x3F (auto-detect)

---

### **7. WiFi & Network**
- **WiFi SSID**: "Kost Premium"
- **HTTP Server Port**: 80
- **IP Mode**: DHCP (Dynamic IP dari router)
- **Device ID**: ESP32-BOTOL-01

---

## 📊 **Tabel Ringkasan Pin**

| Komponen | Pin GPIO | Voltase | Tipe | Fungsi |
|----------|----------|---------|------|--------|
| Sensor HEIGHT TRIG | 4 | 5V | Output | Trigger sensor diameter |
| Sensor HEIGHT ECHO | 18 | 5V→3.3V* | Input | Echo sensor diameter |
| Sensor LENGTH TRIG | 5 | 5V | Output | Trigger sensor panjang |
| Sensor LENGTH ECHO | 12 | 5V→3.3V* | Input | Echo sensor panjang |
| Servo Motor | 19 | 5V** | PWM | Kontrol pintu gerbang |
| Buzzer | 23 | 5V | Output | Notifikasi suara |
| IR Lamp | 13 | 5V | Output | Lampu infrared |
| **Metal Sensor** | **25** | **3.3V** | **Input** | **Deteksi botol logam** |
| LCD SDA | 21 | 5V | I2C | Data I2C |
| LCD SCL | 22 | 5V | I2C | Clock I2C |

**Keterangan:**
- \* = Butuh voltage divider (resistor 1kΩ + 2kΩ) untuk konversi 5V→3.3V
- \** = Gunakan power supply eksternal 5V 2A untuk servo

---

## 🎯 **Klasifikasi Botol (2 Parameter) - TANPA LOAD CELL**

### **Botol KECIL (330ml)**
- **Diameter (HEIGHT)**: 5-11 cm
- **Panjang (LENGTH)**: 8-13 cm
- **Poin**: 5

### **Botol SEDANG (600ml)**
- **Diameter (HEIGHT)**: 12-16 cm
- **Panjang (LENGTH)**: 15-20 cm
- **Poin**: 10

### **Botol BESAR (1.5L)**
- **Diameter (HEIGHT)**: 18-22 cm
- **Panjang (LENGTH)**: 21-30 cm
- **Poin**: 15

---

## ⚠️ **Catatan Penting**

### **1. Sensor Ultrasonik HC-SR04 (5V)**
- Botol diletakkan **HORIZONTAL** (tidur), bukan vertikal
- Jarak deteksi: 2-350 cm
- Sampling: 5 kali pembacaan (median)
- ⚠️ **ECHO pin output 5V** → gunakan voltage divider untuk protect ESP32 GPIO:
  ```
  ECHO pin → Resistor 1kΩ → GPIO ESP32
                          ↓
                   Resistor 2kΩ → GND
  ```
  Formula: Vout = 5V × (2kΩ / (1kΩ + 2kΩ)) = 3.33V ✅

### **2. Sensor Metal Proximity**
- Jarak deteksi: 2-10mm (tergantung sensor)
- Hanya mendeteksi logam (besi, aluminium, dll)
- Tidak mendeteksi plastik atau kaca
- Gunakan `INPUT_PULLUP` mode
- **Buzzer berbunyi 3x beep cepat** ketika logam terdeteksi

### **3. Servo Motor (5V)**
- Menggunakan PWM timer 0 dengan frekuensi 50Hz
- Pulse width: 500-2400 microseconds
- **Wajib gunakan power supply eksternal 5V 2A** untuk servo yang kuat
- Jangan langsung dari pin 5V ESP32 (max 500mA)

### **4. LCD I2C (5V)**
- Auto-detect address antara 0x27 dan 0x3F
- Jika tidak terdeteksi, cek koneksi SDA/SCL
- Module I2C sudah ada level shifter built-in (aman untuk ESP32)

### **5. WiFi**
- Menggunakan DHCP (IP otomatis dari router)
- Auto-register IP ke cloud server setiap 5 menit
- Pastikan WiFi 2.4GHz (ESP32 tidak support 5GHz)

---

## 🔧 **Library yang Dibutuhkan**

Tambahkan di `platformio.ini`:

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps = 
    Wire
    marcoschwartz/LiquidCrystal_I2C@^1.1.4
    madhephaestus/ESP32Servo@^0.13.0
    bblanchon/ArduinoJson@^6.21.3
```

---

## 🛠️ **Wiring Diagram**

### **Sensor Ultrasonik HC-SR04 (5V)**

#### **HEIGHT Sensor:**
```
VCC  → 5V (VIN ESP32)
GND  → GND
TRIG → GPIO 4
ECHO → Voltage Divider → GPIO 18

Voltage Divider:
ECHO ──[1kΩ]── GPIO 18
              |
            [2kΩ]
              |
             GND
```

#### **LENGTH Sensor:**
```
VCC  → 5V (VIN ESP32)
GND  → GND
TRIG → GPIO 5
ECHO → Voltage Divider → GPIO 12

Voltage Divider:
ECHO ──[1kΩ]── GPIO 12
              |
            [2kΩ]
              |
             GND
```

---

### **Metal Proximity Sensor (3.3V)**
```
Sensor Brown  → 3.3V ESP32
Sensor Blue   → GND
Sensor Black  → GPIO 25 (Signal)
```

Atau jika sensor 5V:
```
Sensor Brown  → 5V (VIN ESP32)
Sensor Blue   → GND
Sensor Black  → Voltage Divider → GPIO 25
```

---

### **Servo Motor (5V - External Power)**
```
Servo Orange/Yellow → GPIO 19 (Signal)
Servo Red           → 5V (External PSU 2A)
Servo Brown/Black   → GND (Common dengan ESP32 GND)
```

**⚠️ WAJIB external power supply 5V 2A untuk servo!**

---

### **Buzzer Aktif (5V)**
```
Buzzer (+) → GPIO 23
Buzzer (-) → GND

Optional: Tambah resistor 100Ω jika buzzer terlalu keras
```

---

### **LCD I2C 16x2 (5V)**
```
VCC → 5V (VIN ESP32)
GND → GND
SDA → GPIO 21
SCL → GPIO 22
```

---

### **Lampu IR (5V)**
```
IR (+) → GPIO 13
IR (-) → GND

Optional: Gunakan transistor NPN (BC547) jika IR butuh arus besar
```

---

## 🚀 **Testing & Troubleshooting**

### **Test Metal Sensor**
Gunakan serial command: `TEST`

```cpp
// Output di Serial Monitor:
[Test] METAL: DETECTED    // Ada logam
[Test] METAL: NOT DETECTED // Tidak ada logam
```

### **Test Ultrasonik**
Gunakan serial command: `TEST`

```cpp
// Output di Serial Monitor:
[Test] HEIGHT (stable): 12 cm
[Test] LENGTH (stable): 18 cm
```

### **Test LCD**
Gunakan serial command: `LCD`

```cpp
// LCD akan menampilkan:
Line 0: LCD TEST 1234
Line 1: ABCDEFGHIJKLMNOP
```

### **Test I2C Scan**
Gunakan serial command: `SCAN`

```cpp
// Output di Serial Monitor:
[I2C] Device found at 0x27  // LCD address
```

---

## 🐛 **Common Issues & Fixes**

### **Problem: Sensor Ultrasonik Timeout**
**Penyebab:** ECHO pin tidak dapat mengirim sinyal ke ESP32
**Solusi:**
1. ✅ Pastikan voltage divider terpasang di ECHO pin
2. ✅ Cek koneksi kabel (VCC, GND, TRIG, ECHO)
3. ✅ Ganti pin ECHO ke pin lain (misal GPIO 12 untuk LENGTH)

### **Problem: LCD Tidak Terdeteksi**
**Penyebab:** I2C address salah atau koneksi longgar
**Solusi:**
1. ✅ Jalankan command `SCAN` untuk cek I2C address
2. ✅ Pastikan SDA=GPIO21, SCL=GPIO22
3. ✅ Coba adjust potentiometer di LCD (contrast)
4. ✅ Cek VCC 5V dan GND terhubung

### **Problem: Servo Tidak Bergerak**
**Penyebab:** Power supply tidak cukup
**Solusi:**
1. ✅ Gunakan power supply eksternal 5V 2A
2. ✅ Sambung GND power supply dengan GND ESP32
3. ✅ Pastikan signal wire ke GPIO 19

### **Problem: Metal Sensor Selalu Triggered**
**Penyebab:** Sensor terlalu sensitif atau mode pull-up salah
**Solusi:**
1. ✅ Pastikan menggunakan `INPUT_PULLUP` mode
2. ✅ Adjust jarak sensor (2-10mm dari objek)
3. ✅ Cek voltase sensor (3.3V atau 5V)

### **Problem: WiFi Tidak Connect**
**Penyebab:** SSID/password salah atau WiFi 5GHz
**Solusi:**
1. ✅ Pastikan WiFi adalah 2.4GHz (bukan 5GHz)
2. ✅ Cek SSID dan password di kode
3. ✅ Restart router dan ESP32

---

## 📐 **Voltage Divider Calculator**

Untuk konversi 5V → 3.3V:

```
Formula: Vout = Vin × (R2 / (R1 + R2))

Input:  5V
R1:     1kΩ (ke input)
R2:     2kΩ (ke GND)
Output: 5V × (2kΩ / 3kΩ) = 3.33V ✅

Alternative resistor values:
- R1: 2.2kΩ, R2: 3.3kΩ → Vout = 3V
- R1: 1.5kΩ, R2: 3.3kΩ → Vout = 3.44V
```

**⚠️ Catatan:** 
- Voltage divider **WAJIB** untuk ECHO pin HC-SR04
- Tidak perlu untuk TRIG pin (output dari ESP32)
- LCD I2C module biasanya sudah ada level shifter built-in

---

## 🔌 **Power Supply Requirements**

| Komponen | Voltase | Arus Max | Sumber |
|----------|---------|----------|--------|
| ESP32 | 3.3V (internal) | 500mA | USB 5V atau VIN |
| Sensor Ultrasonik (2x) | 5V | 30mA | VIN ESP32 |
| Servo Motor | 5V | 1-2A | **External PSU** |
| LCD I2C | 5V | 100mA | VIN ESP32 |
| Buzzer | 5V | 30mA | VIN ESP32 |
| Metal Sensor | 3.3V/5V | 10mA | 3V3/VIN ESP32 |
| IR Lamp | 5V | 50mA | VIN ESP32 |

**Total Arus (tanpa servo):** ~200-300mA → Bisa dari USB 5V ✅  
**Total Arus (dengan servo):** ~2A → **Butuh external PSU 5V 3A** ⚠️

---

## 📝 **Changelog**

### **v3.0 - Simplified (Current)**
- ❌ **Hapus Load Cell** (tidak digunakan)
- ❌ **Hapus LED** (tidak digunakan)
- ✅ Tambah sensor metal proximity (GPIO 25)
- ✅ Klasifikasi botol hanya 2 parameter (diameter + panjang)
- ✅ Buzzer alert untuk metal detection (3x beep cepat)
- ✅ DHCP mode untuk WiFi (dynamic IP)
- ✅ Auto-register IP ke cloud server

### **v2.0 - Sensor Tambahan**
- Tambah sensor metal proximity (GPIO 25)
- Tambah load cell HX711 (GPIO 26, 27)
- Klasifikasi botol menggunakan 3 parameter

### **v1.0 - Versi Awal**
- Sensor ultrasonik (2 buah)
- Servo motor
- Buzzer
- LCD I2C
- WiFi + HTTP server

---

## 📞 **Support**

Jika ada masalah dengan konfigurasi pin atau sensor:
1. ✅ Cek koneksi kabel (VCC, GND, Signal)
2. ✅ Cek voltase sensor (3.3V atau 5V)
3. ✅ Gunakan voltage divider untuk sensor 5V
4. ✅ Gunakan Serial Monitor command `TEST`, `LCD`, `SCAN` untuk debug
5. ✅ Pastikan power supply cukup (external PSU untuk servo)

---

## 🎓 **Summary: 3.3V vs 5V**

### **✅ Aman Langsung ke ESP32 (3.3V):**
- TRIG pin sensor ultrasonik (output dari ESP32)
- Sensor metal (jika sensor 3.3V)
- I2C (SDA/SCL) - LCD module ada level shifter

### **⚠️ Butuh Voltage Divider (5V→3.3V):**
- ECHO pin sensor ultrasonik (output 5V dari sensor)
- Signal pin sensor metal (jika sensor 5V)

### **❌ Jangan Langsung ke GPIO ESP32:**
- Output 5V tanpa voltage divider → **Merusak ESP32!**

### **✅ VCC 5V (untuk sensor/actuator 5V):**
- Ambil dari pin **VIN** ESP32 (5V dari USB)
- Atau dari external PSU 5V

### **✅ VCC 3.3V (untuk sensor 3.3V):**
- Ambil dari pin **3V3** ESP32
- Max output: 600mA (cukup untuk sensor kecil)

---

**🎉 Selesai! Dokumentasi lengkap untuk wiring ESP32 Bank Sampah Digital.**
