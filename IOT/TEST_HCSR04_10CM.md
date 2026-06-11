# 📏 Test Sensor HC-SR04 - Deteksi Objek 10cm

## 🎯 **Tujuan Test**

Memastikan sensor HC-SR04 dapat mendeteksi objek pada jarak **10cm** dengan akurat.

---

## 🔧 **Cara Test dengan Command `TEST`**

### **Langkah 1: Upload Kode & Buka Serial Monitor**

1. Upload kode `main.cpp` ke ESP32
2. Buka Serial Monitor (115200 baud)
3. Tunggu ESP32 selesai booting

---

### **Langkah 2: Jalankan Command TEST**

Ketik di Serial Monitor:
```
TEST
```

Output akan muncul:
```
[Command] Testing sensors...
=================================
[Test] Reading HEIGHT sensor (5 samples)...
  Sample 1: 25 cm
  Sample 2: 24 cm
  Sample 3: 25 cm
  Sample 4: 25 cm
  Sample 5: 24 cm
[Test] HEIGHT (stable): 25 cm

[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 30 cm
  Sample 2: 29 cm
  Sample 3: 30 cm
  Sample 4: 30 cm
  Sample 5: 29 cm
[Test] LENGTH (stable): 30 cm

[Test] Reading METAL sensor...
[Test] METAL: NOT DETECTED

=================================
[Test] Summary:
  Height: 25 cm
  Length: 30 cm
  Metal: NO
=================================
```

---

### **Langkah 3: Test dengan Objek di Jarak 10cm**

1. **Siapkan objek test** (buku, tangan, kardus, dll)
2. **Letakkan objek 10cm di depan sensor HEIGHT**
3. **Ketik command:** `TEST`
4. **Lihat output:**

```
[Test] HEIGHT (stable): 10 cm   ← Harusnya ~10cm
```

5. **Pindah ke sensor LENGTH**
6. **Letakkan objek 10cm di depan sensor LENGTH**
7. **Ketik command:** `TEST`
8. **Lihat output:**

```
[Test] LENGTH (stable): 10 cm   ← Harusnya ~10cm
```

---

## 📏 **Cara Mengukur Jarak 10cm dengan Akurat**

### **Metode 1: Gunakan Penggaris**
```
Sensor HC-SR04          Objek (buku/tangan)
     ║                         ║
     ║←────── 10cm ──────→║
     ║                         ║
   [●●]                      [■]
  (TRIG/ECHO)           (Permukaan flat)
```

**Cara:**
1. Letakkan penggaris di depan sensor
2. Hitung dari **permukaan sensor** (tabung ultrasonik) ke objek
3. Pastikan tepat **10cm**

---

### **Metode 2: Gunakan Kertas + Printout**

Print garis ini di kertas:
```
┌────────────────────────────────────────────────┐
│                                                │
│  [●●] ←10cm→ ║                                 │
│ Sensor      Objek                              │
│                                                │
└────────────────────────────────────────────────┘
```

**Cara:**
1. Tempelkan kertas di depan sensor
2. Letakkan objek di garis 10cm
3. Test dengan command `TEST`

---

## 🧪 **Expected Result (Hasil yang Benar)**

### **✅ Sensor Berfungsi Normal:**
```
Jarak Real: 10cm
Output Sensor: 9-11cm (toleransi ±1cm)

Contoh output:
[Test] HEIGHT (stable): 10 cm   ✅
[Test] LENGTH (stable): 10 cm   ✅
```

### **⚠️ Sensor Kurang Akurat:**
```
Jarak Real: 10cm
Output Sensor: 8cm atau 13cm (error >10%)

Contoh output:
[Test] HEIGHT (stable): 8 cm    ⚠️ (error -20%)
[Test] LENGTH (stable): 13 cm   ⚠️ (error +30%)
```

**Penyebab:**
- Objek terlalu kecil (permukaan < 5cm × 5cm)
- Objek miring/tidak flat
- Objek menyerap suara (kain, busa)
- Sensor kotor/berdebu

---

### **❌ Sensor Error/Timeout:**
```
Jarak Real: 10cm
Output Sensor: -1 cm atau 0 cm (timeout)

Contoh output:
[Test] HEIGHT (stable): -1 cm   ❌ TIMEOUT!
[Test] LENGTH (stable): 0 cm    ❌ ERROR!
```

**Penyebab:**
- Voltage divider tidak ada (ECHO pin rusak ESP32!)
- Kabel TRIG/ECHO salah atau putus
- Sensor rusak

