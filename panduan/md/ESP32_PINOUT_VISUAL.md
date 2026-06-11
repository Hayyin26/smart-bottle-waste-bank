# 📌 ESP32 DevKit v1 - Pinout Visual untuk Proyek IoT Anda

## 🔍 **Cara Lihat Pin ESP32 (Tampak Dari Atas)**

```
                    USB Port (atas)
                          ▼
        ╔═══════════════════════════════════╗
        ║  ┌───────────────────────────┐   ║
        ║  │      🔌 USB Port          │   ║
        ║  └───────────────────────────┘   ║
        ║                                   ║
        ║   ●●●●●●●●●●●●●●●   ●●●●●●●●●●●●●●● ║
        ║   │││││││││││││││   │││││││││││││││ ║
        ║   BARIS KIRI         BARIS KANAN   ║
        ║                                   ║
        ║        【 ESP32 CHIP 】           ║
        ║                                   ║
        ╚═══════════════════════════════════╝

● = Pin lubang tempat kabel masuk
│ = Kaki pin (masuk ke breadboard)
```

---

## 📍 **BARIS KIRI (15 pin) - Dari Atas ke Bawah**

```
Pin #  │ Nama Pin  │ Fungsi dalam Proyek              │ Warna Kabel
═══════╪═══════════╪═════════════════════════════════╪══════════════
  1    │ 3V3       │ ❌ TIDAK DIPAKAI                 │ -
  2    │ GND       │ ✅ Ground (ke Ground Rail)       │ ⚫ Hitam
  3    │ GPIO 15   │ ❌ TIDAK DIPAKAI                 │ -
  4    │ GPIO 2    │ ❌ TIDAK DIPAKAI                 │ -
  5    │ GPIO 4    │ 🟢 SENSOR HEIGHT TRIG            │ Bebas
  6    │ GPIO 16   │ ❌ TIDAK DIPAKAI                 │ -
  7    │ GPIO 17   │ ❌ TIDAK DIPAKAI                 │ -
  8    │ GPIO 5    │ 🟢 SENSOR LENGTH TRIG            │ Bebas
  9    │ GPIO 18   │ 🔴 SENSOR HEIGHT ECHO+VD         │ Bebas
 10    │ GPIO 19   │ 🟡 SERVO SIGNAL                  │ Kuning
 11    │ GPIO 21   │ 🔵 LCD SDA (I2C)                 │ Bebas
 12    │ GPIO 22   │ 🔵 LCD SCL (I2C)                 │ Bebas
 13    │ GPIO 23   │ 🟠 BUZZER (+)                    │ Bebas
 14    │ GND       │ ✅ Ground (ke Ground Rail)       │ ⚫ Hitam
 15    │ (kosong)  │ -                                │ -
```

**VD = Voltage Divider (WAJIB!)**

---

## 📍 **BARIS KANAN (15 pin) - Dari Atas ke Bawah**

```
Pin #  │ Nama Pin  │ Fungsi dalam Proyek              │ Warna Kabel
═══════╪═══════════╪═════════════════════════════════╪══════════════
  1    │ VIN       │ ✅ Power 5V (ke Power Rail)      │ 🔴 Merah
  2    │ GPIO 36   │ ❌ TIDAK DIPAKAI                 │ -
  3    │ GPIO 39   │ ❌ TIDAK DIPAKAI                 │ -
  4    │ GPIO 34   │ ❌ TIDAK DIPAKAI                 │ -
  5    │ GPIO 35   │ ❌ TIDAK DIPAKAI                 │ -
  6    │ GPIO 32   │ ❌ TIDAK DIPAKAI                 │ -
  7    │ GPIO 33   │ ❌ TIDAK DIPAKAI                 │ -
  8    │ GPIO 25   │ 🟤 METAL SENSOR SIGNAL           │ Bebas
  9    │ GPIO 26   │ ❌ TIDAK DIPAKAI                 │ -
 10    │ GPIO 27   │ ❌ TIDAK DIPAKAI                 │ -
 11    │ GPIO 14   │ ❌ TIDAK DIPAKAI                 │ -
 12    │ GPIO 12   │ 🔴 SENSOR LENGTH ECHO+VD         │ Bebas
 13    │ GPIO 13   │ 🟣 IR LED (opsional)             │ Bebas
 14    │ GND       │ ✅ Ground (ke Ground Rail)       │ ⚫ Hitam
 15    │ (kosong)  │ -                                │ -
```

---

## 🎨 **Diagram Lengkap dengan Label**

