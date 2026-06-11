# 🔍 EVALUASI PENEMPATAN SENSOR

## 📋 SETUP KAMU SEKARANG

```
Sensor HEIGHT: Di ATAS botol, jarak 20cm
Sensor LENGTH: Di SAMPING botol, jarak 20cm
```

## ✅ APAKAH PENEMPATAN SUDAH BENAR?

### 1. **Sensor HEIGHT di ATAS** ✅ **BENAR!**

```
┌─────────────────────────────┐
│   [SENSOR HEIGHT]           │
│         ↓↓↓                 │
│   ══════════════            │
│         ↓ 20cm              │
│     ┌───────┐               │
│     │ BOTOL │ ← Diameter    │
│     └───────┘               │
└─────────────────────────────┘
```

**Apa yang diukur**: DIAMETER botol (tinggi botol saat horizontal)

**Cara kerja**:
- Botol diameter 6cm → Sensor baca 14cm → Calculate: 20-14 = 6cm ✅
- Botol diameter 9cm → Sensor baca 11cm → Calculate: 20-11 = 9cm ✅

**Status**: ✅ **BENAR!** Ini cara yang tepat untuk ukur diameter.

---

### 2. **Sensor LENGTH di SAMPING** ✅ **BENAR!**

```
┌─────────────────────────────────────┐
│                                     │
│     ┌─────────────┐                │
│ [S] │   BOTOL     │                │
│ [E] └─────────────┘                │
│ [N] ← 20cm →                       │
│ [S]                                 │
│ [O]                                 │
│ [R]                                 │
└─────────────────────────────────────┘
```

**Apa yang diukur**: PANJANG botol (length)

**Cara kerja**:
- Botol panjang 15cm → Sensor baca 5cm → Calculate: 20-5 = 15cm ✅
- Botol panjang 28cm → Sensor baca -8cm → ❌ INVALID! (botol >20cm)

**Status**: ✅ **BENAR secara konsep**, tapi ⚠️ **JARAK TERLALU PENDEK!**

---

## 📊 EVALUASI DETAIL

### ✅ Yang SUDAH BENAR:

1. **Orientasi Sensor**: ✅ Benar
   - HEIGHT di atas → ukur diameter ✅
   - LENGTH di samping → ukur panjang ✅

2. **Konsep Offset**: ✅ Benar
   - Ukuran botol = Offset - Reading ✅
   - Formula sudah benar di code ✅

3. **Posisi Sensor**: ✅ Benar
   - HEIGHT: vertikal ke dasar ✅
   - LENGTH: horizontal ke dinding ✅

### ⚠️ Yang PERLU DIUBAH:

1. **Jarak Sensor LENGTH**: ⚠️ **20cm TERLALU PENDEK!**
   
   **Masalah**:
   ```
   Botol 220ml: panjang 12cm → OK (20-12=8cm reading)
   Botol 330ml: panjang 15cm → OK (20-15=5cm reading)
   Botol 600ml: panjang 19cm → HAMPIR GAGAL (20-19=1cm)
   Botol 1.5L:  panjang 28cm → GAGAL! (20-28=-8cm)
   ```

   **Rekomendasi**: Pindahkan ke **35cm** untuk coverage lengkap!

2. **Threshold di Code**: ❌ **SALAH TOTAL!**
   - Tidak sesuai ukuran botol real
   - Perlu update sesuai data pasar

---

## 🎯 REKOMENDASI SETUP

### Option A: SETUP IDEAL (Recommended!)

```
┌──────────────────────────────────────────────┐
│   [SENSOR HEIGHT]                            │
│         ↓↓↓                                  │
│   ══════════════                             │
│         ↓ 20cm (OK untuk diameter)           │
│     ┌───────┐                                │
│ [S] │ BOTOL │                                │
│ [E] └───────┘                                │
│ [N] ←── 35cm ──→ [DINDING]                  │
│ [S]    (BETTER!)                             │
│ [O]                                          │
│ [R]                                          │
└──────────────────────────────────────────────┘

HEIGHT offset: 20cm  ✅ Cukup untuk diameter 3-17cm
LENGTH offset: 35cm  ✅ Cukup untuk panjang 3-32cm
```

**Coverage**:
- ✅ Botol 220ml (diameter 5.5cm, panjang 12cm)
- ✅ Botol 330ml (diameter 6cm, panjang 15cm)
- ✅ Botol 600ml (diameter 7cm, panjang 19cm)
- ✅ Botol 1.5L (diameter 9cm, panjang 28cm)

**Dimensi Box Minimal**:
- Tinggi: 25cm (sensor 20cm + margin 5cm)
- Lebar: 40cm (sensor 35cm + margin 5cm)
- Panjang: 35cm (untuk botol panjang + space)

---

### Option B: SETUP SEKARANG (Limited)

```
┌──────────────────────────────────────┐
│   [SENSOR HEIGHT]                    │
│         ↓↓↓                          │
│   ══════════════                     │
│         ↓ 20cm                       │
│     ┌───────┐                        │
│ [S] │ BOTOL │                        │
│ [E] └───────┘                        │
│ [N] ←── 20cm ──→                    │
│ [S]                                  │
└──────────────────────────────────────┘

HEIGHT offset: 20cm  ✅ OK
LENGTH offset: 20cm  ⚠️ TERBATAS!
```

