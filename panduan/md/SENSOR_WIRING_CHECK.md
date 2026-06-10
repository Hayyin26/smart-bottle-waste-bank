# 🔌 Sensor Wiring Checklist

## 📍 Pin Configuration

### Sensor HEIGHT (HC-SR04)
```
┌─────────────────┐
│   HC-SR04 #1    │
│   (HEIGHT)      │
├─────────────────┤
│ VCC  → 5V       │
│ TRIG → GPIO 4   │
│ ECHO → GPIO 18  │
│ GND  → GND      │
└─────────────────┘
```

### Sensor LENGTH (HC-SR04)
```
┌─────────────────┐
│   HC-SR04 #2    │
│   (LENGTH)      │
├─────────────────┤
│ VCC  → 5V       │
│ TRIG → GPIO 5   │ ⚠️ CEK INI!
│ ECHO → GPIO 15  │ ⚠️ CEK INI!
│ GND  → GND      │
└─────────────────┘
```

### Load Cell (HX711)
```
┌─────────────────┐
│     HX711       │
├─────────────────┤
│ VCC  → 5V       │
│ DT   → GPIO 26  │
│ SCK  → GPIO 27  │
│ GND  → GND      │
└─────────────────┘
```

### Metal Sensor (Proximity)
```
┌─────────────────┐
│  Metal Sensor   │
├─────────────────┤
│ VCC  → 5V       │
│ OUT  → GPIO 25  │
│ GND  → GND      │
└─────────────────┘
```

### Other Components
```
┌─────────────────┐
│  Servo Motor    │
├─────────────────┤
│ VCC  → 5V       │
│ SIG  → GPIO 19  │
│ GND  → GND      │
└─────────────────┘

┌─────────────────┐
│     Buzzer      │
├─────────────────┤
│ +    → GPIO 23  │
│ -    → GND      │
└─────────────────┘

┌─────────────────┐
│    IR Lamp      │
├─────────────────┤
│ +    → GPIO 13  │
│ -    → GND      │
└─────────────────┘

┌─────────────────┐
│   LCD I2C       │
├─────────────────┤
│ VCC  → 5V       │
│ SDA  → GPIO 21  │
│ SCL  → GPIO 22  │
│ GND  → GND      │
└─────────────────┘
```

---

## 🔍 Troubleshooting Sensor LENGTH

### Step 1: Visual Check
```
[ ] Kabel VCC terhubung ke 5V
[ ] Kabel GND terhubung ke GND
[ ] Kabel TRIG terhubung ke GPIO 5
[ ] Kabel ECHO terhubung ke GPIO 15
[ ] Tidak ada kabel yang longgar
[ ] Tidak ada kabel yang putus
[ ] Breadboard kontak baik
```

### Step 2: Voltage Check (Multimeter)
```
[ ] VCC sensor = 5V (±0.2V)
[ ] GND sensor = 0V
[ ] TRIG pin = 0V saat idle, 3.3V saat pulse
[ ] ECHO pin = 0V saat idle, berubah saat ada echo
```

### Step 3: Swap Test
```
1. Catat hasil sensor HEIGHT (seharusnya normal)
2. Tukar kabel sensor HEIGHT dan LENGTH
3. Test lagi:
   - Jika HEIGHT jadi error → Sensor LENGTH rusak
   - Jika LENGTH jadi normal → Masalah di wiring/pin ESP32
```

### Step 4: Isolation Test
```
1. Disconnect semua sensor kecuali LENGTH
2. Test sensor LENGTH sendiri
3. Jika normal → Ada interferensi dari sensor lain
4. Jika masih error → Masalah di sensor/wiring
```

---

## ⚡ Common Issues

### Issue 1: Sensor Timeout (Length = -1)
**Symptoms:**
```
[Sensor] TIMEOUT on pin TRIG=5 ECHO=15
[Sensor] NO VALID SAMPLES from TRIG=5 ECHO=15
```

**Possible Causes:**
- ❌ Kabel ECHO tidak terhubung
- ❌ Sensor rusak
- ❌ Tidak ada objek di depan sensor (> 350cm)

**Solutions:**
1. Cek kabel ECHO (GPIO 15)
2. Cek sensor dengan multimeter
3. Letakkan objek 10-20cm di depan sensor

---

### Issue 2: Unstable Readings
**Symptoms:**
```
Sample 1: 20 cm
Sample 2: -1 cm
Sample 3: 21 cm
Sample 4: -1 cm
```

