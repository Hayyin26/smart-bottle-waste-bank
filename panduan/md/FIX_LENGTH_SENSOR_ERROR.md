# 🔧 Fix: Length Sensor Mengembalikan -1

## ❌ Masalah
```
[Bottle] REJECTED - Height: 15cm, Length: -1cm, Weight: 12.88g
```

Sensor LENGTH mengembalikan nilai `-1` yang berarti **sensor gagal membaca jarak**.

---

## 🔍 Penyebab

Nilai `-1` dikembalikan oleh fungsi `readUltrasonicStableCm()` ketika:

1. **Tidak ada pembacaan valid** dari sensor ultrasonic
2. **Semua pembacaan di luar range valid** (2-350 cm)
3. **Sensor timeout** (pulseIn mengembalikan 0)

### Kemungkinan Penyebab Hardware:

#### 1. **Masalah Wiring/Koneksi**
- ❌ Kabel sensor LENGTH (TRIG=GPIO5, ECHO=GPIO15) longgar
- ❌ Kabel tidak terhubung dengan benar
- ❌ Breadboard kontak buruk

#### 2. **Masalah Power Supply**
- ❌ Tegangan VCC sensor tidak stabil (harus 5V)
- ❌ Ground tidak terhubung dengan baik
- ❌ Power supply ESP32 tidak cukup untuk semua sensor

#### 3. **Masalah Sensor**
- ❌ Sensor rusak atau mati
- ❌ Sensor kotor (debu/kotoran di transducer)

#### 4. **Interferensi Sensor**
- ❌ Kedua sensor ultrasonic terlalu dekat (saling mengganggu)
- ❌ Delay antar pembacaan terlalu pendek
- ❌ Objek reflektif di sekitar sensor

#### 5. **Posisi Botol Salah**
- ❌ Botol tidak sejajar dengan sensor LENGTH
- ❌ Jarak terlalu dekat (< 2cm) atau terlalu jauh (> 350cm)
- ❌ Permukaan botol tidak rata (tidak memantulkan gelombang dengan baik)

---

## ✅ Solusi yang Sudah Diterapkan

### 1. **Tingkatkan Timing Sensor**
```cpp
// SEBELUM:
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);

// SESUDAH:
delayMicroseconds(5);   // Lebih stabil
digitalWrite(trigPin, HIGH);
delayMicroseconds(15);  // Pulse lebih panjang
```

### 2. **Tingkatkan Timeout**
```cpp
// SEBELUM:
unsigned long duration = pulseIn(echoPin, HIGH, 30000);

// SESUDAH:
unsigned long duration = pulseIn(echoPin, HIGH, 50000); // Timeout lebih lama
```

### 3. **Tingkatkan Delay Antar Pembacaan**
```cpp
// SEBELUM:
delay(SENSOR_INTER_DELAY_MS);  // 60ms

// SESUDAH:
delay(100);  // 100ms untuk menghindari interferensi
```

### 4. **Tambahkan Debug Logging**
```cpp
// Sekarang akan print:
[Sensor] TIMEOUT on pin TRIG=5 ECHO=15
[Sensor] NO VALID SAMPLES from TRIG=5 ECHO=15
[Sensor] Height: 15cm, Length: -1cm, Weight: 12.88g
```

### 5. **Tambahkan Command TEST**
Sekarang bisa test sensor manual dengan command `TEST` di Serial Monitor.

---

## 🛠️ Cara Troubleshooting

### Step 1: Upload Kode Baru
```bash
cd IOT/PBL
pio run -t upload
pio device monitor
```

### Step 2: Test Sensor Manual
Di Serial Monitor, ketik:
```
TEST
```

Output yang diharapkan:
```
[Test] Reading HEIGHT sensor (5 samples)...
  Sample 1: 15 cm
  Sample 2: 15 cm
  Sample 3: 16 cm
  Sample 4: 15 cm
  Sample 5: 15 cm
[Test] HEIGHT (stable): 15 cm

[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: 21 cm
  Sample 3: 20 cm
  Sample 4: 20 cm
  Sample 5: 21 cm
[Test] LENGTH (stable): 20 cm
```

### Step 3: Cek Wiring
Jika masih `-1`, cek wiring sensor LENGTH:

```
Sensor LENGTH (HC-SR04):
  VCC  → 5V ESP32
  GND  → GND ESP32
  TRIG → GPIO 5
  ECHO → GPIO 15
```

