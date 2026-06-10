# ⚡ Quick Fix: Length Sensor = -1

## 🚨 Problem
```
[Bottle] REJECTED - Height: 15cm, Length: -1cm, Weight: 12.88g
```

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
- ✅ **GOOD:** `LENGTH (stable): 20 cm`
- ❌ **BAD:** `LENGTH (stable): -1 cm`

### 3️⃣ Check Wiring (5 minutes)
```
Sensor LENGTH (HC-SR04):
  VCC  → 5V     ✓ Cek ini!
  TRIG → GPIO 5  ✓ Cek ini!
  ECHO → GPIO 15 ✓ Cek ini! (Paling sering longgar)
  GND  → GND    ✓ Cek ini!
```

**Action:**
- Cabut dan pasang ulang semua kabel
- Pastikan tidak ada kabel yang longgar
- Cek breadboard kontak baik

### 4️⃣ Check Bottle Position (2 minutes)
```
Sensor LENGTH
    ↓
[========] ← Botol horizontal
    ↑
  5-30cm
```

**Action:**
- Letakkan botol 10-20cm dari sensor LENGTH
- Pastikan botol horizontal (tidur)
- Pastikan botol sejajar dengan sensor

### 5️⃣ Swap Sensors (5 minutes)
```
1. Tukar kabel sensor HEIGHT dan LENGTH
2. Test lagi dengan command TEST
3. Jika HEIGHT jadi error → Sensor LENGTH rusak
4. Jika LENGTH jadi normal → Masalah di pin ESP32
```

### 6️⃣ Add Capacitor (10 minutes)
```
VCC ----[100µF]---- GND
         ↑
    Dekat sensor
```

**Action:**
- Tambah kapasitor 100µF di VCC dan GND sensor LENGTH
- Letakkan sedekat mungkin dengan sensor

### 7️⃣ Replace Sensor (15 minutes)
Jika semua cara gagal, ganti sensor baru.

---

## 🔍 Debug Output

### ✅ Normal
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: 20 cm
  Sample 3: 21 cm
  Sample 4: 20 cm
  Sample 5: 20 cm
[Test] LENGTH (stable): 20 cm
```

### ❌ Wiring Problem
```
[Sensor] TIMEOUT on pin TRIG=5 ECHO=15
[Sensor] NO VALID SAMPLES from TRIG=5 ECHO=15
[Test] LENGTH (stable): -1 cm
```
**Fix:** Cek kabel ECHO (GPIO 15)

### ⚠️ Unstable
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: -1 cm
  Sample 3: 21 cm
  Sample 4: -1 cm
  Sample 5: 20 cm
```
**Fix:** Tambah kapasitor, kurangi interferensi

---

## 📋 Checklist

- [ ] Upload kode baru
- [ ] Test dengan command `TEST`
- [ ] Cek kabel VCC (5V)
- [ ] Cek kabel GND
- [ ] Cek kabel TRIG (GPIO 5)
- [ ] Cek kabel ECHO (GPIO 15) ⚠️ PRIORITAS!
- [ ] Cek posisi botol (10-20cm)
- [ ] Swap sensor HEIGHT dan LENGTH
- [ ] Tambah kapasitor 100µF
- [ ] Ganti sensor baru

---

## 🎯 Expected Result

Setelah fix:
```
[Sensor] Height: 15cm, Length: 20cm, Weight: 12.88g
[Bottle] Size: KECIL
[Bottle] Points: 5
✅ SUCCESS!
```

---

## 📚 More Info

- **Detailed Guide:** `FIX_LENGTH_SENSOR_ERROR.md`
- **Wiring Check:** `SENSOR_WIRING_CHECK.md`
