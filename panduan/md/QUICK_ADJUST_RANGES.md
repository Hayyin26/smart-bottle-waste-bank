# ⚡ Quick Guide: Sesuaikan Range Botol Horizontal

## 🎯 Langkah Cepat

### 1. Test Botol Anda
Letakkan botol **HORIZONTAL** dan lihat Serial Monitor:

```
[Bottle] REJECTED - Height: 7cm, Length: 22cm
```

### 2. Buka File ESP32_UPDATED_CODE.ino
Cari baris ini (sekitar baris 30-60):

```cpp
// --- KLASIFIKASI UKURAN BOTOL (cm) ---
```

### 3. Sesuaikan Range

#### Jika Botol KECIL Tidak Terdeteksi:
```cpp
// Botol KECIL (contoh: botol air mineral 330ml)
#define SMALL_HEIGHT_MIN 5      // ← Kurangi jika diameter lebih kecil
#define SMALL_HEIGHT_MAX 7      // ← Tambah jika diameter lebih besar
#define SMALL_LENGTH_MIN 15     // ← Kurangi jika panjang lebih pendek
#define SMALL_LENGTH_MAX 20     // ← Tambah jika panjang lebih panjang
#define SMALL_POINTS 5
```

#### Jika Botol SEDANG Tidak Terdeteksi:
```cpp
// Botol SEDANG (contoh: botol air mineral 600ml)
#define MEDIUM_HEIGHT_MIN 6     // ← Sesuaikan
#define MEDIUM_HEIGHT_MAX 8     // ← Sesuaikan
#define MEDIUM_LENGTH_MIN 20    // ← Sesuaikan
#define MEDIUM_LENGTH_MAX 25    // ← Sesuaikan
#define MEDIUM_POINTS 10
```

#### Jika Botol BESAR Tidak Terdeteksi:
```cpp
// Botol BESAR (contoh: botol air mineral 1.5L)
#define LARGE_HEIGHT_MIN 8      // ← Sesuaikan
#define LARGE_HEIGHT_MAX 11     // ← Sesuaikan
#define LARGE_LENGTH_MIN 25     // ← Sesuaikan
#define LARGE_LENGTH_MAX 35     // ← Sesuaikan
#define LARGE_POINTS 15
```

### 4. Upload Ulang
- Klik **Upload** di Arduino IDE
- Tunggu sampai selesai
- Test lagi dengan botol

---

## 📊 Contoh Kasus

### Kasus 1: Botol Kecil Terlalu Besar
**Problem**: Botol 330ml terdeteksi sebagai SEDANG

**Serial Monitor**:
```
[Bottle] Size: SEDANG
[Bottle] Height: 7cm, Length: 18cm
```

**Solusi**: Perkecil range SEDANG atau perbesar range KECIL
```cpp
#define SMALL_HEIGHT_MAX 8      // Dari 7 → 8
#define SMALL_LENGTH_MAX 22     // Dari 20 → 22
```

---

### Kasus 2: Botol Tidak Terdeteksi Sama Sekali
**Problem**: LCD menampilkan "UKURAN SALAH"

**Serial Monitor**:
```
[Bottle] REJECTED - Height: 6cm, Length: 17cm
```

**Solusi**: Nilai 6cm dan 17cm tidak masuk range manapun. Sesuaikan SMALL:
```cpp
#define SMALL_HEIGHT_MIN 5      // OK (6 > 5)
#define SMALL_HEIGHT_MAX 7      // OK (6 < 7)
#define SMALL_LENGTH_MIN 15     // OK (17 > 15)
#define SMALL_LENGTH_MAX 20     // OK (17 < 20)
```

Range sudah benar! Cek sensor atau kabel.

---

### Kasus 3: Semua Botol Terdeteksi BESAR
**Problem**: Botol kecil dan sedang juga terdeteksi BESAR

**Solusi**: Range BESAR terlalu lebar, persempit:
```cpp
#define LARGE_HEIGHT_MIN 9      // Dari 8 → 9 (lebih ketat)
#define LARGE_LENGTH_MIN 28     // Dari 25 → 28 (lebih ketat)
```

---

## 🔧 Tips Penyesuaian

### Prinsip Dasar:
1. **MIN** = Nilai terkecil yang masih diterima
2. **MAX** = Nilai terbesar yang masih diterima
3. **Overlap** = Boleh ada overlap sedikit antar kategori

### Toleransi:
- Berikan toleransi ±1-2cm untuk menghindari false negative
- Jangan terlalu ketat (misal: MIN=6, MAX=6.5) → Sulit terdeteksi
- Jangan terlalu longgar (misal: MIN=5, MAX=15) → Semua botol masuk

### Prioritas Klasifikasi:
Kode akan cek dari KECIL → SEDANG → BESAR. Jika tidak ada yang cocok, akan REJECT.

---

## 📝 Template Penyesuaian

Copy template ini dan isi dengan nilai dari Serial Monitor:

```
BOTOL KECIL (330ml):
- Diameter: ___ cm
- Panjang: ___ cm
→ Range: HEIGHT [___-___], LENGTH [___-___]

BOTOL SEDANG (600ml):
- Diameter: ___ cm
- Panjang: ___ cm
→ Range: HEIGHT [___-___], LENGTH [___-___]

BOTOL BESAR (1.5L):
- Diameter: ___ cm
- Panjang: ___ cm
→ Range: HEIGHT [___-___], LENGTH [___-___]
```

Lalu update kode sesuai nilai di atas.

---

## ⚠️ Catatan Penting

1. **Botol harus HORIZONTAL** (tidur), bukan vertikal
2. **Sensor HEIGHT** = Mengukur DIAMETER botol
3. **Sensor LENGTH** = Mengukur PANJANG botol
4. **Upload ulang** setiap kali ubah range
5. **Test semua ukuran** setelah update

---

## ✅ Verifikasi Akhir

Setelah sesuaikan range, test:
- [ ] Botol kecil → Terdeteksi KECIL (5 poin)
- [ ] Botol sedang → Terdeteksi SEDANG (10 poin)
- [ ] Botol besar → Terdeteksi BESAR (15 poin)
- [ ] Benda lain → REJECT (tidak ada poin)

Jika semua ✅, setup selesai!

---

**Butuh bantuan?** Kirim screenshot Serial Monitor + foto botol Anda.