---

## 📊 **Test dengan Berbagai Jarak**

### **Test 1: Jarak 5cm (Minimum)**
```
Letakkan objek 5cm dari sensor
Ketik: TEST

Expected:
[Test] HEIGHT (stable): 5 cm   ✅ (toleransi 4-6cm)
```

---

### **Test 2: Jarak 10cm (Target Anda)**
```
Letakkan objek 10cm dari sensor
Ketik: TEST

Expected:
[Test] HEIGHT (stable): 10 cm  ✅ (toleransi 9-11cm)
```

---

### **Test 3: Jarak 20cm**
```
Letakkan objek 20cm dari sensor
Ketik: TEST

Expected:
[Test] HEIGHT (stable): 20 cm  ✅ (toleransi 19-21cm)
```

---

### **Test 4: Jarak 50cm**
```
Letakkan objek 50cm dari sensor
Ketik: TEST

Expected:
[Test] HEIGHT (stable): 50 cm  ✅ (toleransi 48-52cm)
```

---

### **Test 5: Tanpa Objek (>400cm)**
```
Jangan letakkan objek di depan sensor (kosong)
Ketik: TEST

Expected:
[Test] HEIGHT (stable): -1 cm  atau >350cm (timeout/out of range)
```

---

## 🎯 **Test dalam Konteks Sistem Botol**

Botol diletakkan **HORIZONTAL** (tidur), sensor akan mengukur:

### **Sensor HEIGHT (Diameter Botol):**
```
        Sensor HEIGHT
             ║
             ║
             ▼
        [●●] ← 10cm → [Botol tidur]
                         ╱───╲
                        │     │ ← Diameter ~10cm
                         ╲___╱
```

**Test:**
1. Letakkan botol HORIZONTAL (tidur) di depan sensor HEIGHT
2. Jarak sensor ke permukaan botol: ~10cm
3. Ketik: `TEST`
4. Output: `[Test] HEIGHT (stable): 10 cm` ✅

---

### **Sensor LENGTH (Panjang Botol):**
```
    Sensor LENGTH
         ║
         ║
         ▼
    [●●] ← 10cm → [Botol tidur]
                    ═══════════════ ← Panjang botol
                         (ujung botol)
```

**Test:**
1. Letakkan botol HORIZONTAL (tidur)
2. Sensor LENGTH di samping botol (mengukur ke ujung)
3. Jarak sensor ke ujung botol: ~10cm
4. Ketik: `TEST`
5. Output: `[Test] LENGTH (stable): 10 cm` ✅

---

## 🔍 **Troubleshooting**

### **Problem 1: Sensor Timeout (-1 cm)**

**Penyebab:**
- Voltage divider tidak ada di ECHO pin
- Kabel ECHO putus
- Sensor rusak

**Solusi:**
1. ⚠️ **CEK VOLTAGE DIVIDER!** (WAJIB untuk ECHO pin)
   ```
   ECHO pin → [1kΩ] → GPIO ESP32
                  ↓
               [2kΩ]
                  ↓
                GND
   ```
2. Ganti kabel ECHO
3. Test dengan sensor lain

---

### **Problem 2: Pembacaan Tidak Stabil (5cm, 15cm, 8cm, 12cm)**

**Penyebab:**
- Objek terlalu kecil (permukaan < 5cm × 5cm)
- Objek miring/tidak tegak lurus sensor
- Objek menyerap suara (kain, busa)

**Solusi:**
1. Gunakan objek flat dan besar (buku, kardus)
2. Pastikan objek tegak lurus sensor (90°)
3. Hindari objek berbahan kain/busa
4. Gunakan objek keras (plastik, kayu, logam)

---

### **Problem 3: Pembacaan Selalu Sama (tidak berubah)**

**Penyebab:**
- Sensor stuck/frozen
- TRIG pin tidak terhubung
- Code tidak running

**Solusi:**
1. Restart ESP32 (unplug dan plug USB)
2. Cek kabel TRIG (GPIO 4 atau GPIO 5)
3. Re-upload kode

---

### **Problem 4: Pembacaan Error pada Jarak Dekat (<5cm)**

**Penyebab:**
- HC-SR04 minimum range = 2cm
- Dead zone sensor (terlalu dekat)

**Solusi:**
1. Jangan test di bawah 5cm
2. Untuk proyek botol, jarak minimal 5cm sudah cukup

---

## 📋 **Checklist Test**

Print dan ceklis:

