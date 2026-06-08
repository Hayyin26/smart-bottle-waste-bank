# 🔋 Cara Menggunakan Power Bank dengan Sensor HOKO SN04-N

## ⚠️ Masalah
- Sensor HOKO SN04-N butuh **6-36V DC**
- Power bank hanya output **5V**
- Sensor tidak akan bekerja dengan 5V

## ✅ Solusi: Step-Up Converter

### Komponen yang Dibutuhkan

| Item | Spesifikasi | Harga | Toko |
|------|-------------|-------|------|
| Step-Up Converter | MT3608 atau XL6009 (5V→12V) | Rp 10.000-20.000 | Tokopedia/Shopee |
| Level Shifter | 4-channel bidirectional | Rp 5.000-10.000 | Tokopedia/Shopee |
| Power Bank | 5V, min 2A | - | Sudah punya |
| Kabel USB | Micro USB atau Type-C | - | Sudah punya |

**Total: ~Rp 15.000-30.000**

---

## 🔌 Wiring Diagram

```
┌─────────────┐
│ Power Bank  │
│   (5V 2A)   │
└──────┬──────┘
       │ USB Cable
       ↓
┌─────────────────────┐
│  Step-Up Converter  │
│   (MT3608/XL6009)   │
│   IN: 5V            │
│   OUT: 12V (adjust) │
└──────┬──────────────┘
       │ 12V
       ↓
┌─────────────────────┐
│  Sensor HOKO SN04-N │
│  Coklat: VCC (12V)  │
│  Biru: GND          │
│  Hitam: OUT         │
└──────┬──────────────┘
       │ Signal (12V)
       ↓
┌─────────────────────┐
│   Level Shifter     │
│   HV: 12V           │
│   LV: 3.3V          │
└──────┬──────────────┘
       │ Signal (3.3V)
       ↓
┌─────────────────────┐
│      ESP32          │
│   GPIO 25           │
└─────────────────────┘
```

---

## 📐 Wiring Detail

### 1. Power Bank → Step-Up Converter
```
Power Bank USB:
  (+5V Red)  ──> Step-Up IN+
  (GND Black)──> Step-Up IN-
```

### 2. Step-Up Converter → Sensor
```
Step-Up Converter (adjust ke 12V):
  OUT+ ──> Coklat (VCC sensor)
  OUT- ──> Biru (GND sensor)
        └──> GND ESP32 (PENTING: Common ground!)
```

### 3. Sensor → Level Shifter → ESP32
```
Sensor Output:
  Hitam (OUT) ──> Level Shifter HV1

Level Shifter:
  HV  ──> 12V (dari step-up OUT+)
  GND ──> Common ground
  LV  ──> 3.3V (dari ESP32)
  LV1 ──> GPIO 25 ESP32
```

### 4. ESP32 Power
```
Power Bank USB (port kedua) ──> ESP32 USB
```

**⚠️ PENTING:** Gunakan power bank dengan **2 USB port** atau gunakan USB splitter!

---

## 🔧 Setup Step-Up Converter

### Langkah Kalibrasi:

1. **Disconnect semua beban** (sensor, ESP32)
2. **Hubungkan power bank** ke step-up converter IN
3. **Ukur output dengan multimeter:**
   - Merah probe → OUT+
   - Hitam probe → OUT-
4. **Putar potentiometer** (screw kecil di module):
   - Searah jarum jam = naikkan voltage
   - Berlawanan jarum jam = turunkan voltage
5. **Target: 12V** (±0.5V)
6. **Disconnect power bank** setelah selesai adjust

**⚠️ JANGAN adjust saat ada beban terhubung!**

---

## 🔌 Wiring Lengkap (Step by Step)

### Step 1: Setup Step-Up Converter
```
1. Solder kabel merah (+) dan hitam (-) ke IN+ dan IN-
2. Solder kabel merah (+) dan hitam (-) ke OUT+ dan OUT-
3. Hubungkan power bank ke IN
4. Adjust voltage ke 12V dengan multimeter
5. Disconnect power bank
```

### Step 2: Hubungkan Sensor
```
1. Coklat sensor → OUT+ step-up
2. Biru sensor → OUT- step-up
3. Hitam sensor → Level shifter HV1 (belum)
```

