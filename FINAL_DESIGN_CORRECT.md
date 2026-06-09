# 🎯 Design FINAL - Sesuai Gambar User (CORRECTED)

## 📐 Posisi Sensor yang BENAR

Berdasarkan gambar terbaru:

```
         SENSOR HEIGHT
              ▓▓
              ││ (dari ATAS, menghadap ke bawah)
              ↓↓
    ┌─────────╪╪─────────────┐
    │         ││             │
    │  [LCD]  ││             │
    │                        │
▓▓  │    ════════════        │
││→ │    [  Platform  ]      │  ← Metal sensor di sini
││  │    [   Botol    ]      │     (samping botol)
S   │    ════════════        │
E   │                        │
N   │    ─────[SERVO]────    │
S   │         [GATE]         │
O   │                        │
R   │  ┌──────────────┐      │
    │  │ Tempat Botol │      │
L   │  └──────────────┘      │
E   └────────────────────────┘
N
G
T
H
(samping)
```

---

## 🎨 View 3D (Potongan Samping)

```
              HEIGHT ▓▓
                    ││  ← Sensor di ATAS
                    ↓↓     (ukur diameter)
    ┌───────────────╪╪──────────┐  ↑
    │ [LCD]         ││          │  │
    ├───────────────╪╪──────────┤  │
    │               ││          │  │
    │       ════════╪╪═════     │  │
    │       [  Platform   ]     │  │ 45cm
    │       [ 🍾 Botol ]        │  │
▓▓→ │       ════════════════    │  │
││  │  [M] ← Metal sensor       │  │
LENGTH                          │  │
(samping)  ──────[Servo]───     │  │
              [Gate tutup]      │  │
                                │  │
           ┌─────────────┐      │  │
           │ Tempat Botol│      │  │
           └─────────────┘      │  │
    └─────────────────────────────┘  ↓
```

---

## 📏 Pengukuran Botol (Cara Kerja)

### **Botol Posisi HORIZONTAL (Tidur)**

```
        HEIGHT sensor (atas)
              ▓▓
              ││
              ↓↓ ukur DIAMETER
              ↓↓
        ══════╪╪═══════
        │     ││      │
▓▓      │   🍾 botol  │     [M]
││ →    │   (tidur)   │  ← metal
LENGTH  │             │    sensor
(ukur   ══════════════
panjang)
```

**Measurement:**
1. **HEIGHT sensor** (atas) → Ukur **DIAMETER** botol (5-22cm)
2. **LENGTH sensor** (samping) → Ukur **PANJANG** botol (8-30cm)
3. **Metal sensor** (samping) → Deteksi **LOGAM** (plastik vs kaleng)

---

## 🔧 Mounting Detail

### **1. Sensor HEIGHT (Atas)**
```
    ┌────────────────────┐
    │   ╔═══════════╗    │
    │   ║  ▓▓       ║    │  ← Bracket holder
    │   ║  ││ HC-SR04    │
    │   ╚═══╪╪══════╝    │
    ├───────╪╪───────────┤
            ││
            ↓↓ 10cm clearance
            ↓↓
      ════════════════
      [   Platform   ]
```

**Mounting:**
- Bracket L ke plafon chamber
- Sensor menghadap **LURUS KE BAWAH**
- Jarak ke platform: **10cm**

---

### **2. Sensor LENGTH (Samping Kiri)**
```
    │                    │
    │  ╔═════════╗       │
    │  ║ ▓▓      ║       │  ← Bracket holder
    │  ║ ││HC-SR04       │
    │  ╚══╪╪══════╝       │
    │     ││→ 10cm        │
    │     ││              │
    │  ═══╪╪═════════     │
    │  [  ╪╪Platform ]    │
    │  [  Botol    ]      │
    │  ═══════════════    │
```

**Mounting:**
- Bracket L ke dinding kiri
- Sensor menghadap **KE KANAN** (ke arah botol)
- Jarak ke botol: **10cm**

---

### **3. Metal Sensor (Samping/Dalam)**
```
    │                    │
    │  ═══════════════   │
    │  [   Platform   ]  │
    │  [   🍾 Botol  ]   │  ← Botol di sini
    │  ═══════════════   │
    │         ↑          │
    │    [M] Metal       │  ← Sensor di bawah
    │       Sensor       │     atau samping platform
```

**Mounting:**
- Di samping atau bawah platform
- Jarak dari botol: **2-4mm** (sensing range)
- Adjustable bracket

---

## 📐 Dimensi Chamber Pengukuran

```
     ← 30cm lebar chamber →
    ┌────────────────────────┐  ↑
    │     HEIGHT ▓▓          │  │
    │            ││          │  │
    │            ↓↓ 10cm     │  │
    │  ═══════════════════   │  │ 20cm
    │  [     Platform     ]  │  │ tinggi
▓▓  │  [      Botol       ]  │  │ chamber
││→ │  ═══════════════════   │  │
LENGTH    ↑                  │  │
(10cm) [M] Metal sensor      │  │
    └────────────────────────┘  ↓
```

