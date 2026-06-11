# 🔧 LCD Tidak Nyala - Quick Fix Guide

## 🎯 **Gejala LCD Tidak Nyala:**

Ada beberapa kondisi LCD tidak nyala:

### **A. LCD BLANK TOTAL (Tidak ada cahaya backlight)**
- Layar hitam pekat
- Tidak ada cahaya sama sekali
- **Penyebab:** Power tidak masuk (VCC/GND)

### **B. LCD NYALA TAPI BLANK (Ada backlight tapi tidak ada text)**
- Layar biru/hijau terang
- Ada cahaya backlight
- Tidak ada tulisan
- **Penyebab:** Contrast terlalu tinggi/rendah atau I2C error

### **C. LCD NYALA TAPI TEXT TIDAK JELAS**
- Text ada tapi buram/samar
- Kotak-kotak hitam
- **Penyebab:** Contrast perlu adjust

---

## ⚡ **LANGKAH 1: Cek Serial Monitor Dulu!**

**PENTING:** Buka Serial Monitor (115200 baud) dan lihat log saat ESP32 startup!

### **Upload kode ke ESP32, lalu buka Serial Monitor, cari output ini:**

```
[LCD] Initializing I2C LCD...
[LCD] Scanning I2C bus...
[LCD] ✅ I2C device found at 0x27    ← LCD TERDETEKSI! ✅
[LCD] Using address: 0x27
[LCD] ✅ LCD initialized successfully!
```

**✅ Jika output seperti ini:**
- LCD **terhubung dengan benar** secara hardware
- Masalah ada di **contrast** (potentiometer)
- **Solusi:** Lanjut ke LANGKAH 3 (Adjust Potentiometer)

---

### **Atau muncul error seperti ini:**

```
[LCD] Scanning I2C bus...
[LCD] ❌ No I2C devices found!
[LCD] Troubleshooting:
[LCD]   1. Check wiring: SDA=GPIO21, SCL=GPIO22
[LCD]   2. Check power: VCC=5V, GND=GND
```

**❌ Jika output seperti ini:**
- LCD **tidak terdeteksi** oleh ESP32
- Masalah ada di **wiring** (kabel lepas atau salah sambung)
- **Solusi:** Lanjut ke LANGKAH 2 (Cek Wiring)

---

## 🔌 **LANGKAH 2: Cek Wiring LCD I2C**

### **LCD I2C punya 4 pin:**

```
LCD Module          ESP32
==========          =====
VCC (merah)    →    VIN (5V) atau Power Rail (+)
GND (hitam)    →    GND atau Ground Rail (-)
SDA (biru)     →    GPIO 21
SCL (kuning)   →    GPIO 22
```

### **Cek Satu Per Satu:**

#### **1. VCC (Power 5V)**
- [ ] Kabel VCC tersambung ke **VIN** ESP32 atau **Power Rail (+)**
- [ ] Cek dengan multimeter: VCC LCD harus ada **5V**
- [ ] Jika tidak ada 5V, cek kabel merah putus atau longgar

#### **2. GND (Ground)**
- [ ] Kabel GND tersambung ke **GND** ESP32 atau **Ground Rail (-)**
- [ ] Cek dengan multimeter: GND LCD harus **0V** (tersambung ke ground)
- [ ] Jika tidak, cek kabel hitam putus atau longgar

#### **3. SDA (I2C Data)**
- [ ] Kabel SDA tersambung ke **GPIO 21** ESP32
- [ ] Pastikan tidak ada kabel lain di GPIO 21
- [ ] Coba ganti kabel jika perlu

#### **4. SCL (I2C Clock)**
- [ ] Kabel SCL tersambung ke **GPIO 22** ESP32
- [ ] Pastikan tidak ada kabel lain di GPIO 22
- [ ] Coba ganti kabel jika perlu

---

### **Quick Test Wiring dengan Multimeter:**

