# ⚡ Quick Fix: Sensor Metal Proximity Tidak Berfungsi

## 🚨 Problem
Sensor metal proximity tidak mendeteksi logam, atau selalu mendeteksi logam padahal tidak ada.

## ✅ Quick Solutions (Try in Order)

### 1️⃣ Upload New Code (2 minutes)
```bash
cd IOT/PBL
pio run -t upload
pio device monitor
```

### 2️⃣ Test Sensor (1 minute)
Di Serial Monitor, ketik:
```
TEST
```

Lihat output:
```
[Test] METAL Raw Value: 1 (0=LOW, 1=HIGH)
[Test] METAL Detected: NO
```

- ✅ **GOOD:** Tanpa logam = NO, Dengan logam = YES
- ❌ **BAD:** Terbalik atau tidak berubah

### 3️⃣ Monitor Real-time (2 minutes)
Di Serial Monitor, ketik:
```
METAL
```

Output:
```
[Metal] Raw: 1 | Detected: NO
```

Dekatkan logam (2-10mm), seharusnya berubah:
```
[Metal] Raw: 0 | Detected: YES
```

**Jika terbalik, lanjut ke step 4.**

### 4️⃣ Fix Logika Terbalik (5 minutes)

**Buka:** `IOT/PBL/src/main.cpp`

**Cari fungsi:** `readMetalSensor()`

**Ubah dari:**
```cpp
return sensorValue == LOW;  // Active LOW
```

**Menjadi:**
```cpp
return sensorValue == HIGH; // Active HIGH
```

Upload ulang dan test lagi.

### 5️⃣ Check Wiring (5 minutes)
```
Sensor Metal Proximity:
  VCC  → 5V (atau 3.3V) ✓ Cek ini!
  OUT  → GPIO 25        ✓ Cek ini!
  GND  → GND            ✓ Cek ini!
```

**Action:**
- Cabut dan pasang ulang semua kabel
- Pastikan tidak ada kabel yang longgar
- Cek LED indikator sensor (jika ada)

### 6️⃣ Calibrate Sensitivity (10 minutes)
Jika sensor punya potentiometer:
- **Putar searah jarum jam** = tingkatkan sensitivitas
- **Putar berlawanan jarum jam** = kurangi sensitivitas
- Test dengan command `METAL` sambil adjust

### 7️⃣ Replace Sensor (15 minutes)
Jika semua cara gagal, ganti sensor baru.

---

## 🔍 Debug Output

### ✅ Normal
```
Tanpa logam:
[Metal] Raw: 1 | Detected: NO

Dengan logam:
[Metal] Raw: 0 | Detected: YES
```

### ⚠️ Terbalik (Logika Salah)
```
Tanpa logam:
[Metal] Raw: 1 | Detected: YES  ← Salah!

Dengan logam:
[Metal] Raw: 0 | Detected: NO   ← Salah!
```
**Fix:** Ubah `== LOW` ke `== HIGH` di `readMetalSensor()`

### ❌ Tidak Berubah (Sensor Mati)
```
Tanpa logam:
[Metal] Raw: 1 | Detected: NO

Dengan logam:
[Metal] Raw: 1 | Detected: NO   ← Tidak berubah!
```
**Fix:** Cek wiring, cek power, ganti sensor

### ⚠️ Selalu Terdeteksi (False Positive)
```
Tanpa logam:
[Metal] Raw: 0 | Detected: YES  ← Selalu YES!

Dengan logam:
[Metal] Raw: 0 | Detected: YES
```
**Fix:** Kurangi sensitivitas, jauhkan dari logam lain

---

## 📋 Checklist

- [ ] Upload kode baru
- [ ] Test dengan command `TEST`
- [ ] Test dengan command `METAL`
- [ ] Cek kabel VCC (5V atau 3.3V)
- [ ] Cek kabel OUT (GPIO 25) ⚠️ PRIORITAS!
- [ ] Cek kabel GND
- [ ] Cek LED indikator sensor
- [ ] Balik logika jika terbalik
- [ ] Kalibrasi sensitivitas
- [ ] Ganti sensor baru

---

## ⚠️ Important Notes

### Jenis Sensor
- **Inductive (NPN):** Active LOW, deteksi logam ferrous
- **Inductive (PNP):** Active HIGH, deteksi logam ferrous
- **Hall Effect:** Hanya deteksi **magnet**, bukan logam biasa!

### Jarak Deteksi
- Sensor metal proximity: **2-10mm**
- Terlalu jauh = tidak terdeteksi
- Terlalu dekat = bisa false positive

### Tegangan
- Cek datasheet sensor: 5V atau 3.3V?
- Salah tegangan = sensor tidak bekerja

---

## 🎯 Expected Result

Setelah fix:
```
[Metal] Raw: 0 | Detected: YES
[Metal] ⚠️ LOGAM TERDETEKSI - REJECT
[LCD] BOTOL CACAT
[LCD] ADA LOGAM
✅ SUCCESS!
```

---

## 📚 More Info

- **Detailed Guide:** `FIX_METAL_SENSOR_NOT_WORKING.md`
- **Commands:** `TEST` (snapshot), `METAL` (real-time monitoring)
