# 📐 Diagram Posisi Sensor untuk Botol Horizontal

## 🎯 Posisi Botol: HORIZONTAL (Tidur/Berbaring)

```
                    TAMPAK ATAS (Top View)
    ═══════════════════════════════════════════════════════
    
    Sensor LENGTH (Pin 5 & 15)
           ↓
        [TRIG] [ECHO]
           ↓     ↓
           ║     ║
           ║     ║
           ▼     ▼
    ┌──────────────────────────────────┐
    │                                  │  ← Botol (horizontal)
    │         BOTOL PLASTIK            │
    │                                  │
    └──────────────────────────────────┘
           ↑     ↑
           ║     ║
           ║     ║
        [TRIG] [ECHO]
           ↑
    Sensor HEIGHT (Pin 4 & 18)
    
    ═══════════════════════════════════════════════════════
```

## 📏 Pengukuran

### Sensor HEIGHT (Pin 4 & 18)
```
    Sensor HEIGHT
         ↓
      [TRIG] [ECHO]
         ↓
         ║
         ║  ← Jarak ini = DIAMETER botol (5-11cm)
         ║
         ▼
    ┌─────────┐
    │         │  ← Botol (tampak samping)
    └─────────┘
```

**Mengukur**: DIAMETER botol (tinggi botol saat tidur)
- Botol KECIL: 5-7 cm
- Botol SEDANG: 6-8 cm
- Botol BESAR: 8-11 cm

---

### Sensor LENGTH (Pin 5 & 15)
```
    Sensor LENGTH
         ↓
      [TRIG] [ECHO]
         ↓
         ║
         ║  ← Jarak ini = PANJANG botol (15-35cm)
         ║
         ▼
    ┌──────────────────────────────┐
    │                              │  ← Botol (tampak atas)
    └──────────────────────────────┘
```

**Mengukur**: PANJANG botol (dari ujung ke ujung)
- Botol KECIL: 15-20 cm
- Botol SEDANG: 20-25 cm
- Botol BESAR: 25-35 cm

---

## 🔧 Setup Fisik

### Posisi Ideal Sensor

```
                    TAMPAK SAMPING (Side View)
    ═══════════════════════════════════════════════════════
    
    Sensor HEIGHT (di atas botol)
         ↓
      [TRIG] [ECHO]
         ↓
         ║
         ║  10-30cm (jarak ideal)
         ║
         ▼
    ┌─────────────────────────────┐
    │                             │  ← Botol horizontal
    └─────────────────────────────┘
         ↑
         ║
         ║  10-30cm (jarak ideal)
         ║
      [TRIG] [ECHO]
         ↑
    Sensor LENGTH (di samping botol)
    
    ═══════════════════════════════════════════════════════
```

### Tips Pemasangan:
1. **Sensor HEIGHT**: Pasang di ATAS botol, menghadap ke bawah
2. **Sensor LENGTH**: Pasang di SAMPING botol, menghadap ke botol
3. **Jarak**: 10-30cm dari botol (tidak terlalu dekat, tidak terlalu jauh)
4. **Sejajar**: Sensor harus sejajar dengan botol (tidak miring)

---

## 📊 Contoh Botol Nyata

### Botol KECIL (Aqua 330ml)
```
    Sensor HEIGHT
         ↓
         ║
         ║  6cm (diameter)
         ▼
    ┌─────────────────┐
    │                 │
    └─────────────────┘
    ←─────17cm───────→
         (panjang)
```
**Klasifikasi**: KECIL (5 poin)

---

### Botol SEDANG (Aqua 600ml)
```
    Sensor HEIGHT
         ↓
         ║
         ║  7cm (diameter)
         ▼
    ┌──────────────────────┐
    │                      │
    └──────────────────────┘
    ←────────22cm─────────→
         (panjang)
```
**Klasifikasi**: SEDANG (10 poin)

---