```
1. Set multimeter ke mode DC Voltage
2. Probe hitam (-) ke GND ESP32
3. Probe merah (+) ke VCC LCD
4. Harusnya muncul: 5.0V (atau 4.8-5.2V)

Jika 0V atau kurang dari 4V:
❌ Power tidak masuk, cek kabel VCC dan GND!
```

---

## 🔍 **LANGKAH 3: Scan I2C Address Manual**

Jika wiring sudah benar tapi LCD masih tidak terdeteksi, coba scan I2C manual.

### **Ketik command ini di Serial Monitor:**

```
SCAN
```

**Output yang benar:**
```
[I2C] Scanning I2C bus...
[I2C] Device found at 0x27  ← LCD address
[I2C] Found 1 device(s)
```

**Jika tidak ada device:**
```
[I2C] Scanning I2C bus...
[I2C] No devices found
```

**Penyebab:**
- ❌ Kabel SDA/SCL salah atau putus
- ❌ LCD I2C module rusak
- ❌ Solder di LCD I2C module lepas

---

## 🎚️ **LANGKAH 4: Adjust Potentiometer (Contrast)**

**Ini penyebab paling umum LCD tidak tampil text!**

### **Lokasi Potentiometer:**
- Di **belakang** LCD I2C module
- Bentuk: Baut kecil biru/putih yang bisa diputar
- Ada 3 kaki solder di bawahnya

### **Cara Adjust:**

1. **Pastikan ESP32 menyala** (power ON)
2. **Upload kode yang ada command `LCD`** (sudah ada di kode Anda)
3. **Ketik command di Serial Monitor:**
   ```
   LCD
   ```
4. **LCD akan menampilkan:**
   ```
   Line 0: LCD TEST 1234
   Line 1: ABCDEFGHIJKLMNOP
   ```
5. **Putar potentiometer** dengan obeng kecil (+):
   - Putar **searah jarum jam** → Text makin gelap
   - Putar **berlawanan jarum jam** → Text makin terang
   - Cari posisi yang pas (text jelas terlihat)

### **Visual Guide:**

```
                LCD I2C Module (tampak belakang)
                ================================

    ┌─────────────────────────────────────────┐
    │                                         │
    │         ┌───────────────────┐           │
    │         │   LCD Display     │           │
    │         │   (tampak depan)  │           │
    │         └───────────────────┘           │
    │                                         │
    │         [Potentiometer] ← Putar ini!    │
    │              │                          │
    │              ▼                          │
    │         (✚) ← Obeng (+)                 │
    │                                         │
    │  VCC  GND  SDA  SCL                     │
    │   ●    ●    ●    ●                      │
    └─────────────────────────────────────────┘
```

### **Tips Adjust:**
- Putar **perlahan** (1/4 putaran dulu)
- Lihat perubahan di LCD
- Jika makin blank, putar arah sebaliknya
- Posisi yang pas: **text hitam jelas di background biru/hijau**

---

## 🧪 **LANGKAH 5: Test LCD dengan Command**

Setelah potentiometer di-adjust, test dengan command:

### **Command 1: `SCAN`**
```
SCAN

Output:
[I2C] Device found at 0x27
```
✅ LCD terdeteksi!

---

### **Command 2: `LCD`**
```
LCD

Output di Serial Monitor:
[LCD] ✅ Test message sent

Output di LCD:
Line 0: LCD TEST 1234
Line 1: ABCDEFGHIJKLMNOP
```
✅ LCD berfungsi dengan baik!

---

## 🔥 **Troubleshooting Lanjutan**

### **Problem 1: I2C Scan Tidak Menemukan Device**

**Penyebab:**
- Kabel SDA/SCL salah pin
- Kabel SDA/SCL putus
- LCD I2C module rusak

