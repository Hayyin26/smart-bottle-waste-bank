# 🎉 Update: Deteksi Botol Horizontal

## ✅ Apa yang Sudah Dilakukan?

Sistem IoT Bank Sampah sudah diupdate untuk mendeteksi botol yang diletakkan **HORIZONTAL (tidur)**, bukan vertikal.

---

## 📦 File yang Sudah Diupdate

### 1. Kode ESP32
- **File**: `ESP32_UPDATED_CODE.ino`
- **Perubahan**:
  - Sensor HEIGHT sekarang mengukur DIAMETER botol (5-11cm)
  - Sensor LENGTH sekarang mengukur PANJANG botol (15-35cm)
  - Fungsi `classifyBottle()` disesuaikan untuk botol horizontal
  - Range deteksi disesuaikan: KECIL (5-7cm × 15-20cm), SEDANG (6-8cm × 20-25cm), BESAR (8-11cm × 25-35cm)

### 2. Dokumentasi Baru
- `HORIZONTAL_BOTTLE_SUMMARY.md` - Ringkasan lengkap
- `HORIZONTAL_BOTTLE_SETUP_GUIDE.md` - Panduan setup detail
- `QUICK_ADJUST_RANGES.md` - Cara cepat sesuaikan range
- `SENSOR_POSITIONING_HORIZONTAL.md` - Diagram posisi sensor
- `BEFORE_AFTER_HORIZONTAL.md` - Perbandingan vertikal vs horizontal
- `QUICK_REFERENCE_HORIZONTAL.md` - Quick reference card
- `README_HORIZONTAL_UPDATE.md` - File ini

---

## 🚀 Cara Menggunakan

### Langkah 1: Upload Kode ke ESP32
1. Buka Arduino IDE
2. Buka file `ESP32_UPDATED_CODE.ino`
3. Pilih board: **ESP32 Dev Module**
4. Pilih port COM yang sesuai
5. Klik **Upload** (ikon panah kanan)
6. Tunggu sampai selesai

### Langkah 2: Test dengan Botol
1. Buka **Serial Monitor** (Tools → Serial Monitor)
2. Set baud rate ke **115200**
3. **Letakkan botol HORIZONTAL** (tidur) di antara sensor
4. Lihat output di Serial Monitor:
   ```
   [Bottle] Size: SEDANG
   [Bottle] Height: 7cm, Length: 22cm
   [Bottle] Points: 10
   ```

### Langkah 3: Sesuaikan Range (Jika Perlu)
Jika botol tidak terdeteksi atau salah klasifikasi:
1. Catat nilai Height & Length dari Serial Monitor
2. Buka `ESP32_UPDATED_CODE.ino`
3. Cari bagian `// --- KLASIFIKASI UKURAN BOTOL (cm) ---`
4. Sesuaikan nilai MIN/MAX sesuai botol Anda
5. Upload ulang kode
6. Test lagi

---

## 📐 Cara Kerja

### Posisi Botol: HORIZONTAL (Tidur)
```
    Sensor HEIGHT (Pin 4 & 18)
         ↓
         ║  Mengukur DIAMETER (5-11cm)
         ▼
    ┌──────────────────────────┐
    │      BOTOL HORIZONTAL    │
    └──────────────────────────┘
         ↑
         ║  Mengukur PANJANG (15-35cm)
    Sensor LENGTH (Pin 5 & 15)
```

### Klasifikasi Ukuran
| Ukuran | Diameter (cm) | Panjang (cm) | Poin | Contoh |
|--------|---------------|--------------|------|--------|
| KECIL  | 5-7          | 15-20        | 5    | Aqua 330ml |
| SEDANG | 6-8          | 20-25        | 10   | Aqua 600ml |
| BESAR  | 8-11         | 25-35        | 15   | Aqua 1.5L |

---

## 🔧 Penyesuaian Range

### Lokasi Kode
Buka `ESP32_UPDATED_CODE.ino`, cari sekitar baris 30-60:

```cpp
// --- KLASIFIKASI UKURAN BOTOL (cm) ---
// ⚠️ PENTING: Botol diletakkan HORIZONTAL (tidur)

// Botol KECIL (contoh: botol air mineral 330ml)
#define SMALL_HEIGHT_MIN 5      // Diameter min (sensor HEIGHT)
#define SMALL_HEIGHT_MAX 7      // Diameter max
#define SMALL_LENGTH_MIN 15     // Panjang min (sensor LENGTH)
#define SMALL_LENGTH_MAX 20     // Panjang max
#define SMALL_POINTS 5

// Botol SEDANG (contoh: botol air mineral 600ml)
#define MEDIUM_HEIGHT_MIN 6     // Diameter min (sensor HEIGHT)
#define MEDIUM_HEIGHT_MAX 8     // Diameter max
#define MEDIUM_LENGTH_MIN 20    // Panjang min (sensor LENGTH)
#define MEDIUM_LENGTH_MAX 25    // Panjang max
#define MEDIUM_POINTS 10

// Botol BESAR (contoh: botol air mineral 1.5L)
#define LARGE_HEIGHT_MIN 8      // Diameter min (sensor HEIGHT)
#define LARGE_HEIGHT_MAX 11     // Diameter max
#define LARGE_LENGTH_MIN 25     // Panjang min (sensor LENGTH)
#define LARGE_LENGTH_MAX 35     // Panjang max
#define LARGE_POINTS 15
```