**PENTING:** 
- Pastikan kabel tidak longgar
- Cek dengan multimeter: VCC harus 5V, GND harus 0V
- Coba ganti kabel jika perlu

### Step 4: Cek Sensor
1. **Cek Visual:**
   - Apakah ada kerusakan fisik?
   - Apakah transducer bersih?

2. **Cek dengan LED:**
   - Hubungkan LED ke TRIG pin
   - Seharusnya LED berkedip saat sensor bekerja

3. **Swap Sensor:**
   - Tukar sensor HEIGHT dan LENGTH
   - Jika masalah pindah ke HEIGHT, berarti sensor rusak

### Step 5: Cek Posisi Botol
1. **Jarak:** Botol harus 5-30cm dari sensor LENGTH
2. **Sejajar:** Botol harus horizontal dan sejajar dengan sensor
3. **Permukaan:** Pastikan permukaan botol bersih dan rata

### Step 6: Kurangi Interferensi
1. **Pisahkan Sensor:**
   - Jarak minimal 10cm antara sensor HEIGHT dan LENGTH
   - Arahkan sensor ke arah berbeda

2. **Tambah Delay:**
   - Jika masih error, tingkatkan delay di kode:
   ```cpp
   delay(150);  // Dari 100 ke 150
   ```

---

## 📊 Interpretasi Output Debug

### ✅ Normal (Sensor Bekerja)
```
[Sensor] Height: 15cm, Length: 20cm, Weight: 12.88g
```

### ❌ Sensor Timeout
```
[Sensor] TIMEOUT on pin TRIG=5 ECHO=15
[Sensor] NO VALID SAMPLES from TRIG=5 ECHO=15
[Sensor] Height: 15cm, Length: -1cm, Weight: 12.88g
```
**Artinya:** Sensor tidak menerima echo (pantulan gelombang)
**Solusi:** Cek wiring, cek sensor, cek posisi botol

### ⚠️ Pembacaan Tidak Stabil
```
[Test] Reading LENGTH sensor (5 samples)...
  Sample 1: 20 cm
  Sample 2: -1 cm
  Sample 3: 21 cm
  Sample 4: -1 cm
  Sample 5: 20 cm
[Test] LENGTH (stable): 20 cm
```
**Artinya:** Sensor kadang timeout, kadang berhasil
**Solusi:** Cek power supply, kurangi interferensi, bersihkan sensor

---

## 🔧 Solusi Hardware (Jika Software Tidak Cukup)

### 1. **Tambah Kapasitor**
Tambahkan kapasitor 100µF di VCC dan GND sensor untuk stabilkan power:
```
VCC ----[100µF]---- GND
```

### 2. **Gunakan Level Shifter**
Jika ECHO pin sensor 5V, gunakan voltage divider atau level shifter:
```
ECHO (5V) ----[1kΩ]---- GPIO15 (3.3V)
                |
              [2kΩ]
                |
               GND
```

### 3. **Pisahkan Power Supply**
Gunakan power supply terpisah untuk sensor (5V external) dengan ground yang sama.

### 4. **Ganti Sensor**
Jika semua cara gagal, kemungkinan sensor rusak. Ganti dengan sensor baru.

---

## 📝 Checklist Troubleshooting

- [ ] Upload kode baru dengan debug logging
- [ ] Jalankan command `TEST` di Serial Monitor
- [ ] Cek output: apakah ada "TIMEOUT" atau "NO VALID SAMPLES"?
- [ ] Cek wiring: VCC, GND, TRIG, ECHO
- [ ] Cek tegangan: VCC = 5V, GND = 0V
- [ ] Cek sensor: tidak ada kerusakan fisik
- [ ] Cek posisi botol: jarak 5-30cm, sejajar
- [ ] Cek interferensi: pisahkan sensor minimal 10cm
- [ ] Coba swap sensor HEIGHT dan LENGTH
- [ ] Coba tambah kapasitor di VCC
- [ ] Coba ganti kabel
- [ ] Coba ganti sensor

---

## 🎯 Expected Result

Setelah troubleshooting, output seharusnya:
```
[Sensor] Height: 15cm, Length: 20cm, Weight: 12.88g
[Bottle] Size: KECIL
[Bottle] Points: 5
```

Tidak ada lagi `-1` di Length! ✅
