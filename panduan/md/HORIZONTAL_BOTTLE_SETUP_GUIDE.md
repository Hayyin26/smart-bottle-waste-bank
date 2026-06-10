# 🔧 Panduan Setup Botol Horizontal

## ✅ Status Implementasi

Kode ESP32 sudah diupdate untuk deteksi botol **HORIZONTAL (tidur/berbaring)**, bukan vertikal.

---

## 📐 Cara Kerja Sensor untuk Botol Horizontal

Ketika botol diletakkan **HORIZONTAL** (tidur):

```
        ┌─────────────────────────┐
        │                         │  ← Sensor HEIGHT mengukur DIAMETER (5-11cm)
        └─────────────────────────┘
        ←──────────────────────────→
           Sensor LENGTH mengukur
           PANJANG BOTOL (15-35cm)
```

### Sensor HEIGHT (Pin 4 & 18)
- **Mengukur**: DIAMETER botol (tinggi botol saat tidur)
- **Range**: 5-11 cm

### Sensor LENGTH (Pin 5 & 15)
- **Mengukur**: PANJANG botol (dari ujung ke ujung)
- **Range**: 15-35 cm

---

## 🏷️ Klasifikasi Ukuran Botol

### 1️⃣ BOTOL KECIL (5 poin)
- **Diameter**: 5-7 cm
- **Panjang**: 15-20 cm
- **Contoh**: Botol air mineral 330ml (Aqua kecil)

### 2️⃣ BOTOL SEDANG (10 poin)
- **Diameter**: 6-8 cm
- **Panjang**: 20-25 cm
- **Contoh**: Botol air mineral 600ml

### 3️⃣ BOTOL BESAR (15 poin)
- **Diameter**: 8-11 cm
- **Panjang**: 25-35 cm
- **Contoh**: Botol air mineral 1.5L

---

## 🧪 Cara Testing

### Langkah 1: Upload Kode ke ESP32
1. Buka Arduino IDE
2. Buka file `ESP32_UPDATED_CODE.ino`
3. Pilih board: **ESP32 Dev Module**
4. Pilih port COM yang sesuai
5. Klik **Upload** (ikon panah kanan)

### Langkah 2: Buka Serial Monitor
1. Klik **Tools** → **Serial Monitor**
2. Set baud rate ke **115200**
3. Perhatikan output:
   ```
   [Bottle] Size: SEDANG
   [Bottle] Height: 7cm, Length: 22cm
   [Bottle] Points: 10
   ```

### Langkah 3: Test dengan Botol Asli
1. **Letakkan botol HORIZONTAL** (tidur) di antara sensor
2. Lihat Serial Monitor untuk nilai sensor:
   ```
   [Bottle] Height: Xcm, Length: Ycm
   ```
3. **Catat nilai X dan Y** untuk setiap ukuran botol

### Langkah 4: Sesuaikan Range (Jika Perlu)
Jika botol tidak terdeteksi atau salah klasifikasi:

1. Buka `ESP32_UPDATED_CODE.ino`
2. Cari bagian **KLASIFIKASI UKURAN BOTOL**
3. Sesuaikan nilai berdasarkan hasil test:

```cpp
// Contoh: Jika botol kecil Anda diameter 6cm, panjang 18cm
#define SMALL_HEIGHT_MIN 5      // Sesuaikan
#define SMALL_HEIGHT_MAX 7      // Sesuaikan
#define SMALL_LENGTH_MIN 15     // Sesuaikan
#define SMALL_LENGTH_MAX 20     // Sesuaikan
```

---

## ⚠️ Troubleshooting

### Masalah 1: Botol Tidak Terdeteksi
**Gejala**: LCD tetap "MASUKKAN BOTOL", tidak ada reaksi

**Solusi**:
1. Cek jarak sensor ke botol (harus < 35cm)
2. Pastikan botol benar-benar HORIZONTAL
3. Cek kabel sensor (TRIG & ECHO)
4. Lihat Serial Monitor untuk nilai sensor

### Masalah 2: Ukuran Salah Terdeteksi
**Gejala**: LCD menampilkan "UKURAN SALAH" atau ukuran tidak sesuai

**Solusi**:
1. Lihat Serial Monitor untuk nilai Height & Length
2. Bandingkan dengan range di kode
3. Sesuaikan range sesuai botol Anda
4. Upload ulang kode