**Possible Causes:**
- ❌ Power supply tidak stabil
- ❌ Interferensi dari sensor lain
- ❌ Objek bergerak

**Solutions:**
1. Tambah kapasitor 100µF di VCC sensor
2. Pisahkan sensor HEIGHT dan LENGTH (min 10cm)
3. Tingkatkan delay antar pembacaan (100ms → 150ms)

---

### Issue 3: Wrong Readings (Selalu 2cm atau 350cm)
**Symptoms:**
```
[Sensor] Height: 2cm, Length: 2cm
```
atau
```
[Sensor] Height: 350cm, Length: 350cm
```

**Possible Causes:**
- ❌ Sensor kotor (debu di transducer)
- ❌ Objek terlalu dekat/jauh
- ❌ Permukaan objek tidak memantulkan gelombang

**Solutions:**
1. Bersihkan sensor dengan kuas lembut
2. Atur jarak objek 5-30cm
3. Gunakan objek dengan permukaan rata

---

## 🛠️ Hardware Fixes

### Fix 1: Add Decoupling Capacitor
```
        VCC (5V)
         |
        [C] 100µF
         |
        GND

Letakkan kapasitor sedekat mungkin dengan pin VCC sensor
```

### Fix 2: Add Pull-down Resistor (Optional)
```
ECHO ----[10kΩ]---- GND

Untuk stabilkan ECHO pin saat idle
```

### Fix 3: Separate Power Supply
```
ESP32 5V ----[Diode]---- Sensor VCC
                |
              [100µF]
                |
               GND

Diode mencegah backflow, kapasitor stabilkan tegangan
```

---

## 📊 Test Results Interpretation

### ✅ GOOD (Sensor Working)
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: 20 cm
  Sample 3: 21 cm
  Sample 4: 20 cm
  Sample 5: 20 cm
[Test] LENGTH (stable): 20 cm
```
**Action:** None, sensor bekerja normal

---

### ⚠️ UNSTABLE (Intermittent)
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: -1 cm
  Sample 3: 21 cm
  Sample 4: 20 cm
  Sample 5: -1 cm
[Test] LENGTH (stable): 20 cm
```
**Action:** 
1. Cek power supply
2. Tambah kapasitor
3. Kurangi interferensi

---

### ❌ FAILED (Sensor Not Working)
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: -1 cm
  Sample 2: -1 cm
  Sample 3: -1 cm
  Sample 4: -1 cm
  Sample 5: -1 cm
[Test] LENGTH (stable): -1 cm
```
**Action:**
1. Cek wiring (prioritas tinggi!)
2. Cek tegangan VCC/GND
3. Swap sensor untuk isolasi masalah
4. Ganti sensor jika rusak

---

## 🎯 Quick Fix Checklist

Jika sensor LENGTH mengembalikan `-1`, coba langkah ini secara berurutan:

1. **[5 menit]** Cek kabel ECHO (GPIO 15) - kabel paling sering longgar
2. **[5 menit]** Cek kabel TRIG (GPIO 5)
3. **[5 menit]** Cek VCC dan GND dengan multimeter
4. **[10 menit]** Swap sensor HEIGHT dan LENGTH
5. **[10 menit]** Test sensor LENGTH sendiri (disconnect sensor lain)
6. **[15 menit]** Tambah kapasitor 100µF di VCC
7. **[20 menit]** Ganti kabel sensor
8. **[30 menit]** Ganti sensor baru

**Total waktu troubleshooting: 30-60 menit**

---

## 📞 Need Help?

Jika masih error setelah semua langkah:

1. **Capture Serial Output:**
   ```
   pio device monitor > sensor_debug.txt
   ```
   Ketik `TEST` dan simpan output

2. **Take Photos:**
   - Foto wiring lengkap
   - Foto close-up sensor LENGTH
   - Foto breadboard connections

3. **Share Info:**
   - Model sensor (HC-SR04 atau lainnya)
   - ESP32 board type
   - Power supply (USB atau external)
   - Serial output dari command `TEST`

---

## ✅ Success Criteria

Sensor LENGTH bekerja normal jika:
- ✅ Command `TEST` menunjukkan pembacaan stabil (tidak ada -1)
- ✅ Semua 5 samples valid (tidak ada timeout)
- ✅ Pembacaan sesuai jarak sebenarnya (±2cm)
- ✅ Botol terdeteksi dan diklasifikasi dengan benar

**Expected Output:**
```
[Sensor] Height: 15cm, Length: 20cm, Weight: 12.88g
[Bottle] Size: KECIL
[Bottle] Points: 5
```