**Clearance:**
- HEIGHT sensor → platform: **10cm**
- LENGTH sensor → botol: **10cm**
- Metal sensor → botol: **2-4mm**

---

## 🎯 Klasifikasi Size (Tidak Berubah)

| Size | Diameter (HEIGHT) | Panjang (LENGTH) | Point |
|------|------------------|------------------|-------|
| **KECIL** | 5-11 cm | 8-13 cm | **5** |
| **SEDANG** | 12-16 cm | 15-20 cm | **10** |
| **BESAR** | 18-22 cm | 21-30 cm | **15** |

**Metal Detection:**
- Plastik → ✅ **ACCEPT** (ukur size → point)
- Kaleng → ❌ **REJECT** (buzzer 3x, no point)

---

## 📦 Component List (FINAL)

| No | Item | Posisi | Fungsi |
|----|------|--------|--------|
| 1 | ESP32 | Belakang kiri | Brain system |
| 2 | LCD 16x2 | Depan atas | Display info |
| 3 | HC-SR04 HEIGHT | **ATAS** tengah | Ukur diameter |
| 4 | HC-SR04 LENGTH | **SAMPING KIRI** | Ukur panjang |
| 5 | Metal Sensor | Samping platform | Deteksi logam |
| 6 | Servo | Tengah (gate) | Buka/tutup |
| 7 | Buzzer | Belakang | Feedback |
| 8 | IR Lamp | Atas | Penerangan |
| 9 | Platform | Tengah chamber | Tempat botol |
| 10 | Collection Box | Bawah | Penampung |

---

## 🔌 Wiring (Tidak Berubah)

```
ESP32
├→ GPIO 4  → HEIGHT TRIG (atas)
├→ GPIO 18 → HEIGHT ECHO (atas)
├→ GPIO 5  → LENGTH TRIG (samping)
├→ GPIO 12 → LENGTH ECHO (samping)
├→ GPIO 19 → SERVO
├→ GPIO 21 → LCD SDA
├→ GPIO 22 → LCD SCL
├→ GPIO 23 → BUZZER
├→ GPIO 25 → METAL SENSOR
└→ GPIO 13 → IR LAMP
```

---

## ⚙️ Cara Kerja (Step by Step)

```
1. User scan QR → Login
         ↓
2. User masukkan botol HORIZONTAL (tidur)
         ↓
3. Botol jatuh ke PLATFORM
         ↓
4. METAL SENSOR CEK:
   - Logam? → REJECT ❌
   - Plastik? → Lanjut ✅
         ↓
5. SENSOR UKUR:
   - HEIGHT (atas) → Diameter ↓
   - LENGTH (samping) → Panjang →
         ↓
6. KLASIFIKASI SIZE → Hitung point
         ↓
7. LCD tampil: "BOTOL SEDANG +10 PT"
         ↓
8. SERVO BUKA GATE (90°)
         ↓
9. Botol jatuh ke collection box
         ↓
10. SERVO TUTUP GATE (0°)
         ↓
11. Data ke Supabase → Point update
```

---

## 🛠️ Assembly Tips

### **1. Mount Sensor HEIGHT (Atas)**
- Gunakan bracket L adjustable
- Test jarak dengan penggaris (10cm ke platform)
- Pastikan lurus ke bawah (tidak miring)

### **2. Mount Sensor LENGTH (Samping)**
- Bracket L ke dinding kiri chamber
- Sensor menghadap **ke kanan** (horizontal)
- Test jarak 10cm ke tengah platform

### **3. Platform**
- Acrylic 25x20cm
- 4 spacer sebagai kaki (tinggi 5cm)
- Posisi: 20cm dari atas kotak

### **4. Metal Sensor**
- Dekat platform (samping atau bawah)
- Jarak sensing: 2-4mm
- Adjustable untuk kalibrasi

---

## ✅ Testing Checklist

- [ ] HEIGHT sensor baca diameter akurat (±1cm)
- [ ] LENGTH sensor baca panjang akurat (±1cm)
- [ ] Metal sensor deteksi kaleng
- [ ] Metal sensor TIDAK deteksi plastik
- [ ] Botol TIDAK bergeser saat diukur
- [ ] Klasifikasi size benar (small/medium/large)
- [ ] Servo buka/tutup smooth
- [ ] Data tersimpan ke database

---

## 💡 Pro Tips

1. **Sensor HEIGHT:** Pastikan mounting KUAT, tidak goyang
2. **Sensor LENGTH:** Jarak 10cm critical untuk akurasi
3. **Platform:** Harus RATA, tidak miring
4. **Metal Sensor:** Test dengan berbagai jenis kaleng
5. **Clearance:** Jangan terlalu dekat/jauh dari recommended

---

**Design:** FINAL (Corrected Sensor Position)  
**Sensor:** HEIGHT (atas) + LENGTH (samping) + Metal  
**Budget:** Rp 455.000  
**Status:** ✅ READY TO BUILD!  
**Last Updated:** June 9, 2026
