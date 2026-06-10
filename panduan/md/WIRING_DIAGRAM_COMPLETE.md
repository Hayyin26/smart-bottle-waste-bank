# 🔌 Wiring Diagram Lengkap - IoT Bank Sampah

## 📋 Daftar Komponen

### 1. Microcontroller
- **ESP32 Dev Module** (1 unit)

### 2. Sensor
- **HC-SR04 Ultrasonic Sensor** (2 unit) - Sensor HEIGHT & LENGTH
- **ROKO Metal Proximity Sensor** (1 unit) - Sensor Logam
- **IR Lamp/LED** (1 unit) - Lampu indikator

### 3. Aktuator
- **Servo Motor SG90** (1 unit) - Pintu gerbang
- **Buzzer Aktif 5V** (1 unit) - Suara notifikasi

### 4. Display
- **LCD I2C 16x2** (1 unit) - Display informasi

### 5. Power Supply
- **Adaptor 5V 2A** (1 unit)

---

## 🔌 Koneksi Lengkap

### ESP32 Pinout
```
                    ESP32 Dev Module
    ┌───────────────────────────────────────┐
    │                                       │
    │  3V3  ─────────────────────────  GND  │
    │  EN                                   │
    │  VP (36)                              │
    │  VN (39)                              │
    │  34                                   │
    │  35                                   │
    │  32                                   │
    │  33                                   │
    │  25                                   │
    │  26                                   │
    │  27                                   │
    │  14  ──→ METAL SENSOR (Signal)        │
    │  12                                   │
    │  13  ──→ IR LAMP                      │
    │  GND ─────────────────────────  GND   │
    │  VIN (5V) ────────────────────  5V    │
    │  23  ──→ BUZZER                       │
    │  22  ──→ LCD (SCL)                    │
    │  TX                                   │
    │  RX                                   │
    │  21  ──→ LCD (SDA)                    │
    │  19  ──→ SERVO (Signal)               │
    │  18  ──→ ULTRASONIC HEIGHT (ECHO)     │
    │  5   ──→ ULTRASONIC LENGTH (TRIG)     │
    │  17                                   │
    │  16                                   │
    │  4   ──→ ULTRASONIC HEIGHT (TRIG)     │
    │  0                                    │
    │  2                                    │
    │  15  ──→ ULTRASONIC LENGTH (ECHO)     │
    │  GND ─────────────────────────  GND   │
    │  3V3                                  │
    └───────────────────────────────────────┘
```

---

## 📐 Wiring Detail

### 1. Sensor Ultrasonik HEIGHT (HC-SR04)
```
HC-SR04 (HEIGHT)          ESP32
────────────────          ─────────────
VCC                ────→  5V (VIN)
TRIG               ────→  GPIO 4
ECHO               ────→  GPIO 18
GND                ────→  GND
```

### 2. Sensor Ultrasonik LENGTH (HC-SR04)
```
HC-SR04 (LENGTH)          ESP32
────────────────          ─────────────
VCC                ────→  5V (VIN)
TRIG               ────→  GPIO 5
ECHO               ────→  GPIO 15
GND                ────→  GND
```

### 3. Sensor Logam (ROKO Metal Proximity Sensor)
```
ROKO Metal Sensor         ESP32
─────────────────         ─────────────
Coklat (Brown/VCC) ────→  5V (VIN)
Biru (Blue/GND)    ────→  GND
Hitam (Black/OUT)  ────→  GPIO 14
```

**Catatan**: 
- Sensor ini **Active LOW** (LOW = Logam terdeteksi)
- Jarak deteksi: 2-10mm
- Pastikan kabel tidak terbalik!

### 4. Servo Motor (SG90)
```
Servo SG90                ESP32
──────────                ─────────────
Merah (VCC)        ────→  5V (VIN)
Coklat (GND)       ────→  GND
Oranye (Signal)    ────→  GPIO 19
```

### 5. Buzzer Aktif 5V
```
Buzzer                    ESP32
──────                    ─────────────
+ (Positif)        ────→  GPIO 23
- (Negatif)        ────→  GND
```

### 6. IR Lamp/LED
```
IR Lamp/LED               ESP32
───────────               ─────────────
+ (Anode)          ────→  GPIO 13
- (Cathode)        ────→  GND (via resistor 220Ω)
```

**Catatan**: Jika menggunakan LED biasa, tambahkan resistor 220Ω di kaki negatif.