### Step 3: Setup Level Shifter
```
Level Shifter:
  HV  → OUT+ step-up (12V)
  GND → OUT- step-up (common ground)
  LV  → 3.3V ESP32
  GND → GND ESP32
  HV1 → Hitam sensor (signal)
  LV1 → GPIO 25 ESP32
```

### Step 4: Power ESP32
```
Power Bank (port 2) → ESP32 USB
```

### Step 5: Common Ground
```
⚠️ SANGAT PENTING!
Semua GND harus terhubung:
  - Step-up OUT-
  - Sensor Biru
  - Level shifter GND
  - ESP32 GND
```

---

## 🧪 Testing

### Test 1: Cek Voltage
```
1. Hubungkan power bank
2. Ukur step-up output: Harus 12V
3. Ukur sensor VCC: Harus 12V
4. Ukur ESP32 VCC: Harus 5V (dari USB)
```

### Test 2: Cek Sensor
```
1. Upload kode ke ESP32
2. Buka Serial Monitor
3. Ketik: METAL
4. Lihat output:
   - Tanpa logam: Raw: 1 | Detected: NO
   - Dengan logam: Raw: 0 | Detected: YES
```

### Test 3: Cek LED Sensor
```
LED merah di sensor:
  - Menyala = Ada logam terdeteksi
  - Mati = Tidak ada logam
```

---

## ⚠️ Troubleshooting

### Sensor Tidak Menyala
```
Cek:
  [ ] Step-up output = 12V?
  [ ] Kabel coklat terhubung ke OUT+?
  [ ] Kabel biru terhubung ke OUT-?
  [ ] Power bank masih ada daya?
```

### Sensor Menyala tapi ESP32 Tidak Deteksi
```
Cek:
  [ ] Level shifter terpasang benar?
  [ ] HV = 12V, LV = 3.3V?
  [ ] Common ground terhubung?
  [ ] Kabel hitam sensor ke HV1?
  [ ] LV1 ke GPIO 25?
```

### ESP32 Restart Terus
```
Kemungkinan:
  - Power bank tidak cukup arus (min 2A)
  - Step-up converter konsumsi terlalu besar
  - Short circuit di wiring

Solusi:
  - Gunakan power bank min 2A
  - Cek wiring, pastikan tidak ada short
  - Gunakan power bank dengan 2 port USB
```

---

## 💡 Tips

1. **Gunakan power bank min 10.000mAh** untuk daya tahan lama
2. **Gunakan kabel USB berkualitas** (tidak terlalu panjang)
3. **Solder semua koneksi** untuk kontak yang baik
4. **Gunakan heatshrink** untuk isolasi
5. **Test step-up converter dulu** sebelum hubungkan sensor
6. **Cek common ground** dengan multimeter (continuity test)

---

## 📊 Konsumsi Daya

| Komponen | Konsumsi | Keterangan |
|----------|----------|------------|
| ESP32 | ~200mA | Normal operation |
| Sensor HOKO | ~10mA | Standby |
| Sensor HOKO | ~15mA | Saat deteksi |
| Step-up Converter | ~50mA | Efficiency loss |
| LCD | ~20mA | Backlight on |
| Servo | ~100-500mA | Saat bergerak |
| **TOTAL** | **~400-800mA** | Peak saat servo gerak |

**Estimasi daya tahan:**
- Power bank 10.000mAh: ~12-25 jam
- Power bank 20.000mAh: ~25-50 jam

---

## ✅ Checklist Final

Sebelum operasi:
- [ ] Step-up output = 12V (cek dengan multimeter)
- [ ] Sensor LED menyala (cek dengan power)
- [ ] Level shifter terpasang benar
- [ ] Common ground terhubung semua
- [ ] ESP32 bisa upload kode
- [ ] Command METAL berfungsi
- [ ] Sensor deteksi logam dengan benar
- [ ] Power bank terisi penuh

---

## 🎯 Kesimpulan

Setup ini **bisa bekerja** tapi **cukup rumit**. Jika Anda:
- ✅ Sudah punya sensor HOKO SN04-N → Ikuti guide ini
- ❌ Belum beli sensor → **Lebih baik beli sensor 5V!**

Sensor 5V jauh lebih mudah:
- Tidak perlu step-up converter
- Tidak perlu level shifter
- Wiring langsung ke ESP32
- Lebih murah dan lebih aman

**Rekomendasi: Ganti ke sensor 5V (LJ12A3-4-Z/BX)**
