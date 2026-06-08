# 🔧 LCD Troubleshooting Guide - LCD Tidak Nyala

## 📋 Checklist Cepat

### 1. **Cek Koneksi Hardware**
```
LCD I2C Module → ESP32
VCC  → 5V (atau 3.3V tergantung LCD)
GND  → GND
SDA  → GPIO 21
SCL  → GPIO 22
```

### 2. **Cek Power LCD**
- ✅ LED backlight menyala? (jika ada)
- ✅ Potentiometer sudah diatur? (putar untuk adjust kontras)
- ✅ Coba ukur voltage di VCC pin (harus 5V atau 3.3V)

### 3. **Cek I2C Address**
Upload kode ke ESP32, buka **Serial Monitor (115200 baud)**, lihat output:

```
[LCD] Scanning I2C bus...
[LCD] ✅ I2C device found at 0x27
[LCD] Using address: 0x27
[LCD] ✅ LCD initialized successfully!
```

**Jika tidak ada device ditemukan:**
```
[LCD] ❌ No I2C devices found!
```

## 🔍 Diagnostik dengan Serial Monitor

### Command yang Tersedia:
Ketik di Serial Monitor (115200 baud):

1. **`SCAN`** - Scan semua I2C devices
   ```
   SCAN
   ```
   Output:
   ```
   [I2C] Device found at 0x27
   [I2C] Found 1 device(s)
   ```

2. **`LCD`** - Test LCD display
   ```
   LCD
   ```
   Output:
   ```
   [LCD] ✅ Test message sent
   ```
   LCD akan menampilkan: `LCD TEST 1234`

## 🛠️ Solusi Berdasarkan Masalah

### ❌ Problem 1: "No I2C devices found"

**Penyebab:**
- Kabel tidak terhubung dengan benar
- LCD tidak mendapat power
- I2C module rusak

**Solusi:**
1. **Cek kabel satu per satu:**
   ```
   VCC → 5V (merah)
   GND → GND (hitam)
   SDA → GPIO 21 (kuning/hijau)
   SCL → GPIO 22 (biru/putih)
   ```

2. **Coba swap SDA/SCL** (kadang terbalik):
   ```cpp
   Wire.begin(22, 21);  // Swap: SDA=22, SCL=21
   ```

3. **Coba voltage berbeda:**
   - Jika pakai 5V, coba 3.3V
   - Jika pakai 3.3V, coba 5V

4. **Test dengan multimeter:**
   - Ukur voltage di VCC pin LCD (harus 5V atau 3.3V)
   - Ukur continuity kabel

### ❌ Problem 2: I2C Device Ditemukan, Tapi LCD Blank

**Penyebab:**
- Kontras LCD terlalu rendah/tinggi
- Backlight mati
- LCD rusak

**Solusi:**
1. **Adjust Potentiometer:**
   - Putar potentiometer di belakang LCD (biasanya biru)
   - Putar perlahan sambil lihat LCD
   - Seharusnya muncul kotak-kotak atau text

2. **Cek Backlight:**
   ```cpp
   lcd->backlight();  // Nyalakan backlight
   lcd->noBacklight(); // Matikan backlight (untuk test)
   ```

3. **Test dengan kode sederhana:**
   ```cpp
   lcd->clear();
   lcd->setCursor(0, 0);
   lcd->print("HELLO WORLD");
   ```

### ❌ Problem 3: Address 0x27 Tidak Ditemukan

**Penyebab:**
- LCD menggunakan address berbeda (0x3F, 0x20, dll)

**Solusi:**
1. **Jalankan command `SCAN`** di Serial Monitor
2. **Lihat address yang ditemukan:**
   ```
   [I2C] Device found at 0x3F  ← Ini address LCD Anda
   ```

3. **Update kode jika perlu** (kode sudah auto-detect, tapi bisa manual):
   ```cpp
   lcd = new LiquidCrystal_I2C(0x3F, 16, 2); // Ganti 0x3F dengan address Anda
   ```

### ❌ Problem 4: LCD Berkedip/Flicker

**Sudah diperbaiki di kode!** Tapi jika masih berkedip:

1. **Tambahkan kapasitor 100uF** di VCC dan GND LCD (dekat LCD)
2. **Gunakan kabel lebih pendek** (< 20cm)
3. **Tambahkan pull-up resistor** 4.7kΩ di SDA dan SCL

## 📊 Wiring Diagram

```
ESP32                    LCD I2C Module
┌─────────┐             ┌──────────────┐
│         │             │              │
│  5V     ├─────────────┤ VCC          │
│  GND    ├─────────────┤ GND          │
│  GPIO21 ├─────────────┤ SDA          │
│  GPIO22 ├─────────────┤ SCL          │
│         │             │              │
└─────────┘             └──────────────┘
```

## 🔧 Test Hardware Tanpa ESP32

**Test LCD dengan Arduino Uno:**
```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Hello World!");
}

void loop() {}
```

Jika berhasil di Arduino tapi gagal di ESP32 → masalah di ESP32 atau wiring.

## 📝 Checklist Akhir

- [ ] Kabel VCC, GND, SDA, SCL terpasang benar
- [ ] Voltage di VCC = 5V atau 3.3V
- [ ] Command `SCAN` menemukan device
- [ ] Potentiometer sudah diatur
- [ ] Backlight menyala
- [ ] Command `LCD` menampilkan text
- [ ] Serial Monitor menunjukkan "LCD initialized successfully"

## 🆘 Jika Semua Gagal

1. **Coba LCD di Arduino Uno** (untuk test LCD)
2. **Coba I2C scanner sketch** (untuk test I2C bus)
3. **Ganti I2C module** (modul PCF8574 bisa rusak)
4. **Ganti LCD** (LCD bisa rusak)

## 📞 Debug Output yang Berguna

Kirimkan output ini jika minta bantuan:
```
[LCD] Scanning I2C bus...
[LCD] ✅ I2C device found at 0x??
[LCD] Using address: 0x??
[LCD] ✅ LCD initialized successfully!
```

Atau:
```
[LCD] ❌ No I2C devices found!
```

## 🎯 Quick Fix Commands

Di Serial Monitor (115200 baud):
```
SCAN    → Scan I2C devices
LCD     → Test LCD display
```

---

**Kode sudah include auto-detect I2C address dan diagnostik lengkap!**
Upload kode baru, buka Serial Monitor, dan lihat output untuk troubleshooting.