### **Hardware:**
- [ ] Sensor HEIGHT terpasang (TRIG=GPIO4, ECHO=GPIO18+VD)
- [ ] Sensor LENGTH terpasang (TRIG=GPIO5, ECHO=GPIO12+VD)
- [ ] Voltage divider ada di ECHO pin (WAJIB!)
- [ ] Power 5V terhubung (VCC sensor)
- [ ] GND terhubung

### **Software:**
- [ ] Kode ter-upload ke ESP32
- [ ] Serial Monitor terbuka (115200 baud)
- [ ] Command `TEST` berfungsi

### **Test Jarak 10cm:**
- [ ] Objek flat (buku/kardus) siap
- [ ] Penggaris siap (untuk ukur 10cm)
- [ ] Test sensor HEIGHT di 10cm → Output: 9-11cm ✅
- [ ] Test sensor LENGTH di 10cm → Output: 9-11cm ✅
- [ ] Test dengan botol HORIZONTAL → Output sesuai ✅

### **Variasi Test:**
- [ ] Test jarak 5cm → Output: 4-6cm ✅
- [ ] Test jarak 20cm → Output: 19-21cm ✅
- [ ] Test jarak 50cm → Output: 48-52cm ✅
- [ ] Test tanpa objek → Output: -1 atau >350cm ✅

---

## 🎓 **Tips untuk Akurasi Tinggi**

### **1. Pilih Objek yang Tepat:**
✅ **BAIK:**
- Buku (permukaan flat & keras)
- Kardus tebal
- Papan kayu
- Plastik keras
- Botol PET (untuk test real)

❌ **BURUK:**
- Kain (menyerap suara)
- Busa (menyerap suara)
- Kertas tipis (goyang-goyang)
- Objek kecil (<5cm × 5cm)

---

### **2. Posisi Objek:**
```
BENAR (90°):                SALAH (miring):
  Sensor                      Sensor
    ║                           ║
    ▼                           ▼
  [●●] → ║ Objek             [●●] → ╱ Objek
         ║                           ╱
       (tegak lurus)            (pantul kemana-mana)
```

---

### **3. Lingkungan Test:**
✅ **BAIK:**
- Ruangan normal (tidak terlalu bising)
- Tidak ada angin kencang
- Tidak ada objek lain di dekat sensor

❌ **BURUK:**
- Di luar ruangan (angin)
- Di dekat kipas angin
- Banyak objek bergerak

---

### **4. Serial Monitor Output:**

Ketik `TEST` berulang kali, lihat konsistensi:
```
Test #1: HEIGHT = 10 cm
Test #2: HEIGHT = 10 cm
Test #3: HEIGHT = 11 cm
Test #4: HEIGHT = 10 cm
Test #5: HEIGHT = 10 cm

Average: 10.2 cm ✅ (konsisten!)
Error: ±1cm (toleransi OK!)
```

---

## 🎉 **Expected Output untuk Jarak 10cm**

```
$ TEST

[Command] Testing sensors...
=================================
[Test] Reading HEIGHT sensor (5 samples)...
  Sample 1: 10 cm
  Sample 2: 11 cm
  Sample 3: 10 cm
  Sample 4: 10 cm
  Sample 5: 10 cm
[Test] HEIGHT (stable): 10 cm

[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 10 cm
  Sample 2: 10 cm
  Sample 3: 9 cm
  Sample 4: 10 cm
  Sample 5: 10 cm
[Test] LENGTH (stable): 10 cm

[Test] Reading METAL sensor...
[Test] METAL: NOT DETECTED

=================================
[Test] Summary:
  Height: 10 cm     ← ✅ SESUAI TARGET!
  Length: 10 cm     ← ✅ SESUAI TARGET!
  Metal: NO
=================================
```

---

## 📝 **Kesimpulan**

✅ **Sensor BAIK** jika:
- Output 10cm ±1cm (toleransi 9-11cm)
- Konsisten (test 5x hasilnya mirip)
- Tidak timeout (-1 cm)

⚠️ **Sensor KURANG BAIK** jika:
- Output 10cm ±3cm (error >30%)
- Tidak konsisten (5cm, 15cm, 8cm, berganti-ganti)
- Kadang timeout

❌ **Sensor RUSAK** jika:
- Selalu timeout (-1 cm)
- Output tidak berubah (stuck)
- Error >50% (output 20cm padahal real 10cm)

---

**File ini:** `IOT/TEST_HCSR04_10CM.md`

Selamat testing! 🚀