```
                       🔌 USB Micro (Power 5V)
                              ↓
        ╔═══════════════════════════════════════════════╗
        ║                                               ║
        ║    3V3  ●───────────────────────● VIN        ║ 🔴 → Power Rail (+) 5V
        ║    GND  ●───────────────────────● GPIO 36    ║ ⚫ → Ground Rail (-)
        ║ GPIO 15 ●                       ● GPIO 39    ║
        ║  GPIO 2 ●                       ● GPIO 34    ║
        ║  GPIO 4 ●───🟢 HEIGHT TRIG      ● GPIO 35    ║
        ║ GPIO 16 ●                       ● GPIO 32    ║
        ║ GPIO 17 ●                       ● GPIO 33    ║
        ║  GPIO 5 ●───🟢 LENGTH TRIG      ● GPIO 25────🟤 METAL SENSOR
        ║ GPIO 18 ●───🔴 HEIGHT ECHO+VD   ● GPIO 26    ║
        ║ GPIO 19 ●───🟡 SERVO SIGNAL     ● GPIO 27    ║
        ║ GPIO 21 ●───🔵 LCD SDA          ● GPIO 14    ║
        ║ GPIO 22 ●───🔵 LCD SCL          ● GPIO 12────🔴 LENGTH ECHO+VD
        ║ GPIO 23 ●───🟠 BUZZER           ● GPIO 13────🟣 IR LED (opsional)
        ║    GND  ●───────────────────────● GND        ║ ⚫ → Ground Rail (-)
        ║         ●                       ●            ║
        ║                                               ║
        ╚═══════════════════════════════════════════════╝

Legend:
🟢 = Output (TRIG sensor)
🔴 = Input dengan Voltage Divider (ECHO sensor)
🟡 = Output PWM (Servo)
🔵 = I2C (LCD)
🟠 = Output Digital (Buzzer)
🟤 = Input Digital (Metal Sensor)
🟣 = Output Digital (IR LED)
⚫ = Ground
🔴 (VIN) = Power 5V
```

---

## 🔌 **Pin POWER (Yang Paling Penting!)**

### **1. VIN (5V INPUT)**
**Lokasi:** Baris KANAN, pin paling atas (pojok kanan atas)

**Fungsi:** Menerima 5V dari USB dan mendistribusikan ke sensor-sensor

**Sambung ke:**
```
VIN ESP32 → Breadboard Power Rail (+)
            ↓
            ├─→ Sensor HEIGHT VCC
            ├─→ Sensor LENGTH VCC
            ├─→ LCD I2C VCC
            └─→ (IR LED via resistor)
```

**Ciri kabel:**
- 🔴 Biasanya MERAH atau ORANGE
- Kabel tebal/gemuk (karena membawa arus banyak)

---

### **2. 3V3 (3.3V OUTPUT)**
**Lokasi:** Baris KIRI, pin paling atas (pojok kiri atas)

**Fungsi:** Output 3.3V untuk sensor-sensor yang butuh 3.3V

**Sambung ke:**
```
3V3 ESP32 → Metal Sensor VCC (jika sensor 3.3V)
```

⚠️ **PENTING:**
- Jika metal sensor pakai 5V, maka VCC-nya sambung ke **VIN**, bukan 3V3!
- Cek datasheet sensor untuk tahu voltase yang benar

**Ciri kabel:**
- 🟢 Biasanya HIJAU MUDA atau PUTIH
- Kabel tipis (karena hanya 1 sensor)

---

### **3. GND (GROUND)**
**Lokasi:** Ada 3 pin GND:
- KIRI pin #2 (atas)
- KIRI pin #14 (bawah)
- KANAN pin #14 (bawah)

**Fungsi:** Ground/massa untuk semua komponen (WAJIB COMMON!)

**Sambung ke:**
```
GND ESP32 → Breadboard Ground Rail (-)
            ↓
            ├─→ Sensor HEIGHT GND
            ├─→ Sensor LENGTH GND
            ├─→ LCD I2C GND
            ├─→ Buzzer GND
            ├─→ Metal Sensor GND
            ├─→ IR LED GND
            ├─→ Servo GND
            └─→ External PSU GND (untuk servo)
```

**Ciri kabel:**
- ⚫ Biasanya HITAM atau COKLAT TUA
- Banyak kabel hitam tersambung ke ground rail

⚠️ **PENTING:**
- **Semua GND harus tersambung** (common ground!)
- GND servo + GND PSU eksternal HARUS tersambung dengan GND ESP32!

---

## 🎯 **Pin OUTPUT (GPIO yang Mengirim Sinyal)**

### **GPIO 4 - Sensor HEIGHT TRIG**
```
Lokasi: KIRI pin #5
Fungsi: Trigger sensor ultrasonik #1 (diameter botol)
Sambung: Langsung ke pin TRIG sensor
Voltage Divider: ❌ TIDAK PERLU (output dari ESP32)
```

---

### **GPIO 5 - Sensor LENGTH TRIG**
```
Lokasi: KIRI pin #8
Fungsi: Trigger sensor ultrasonik #2 (panjang botol)
Sambung: Langsung ke pin TRIG sensor
Voltage Divider: ❌ TIDAK PERLU (output dari ESP32)
```

---

### **GPIO 19 - Servo Signal**
```
Lokasi: KIRI pin #10
Fungsi: PWM signal untuk servo motor
Sambung: Pin Signal servo (kabel kuning/putih)
Catatan: Servo VCC WAJIB dari external PSU 5V!
```

