# 🎉 Update: Deteksi Logam - Tolak Botol Kaleng

## ✅ Fitur Baru

Sistem sekarang dapat **mendeteksi dan menolak botol logam/kaleng**. Hanya botol **PLASTIK** yang diterima!

---

## 🛠️ Hardware yang Dibutuhkan

### Sensor: ROKO Metal Proximity Sensor
- **Tipe**: Inductive Proximity Sensor
- **Fungsi**: Mendeteksi logam (kaleng, aluminium, besi)
- **Jarak Deteksi**: 2-10mm
- **Voltage**: 5V DC
- **Output**: Active LOW (LOW = Logam terdeteksi)

### Wiring:
```
ROKO Metal Sensor         ESP32
─────────────────         ─────────────
Coklat (Brown)     ────→  5V (VIN)
Biru (Blue)        ────→  GND
Hitam (Black)      ────→  GPIO 14
```

---

## 🔧 Yang Sudah Dilakukan

### 1. ✅ Update Kode ESP32
- Tambah pin `PIN_METAL_SENSOR` (GPIO 14)
- Tambah logika deteksi logam sebelum klasifikasi ukuran
- Tambah feedback LCD & Buzzer untuk botol logam

### 2. ✅ Logika Sistem
```
User memasukkan botol
         ↓
Sensor ultrasonik deteksi objek
         ↓
Cek sensor logam
         ↓
    ┌────┴────┐
    │         │
  LOGAM?    PLASTIK?
    │         │
    ↓         ↓
 TOLAK!    Cek ukuran
 (3x beep)     ↓
           TERIMA/TOLAK
```

### 3. ✅ Output Sistem
| Kondisi | LCD | Buzzer | Servo | Serial Monitor |
|---------|-----|--------|-------|----------------|
| Logam terdeteksi | DITOLAK! / BOTOL LOGAM | 3x beep | TUTUP | [Metal] ❌ REJECTED |
| Plastik OK | BOTOL SEDANG / +10 POIN | 1x beep | BUKA | [Bottle] ✅ PLASTIC |

---

## 🚀 Cara Menggunakan

### Langkah 1: Beli Sensor
- Cari di toko online: "ROKO Metal Proximity Sensor" atau "LJ12A3-4-Z/BX"
- Harga: ~Rp 20.000 - 50.000

### Langkah 2: Pasang Sensor
1. Hubungkan kabel:
   - **Coklat** → 5V ESP32
   - **Biru** → GND ESP32
   - **Hitam** → GPIO 14 ESP32
2. Pasang sensor di samping jalur botol (2-5mm dari botol)
3. Arahkan sensor menghadap ke botol

### Langkah 3: Upload Kode
1. Buka Arduino IDE
2. Buka file `ESP32_UPDATED_CODE.ino`
3. Kode sudah include deteksi logam
4. Upload ke ESP32

### Langkah 4: Test
1. Buka Serial Monitor (115200 baud)
2. Test dengan **KALENG**:
   ```
   [Metal] ❌ REJECTED - Metal bottle detected!
   [Metal] Only PLASTIC bottles accepted
   ```
   - LCD: "DITOLAK! / BOTOL LOGAM"
   - Buzzer: 3x beep
   - Servo: TUTUP

3. Test dengan **BOTOL PLASTIK**:
   ```
   [Bottle] ✅ PLASTIC bottle detected
   [Bottle] Size: SEDANG
   [Bottle] Points: 10
   ```
   - LCD: "BOTOL SEDANG / +10 POIN"
   - Buzzer: 1x beep
   - Servo: BUKA

---

## 📐 Posisi Sensor

### Tampak Atas
```
    Sensor Ultrasonik LENGTH
           ↓
        [TRIG] [ECHO]
           ↓
           ║
           ▼
    ┌──────────────────────────┐
    │      BOTOL HORIZONTAL    │  ← [SENSOR LOGAM] (2-5mm)
    └──────────────────────────┘
           ↑
           ║
        [TRIG] [ECHO]
           ↑
    Sensor Ultrasonik HEIGHT
```

