# ⚡ Opsi Power Supply untuk Metal Sensor

## 🤔 **Kenapa Butuh Power Supply Terpisah?**

### **Alasan Utama:**
Metal proximity sensor (seperti LJ12A3) biasanya dirancang untuk **aplikasi industri** yang menggunakan voltase tinggi:
- **Input**: 6-36V DC (tergantung model)
- **Output**: Sama dengan input (6-36V)
- **ESP32**: Hanya tahan maksimal **3.3V**

Jadi ada **2 masalah**:
1. Sensor butuh voltase tinggi (6-36V)
2. ESP32 hanya tahan 3.3V

---

## 🔍 **Cek Jenis Sensor Anda Dulu!**

### **Ada 3 Jenis Sensor Metal:**

#### **1. Sensor Industri (6-36V DC)** ⚠️
```
Model: LJ12A3-4-Z/BX, LJ18A3-8-Z/BX
Input: 6-36V DC
Output: 6-36V (NPN/PNP)
Harga: Rp 30.000 - 50.000

❌ TIDAK bisa langsung ke ESP32
✅ BUTUH voltage divider atau level shifter
✅ BUTUH power supply terpisah (12V)
```

#### **2. Sensor 5V (Arduino Compatible)** ✅
```
Model: Capacitive/Inductive 5V
Input: 5V DC
Output: 0-5V (digital)
Harga: Rp 20.000 - 40.000

✅ Bisa pakai USB 5V ESP32
⚠️ Tetap butuh voltage divider (5V → 3.3V)
✅ TIDAK butuh power supply terpisah
```

#### **3. Sensor 3.3V (ESP32 Compatible)** ✅✅
```
Model: Capacitive/Inductive 3.3V
Input: 3.3V DC
Output: 0-3.3V (digital)
Harga: Rp 25.000 - 45.000

✅ Langsung ke ESP32 (tanpa voltage divider!)
✅ TIDAK butuh power supply terpisah
✅ Paling mudah untuk ESP32
```

---

## 💡 **Solusi Berdasarkan Jenis Sensor**

### **Opsi 1: Sensor 6-36V (Industri) - Butuh Power Terpisah**

#### **Setup A: Dual Power Supply**
```
USB 5V ──→ ESP32
12V DC ──→ Metal Sensor

Wiring:
12V+ ──→ Sensor Coklat
GND  ──→ Sensor Biru (common dengan ESP32)
Sensor Hitam ──→ Voltage Divider ──→ GPIO 25

Voltage Divider:
Sensor Hitam ──[10kΩ]──┬──→ GPIO 25
                        │
                     [4.7kΩ]
                        │
                       GND
```

#### **Setup B: Single 12V + Buck Converter** (Lebih Rapi)
```
12V DC Adapter
    │
    ├──→ Metal Sensor (12V)
    │
    └──→ Buck Converter (12V → 5V)
         │
         └──→ ESP32 VIN

Keuntungan:
✅ Hanya 1 power supply
✅ Lebih rapi
✅ Lebih stabil

Kekurangan:
❌ Butuh buck converter (Rp 10.000)
```

---

### **Opsi 2: Sensor 5V - Tidak Butuh Power Terpisah!**

```
USB 5V ──┬──→ ESP32 VIN
         │
         └──→ Sensor VCC (5V)

Wiring:
ESP32 5V ──→ Sensor VCC
ESP32 GND ──→ Sensor GND
Sensor OUT ──→ Voltage Divider ──→ GPIO 25

Voltage Divider (5V → 3.3V):
Sensor OUT ──[2.2kΩ]──┬──→ GPIO 25
                      │
                   [3.3kΩ]
                      │
                     GND

Output: 5V × (3.3kΩ / 5.5kΩ) = 3V ✅
```

**Keuntungan:**
- ✅ Tidak butuh power supply terpisah
- ✅ Cukup USB 5V
- ✅ Lebih sederhana

**Kekurangan:**
- ⚠️ Tetap butuh voltage divider (5V → 3.3V)

---

### **Opsi 3: Sensor 3.3V - Paling Mudah!**

```
USB 5V ──→ ESP32 VIN
         │
         └──→ ESP32 3.3V regulator
              │
              └──→ Sensor VCC (3.3V)

Wiring:
ESP32 3.3V ──→ Sensor VCC
ESP32 GND  ──→ Sensor GND
Sensor OUT ──→ GPIO 25 (LANGSUNG!)

✅ TIDAK butuh voltage divider!
✅ TIDAK butuh power supply terpisah!
✅ Paling sederhana!
```

**Keuntungan:**
- ✅ Tidak butuh power supply terpisah
- ✅ Tidak butuh voltage divider
- ✅ Langsung colok ke ESP32
- ✅ Paling aman

**Kekurangan:**
- ⚠️ Jarak deteksi lebih pendek (2-5mm)
- ⚠️ Kurang cocok untuk aplikasi industri

---

## 🛒 **Rekomendasi Sensor untuk ESP32**

### **Pilihan Terbaik: Sensor 3.3V atau 5V**

#### **1. Capacitive Proximity Sensor 3.3V-5V**
```
Nama: Capacitive Touch Sensor (TTP223)
Input: 3.3V - 5V
Output: 0-3.3V / 0-5V
Jarak: 2-10mm
Harga: Rp 5.000 - 15.000

✅ Murah
✅ Mudah
✅ Tidak butuh voltage divider (jika 3.3V)
❌ Jarak pendek
```

#### **2. Inductive Proximity Sensor 5V**
```
Nama: LJ12A3-4-Z/BY (5V version)
Input: 5V DC
Output: 0-5V
Jarak: 4mm
Harga: Rp 25.000 - 40.000

✅ Jarak lebih jauh
✅ Lebih akurat
⚠️ Butuh voltage divider sederhana
❌ Lebih mahal
```

