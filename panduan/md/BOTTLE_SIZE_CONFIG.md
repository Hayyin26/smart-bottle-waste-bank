# 🔧 Konfigurasi Ukuran Botol - Quick Reference

## 📏 Tabel Ukuran Saat Ini

| Kategori | Tinggi Min | Tinggi Max | Diameter Min | Diameter Max | Poin |
|----------|------------|------------|--------------|--------------|------|
| KECIL    | 8 cm       | 15 cm      | 3 cm         | 6 cm         | 5    |
| SEDANG   | 15 cm      | 22 cm      | 6 cm         | 9 cm         | 10   |
| BESAR    | 22 cm      | 30 cm      | 9 cm         | 12 cm        | 15   |

---

## 🎯 Contoh Botol Real

### Botol KECIL (5 poin)
- ✅ Aqua 330ml: ~12cm tinggi, ~5cm diameter
- ✅ Botol sirup ABC kecil: ~14cm tinggi, ~5cm diameter
- ✅ Botol yakult: ~10cm tinggi, ~4cm diameter
- ✅ Botol kopi kemasan kecil: ~13cm tinggi, ~5cm diameter

### Botol SEDANG (10 poin)
- ✅ Aqua 600ml: ~18cm tinggi, ~7cm diameter
- ✅ Coca-Cola 500ml: ~20cm tinggi, ~7cm diameter
- ✅ Teh Botol Sosro: ~19cm tinggi, ~6.5cm diameter
- ✅ Pocari Sweat 500ml: ~18cm tinggi, ~7cm diameter

### Botol BESAR (15 poin)
- ✅ Aqua 1.5L: ~28cm tinggi, ~10cm diameter
- ✅ Coca-Cola 1.5L: ~27cm tinggi, ~10cm diameter
- ✅ Botol detergen cair: ~25cm tinggi, ~11cm diameter
- ✅ Botol minyak goreng 1L: ~24cm tinggi, ~9cm diameter

---

## ⚙️ Cara Mengubah Konfigurasi

### Di Kode ESP32 (ESP32_UPDATED_CODE.ino)

Cari bagian ini dan edit sesuai kebutuhan:

```cpp
// --- KLASIFIKASI UKURAN BOTOL (cm) ---

// Botol KECIL
#define SMALL_HEIGHT_MIN 8      // ← Ubah ini
#define SMALL_HEIGHT_MAX 15     // ← Ubah ini
#define SMALL_LENGTH_MIN 3      // ← Ubah ini
#define SMALL_LENGTH_MAX 6      // ← Ubah ini
#define SMALL_POINTS 5          // ← Ubah ini

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 15    // ← Ubah ini
#define MEDIUM_HEIGHT_MAX 22    // ← Ubah ini
#define MEDIUM_LENGTH_MIN 6     // ← Ubah ini
#define MEDIUM_LENGTH_MAX 9     // ← Ubah ini
#define MEDIUM_POINTS 10        // ← Ubah ini

// Botol BESAR
#define LARGE_HEIGHT_MIN 22     // ← Ubah ini
#define LARGE_HEIGHT_MAX 30     // ← Ubah ini
#define LARGE_LENGTH_MIN 9      // ← Ubah ini
#define LARGE_LENGTH_MAX 12     // ← Ubah ini
#define LARGE_POINTS 15         // ← Ubah ini
```

---

## 🧪 Template Konfigurasi Alternatif

### Opsi 1: Poin Lebih Tinggi untuk Botol Besar
```cpp
#define SMALL_POINTS 3
#define MEDIUM_POINTS 7
#define LARGE_POINTS 20   // Incentive untuk botol besar
```

### Opsi 2: Poin Sama untuk Semua (Fokus ke Jumlah)
```cpp
#define SMALL_POINTS 10
#define MEDIUM_POINTS 10
#define LARGE_POINTS 10
```

### Opsi 3: Rentang Lebih Luas (Terima Lebih Banyak Botol)
```cpp
// Botol KECIL
#define SMALL_HEIGHT_MIN 5      // Lebih kecil
#define SMALL_HEIGHT_MAX 18     // Lebih besar
#define SMALL_LENGTH_MIN 2      // Lebih kecil
#define SMALL_LENGTH_MAX 7      // Lebih besar

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 18
#define MEDIUM_HEIGHT_MAX 25
#define MEDIUM_LENGTH_MIN 7
#define MEDIUM_LENGTH_MAX 10

// Botol BESAR
#define LARGE_HEIGHT_MIN 25
#define LARGE_HEIGHT_MAX 35     // Lebih besar
#define LARGE_LENGTH_MIN 10
#define LARGE_LENGTH_MAX 15     // Lebih besar
```