### 7. LCD I2C 16x2
```
LCD I2C                   ESP32
───────                   ─────────────
VCC                ────→  5V (VIN)
GND                ────→  GND
SDA                ────→  GPIO 21
SCL                ────→  GPIO 22
```

**Catatan**: 
- Alamat I2C biasanya 0x27 atau 0x3F
- Kode akan auto-detect alamat

---

## 🔋 Power Supply

### Opsi 1: Power dari USB (Development)
```
USB Cable (5V 1A)
     ↓
ESP32 USB Port
     ↓
ESP32 menyuplai semua komponen via VIN (5V)
```

**Catatan**: 
- ⚠️ Arus terbatas (~500mA)
- Cukup untuk testing, tapi tidak ideal untuk production
- Servo bisa tidak kuat jika beban berat

### Opsi 2: Power dari Adaptor (Production) ✅ RECOMMENDED
```
Adaptor 5V 2A
     ↓
Terminal Block/Breadboard Power Rail
     ├──→ ESP32 VIN (5V)
     ├──→ Sensor Ultrasonik 1 VCC
     ├──→ Sensor Ultrasonik 2 VCC
     ├──→ Sensor Logam VCC (Coklat)
     ├──→ Servo VCC (Merah)
     ├──→ LCD VCC
     └──→ GND (semua komponen)
```

**Keuntungan**:
- ✅ Arus cukup untuk semua komponen (2A)
- ✅ Servo bekerja optimal
- ✅ Sistem lebih stabil

---

## 📊 Tabel Pin Summary

| Komponen | Pin ESP32 | Fungsi | Tipe |
|----------|-----------|--------|------|
| Ultrasonic HEIGHT TRIG | GPIO 4 | Output | Digital |
| Ultrasonic HEIGHT ECHO | GPIO 18 | Input | Digital |
| Ultrasonic LENGTH TRIG | GPIO 5 | Output | Digital |
| Ultrasonic LENGTH ECHO | GPIO 15 | Input | Digital |
| Metal Sensor | GPIO 14 | Input | Digital (Active LOW) |
| Servo Motor | GPIO 19 | Output | PWM |
| Buzzer | GPIO 23 | Output | Digital |
| IR Lamp | GPIO 13 | Output | Digital |
| LCD SDA | GPIO 21 | I2C Data | I2C |
| LCD SCL | GPIO 22 | I2C Clock | I2C |

---

## 🎨 Wiring Diagram Visual

### Tampak Atas (Top View)
```
                    ┌─────────────┐
                    │   LCD I2C   │
                    │   16x2      │
                    └──────┬──────┘
                           │ (I2C: SDA=21, SCL=22)
                           │
    ┌──────────────────────┴──────────────────────┐
    │                                              │
    │              ESP32 Dev Module                │
    │                                              │
    └──┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬─┘
       │   │   │   │   │   │   │   │   │   │   │
       │   │   │   │   │   │   │   │   │   │   │
    ┌──┴─┐ │   │   │   │   │   │   │   │   │   │
    │Buzz│ │   │   │   │   │   │   │   │   │   │
    │zer │ │   │   │   │   │   │   │   │   │   │
    └────┘ │   │   │   │   │   │   │   │   │   │
           │   │   │   │   │   │   │   │   │   │
        ┌──┴─┐ │   │   │   │   │   │   │   │   │
        │Servo│ │   │   │   │   │   │   │   │   │
        └────┘ │   │   │   │   │   │   │   │   │
               │   │   │   │   │   │   │   │   │
            ┌──┴──┐│   │   │   │   │   │   │   │
            │HC-SR││   │   │   │   │   │   │   │
            │04-H ││   │   │   │   │   │   │   │
            └─────┘│   │   │   │   │   │   │   │
                   │   │   │   │   │   │   │   │
                ┌──┴──┐│   │   │   │   │   │   │
                │HC-SR││   │   │   │   │   │   │
                │04-L ││   │   │   │   │   │   │
                └─────┘│   │   │   │   │   │   │
                       │   │   │   │   │   │   │
                    ┌──┴──┐│   │   │   │   │   │
                    │Metal││   │   │   │   │   │
                    │Sens ││   │   │   │   │   │
                    └─────┘│   │   │   │   │   │
                           │   │   │   │   │   │
                        ┌──┴─┐ │   │   │   │   │
                        │IR  │ │   │   │   │   │
                        │Lamp│ │   │   │   │   │
                        └────┘ │   │   │   │   │
                               │   │   │   │   │
                            ┌──┴───┴───┴───┴───┴─┐
                            │   Power Supply     │
                            │   5V 2A Adaptor    │
                            └────────────────────┘
```