#### **3. Hall Effect Sensor (Alternatif)**
```
Nama: A3144 Hall Sensor
Input: 3.3V - 5V
Output: 0-3.3V / 0-5V
Jarak: 5-15mm
Harga: Rp 3.000 - 10.000

✅ Sangat murah
✅ Mudah
✅ Tidak butuh voltage divider
❌ Hanya detect magnet (bukan semua logam)
```

---

## 📊 **Perbandingan Opsi**

| Opsi | Power Supply | Voltage Divider | Kompleksitas | Biaya | Rekomendasi |
|------|--------------|-----------------|--------------|-------|-------------|
| Sensor 12V | ❌ Butuh 12V terpisah | ✅ Butuh | Tinggi | Mahal | Industri |
| Sensor 5V | ✅ USB 5V cukup | ⚠️ Butuh sederhana | Sedang | Sedang | **Recommended** |
| Sensor 3.3V | ✅ USB 5V cukup | ❌ Tidak butuh | Rendah | Sedang | **Best for ESP32** |
| Hall Sensor | ✅ USB 5V cukup | ❌ Tidak butuh | Rendah | Murah | Budget |

---

## 🎯 **Rekomendasi Saya**

### **Untuk Proyek Anda (Bank Sampah):**

#### **Pilihan 1: Sensor 5V (Recommended)** ⭐
```
Sensor: Inductive Proximity 5V
Power: USB 5V (tidak butuh power terpisah)
Wiring: Butuh voltage divider sederhana

Keuntungan:
✅ Tidak butuh power supply terpisah
✅ Jarak deteksi cukup (4-8mm)
✅ Akurat untuk botol logam
✅ Harga terjangkau

Wiring:
ESP32 5V ──→ Sensor VCC
ESP32 GND ──→ Sensor GND
Sensor OUT ──[2.2kΩ]──┬──→ GPIO 25
                      │
                   [3.3kΩ]
                      │
                     GND
```

#### **Pilihan 2: Sensor 3.3V (Easiest)** ⭐⭐
```
Sensor: Capacitive Proximity 3.3V
Power: ESP32 3.3V (tidak butuh power terpisah)
Wiring: Langsung colok (tidak butuh voltage divider)

Keuntungan:
✅ Tidak butuh power supply terpisah
✅ Tidak butuh voltage divider
✅ Paling mudah
✅ Paling aman

Wiring:
ESP32 3.3V ──→ Sensor VCC
ESP32 GND  ──→ Sensor GND
Sensor OUT ──→ GPIO 25 (LANGSUNG!)
```

---

## 🔧 **Update Kode untuk Sensor 5V/3.3V**

Kode tetap sama! Tidak perlu ubah apapun:

```cpp
#define PIN_METAL_SENSOR 25

void setup() {
  pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);
}

bool readMetalSensor() {
  return digitalRead(PIN_METAL_SENSOR) == LOW;
}
```

---

## 💰 **Estimasi Biaya**

### **Opsi 1: Sensor 12V (Industri)**
```
Sensor LJ12A3 12V:     Rp 35.000
Power Supply 12V 2A:   Rp 50.000
Resistor 10kΩ + 4.7kΩ: Rp 1.000
─────────────────────────────────
TOTAL:                 Rp 86.000
```

### **Opsi 2: Sensor 5V (Recommended)**
```
Sensor Inductive 5V:   Rp 30.000
Resistor 2.2kΩ + 3.3kΩ: Rp 1.000
─────────────────────────────────
TOTAL:                 Rp 31.000 ✅
```

### **Opsi 3: Sensor 3.3V (Easiest)**
```
Sensor Capacitive 3.3V: Rp 25.000
─────────────────────────────────
TOTAL:                  Rp 25.000 ✅✅
```

---

## 🎓 **Kesimpulan**

### **Kenapa Dokumentasi Saya Pakai 12V?**
Karena sensor LJ12A3 (yang paling umum di pasaran) adalah versi 12V. Tapi sebenarnya ada opsi lebih mudah!

### **Rekomendasi Saya:**
1. **Beli sensor 5V atau 3.3V** (lebih mudah, lebih murah)
2. **Tidak perlu power supply terpisah** (cukup USB 5V)
3. **Voltage divider sederhana** (atau tidak perlu sama sekali)

### **Jika Sudah Punya Sensor 12V:**
Tetap bisa dipakai, tapi butuh:
- Power supply 12V terpisah
- Voltage divider 10kΩ + 4.7kΩ

---

## 🛒 **Link Pembelian (Tokopedia/Shopee)**

### **Sensor 5V:**
Cari: "Proximity Sensor 5V NPN" atau "Inductive Sensor 5V"

### **Sensor 3.3V:**
Cari: "Capacitive Touch Sensor 3.3V" atau "TTP223"

### **Hall Sensor (Alternatif):**
Cari: "Hall Effect Sensor A3144" atau "Hall Sensor Module"

---

## 📞 **Pertanyaan Lanjutan?**

**Q: Sensor saya tidak ada tulisan voltase, bagaimana?**
A: Cek dengan multimeter. Ukur voltase di pin VCC saat sensor nyala.

**Q: Bisa pakai sensor 12V tanpa power terpisah?**
A: Tidak bisa. Sensor 12V butuh minimal 6V untuk bekerja.

**Q: Voltage divider wajib?**
A: Wajib jika output sensor > 3.3V. Jika sensor 3.3V, tidak perlu.

**Q: Bisa pakai sensor HP (capacitive touch)?**
A: Bisa! Tapi jarak deteksi sangat pendek (1-2mm).

---

**✅ Kesimpulan: Gunakan sensor 5V atau 3.3V untuk kemudahan!**