### Botol BESAR (Aqua 1.5L)
```
    Sensor HEIGHT
         ↓
         ║
         ║  9cm (diameter)
         ▼
    ┌────────────────────────────────┐
    │                                │
    └────────────────────────────────┘
    ←──────────────30cm──────────────→
              (panjang)
```
**Klasifikasi**: BESAR (15 poin)

---

## ⚠️ Kesalahan Umum

### ❌ SALAH: Botol Vertikal (Berdiri)
```
         Sensor
            ↓
            ║
            ▼
         ┌─────┐
         │     │
         │     │  ← Botol berdiri (SALAH!)
         │     │
         │     │
         └─────┘
```
**Masalah**: Sensor akan mengukur tinggi botol, bukan diameter!

---

### ✅ BENAR: Botol Horizontal (Tidur)
```
         Sensor
            ↓
            ║
            ▼
    ┌──────────────────┐
    │                  │  ← Botol tidur (BENAR!)
    └──────────────────┘
```
**Hasil**: Sensor mengukur diameter dan panjang dengan benar!

---

## 🧪 Testing Posisi Sensor

### Langkah 1: Cek Sensor HEIGHT
1. Letakkan botol horizontal
2. Lihat Serial Monitor
3. Nilai HEIGHT harus 5-11cm (sesuai diameter botol)
4. Jika terlalu besar/kecil, sesuaikan posisi sensor

### Langkah 2: Cek Sensor LENGTH
1. Botol tetap horizontal
2. Lihat Serial Monitor
3. Nilai LENGTH harus 15-35cm (sesuai panjang botol)
4. Jika terlalu besar/kecil, sesuaikan posisi sensor

### Langkah 3: Verifikasi Klasifikasi
1. Test dengan botol kecil → Harus terdeteksi KECIL
2. Test dengan botol sedang → Harus terdeteksi SEDANG
3. Test dengan botol besar → Harus terdeteksi BESAR

---

## 📝 Checklist Setup Fisik

- [ ] Sensor HEIGHT dipasang di ATAS botol
- [ ] Sensor LENGTH dipasang di SAMPING botol
- [ ] Jarak sensor 10-30cm dari botol
- [ ] Sensor sejajar dengan botol (tidak miring)
- [ ] Botol diletakkan HORIZONTAL (tidur)
- [ ] Tidak ada penghalang antara sensor dan botol
- [ ] Kabel sensor terpasang dengan benar (TRIG & ECHO)
- [ ] Power supply 5V untuk sensor

---

## 🔍 Troubleshooting Posisi

### Problem: Nilai HEIGHT Terlalu Besar (>20cm)
**Penyebab**: Sensor HEIGHT terlalu jauh dari botol
**Solusi**: Dekatkan sensor ke botol (10-15cm)

### Problem: Nilai LENGTH Terlalu Kecil (<10cm)
**Penyebab**: Sensor LENGTH terlalu dekat atau miring
**Solusi**: Jauhkan sensor atau sejajarkan dengan botol

### Problem: Nilai Tidak Stabil (berubah-ubah)
**Penyebab**: Botol bergerak atau sensor goyang
**Solusi**: Pastikan botol diam dan sensor terpasang kuat

---

## 📐 Dimensi Referensi

| Ukuran | Diameter (cm) | Panjang (cm) | Volume |
|--------|---------------|--------------|--------|
| KECIL  | 5-7          | 15-20        | 330ml  |
| SEDANG | 6-8          | 20-25        | 600ml  |
| BESAR  | 8-11         | 25-35        | 1.5L   |

**Catatan**: Ukuran bisa bervariasi tergantung merek botol.

---

## 🎯 Tips Optimasi

1. **Pencahayaan**: Sensor ultrasonik tidak terpengaruh cahaya
2. **Suhu**: Sensor bekerja optimal di suhu ruangan (20-30°C)
3. **Kelembaban**: Hindari tempat terlalu lembab
4. **Getaran**: Pasang sensor di tempat yang stabil
5. **Kalibrasi**: Test dengan botol asli yang akan digunakan

---

**Terakhir diupdate**: 7 Mei 2026
**Versi**: 2.0 (Horizontal Bottle Detection)
