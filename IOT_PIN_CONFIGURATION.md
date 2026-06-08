# 📌 Konfigurasi Pin IoT ESP32 - Bank Sampah Digital

## 🔌 **Daftar Pin yang Digunakan**

### **1. Sensor Ultrasonik (2 buah)**

#### **Sensor HEIGHT (Mengukur Diameter Botol)**
- **TRIG Pin**: GPIO **4**
- **ECHO Pin**: GPIO **18**
- **Fungsi**: Mengukur diameter botol (botol horizontal)

#### **Sensor LENGTH (Mengukur Panjang Botol)**
- **TRIG Pin**: GPIO **5**
- **ECHO Pin**: GPIO **15**
- **Fungsi**: Mengukur panjang botol (botol horizontal)

---

### **2. Load Cell (Sensor Berat) - HX711**
- **DOUT Pin**: GPIO **26**
- **SCK Pin**: GPIO **27**
- **Fungsi**: Mengukur berat botol dalam gram
- **Kalibrasi**: 420.0983 (sesuaikan dengan load cell Anda)

**Cara Kalibrasi Load Cell:**
1. Jalankan `scale.read()` tanpa beban → catat nilai (tare)
2. Letakkan beban 100g → catat nilai
3. Hitung: `calibration_factor = (nilai_dengan_beban - tare) / 100`
4. Update nilai di kode: `scale.set_scale(calibration_factor);`

---

### **3. Sensor Metal Proximity (Inductive Sensor)**
- **Signal Pin**: GPIO **25**
- **Fungsi**: Mendeteksi botol logam/kaleng (ditolak)
- **Logika**: LOW = Metal terdeteksi, HIGH = Tidak ada metal
- **Tipe**: Digital input dengan pull-up resistor

---

### **4. Servo Motor (Pintu Gerbang)**
- **Servo Pin**: GPIO **19**
- **Sudut Buka**: 90°
- **Sudut Tutup**: 0°
- **PWM**: Timer 0, 50Hz

---

### **5. Buzzer (Notifikasi Suara)**
- **Buzzer Pin**: GPIO **23**
- **Fungsi**: 
  - 1x beep = Botol diterima
  - 2x beep = Ukuran salah
  - 3x beep = Botol logam terdeteksi

---

### **6. Lampu IR (Infrared Lamp)**
- **IR Lamp Pin**: GPIO **13**
- **Fungsi**: Penerangan untuk sensor (opsional)

---

### **7. LCD I2C (Display 16x2)**
- **SDA Pin**: GPIO **21** (default I2C)
- **SCL Pin**: GPIO **22** (default I2C)
- **I2C Address**: 0x27 atau 0x3F (auto-detect)

---

### **8. WiFi & Network**
- **Static IP**: 192.168.100.87
- **Gateway**: 192.168.100.1
- **Subnet**: 255.255.255.0
- **HTTP Server Port**: 80

---

## 📊 **Tabel Ringkasan Pin**

| Komponen | Pin GPIO | Tipe | Fungsi |
|----------|----------|------|--------|
| Sensor HEIGHT TRIG | 4 | Output | Trigger sensor diameter |
| Sensor HEIGHT ECHO | 18 | Input | Echo sensor diameter |
| Sensor LENGTH TRIG | 5 | Output | Trigger sensor panjang |
| Sensor LENGTH ECHO | 15 | Input | Echo sensor panjang |
| Servo Motor | 19 | PWM | Kontrol pintu gerbang |
| Buzzer | 23 | Output | Notifikasi suara |
| IR Lamp | 13 | Output | Lampu infrared |
| **Metal Sensor** | **25** | **Input** | **Deteksi botol logam** |
| **Load Cell DOUT** | **26** | **Input** | **Data berat (HX711)** |
| **Load Cell SCK** | **27** | **Output** | **Clock berat (HX711)** |
| LCD SDA | 21 | I2C | Data I2C |
| LCD SCL | 22 | I2C | Clock I2C |

---

## 🎯 **Klasifikasi Botol (3 Parameter)**