**Coverage**:
- ✅ Botol 220ml (panjang 12cm) → OK
- ✅ Botol 330ml (panjang 15cm) → OK
- ⚠️ Botol 600ml (panjang 19cm) → HAMPIR GAGAL (margin 1cm!)
- ❌ Botol 1.5L (panjang 28cm) → GAGAL!

**Cocok untuk**: Hanya botol kecil 220-330ml

---

## 🔧 CARA MENGUKUR OFFSET SAAT INI

Untuk memastikan offset 20cm benar:

### Test 1: Box Kosong
```
1. Kosongkan box (tidak ada botol)
2. Upload code
3. Jalankan command: TEST
4. Cek output:
   [Test] HEIGHT: 20cm (raw) → -1cm (bottle)  ✅ BENAR
   [Test] LENGTH: 20cm (raw) → -1cm (bottle)  ✅ BENAR
```

Jika sensor baca **≠ 20cm**, berarti:
- Sensor tidak tepat 20cm dari target
- Atau ada objek menghalangi

### Test 2: Dengan Penggaris
```
1. Ukur FISIK dengan penggaris/meteran:
   - Sensor HEIGHT ke dasar box = ___ cm?
   - Sensor LENGTH ke dinding = ___ cm?

2. Bandingkan dengan reading:
   - Jika fisik = 20cm, reading harus ~20cm ✅
   - Jika fisik = 25cm, update offset ke 25cm!
```

---

## 📐 CARA PINDAHKAN SENSOR (Jika Perlu)

### Pindahkan Sensor LENGTH dari 20cm → 35cm

**Step 1: Ukur Posisi Baru**
```
1. Ukur 35cm dari dinding berlawanan
2. Tandai posisi mounting sensor
3. Pastikan sensor mengarah horizontal (tegak lurus dinding)
```

**Step 2: Pasang Sensor**
```
1. Lepas sensor dari posisi lama (20cm)
2. Pasang di posisi baru (35cm)
3. Pastikan sensor stabil (tidak goyang)
4. Cek kabel tidak tertarik/terlipat
```

**Step 3: Update Code**
```cpp
#define SENSOR_LENGTH_OFFSET 35  // Update dari 20 → 35
```

**Step 4: Test**
```
Serial Monitor → TEST
[Test] LENGTH: 35cm (raw) → -1cm (no bottle)  ✅ BENAR!
```

---

## 🧪 VALIDASI PENEMPATAN

### Checklist Sensor HEIGHT:

- [ ] Sensor di ATAS botol (vertikal ke bawah)
- [ ] Jarak ke dasar box = 20cm (ukur fisik)
- [ ] Sensor mengarah TEGAK LURUS ke dasar
- [ ] Test box kosong → reading ~20cm
- [ ] Test botol 6cm → reading ~14cm (20-6=14)

### Checklist Sensor LENGTH:

- [ ] Sensor di SAMPING botol (horizontal)
- [ ] Jarak ke dinding = 20cm atau 35cm (ukur fisik)
- [ ] Sensor mengarah TEGAK LURUS ke dinding
- [ ] Test box kosong → reading ~20cm (atau 35cm)
- [ ] Test botol 15cm → reading ~5cm (atau 20cm jika offset 35)

### Checklist Alignment:

- [ ] Botol masuk TEPAT di antara kedua sensor
- [ ] Tidak ada objek lain menghalangi sensor
- [ ] Sensor tidak terlalu miring (max 5°)
- [ ] Kabel tidak menutupi sensor

---

## 📊 DECISION MATRIX

### Apakah Perlu Ubah Penempatan?

| Skenario | HEIGHT 20cm | LENGTH 20cm | Action |
|----------|-------------|-------------|--------|
| **Hanya botol 220-330ml** | ✅ OK | ✅ OK | ✅ Tidak perlu ubah |
| **Termasuk botol 600ml** | ✅ OK | ⚠️ Terbatas | ⚠️ Consider naikkan LENGTH |
| **Termasuk botol 1.5L** | ✅ OK | ❌ Tidak cukup | ❌ HARUS naikkan LENGTH ke 35cm |

---

## ✅ KESIMPULAN: APAKAH PENEMPATAN SUDAH BENAR?

### Jawaban: **SEBAGIAN BENAR!** ✅⚠️

**Yang BENAR**:
1. ✅ Konsep penempatan (HEIGHT atas, LENGTH samping)
2. ✅ Orientasi sensor (vertikal & horizontal)
3. ✅ Formula perhitungan (offset - reading)
4. ✅ HEIGHT offset 20cm → Cukup untuk semua diameter

**Yang PERLU DIPERBAIKI**:
1. ⚠️ LENGTH offset 20cm → **TERLALU PENDEK** untuk botol 600ml+
2. ❌ Threshold di code → **SALAH TOTAL** (perlu update)

### Rekomendasi Final:

**Jika mau terima semua ukuran botol**:
1. Pindahkan sensor LENGTH ke **35cm**
2. Update code offset LENGTH → 35
3. Update threshold sesuai data real

**Jika hanya botol kecil (220-330ml)**:
1. Penempatan sensor **SUDAH BENAR** (tidak perlu ubah)
2. Tapi tetap harus **update threshold** di code!

---

**Penempatan sensor kamu SUDAH BENAR secara konsep, tapi perlu adjustment untuk coverage yang lebih baik!** 🎯