**Solusi:**
1. **Cek ulang pin:**
   - SDA → GPIO 21 (baris kiri pin #11)
   - SCL → GPIO 22 (baris kiri pin #12)
2. **Ganti kabel** SDA dan SCL
3. **Test dengan LCD lain** (jika ada)
4. **Cek solder** di belakang LCD I2C module (ada yang lepas?)

---

### **Problem 2: LCD Terdeteksi Tapi Text Tidak Muncul**

**Penyebab:**
- Contrast terlalu tinggi/rendah
- Code tidak mengirim data ke LCD

**Solusi:**
1. **Adjust potentiometer** (putar perlahan)
2. **Test dengan command `LCD`**
3. **Restart ESP32** (unplug dan plug lagi USB)

---

### **Problem 3: LCD Muncul Kotak-Kotak Hitam**

**Penyebab:**
- Contrast terlalu tinggi
- LCD initialization error

**Solusi:**
1. **Adjust potentiometer** (putar berlawanan jarum jam)
2. **Restart ESP32**
3. **Ketik `LCD` untuk test**

---

### **Problem 4: LCD Text Buram/Samar**

**Penyebab:**
- Contrast terlalu rendah

**Solusi:**
1. **Adjust potentiometer** (putar searah jarum jam)
2. Cari posisi yang pas

---

### **Problem 5: LCD Berkedip-Kedip**

**Penyebab:**
- Power tidak stabil (voltase drop)
- Kabel VCC/GND longgar

**Solusi:**
1. **Cek koneksi VCC dan GND** (pastikan kencang)
2. **Gunakan USB charger 5V 2A** (bukan USB laptop yang lemah)
3. **Cek kabel USB** (ganti jika rusak)

---

## 📋 **Checklist Lengkap - Print & Ceklis!**

### **Wiring:**
- [ ] VCC LCD → VIN ESP32 (5V)
- [ ] GND LCD → GND ESP32
- [ ] SDA LCD → GPIO 21 ESP32
- [ ] SCL LCD → GPIO 22 ESP32
- [ ] Semua kabel terpasang kencang (tidak longgar)

### **Power:**
- [ ] ESP32 tersambung USB (power ON)
- [ ] LED power ESP32 menyala
- [ ] LCD backlight menyala (ada cahaya)

### **I2C Scan:**
- [ ] Serial Monitor menampilkan "I2C device found at 0x27"
- [ ] Jika tidak, cek wiring SDA/SCL

### **Potentiometer:**
- [ ] Sudah putar potentiometer (cari posisi yang pas)
- [ ] Text LCD jelas terlihat (hitam di background biru/hijau)

### **Test:**
- [ ] Command `SCAN` → Device found
- [ ] Command `LCD` → Text muncul di LCD

---

## 🎯 **Quick Fix Summary**

### **90% Kasus LCD Tidak Nyala:**

1. **Potentiometer tidak di-adjust** ← **PALING SERING!**
   - **Solusi:** Putar potentiometer sampai text terlihat

2. **Kabel SDA/SCL salah pin**
   - **Solusi:** Pastikan SDA=GPIO21, SCL=GPIO22

3. **Power tidak masuk (VCC/GND)**
   - **Solusi:** Cek kabel merah (VCC) dan hitam (GND)

4. **Contrast terlalu tinggi/rendah**
   - **Solusi:** Adjust potentiometer

5. **I2C address salah**
   - **Solusi:** Code sudah auto-detect (0x27 atau 0x3F)

---

## 🔧 **Command untuk Troubleshooting**

```cpp
// Di Serial Monitor (115200 baud):

SCAN     → Scan I2C devices
LCD      → Test LCD display
TEST     → Test semua sensor (termasuk cek LCD)
```

---

## 📸 **Foto untuk Bantuan**

Jika masih tidak berhasil, kirim foto:

1. **Foto LCD dari depan** (apakah ada backlight?)
2. **Foto LCD dari belakang** (lihat potentiometer dan solder)
3. **Foto wiring LCD** (4 kabel: VCC, GND, SDA, SCL)
4. **Screenshot Serial Monitor** (output saat startup)

---

## 🎉 **Selesai!**

**90% kasus LCD tidak nyala karena potentiometer belum di-adjust!**

Coba putar potentiometer dulu sebelum bongkar wiring! 🔧

**File ini:** `IOT/LCD_QUICK_FIX.md`
