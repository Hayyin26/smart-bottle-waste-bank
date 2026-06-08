# 🗑️ Desain Fisik Smart Bottle Waste Bank IoT

## 📐 **Gambaran Umum:**

Tempat sampah pintar ini dirancang untuk **menerima botol plastik secara horizontal** (tidur), mengukur dimensi botol, dan memberikan poin otomatis kepada user.

---

## 🏗️ **Desain 3D - Tampak Depan:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║         SMART BOTTLE WASTE BANK                       ║ │
│  ║              Bank Sampah Digital                      ║ │
│  ╚═══════════════════════════════════════════════════════╝ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  [LCD 16x2]                                 │    │   │
│  │  │  SCAN QR CODE                               │    │   │
│  │  │  TO LOGIN                                   │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │         ┌───────────────────────────┐               │   │
│  │         │                           │               │   │
│  │         │    SLOT MASUK BOTOL       │               │   │
│  │         │    (30cm x 15cm)          │               │   │
│  │         │         ↓                 │               │   │
│  │         └───────────────────────────┘               │   │
│  │                                                      │   │
│  │  [●] LED Hijau    [●] LED Merah    [♪] Buzzer      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │              TEMPAT SAMPAH                           │  │
│  │              (Kapasitas: 50L)                        │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
   60cm (Lebar)                                    80cm (Tinggi)
```

---

## 🔍 **Desain Internal - Potongan Samping:**

```
┌─────────────────────────────────────────────────────────────┐
│                    BAGIAN ATAS                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [LCD 16x2]  [LED] [Buzzer]                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SLOT MASUK BOTOL                        │   │
│  │         ┌─────────────────────────┐                  │   │
│  │         │                         │                  │   │
│  │         └─────────────────────────┘                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                 RUANG SENSOR & GATE                         │
│                                                             │
│  [Sensor HEIGHT] ← Dipasang di atas                        │
│         ↓                                                   │
│         │ 30cm (jarak ke dasar)                            │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [Sensor LENGTH] ←─────→ [BOTOL] ←─────→ [Dinding]│   │
│  │  (Samping kiri)          (Horizontal)              │   │
│  │                                                     │   │
│  │  ┌──────────┐                                      │   │
│  │  │  SERVO   │ ← Gate (pintu otomatis)              │   │
│  │  │  GATE    │                                      │   │
│  │  └──────────┘                                      │   │
│  │                                                     │   │
│  │  [Load Cell] ← Timbangan (di bawah botol)         │   │
│  │                                                     │   │
│  │  [Metal Sensor] ← Deteksi logam                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                 TEMPAT SAMPAH UTAMA                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                                                     │   │
│  │         [Botol-botol yang sudah masuk]             │   │
│  │                                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                 RUANG ELEKTRONIK                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [ESP32]  [Power Supply]  [Relay Module]           │   │
│  │  [Breadboard]  [Kabel-kabel]                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📏 **Dimensi Detail:**

### **Ukuran Keseluruhan:**
- Tinggi: 80 cm
- Lebar: 60 cm
- Dalam: 40 cm
- Berat: ~15 kg

### **Ruang Sensor:**
- Tinggi: 30 cm
- Lebar: 40 cm
- Dalam: 35 cm

### **Slot Masuk:**
- Lebar: 30 cm
- Tinggi: 15 cm

### **Tempat Sampah:**
- Kapasitas: 50 liter
- ~150-200 botol

---

## 📊 **Estimasi Biaya:**

| Komponen | Harga (IDR) |
|----------|-------------|
| ESP32 Dev Board | 50,000 |
| Sensor Ultrasonic (2x) | 20,000 |
| Servo Motor | 15,000 |
| Load Cell + HX711 | 50,000 |
| Metal Sensor | 30,000 |
| LCD 16x2 I2C | 35,000 |
| LED & Buzzer | 7,000 |
| Power Supply | 80,000 |
| Relay Module | 25,000 |
| Kabel & Connector | 30,000 |
| Acrylic/Plywood | 200,000 |
| Tempat Sampah | 100,000 |
| Miscellaneous | 50,000 |
| **TOTAL** | **~692,000** |

---

**File lengkap dengan diagram detail, wiring, dan cara pembuatan!**