### Cara Sesuaikan
1. **Lihat Serial Monitor** untuk nilai Height & Length saat test botol
2. **Bandingkan** dengan range di kode
3. **Sesuaikan** nilai MIN/MAX jika perlu
4. **Upload ulang** kode
5. **Test lagi** dengan botol

---

## ⚠️ Troubleshooting

### Problem 1: "UKURAN SALAH" terus muncul
**Gejala**: LCD menampilkan "UKURAN SALAH", botol tidak diterima

**Solusi**:
1. Lihat Serial Monitor untuk nilai Height & Length
2. Contoh output: `[Bottle] REJECTED - Height: 6cm, Length: 17cm`
3. Bandingkan dengan range di kode
4. Sesuaikan range agar nilai tersebut masuk kategori
5. Upload ulang kode

### Problem 2: Semua botol terdeteksi BESAR
**Gejala**: Botol kecil dan sedang juga terdeteksi sebagai BESAR

**Solusi**:
1. Range BESAR terlalu lebar
2. Persempit `LARGE_HEIGHT_MIN` dan `LARGE_LENGTH_MIN`
3. Contoh: Ubah `LARGE_HEIGHT_MIN` dari 8 → 9
4. Upload ulang kode

### Problem 3: Sensor membaca nilai aneh
**Gejala**: Serial Monitor menampilkan nilai tidak masuk akal (misal: -1cm, 200cm)

**Solusi**:
1. Cek koneksi kabel sensor (TRIG & ECHO)
2. Cek power supply (5V untuk sensor)
3. Pastikan sensor tidak tertutup/kotor
4. Ganti sensor jika rusak

### Problem 4: Botol tidak terdeteksi sama sekali
**Gejala**: LCD tetap "MASUKKAN BOTOL", tidak ada reaksi

**Solusi**:
1. Pastikan botol diletakkan HORIZONTAL (tidur)
2. Cek jarak sensor ke botol (harus 10-30cm)
3. Cek kabel sensor (TRIG & ECHO)
4. Lihat Serial Monitor untuk nilai sensor

---

## 📊 Contoh Penyesuaian

### Contoh 1: Botol Kecil Anda
**Hasil Test**:
- Diameter: 6cm
- Panjang: 17cm

**Range Saat Ini**:
```cpp
#define SMALL_HEIGHT_MIN 5      // OK (6 > 5)
#define SMALL_HEIGHT_MAX 7      // OK (6 < 7)
#define SMALL_LENGTH_MIN 15     // OK (17 > 15)
#define SMALL_LENGTH_MAX 20     // OK (17 < 20)
```
**Kesimpulan**: Range sudah cocok, tidak perlu ubah!

---

### Contoh 2: Botol Sedang Anda
**Hasil Test**:
- Diameter: 8cm
- Panjang: 24cm

**Range Saat Ini**:
```cpp
#define MEDIUM_HEIGHT_MIN 6     // OK (8 > 6)
#define MEDIUM_HEIGHT_MAX 8     // ⚠️ Pas batas! (8 = 8)
#define MEDIUM_LENGTH_MIN 20    // OK (24 > 20)
#define MEDIUM_LENGTH_MAX 25    // OK (24 < 25)
```
**Kesimpulan**: Bisa ubah `MEDIUM_HEIGHT_MAX` jadi 9 untuk toleransi lebih.

**Update**:
```cpp
#define MEDIUM_HEIGHT_MAX 9     // Dari 8 → 9
```

---

### Contoh 3: Botol Besar Anda
**Hasil Test**:
- Diameter: 10cm
- Panjang: 32cm

**Range Saat Ini**:
```cpp
#define LARGE_HEIGHT_MIN 8      // OK (10 > 8)
#define LARGE_HEIGHT_MAX 11     // OK (10 < 11)
#define LARGE_LENGTH_MIN 25     // OK (32 > 25)
#define LARGE_LENGTH_MAX 35     // OK (32 < 35)
```
**Kesimpulan**: Range sudah cocok, tidak perlu ubah!

---

## 📚 Dokumentasi Lengkap

Untuk informasi lebih detail, baca dokumentasi berikut:

1. **HORIZONTAL_BOTTLE_SUMMARY.md**
   - Ringkasan lengkap update
   - Status implementasi
   - Langkah selanjutnya