### **Botol KECIL (330ml)**
- **Diameter**: 5-11 cm
- **Panjang**: 10-14 cm
- **Berat**: 12.5-18 gram
- **Poin**: 5

### **Botol SEDANG (600ml)**
- **Diameter**: 12-17 cm
- **Panjang**: 15-22 cm
- **Berat**: 20-23 gram
- **Poin**: 10

### **Botol BESAR (1.5L)**
- **Diameter**: 18-22 cm
- **Panjang**: 23-30 cm
- **Berat**: 25-28 gram
- **Poin**: 15

---

## ⚠️ **Catatan Penting**

### **1. Sensor Ultrasonik**
- Botol diletakkan **HORIZONTAL** (tidur), bukan vertikal
- Jarak deteksi: 2-350 cm
- Sampling: 5 kali pembacaan (median)

### **2. Load Cell (HX711)**
- **WAJIB dikalibrasi** sebelum digunakan
- Gunakan beban standar (100g, 200g, dll) untuk kalibrasi
- Tare (reset ke 0) setiap kali ESP32 restart

### **3. Sensor Metal Proximity**
- Jarak deteksi: 2-10mm (tergantung sensor)
- Hanya mendeteksi logam (besi, aluminium, dll)
- Tidak mendeteksi plastik atau kaca

### **4. Servo Motor**
- Menggunakan PWM timer 0 dengan frekuensi 50Hz
- Pulse width: 500-2400 microseconds

### **5. LCD I2C**
- Auto-detect address antara 0x27 dan 0x3F
- Jika tidak terdeteksi, cek koneksi SDA/SCL

### **6. WiFi**
- Menggunakan Static IP agar tidak berubah-ubah
- Pastikan IP tidak konflik dengan device lain di jaringan

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
    bogde/HX711@^0.7.5
```

---

## 🛠️ **Wiring Diagram**

### **Load Cell (HX711)**
```
Load Cell Red    → E+ (Excitation+)
Load Cell Black  → E- (Excitation-)
Load Cell White  → A- (Signal-)
Load Cell Green  → A+ (Signal+)

HX711 VCC → 3.3V ESP32
HX711 GND → GND ESP32
HX711 DT  → GPIO 26
HX711 SCK → GPIO 27
```

### **Metal Proximity Sensor**
```
Sensor Brown  → VCC (5V atau 12V, tergantung sensor)
Sensor Blue   → GND
Sensor Black  → GPIO 25 (Signal)
```

### **Sensor Ultrasonik (HC-SR04)**
```
VCC  → 5V
GND  → GND
TRIG → GPIO 4 (HEIGHT) / GPIO 5 (LENGTH)
ECHO → GPIO 18 (HEIGHT) / GPIO 15 (LENGTH)
```

---

## 🚀 **Testing**

### **Test Load Cell**
```cpp
Serial.print("Weight: ");
Serial.print(scale.get_units(10), 1);
Serial.println(" g");
```

### **Test Metal Sensor**
```cpp
if (digitalRead(PIN_METAL_SENSOR) == LOW) {
  Serial.println("Metal detected!");
}
```

### **Test Ultrasonik**
```cpp
int distance = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
Serial.print("Distance: ");
Serial.print(distance);
Serial.println(" cm");
```

---

## 📝 **Changelog**

### **v2.0 - Sensor Tambahan**
- ✅ Tambah sensor metal proximity (GPIO 25)
- ✅ Tambah load cell HX711 (GPIO 26, 27)
- ✅ Klasifikasi botol menggunakan 3 parameter (diameter, panjang, berat)
- ✅ Reject otomatis untuk botol logam

### **v1.0 - Versi Awal**
- Sensor ultrasonik (2 buah)
- Servo motor
- Buzzer
- LCD I2C
- WiFi + HTTP server

---

## 📞 **Support**

Jika ada masalah dengan konfigurasi pin atau sensor:
1. Cek koneksi kabel (VCC, GND, Signal)
2. Cek voltase sensor (3.3V atau 5V)
3. Cek Serial Monitor untuk debug
4. Kalibrasi ulang load cell jika pembacaan tidak akurat
