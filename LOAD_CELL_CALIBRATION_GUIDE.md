# 🔧 Panduan Kalibrasi Load Cell HX711

## 📋 **Persiapan**

### **Alat yang Dibutuhkan:**
1. ESP32 dengan load cell HX711 terpasang
2. Beban standar (100g, 200g, atau 500g)
3. Kabel USB untuk koneksi ke komputer
4. PlatformIO atau Arduino IDE

### **Wiring Load Cell:**
```
Load Cell Red    → E+ (Excitation+)
Load Cell Black  → E- (Excitation-)
Load Cell White  → A- (Signal-)
Load Cell Green  → A+ (Signal+)

HX711 VCC → 3.3V ESP32
HX711 GND → GND ESP32
HX711 DT  → GPIO 26
HX711 SCK → GPIO 27
```

---

## 🚀 **Langkah Kalibrasi**

### **Step 1: Upload Program Kalibrasi**

1. Buka file `IOT/PBL/calibrate_loadcell.cpp`
2. Pastikan wiring sudah benar
3. Upload ke ESP32
4. Buka Serial Monitor (115200 baud)

### **Step 2: Tare (Reset ke Nol)**

1. **Pastikan tidak ada beban di load cell**
2. Tekan tombol apapun di Serial Monitor
3. Program akan melakukan tare (reset ke 0)
4. Tunggu hingga muncul "✅ Tare complete!"

### **Step 3: Kalibrasi dengan Beban Standar**

1. **Siapkan beban standar** (contoh: 100g)
2. **Masukkan berat beban** di Serial Monitor (contoh: `100`)
3. **Letakkan beban di load cell**
4. Tekan tombol apapun
5. Program akan menghitung calibration factor

### **Step 4: Catat Calibration Factor**

Contoh output:
```
=================================
CALIBRATION RESULT
=================================
Raw reading: 42009
Known weight: 100.0 g
Calibration factor: 420.0983
```

**Catat nilai `420.0983`** (nilai Anda mungkin berbeda)

### **Step 5: Update main.cpp**

1. Buka file `IOT/PBL/src/main.cpp`
2. Cari baris:
   ```cpp
   scale.set_scale(420.0983);  // ← Ganti dengan nilai kalibrasi Anda
   ```
3. Ganti dengan nilai calibration factor Anda
4. Upload main.cpp ke ESP32

### **Step 6: Testing**

1. Program kalibrasi akan otomatis masuk mode testing
2. Letakkan berbagai beban untuk test akurasi
3. Tekan `r` untuk reset ke 0
4. Tekan `q` untuk keluar

---

## 🎯 **Contoh Kalibrasi**

### **Contoh 1: Beban 100g**
```
Enter the weight in grams: 100
Place the weight on the load cell now
Press any key when ready...

Reading weight...

=================================
CALIBRATION RESULT
=================================
Raw reading: 42009
Known weight: 100.0 g
Calibration factor: 420.0983

NEXT STEPS:
1. Copy this line to main.cpp:
   scale.set_scale(420.0983);
```

### **Contoh 2: Beban 200g**
```
Enter the weight in grams: 200
Place the weight on the load cell now
Press any key when ready...

Reading weight...

=================================
CALIBRATION RESULT
=================================
Raw reading: 84018
Known weight: 200.0 g
Calibration factor: 420.0900

NEXT STEPS:
1. Copy this line to main.cpp:
   scale.set_scale(420.0900);
```

---

## ⚠️ **Troubleshooting**

### **Problem 1: "Load cell not found"**
**Solusi:**
- Cek koneksi kabel DT dan SCK
- Pastikan VCC terhubung ke 3.3V (bukan 5V)
- Pastikan GND terhubung dengan benar
- Coba swap kabel DT dan SCK

