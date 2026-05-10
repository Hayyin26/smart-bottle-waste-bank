# 📋 Quick Reference: Botol Horizontal

## 🎯 Posisi Botol: HORIZONTAL (Tidur)

```
    Sensor HEIGHT (Pin 4 & 18)
         ↓
         ║  DIAMETER (5-11cm)
         ▼
    ┌──────────────────────┐
    │      BOTOL TIDUR     │
    └──────────────────────┘
         ↑
         ║  PANJANG (15-35cm)
    Sensor LENGTH (Pin 5 & 15)
```

---

## 📏 Range Klasifikasi

| Ukuran | Diameter (cm) | Panjang (cm) | Poin |
|--------|---------------|--------------|------|
| KECIL  | 5-7          | 15-20        | 5    |
| SEDANG | 6-8          | 20-25        | 10   |
| BESAR  | 8-11         | 25-35        | 15   |

---

## 🔧 Kode yang Perlu Disesuaikan

Buka `ESP32_UPDATED_CODE.ino`, cari baris ini:

```cpp
// Botol KECIL
#define SMALL_HEIGHT_MIN 5      // Diameter min
#define SMALL_HEIGHT_MAX 7      // Diameter max
#define SMALL_LENGTH_MIN 15     // Panjang min
#define SMALL_LENGTH_MAX 20     // Panjang max
#define SMALL_POINTS 5

// Botol SEDANG
#define MEDIUM_HEIGHT_MIN 6
#define MEDIUM_HEIGHT_MAX 8
#define MEDIUM_LENGTH_MIN 20
#define MEDIUM_LENGTH_MAX 25
#define MEDIUM_POINTS 10

// Botol BESAR
#define LARGE_HEIGHT_MIN 8
#define LARGE_HEIGHT_MAX 11
#define LARGE_LENGTH_MIN 25
#define LARGE_LENGTH_MAX 35
#define LARGE_POINTS 15
```

---

## 🧪 Testing Cepat

### 1. Upload Kode
```
Arduino IDE → Upload → Tunggu selesai
```

### 2. Buka Serial Monitor
```
Tools → Serial Monitor → Set 115200 baud
```

### 3. Test Botol
```
Letakkan botol HORIZONTAL → Lihat output:
[Bottle] Size: SEDANG
[Bottle] Height: 7cm, Length: 22cm
[Bottle] Points: 10
```

---

## ⚠️ Troubleshooting

### "UKURAN SALAH"
1. Lihat nilai Height & Length di Serial Monitor
2. Bandingkan dengan range di kode
3. Sesuaikan range jika perlu

### Nilai Aneh (-1, 200cm)
1. Cek koneksi kabel sensor
2. Cek power supply (5V)
3. Pastikan sensor tidak tertutup

### Semua Botol REJECT
1. Pastikan botol HORIZONTAL (tidur)
2. Cek jarak sensor (10-30cm)
3. Sesuaikan range di kode

---

## 📊 Contoh Botol Umum

| Merek | Volume | Diameter | Panjang | Klasifikasi |
|-------|--------|----------|---------|-------------|
| Aqua  | 330ml  | 6cm      | 17cm    | KECIL (5pt) |
| Aqua  | 600ml  | 7cm      | 22cm    | SEDANG (10pt) |
| Aqua  | 1.5L   | 9cm      | 30cm    | BESAR (15pt) |

---

## ✅ Checklist

- [ ] Upload kode ke ESP32
- [ ] Buka Serial Monitor (115200)
- [ ] Letakkan botol HORIZONTAL
- [ ] Test semua ukuran botol
- [ ] Sesuaikan range (jika perlu)
- [ ] Verifikasi poin benar

---

## 📚 Dokumentasi Lengkap

1. `HORIZONTAL_BOTTLE_SUMMARY.md` - Ringkasan lengkap
2. `HORIZONTAL_BOTTLE_SETUP_GUIDE.md` - Panduan detail
3. `QUICK_ADJUST_RANGES.md` - Cara sesuaikan range
4. `SENSOR_POSITIONING_HORIZONTAL.md` - Diagram sensor
5. `BEFORE_AFTER_HORIZONTAL.md` - Perbandingan vertikal vs horizontal

---

## 💡 Tips Penting

✅ **DO**:
- Letakkan botol HORIZONTAL (tidur)
- Test dengan botol asli
- Berikan toleransi ±1-2cm
- Upload ulang setiap ubah kode

❌ **DON'T**:
- Jangan berdirikan botol (vertikal)
- Jangan terlalu dekat/jauh sensor
- Jangan lupa upload ulang kode

---

**Versi**: 2.0 | **Status**: ✅ READY