### Masalah 3: Sensor Membaca Nilai Aneh
**Gejala**: Serial Monitor menampilkan nilai tidak masuk akal (misal: 200cm, -1cm)

**Solusi**:
1. Cek koneksi kabel sensor
2. Pastikan sensor tidak tertutup/kotor
3. Cek power supply (5V untuk sensor)
4. Ganti sensor jika rusak

---

## 📊 Tabel Referensi Ukuran Botol Umum

| Jenis Botol | Volume | Diameter (cm) | Panjang (cm) | Klasifikasi |
|-------------|--------|---------------|--------------|-------------|
| Aqua Kecil | 330ml | 5-6 | 15-18 | KECIL (5pt) |
| Aqua Sedang | 600ml | 6-7 | 20-23 | SEDANG (10pt) |
| Aqua Besar | 1.5L | 8-9 | 28-32 | BESAR (15pt) |
| Le Minerale | 600ml | 6-7 | 21-24 | SEDANG (10pt) |
| Pristine | 1.5L | 8-10 | 30-34 | BESAR (15pt) |

**Catatan**: Ukuran bisa bervariasi tergantung merek. Sesuaikan range di kode sesuai botol yang Anda gunakan.

---

## 🔍 Cara Mengukur Botol Anda

### Alat yang Dibutuhkan:
- Penggaris atau meteran
- Botol yang akan digunakan

### Langkah:
1. **Letakkan botol HORIZONTAL** di meja
2. **Ukur DIAMETER** (tinggi botol saat tidur) dengan penggaris
3. **Ukur PANJANG** (dari ujung ke ujung) dengan penggaris
4. **Catat hasilnya**
5. **Sesuaikan range di kode** berdasarkan hasil pengukuran

---

## 📝 Contoh Penyesuaian Range

Misalnya hasil test Anda:
- Botol kecil: Diameter 6cm, Panjang 17cm
- Botol sedang: Diameter 7cm, Panjang 22cm
- Botol besar: Diameter 9cm, Panjang 30cm

Maka sesuaikan kode:

```cpp
// Botol KECIL
#define SMALL_HEIGHT_MIN 5      // 6-1 = 5 (toleransi)
#define SMALL_HEIGHT_MAX 7      // 6+1 = 7 (toleransi)
#define SMALL_LENGTH_MIN 15     // 17-2 = 15 (toleransi)
#define SMALL_LENGTH_MAX 19     // 17+2 = 19 (toleransi)

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 6     // 7-1 = 6 (overlap dengan kecil)
#define MEDIUM_HEIGHT_MAX 8     // 7+1 = 8 (toleransi)
#define MEDIUM_LENGTH_MIN 20    // 22-2 = 20 (toleransi)
#define MEDIUM_LENGTH_MAX 25    // 22+3 = 25 (toleransi)

// Botol BESAR
#define LARGE_HEIGHT_MIN 8      // 9-1 = 8 (overlap dengan sedang)
#define LARGE_HEIGHT_MAX 11     // 9+2 = 11 (toleransi)
#define LARGE_LENGTH_MIN 27     // 30-3 = 27 (toleransi)
#define LARGE_LENGTH_MAX 35     // 30+5 = 35 (toleransi)
```

---

## ✅ Checklist Testing

- [ ] Upload kode ke ESP32
- [ ] Buka Serial Monitor (115200 baud)
- [ ] Test botol kecil → Catat Height & Length
- [ ] Test botol sedang → Catat Height & Length
- [ ] Test botol besar → Catat Height & Length
- [ ] Sesuaikan range di kode (jika perlu)
- [ ] Upload ulang kode
- [ ] Test ulang semua ukuran botol
- [ ] Verifikasi poin yang diberikan benar

---

## 🎯 Tips Optimasi

1. **Posisi Sensor**: Pastikan sensor HEIGHT dan LENGTH sejajar dengan botol
2. **Jarak Sensor**: Jarak ideal 10-30cm dari botol
3. **Pencahayaan**: Sensor ultrasonik tidak terpengaruh cahaya, tapi pastikan tidak ada penghalang
4. **Stabilitas**: Botol harus diam saat diukur (tidak bergerak)
5. **Toleransi**: Berikan toleransi ±1-2cm untuk menghindari false negative

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Screenshot Serial Monitor output
2. Foto posisi botol dan sensor
3. Catat ukuran botol yang digunakan
4. Tanyakan ke developer

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.0 (Horizontal Bottle Detection)