---

## 🔧 Tips Pemasangan

### 1. Urutan Pemasangan
1. **Pasang ESP32** di breadboard/PCB
2. **Hubungkan power** (5V & GND) ke power rail
3. **Pasang LCD** dan test (harus muncul backlight)
4. **Pasang sensor ultrasonik** (HEIGHT & LENGTH)
5. **Pasang sensor logam** (ROKO Metal Sensor)
6. **Pasang servo motor**
7. **Pasang buzzer**
8. **Pasang IR lamp** (optional)
9. **Upload kode** dan test satu per satu

### 2. Kabel Management
- Gunakan kabel warna berbeda untuk VCC (merah), GND (hitam), Signal (kuning/hijau)
- Rapikan kabel dengan cable tie
- Pisahkan kabel power dari kabel signal (mengurangi noise)
- Label setiap kabel untuk memudahkan troubleshooting

### 3. Grounding
- **PENTING**: Semua GND harus terhubung ke satu titik (common ground)
- Jangan ada GND yang floating (tidak terhubung)
- Gunakan breadboard power rail untuk distribusi GND

### 4. Testing
- Test satu komponen dulu sebelum pasang semua
- Gunakan multimeter untuk cek koneksi
- Cek voltage di setiap komponen (harus 5V)

---

## ⚠️ Troubleshooting Wiring

### Problem 1: ESP32 Tidak Menyala
**Penyebab**: Power supply tidak terhubung atau rusak
**Solusi**:
1. Cek kabel USB/adaptor
2. Cek voltage di VIN (harus 5V)
3. Coba power supply lain

### Problem 2: LCD Tidak Muncul
**Penyebab**: Koneksi I2C salah atau alamat salah
**Solusi**:
1. Cek koneksi SDA (GPIO 21) dan SCL (GPIO 22)
2. Cek voltage di LCD VCC (harus 5V)
3. Scan alamat I2C dengan kode test
4. Sesuaikan alamat di kode (0x27 atau 0x3F)

### Problem 3: Sensor Ultrasonik Tidak Bekerja
**Penyebab**: Koneksi TRIG/ECHO salah
**Solusi**:
1. Cek koneksi TRIG dan ECHO (jangan terbalik!)
2. Cek voltage di VCC sensor (harus 5V)
3. Test sensor dengan kode sederhana
4. Ganti sensor jika rusak

### Problem 4: Servo Tidak Bergerak
**Penyebab**: Power tidak cukup atau koneksi salah
**Solusi**:
1. Gunakan power supply 5V 2A (bukan USB)
2. Cek koneksi signal servo (GPIO 19)
3. Cek voltage di servo VCC (harus 5V)
4. Test servo dengan kode sederhana

### Problem 5: Sensor Logam Tidak Bekerja
**Penyebab**: Koneksi salah atau sensor rusak
**Solusi**:
1. Cek koneksi kabel:
   - Coklat → 5V
   - Biru → GND
   - Hitam → GPIO 14
2. Test sensor dengan multimeter (cek output LOW/HIGH)
3. Dekatkan logam ke sensor (2-5mm)
4. Ganti sensor jika rusak

---

## 📝 Checklist Wiring

- [ ] ESP32 terpasang dengan benar
- [ ] Power supply 5V 2A terhubung
- [ ] Semua GND terhubung ke common ground
- [ ] LCD I2C terhubung (SDA=21, SCL=22)
- [ ] Sensor Ultrasonik HEIGHT terhubung (TRIG=4, ECHO=18)
- [ ] Sensor Ultrasonik LENGTH terhubung (TRIG=5, ECHO=15)
- [ ] Sensor Logam terhubung (Signal=14)
- [ ] Servo terhubung (Signal=19)
- [ ] Buzzer terhubung (Signal=23)
- [ ] IR Lamp terhubung (Signal=13)
- [ ] Semua koneksi sudah dicek dengan multimeter
- [ ] Tidak ada short circuit
- [ ] Kabel sudah rapi dan terlabel

---

## 🔗 File Terkait

- `ESP32_UPDATED_CODE.ino` - Kode ESP32 lengkap
- `METAL_DETECTION_GUIDE.md` - Panduan sensor logam
- `HORIZONTAL_BOTTLE_SETUP_GUIDE.md` - Panduan setup botol horizontal

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.1 (Complete Wiring with Metal Sensor)
**Status**: ✅ READY TO USE
