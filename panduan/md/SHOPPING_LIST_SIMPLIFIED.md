# 🛒 Shopping List SIMPLIFIED - IoT Bank Sampah

## 💰 Total Budget: **Rp 455.000** (hemat Rp 160.000!)

---

## 🔌 ELEKTRONIK (Rp 275.000)

| No | Item | Spec | Qty | Harga | Total |
|----|------|------|-----|-------|-------|
| 1 | **ESP32 DevKit** | 30 pin, WiFi+BT | 1 | Rp 60.000 | **Rp 60.000** |
| 2 | **LCD 16x2 I2C** | Blue backlight | 1 | Rp 35.000 | **Rp 35.000** |
| 3 | **Ultrasonic HC-SR04** | 2-400cm | **2** | Rp 10.000 | **Rp 20.000** |
| 4 | **Metal Sensor** | LJ12A3-4-Z/BX | 1 | Rp 30.000 | **Rp 30.000** |
| 5 | **Servo Motor** | MG996R 180° | 1 | Rp 45.000 | **Rp 45.000** |
| 6 | **Buzzer 5V** | Active | 1 | Rp 5.000 | **Rp 5.000** |
| 7 | **IR Lamp 12V** | 3W infra merah | 1 | Rp 15.000 | **Rp 15.000** |
| 8 | **Power Supply** | 12V 3A adapter | 1 | Rp 40.000 | **Rp 40.000** |
| 9 | **Buck Converter** | 12V→5V 3A | 1 | Rp 15.000 | **Rp 15.000** |
| 10 | **Kabel Jumper** | 40pin M-F 20cm | 1 set | Rp 10.000 | **Rp 10.000** |

**Subtotal Elektronik: Rp 275.000**

---

## 🏗️ STRUKTUR & MEKANIK (Rp 180.000)

| No | Item | Spec | Qty | Harga | Total |
|----|------|------|-----|-------|-------|
| 11 | **Acrylic Clear 5mm** | 122x244cm | 1 | Rp 150.000 | **Rp 150.000** |
| 12 | **Bracket L** | 3x3cm stainless | 8 | Rp 2.500 | **Rp 20.000** |
| 13 | **Sekrup M3** | + mur, 10mm | 50 | Rp 200 | **Rp 10.000** |

**Alternatif murah:**
- MDF 6mm: Rp 80.000 (hemat Rp 70.000!)

**Subtotal Struktur: Rp 180.000**

---

## ❌ TIDAK PERLU BELI (HEMAT!)

| Item | Harga | Status |
|------|-------|--------|
| ~~Load Cell 5kg~~ | ~~Rp 50.000~~ | ❌ **TIDAK PAKAI** |
| ~~HX711 Module~~ | ~~(included)~~ | ❌ **TIDAK PAKAI** |
| ~~Breadboard~~ | ~~Rp 10.000~~ | ❌ **TIDAK PERLU** |
| ~~Platform Complex~~ | ~~Rp 20.000~~ | ❌ **Pakai yang simple** |
| **Total Hemat** | | **Rp 80.000** ✅ |

---

## 📦 GRAND TOTAL

| Kategori | Harga |
|----------|-------|
| Elektronik | Rp 275.000 |
| Struktur & Mekanik | Rp 180.000 |
| **TOTAL** | **Rp 455.000** |

### **Opsi Budget MDF:**
| Kategori | Harga |
|----------|-------|
| Elektronik | Rp 275.000 |
| Struktur (MDF) | Rp 110.000 |
| **TOTAL MDF** | **Rp 385.000** 🎉 |

---

## 🎯 PRIORITAS BELANJA

### **FASE 1: TEST ELEKTRONIK (Rp 275.000)**
Beli dulu:
- [x] ESP32
- [x] LCD 16x2
- [x] 2x Ultrasonic
- [x] Metal Sensor
- [x] Servo
- [x] Buzzer
- [x] Power Supply + Buck Converter
- [x] Kabel Jumper

**Tujuan:** Test kode, kalibrasi sensor

---

### **FASE 2: STRUKTUR (Rp 180.000)**
Beli setelah test OK:
- [x] Acrylic / MDF
- [x] Bracket + Sekrup

**Tujuan:** Rakit kotak, pasang komponen

---

## 🛠️ PIN yang Dipakai

| GPIO | Fungsi |
|------|--------|
| 4 | Ultrasonic HEIGHT - TRIG |
| 18 | Ultrasonic HEIGHT - ECHO |
| 5 | Ultrasonic LENGTH - TRIG |
| 12 | Ultrasonic LENGTH - ECHO |
| 19 | Servo PWM |
| 23 | Buzzer |
| 13 | IR Lamp (via MOSFET) |
| 25 | Metal Sensor |
| 21 | LCD SDA (I2C) |
| 22 | LCD SCL (I2C) |

**PIN yang TIDAK DIPAKAI:**
- ~~GPIO 26~~ (Load Cell DOUT)
- ~~GPIO 27~~ (Load Cell SCK)

---

## 🏪 REKOMENDASI TOKO

### **Online**
- **Tokopedia:** ArduEshop, RoboticA, CNC Store
- **Shopee:** Akhi Shop, Arduino Indonesia
- **Lazada:** Indo Robotic, Mekatronika

### **Offline**
- **Jakarta:** Glodok (Harco, Mangga Dua)
- **Bandung:** Pasar Baltos, Toko Sigma
- **Surabaya:** Hi-Tech Mall, WTC
- **Yogyakarta:** Jl. Kenari, Toko TARA

---

## ✅ CHECKLIST BELANJA

### **Sebelum Checkout:**
- [ ] Cek spesifikasi (voltage, pin count)
- [ ] Baca review
- [ ] Bandingkan 3 toko
- [ ] Tanya stock
- [ ] Cek garansi

### **Saat Terima:**
- [ ] Cek kondisi fisik
- [ ] Test dengan multimeter
- [ ] Simpan nota
- [ ] Foto unboxing

---

## 💡 TIPS HEMAT

1. **Pakai MDF** instead of acrylic → hemat Rp 70.000
2. **Beli paket** ESP32 starter kit → hemat ongkir
3. **Nego** kalau beli offline
4. **Flash sale** Shopee/Tokopedia
5. **Patungan** dengan teman

**Potensi hemat total:** Rp 100.000 - Rp 150.000!

---

## 📊 PERBANDINGAN DESIGN

| Aspek | With Load Cell | **Simplified** |
|-------|---------------|----------------|
| **Budget** | Rp 615.000 | **Rp 455.000** ✅ |
| **Sensor** | 4 (2 ultrasonic + load cell + metal) | **3 (2 ultrasonic + metal)** ✅ |
| **Kompleksitas** | Tinggi (kalibrasi berat) | **Sederhana** ✅ |
| **Waktu Rakit** | 8 jam | **6 jam** ✅ |
| **Akurasi** | Sangat tinggi | Cukup untuk bank sampah ✅ |
| **Maintenance** | Ribet | **Mudah** ✅ |

**Kesimpulan:** Design simplified **LEBIH COCOK untuk mahasiswa!** ✅

---

**Shopping List v2.0 - Simplified**  
**Budget:** Rp 455.000 (standard) / Rp 385.000 (MDF)  
**Last Updated:** June 9, 2026

---

**Print dan bawa ke toko! 🛒✨**