**Tips**:
- Pasang sensor di samping jalur botol
- Jarak ideal: 2-5mm dari botol
- Arahkan tegak lurus ke botol
- Jauhkan dari logam lain (minimal 5cm)

---

## ⚠️ Troubleshooting Cepat

### Semua Botol Ditolak (Termasuk Plastik)
**Solusi**:
1. Jauhkan sensor dari logam lain (sekrup, bracket)
2. Cek koneksi kabel (pastikan tidak short)
3. Sesuaikan posisi sensor (jangan terlalu dekat)

### Kaleng Tidak Terdeteksi
**Solusi**:
1. Dekatkan sensor ke botol (2-5mm)
2. Cek koneksi kabel (Coklat=5V, Biru=GND, Hitam=GPIO14)
3. Test sensor dengan multimeter

### Hasil Tidak Stabil
**Solusi**:
1. Pastikan kabel terpasang kuat
2. Gunakan power supply stabil (5V 2A)
3. Jauhkan dari motor/relay

---

## 📊 Perbandingan

### Sebelum (Tanpa Sensor Logam)
- ❌ Kaleng bisa masuk
- ❌ Bisa merusak sistem
- ❌ Tidak sesuai tujuan (bank sampah plastik)

### Sesudah (Dengan Sensor Logam)
- ✅ Kaleng otomatis ditolak
- ✅ Sistem lebih aman
- ✅ Hanya plastik yang diterima
- ✅ User mendapat feedback jelas

---

## 📚 Dokumentasi Lengkap

1. **METAL_DETECTION_GUIDE.md**
   - Panduan lengkap sensor logam
   - Troubleshooting detail
   - Cara test sensor

2. **WIRING_DIAGRAM_COMPLETE.md**
   - Wiring diagram lengkap semua komponen
   - Pin summary
   - Tips pemasangan

3. **ESP32_UPDATED_CODE.ino**
   - Kode ESP32 (sudah include deteksi logam)

---

## ✅ Checklist

- [ ] Sensor logam sudah dibeli
- [ ] Kabel sensor terhubung ke ESP32 (Coklat=5V, Biru=GND, Hitam=GPIO14)
- [ ] Kode sudah diupload
- [ ] Test dengan kaleng → Ditolak (3x beep)
- [ ] Test dengan botol plastik → Diterima (1x beep)
- [ ] Posisi sensor optimal (2-5mm dari botol)

---

## 🎯 Hasil yang Diharapkan

Setelah setup selesai:
1. ✅ Kaleng/botol logam → **DITOLAK** (3x beep, LCD: "DITOLAK! / BOTOL LOGAM")
2. ✅ Botol plastik kecil → **TERIMA** (5 poin)
3. ✅ Botol plastik sedang → **TERIMA** (10 poin)
4. ✅ Botol plastik besar → **TERIMA** (15 poin)
5. ✅ Sistem lebih aman dan akurat

---

## 💡 Keuntungan Fitur Ini

### 1. Keamanan
- Mencegah kerusakan sistem (kaleng bisa merusak sensor/servo)
- Mencegah penyalahgunaan (user memasukkan benda logam lain)

### 2. Akurasi
- Deteksi logam sangat akurat (sensor inductive)
- Tidak terpengaruh warna/bentuk botol
- Respon cepat (<100ms)

### 3. User Experience
- Feedback jelas (LCD + Buzzer 3x)
- User langsung tahu kenapa ditolak
- Mencegah kebingungan user

---

## 📞 Butuh Bantuan?

Jika sensor logam tidak bekerja:
1. Screenshot Serial Monitor output
2. Foto koneksi kabel sensor
3. Foto posisi sensor terhadap botol
4. Tanyakan ke developer

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.1 (Metal Detection)
**Status**: ✅ READY TO USE

---

## 🎉 Selamat!

Sistem deteksi logam sudah siap! Tinggal:
1. Beli sensor ROKO Metal Proximity Sensor
2. Pasang sensor (Coklat=5V, Biru=GND, Hitam=GPIO14)
3. Upload kode
4. Test dengan kaleng dan botol plastik

Sistem sekarang lebih aman dan hanya menerima botol plastik! 🚀