### **Problem 2: Pembacaan tidak stabil**
**Solusi:**
- Pastikan load cell terpasang dengan benar
- Hindari getaran atau guncangan
- Tunggu beberapa detik setelah meletakkan beban
- Gunakan beban yang lebih berat (200g atau 500g)

### **Problem 3: Nilai negatif**
**Solusi:**
- Lakukan tare ulang (tekan `r`)
- Pastikan tidak ada beban saat tare
- Coba kalibrasi ulang dari awal

### **Problem 4: Akurasi rendah**
**Solusi:**
- Gunakan beban standar yang akurat
- Lakukan kalibrasi dengan beban yang lebih berat
- Pastikan load cell tidak tertekan saat tare
- Coba kalibrasi beberapa kali dan ambil rata-rata

---

## 📊 **Tabel Referensi Berat Botol**

| Ukuran | Volume | Berat Kosong | Range Kalibrasi |
|--------|--------|--------------|-----------------|
| Kecil  | 330ml  | 12.5-18g     | 12.5-18g        |
| Sedang | 600ml  | 20-23g       | 20-23g          |
| Besar  | 1.5L   | 25-28g       | 25-28g          |

**Tips:**
- Gunakan botol asli untuk testing
- Timbang botol dengan timbangan digital untuk referensi
- Sesuaikan range di `main.cpp` jika perlu

---

## 🔄 **Re-Kalibrasi**

Lakukan re-kalibrasi jika:
1. Pembacaan tidak akurat
2. Ganti load cell baru
3. Ganti ESP32 baru
4. Setelah 6 bulan penggunaan

---

## 📝 **Checklist Kalibrasi**

- [ ] Wiring load cell sudah benar
- [ ] Upload program kalibrasi
- [ ] Tare tanpa beban
- [ ] Kalibrasi dengan beban standar
- [ ] Catat calibration factor
- [ ] Update main.cpp
- [ ] Upload main.cpp
- [ ] Testing dengan berbagai beban
- [ ] Verifikasi akurasi ±2g

---

## 💡 **Tips Kalibrasi**

1. **Gunakan beban standar yang akurat**
   - Timbangan digital
   - Beban kalibrasi resmi
   - Botol air mineral (cek label)

2. **Lakukan di tempat yang stabil**
   - Meja yang tidak bergetar
   - Hindari angin
   - Suhu ruangan stabil

3. **Kalibrasi beberapa kali**
   - Ambil rata-rata dari 3-5 kalibrasi
   - Gunakan beban yang berbeda
   - Verifikasi konsistensi

4. **Simpan nilai kalibrasi**
   - Catat di dokumentasi
   - Backup di file terpisah
   - Tulis di sticker di ESP32

---

## 🎓 **Penjelasan Teknis**

### **Apa itu Calibration Factor?**
Calibration factor adalah nilai konversi dari raw reading (nilai ADC) ke satuan gram.

**Formula:**
```
calibration_factor = raw_reading / known_weight
weight (gram) = raw_reading / calibration_factor
```

### **Kenapa Perlu Kalibrasi?**
Setiap load cell memiliki karakteristik yang berbeda:
- Sensitivitas berbeda
- Resistansi berbeda
- Tegangan output berbeda

Kalibrasi memastikan pembacaan akurat untuk load cell spesifik Anda.

### **Apa itu Tare?**
Tare adalah proses reset ke nol untuk menghilangkan:
- Berat wadah
- Offset sensor
- Noise elektronik

---

## 📞 **Support**

Jika masih ada masalah:
1. Cek Serial Monitor untuk error message
2. Verifikasi wiring dengan multimeter
3. Test dengan program sederhana (baca raw value)
4. Ganti load cell jika rusak

---

## 📚 **Referensi**

- [HX711 Library Documentation](https://github.com/bogde/HX711)
- [Load Cell Wiring Guide](https://learn.sparkfun.com/tutorials/load-cell-amplifier-hx711-breakout-hookup-guide)
- [ESP32 Pinout Reference](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)