### Opsi 4: Rentang Lebih Ketat (Hanya Botol Standar)
```cpp
// Botol KECIL (hanya 330ml)
#define SMALL_HEIGHT_MIN 10
#define SMALL_HEIGHT_MAX 13
#define SMALL_LENGTH_MIN 4
#define SMALL_LENGTH_MAX 5.5

// Botol SEDANG (hanya 600ml)
#define MEDIUM_HEIGHT_MIN 17
#define MEDIUM_HEIGHT_MAX 20
#define MEDIUM_LENGTH_MIN 6.5
#define MEDIUM_LENGTH_MAX 7.5

// Botol BESAR (hanya 1.5L)
#define LARGE_HEIGHT_MIN 26
#define LARGE_HEIGHT_MAX 29
#define LARGE_LENGTH_MIN 9.5
#define LARGE_LENGTH_MAX 10.5
```

---

## 📊 Cara Kalibrasi Sensor

### Langkah 1: Ukur Botol Manual
```
1. Siapkan penggaris/meteran
2. Ukur tinggi botol dari bawah ke atas
3. Ukur diameter botol di bagian terlebar
4. Catat hasilnya
```

### Langkah 2: Bandingkan dengan Sensor
```
1. Upload kode ke ESP32
2. Buka Serial Monitor
3. Masukkan botol yang sudah diukur
4. Lihat output: [Bottle] Height: Xcm, Length: Ycm
5. Bandingkan dengan ukuran manual
```

### Langkah 3: Sesuaikan Konfigurasi
```
Jika sensor membaca lebih besar/kecil:
- Sesuaikan rentang MIN dan MAX
- Test ulang dengan botol yang sama
- Ulangi sampai akurat
```

---

## 🎯 Rekomendasi Berdasarkan Use Case

### Use Case 1: Sekolah/Kampus
**Tujuan**: Edukasi, fokus ke partisipasi
```cpp
#define SMALL_POINTS 5
#define MEDIUM_POINTS 10
#define LARGE_POINTS 15
// Rentang: Luas (terima banyak jenis botol)
```

### Use Case 2: Komunitas/RT
**Tujuan**: Incentive untuk botol besar
```cpp
#define SMALL_POINTS 2
#define MEDIUM_POINTS 5
#define LARGE_POINTS 20
// Rentang: Standar
```

### Use Case 3: Komersial/Bisnis
**Tujuan**: Efisiensi, hanya botol standar
```cpp
#define SMALL_POINTS 3
#define MEDIUM_POINTS 7
#define LARGE_POINTS 12
// Rentang: Ketat (hanya botol standar)
```

### Use Case 4: Event/Festival
**Tujuan**: Cepat, semua botol sama
```cpp
#define SMALL_POINTS 10
#define MEDIUM_POINTS 10
#define LARGE_POINTS 10
// Rentang: Sangat luas
```

---

## 🔄 Workflow Update Konfigurasi

```
1. Edit ESP32_UPDATED_CODE.ino
   ↓
2. Upload ke ESP32
   ↓
3. Test dengan botol real
   ↓
4. Cek Serial Monitor
   ↓
5. Sesuaikan jika perlu
   ↓
6. Deploy ke production
```

---

## 📝 Checklist Setelah Ubah Konfigurasi

- [ ] Edit nilai `#define` di kode
- [ ] Upload ke ESP32
- [ ] Test botol kecil → Cek poin yang didapat
- [ ] Test botol sedang → Cek poin yang didapat
- [ ] Test botol besar → Cek poin yang didapat
- [ ] Test botol di luar rentang → Harus ditolak
- [ ] Cek Serial Monitor → Log harus sesuai
- [ ] Cek database → Data `bottle_size` dan `points_earned` benar
- [ ] Dokumentasikan perubahan

---

## 🐛 Common Issues

### Issue 1: Semua Botol Ditolak
**Solusi**: Rentang terlalu ketat, perluas MIN dan MAX

### Issue 2: Botol Salah Kategori
**Solusi**: Overlap rentang, sesuaikan batas MIN/MAX

### Issue 3: Poin Tidak Sesuai
**Solusi**: Cek nilai `SMALL_POINTS`, `MEDIUM_POINTS`, `LARGE_POINTS`

### Issue 4: Sensor Tidak Akurat
**Solusi**: 
- Cek posisi sensor
- Cek kabel sensor
- Kalibrasi ulang dengan botol real

---

## 💡 Tips Optimasi

1. **Gunakan botol real untuk testing** - Jangan hanya asumsi ukuran
2. **Dokumentasikan setiap perubahan** - Catat konfigurasi yang berhasil
3. **Test di berbagai kondisi** - Pagi, siang, malam (cahaya berbeda)
4. **Libatkan user** - Minta feedback tentang akurasi klasifikasi
5. **Monitor statistik** - Lihat distribusi ukuran botol yang masuk

---

## 📞 Quick Help

**Ingin rentang lebih luas?**
→ Kurangi MIN, tambah MAX

**Ingin rentang lebih ketat?**
→ Tambah MIN, kurangi MAX

**Ingin poin lebih tinggi?**
→ Ubah nilai POINTS

**Ingin semua botol diterima?**
→ Set MIN sangat kecil, MAX sangat besar