---

### **GPIO 21 - LCD SDA (I2C Data)**
```
Lokasi: KIRI pin #11
Fungsi: I2C data line untuk LCD
Sambung: Pin SDA di LCD I2C module
```

---

### **GPIO 22 - LCD SCL (I2C Clock)**
```
Lokasi: KIRI pin #12
Fungsi: I2C clock line untuk LCD
Sambung: Pin SCL di LCD I2C module
```

---

### **GPIO 23 - Buzzer**
```
Lokasi: KIRI pin #13
Fungsi: Output digital untuk buzzer
Sambung: Pin (+) buzzer (pin panjang)
Catatan: Pin (-) buzzer ke GND
```

---

### **GPIO 13 - IR LED (Opsional)**
```
Lokasi: KANAN pin #13
Fungsi: Output digital untuk IR LED
Sambung: Anode (+) IR LED via resistor 220Ω
Catatan: Cathode (-) IR LED ke GND
```

---

## 🎯 **Pin INPUT (GPIO yang Menerima Sinyal)**

### **GPIO 18 - Sensor HEIGHT ECHO** ⚠️ **VOLTAGE DIVIDER WAJIB!**
```
Lokasi: KIRI pin #9
Fungsi: Input echo dari sensor ultrasonik #1
Sambung: Pin ECHO sensor via voltage divider

Circuit:
Sensor ECHO (5V) → [1kΩ] → GPIO 18
                           ↓
                        [2kΩ]
                           ↓
                          GND

⚠️ Tanpa voltage divider, ESP32 bisa RUSAK!
```

---

### **GPIO 12 - Sensor LENGTH ECHO** ⚠️ **VOLTAGE DIVIDER WAJIB!**
```
Lokasi: KANAN pin #12
Fungsi: Input echo dari sensor ultrasonik #2
Sambung: Pin ECHO sensor via voltage divider

Circuit:
Sensor ECHO (5V) → [1kΩ] → GPIO 12
                           ↓
                        [2kΩ]
                           ↓
                          GND

⚠️ Tanpa voltage divider, ESP32 bisa RUSAK!
```

---

### **GPIO 25 - Metal Sensor**
```
Lokasi: KANAN pin #8
Fungsi: Input digital dari sensor metal proximity
Sambung: Pin Signal sensor metal (kabel hitam)
Mode: INPUT_PULLUP
Logic: LOW = metal detected, HIGH = no metal
```

---

## 📋 **Checklist Cepat - Trace Wiring Anda**

Print dan ceklis:

### **Baris KIRI ESP32:**
- [ ] Pin #1 (3V3) → ❌ Tidak dipakai ATAU → Metal Sensor VCC (jika 3.3V)
- [ ] Pin #2 (GND) → Ground Rail (-)
- [ ] Pin #5 (GPIO 4) → Sensor HEIGHT TRIG
- [ ] Pin #8 (GPIO 5) → Sensor LENGTH TRIG
- [ ] Pin #9 (GPIO 18) → Sensor HEIGHT ECHO + Voltage Divider
- [ ] Pin #10 (GPIO 19) → Servo Signal (kuning)
- [ ] Pin #11 (GPIO 21) → LCD SDA
- [ ] Pin #12 (GPIO 22) → LCD SCL
- [ ] Pin #13 (GPIO 23) → Buzzer (+)
- [ ] Pin #14 (GND) → Ground Rail (-)

### **Baris KANAN ESP32:**
- [ ] Pin #1 (VIN) → Power Rail (+) 5V
- [ ] Pin #8 (GPIO 25) → Metal Sensor Signal
- [ ] Pin #12 (GPIO 12) → Sensor LENGTH ECHO + Voltage Divider
- [ ] Pin #13 (GPIO 13) → IR LED (opsional)
- [ ] Pin #14 (GND) → Ground Rail (-)

---

## 🔍 **Tips Trace Wiring Tanpa Bongkar:**

### **1. Lihat dari Atas**
- Foto ESP32 dari atas
- Hitung pin dari atas ke bawah
- Cocokkan dengan diagram

### **2. Ikuti Warna Kabel**
- Merah/Orange = Power 5V (VIN)
- Hitam/Coklat = Ground (GND)
- Kuning = Servo Signal (GPIO 19)
- Warna lain = GPIO sensor/actuator

### **3. Cek Voltage Divider**
- Lihat breadboard
- Cari 2 resistor antara sensor ECHO dan GPIO
- WAJIB ada untuk GPIO 18 dan GPIO 12!

### **4. Test dengan Serial Monitor**
```
Ketik: TEST
Output:
[Test] HEIGHT (stable): 15 cm
[Test] LENGTH (stable): 20 cm
[Test] METAL: NOT DETECTED

✅ Jika output seperti ini, wiring BENAR!
```

---

## 🎉 **Selesai!**

Sekarang Anda tahu persis pin mana yang dipakai!

**Print halaman ini dan tempelkan di dekat proyek IoT Anda untuk referensi cepat!** 📌