2. **HORIZONTAL_BOTTLE_SETUP_GUIDE.md**
   - Panduan setup lengkap
   - Troubleshooting detail
   - Tabel referensi ukuran botol umum

3. **QUICK_ADJUST_RANGES.md**
   - Panduan cepat sesuaikan range
   - Contoh kasus dan solusi
   - Template penyesuaian

4. **SENSOR_POSITIONING_HORIZONTAL.md**
   - Diagram posisi sensor
   - Tips pemasangan fisik
   - Checklist setup fisik

5. **BEFORE_AFTER_HORIZONTAL.md**
   - Perbandingan vertikal vs horizontal
   - Ilustrasi lengkap
   - Alasan kenapa harus horizontal

6. **QUICK_REFERENCE_HORIZONTAL.md**
   - Quick reference card
   - Bisa dicetak untuk referensi cepat

---

## ✅ Checklist Testing

Setelah upload kode, lakukan testing berikut:

- [ ] Upload kode ke ESP32 berhasil
- [ ] Buka Serial Monitor (115200 baud)
- [ ] Letakkan botol HORIZONTAL (tidur)
- [ ] Test botol kecil → Catat Height & Length
- [ ] Test botol sedang → Catat Height & Length
- [ ] Test botol besar → Catat Height & Length
- [ ] Verifikasi klasifikasi benar (KECIL/SEDANG/BESAR)
- [ ] Verifikasi poin yang diberikan benar (5/10/15)
- [ ] Sesuaikan range (jika perlu)
- [ ] Upload ulang kode (jika ada perubahan)
- [ ] Test ulang semua ukuran botol
- [ ] Verifikasi data terkirim ke Supabase

---

## 🎯 Hasil yang Diharapkan

Setelah setup selesai:
1. ✅ Botol kecil → Terdeteksi KECIL (5 poin)
2. ✅ Botol sedang → Terdeteksi SEDANG (10 poin)
3. ✅ Botol besar → Terdeteksi BESAR (15 poin)
4. ✅ Benda lain → REJECT (tidak ada poin)
5. ✅ Data terkirim ke Supabase dengan bottle_size
6. ✅ LCD menampilkan ukuran dan poin dengan benar

---

## 💡 Tips Penting

### ✅ DO (Lakukan):
- Letakkan botol HORIZONTAL (tidur)
- Test dengan botol asli yang akan digunakan
- Berikan toleransi ±1-2cm untuk range
- Upload ulang kode setiap kali ubah range
- Catat nilai Height & Length dari Serial Monitor
- Sesuaikan range berdasarkan botol Anda

### ❌ DON'T (Jangan):
- Jangan berdirikan botol (vertikal) → Akan REJECT
- Jangan terlalu dekat sensor (<10cm) → Nilai tidak akurat
- Jangan terlalu jauh sensor (>30cm) → Tidak terdeteksi
- Jangan lupa upload ulang setelah ubah kode
- Jangan gunakan range terlalu ketat → Sulit terdeteksi
- Jangan gunakan range terlalu longgar → Klasifikasi salah

---

## 📞 Butuh Bantuan?

Jika masih ada masalah setelah mengikuti panduan ini:

1. **Screenshot Serial Monitor output**
   - Sertakan nilai Height & Length
   - Sertakan pesan error (jika ada)

2. **Foto posisi botol dan sensor**
   - Tampak atas (top view)
   - Tampak samping (side view)

3. **Catat ukuran botol yang digunakan**
   - Diameter (ukur dengan penggaris)
   - Panjang (ukur dengan penggaris)
   - Volume (lihat label botol)

4. **Tanyakan ke developer**
   - Kirim info di atas
   - Jelaskan masalah yang dialami

---

## 🎉 Selamat!

Sistem deteksi botol horizontal sudah siap digunakan!

**Langkah selanjutnya**:
1. Upload kode ke ESP32
2. Test dengan botol asli
3. Sesuaikan range (jika perlu)
4. Mulai gunakan sistem!

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.0 (Horizontal Bottle Detection)
**Status**: ✅ READY TO USE

---

## 📝 Changelog

### Version 2.0 (7 Mei 2026)
- ✅ Update deteksi botol dari vertikal ke horizontal
- ✅ Sensor HEIGHT sekarang mengukur DIAMETER (5-11cm)
- ✅ Sensor LENGTH sekarang mengukur PANJANG (15-35cm)
- ✅ Update fungsi `classifyBottle()` untuk botol horizontal
- ✅ Update range deteksi: KECIL (5-7×15-20), SEDANG (6-8×20-25), BESAR (8-11×25-35)
- ✅ Tambah dokumentasi lengkap (6 file baru)
- ✅ Tambah troubleshooting guide
- ✅ Tambah contoh penyesuaian range

### Version 1.0 (Sebelumnya)
- Deteksi botol vertikal (berdiri)
- Klasifikasi berdasarkan tinggi botol
- QR code auto-login
- Auto-logout setelah transaksi
