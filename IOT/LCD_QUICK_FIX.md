# ⚡ LCD Quick Fix - 5 Menit

## 🚀 Langkah Cepat (Urutan Penting!)

### 1️⃣ Upload Kode Baru (30 detik)
- Kode sudah diperbaiki dengan auto-detect I2C
- Upload ke ESP32

### 2️⃣ Buka Serial Monitor (10 detik)
- Baud rate: **115200**
- Lihat output saat boot

### 3️⃣ Cek Output (20 detik)

#### ✅ **SUKSES** - Lihat ini:
```
[LCD] Scanning I2C bus...
[LCD] ✅ I2C device found at 0x27
[LCD] Using address: 0x27
[LCD] ✅ LCD initialized successfully!
```
**LCD akan menampilkan:** `LCD TEST OK!`

#### ❌ **GAGAL** - Lihat ini:
```
[LCD] ❌ No I2C devices found!
```
**Lanjut ke langkah 4**

### 4️⃣ Cek Hardware (2 menit)

**Koneksi Wajib:**
```
LCD → ESP32
VCC → 5V
GND → GND
SDA → GPIO 21
SCL → GPIO 22
```

**Cek Visual:**
- [ ] Semua kabel terpasang kencang
- [ ] LED backlight menyala (jika ada)
- [ ] Potentiometer sudah diputar (coba putar perlahan)

### 5️⃣ Test Manual (1 menit)

Ketik di Serial Monitor:
```
SCAN
```

**Hasil:**
- **Ada device:** `[I2C] Device found at 0x27` → LCD OK, coba adjust potentiometer
- **Tidak ada:** `[I2C] No devices found` → Cek kabel atau ganti LCD

### 6️⃣ Test LCD (30 detik)

Ketik di Serial Monitor:
```
LCD
```

**Hasil:**
- **LCD menampilkan text:** ✅ LCD BERFUNGSI!
- **LCD blank:** Putar potentiometer di belakang LCD

## 🔧 Solusi Kilat

### LCD Blank Tapi I2C Terdeteksi
**→ Putar potentiometer** (baut biru di belakang LCD) sambil lihat LCD

### No I2C Devices Found
**→ Cek kabel:**
1. Cabut semua kabel
2. Pasang ulang satu per satu
3. Pastikan kencang

### Masih Gagal?
**→ Swap SDA/SCL:**
Edit `main.cpp` line ~520:
```cpp
Wire.begin(22, 21);  // Swap: SDA=22, SCL=21
```

## 📸 Foto yang Perlu Dicek

1. **Koneksi ESP32 ke LCD** (4 kabel)
2. **Potentiometer di belakang LCD** (baut biru)
3. **Serial Monitor output** (saat boot)

## 🎯 Hasil Akhir

**LCD harus menampilkan:**
```
LCD TEST OK!
Addr: 0x27
```

Lalu setelah 2 detik:
```
SYSTEM READY
WiFi OK
```

---

**Total waktu: 5 menit**
**Jika masih gagal:** Baca `LCD_TROUBLESHOOTING.md` untuk detail lengkap
