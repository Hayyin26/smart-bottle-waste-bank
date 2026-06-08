# 🔍 Panduan Sensor Metal Proximity

## 📋 **Tentang Sensor**

Sensor metal proximity (inductive sensor) digunakan untuk mendeteksi botol logam/kaleng yang **TIDAK DITERIMA** oleh sistem.

### **Jenis Sensor yang Direkomendasikan:**
1. **LJ12A3-4-Z/BX** (12mm, NPN, NO)
2. **LJ18A3-8-Z/BX** (18mm, NPN, NO)
3. **Capacitive Proximity Sensor** (alternatif)

---

## 🔌 **Wiring Diagram**

### **Sensor NPN (Normally Open)**
```
Sensor Brown  → VCC (5V-12V DC)
Sensor Blue   → GND
Sensor Black  → GPIO 25 (Signal)
```

### **Catatan Penting:**
- **VCC**: Cek datasheet sensor (5V, 12V, atau 24V)
- **Signal**: Output 0-5V (gunakan voltage divider jika perlu)
- **GPIO 25**: Configured sebagai INPUT_PULLUP

---

## ⚙️ **Konfigurasi di Kode**

### **Pin Definition:**
```cpp
#define PIN_METAL_SENSOR 25  // GPIO 25
```

### **Setup:**
```cpp
pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);
```

### **Read Function:**
```cpp
bool readMetalSensor() {
  // LOW = Metal terdeteksi
  // HIGH = Tidak ada metal
  return digitalRead(PIN_METAL_SENSOR) == LOW;
}
```

---

## 🎯 **Cara Kerja**

### **Logika Deteksi:**
1. **Botol plastik** → Sensor output HIGH → Diterima
2. **Botol logam/kaleng** → Sensor output LOW → Ditolak

### **Flow Diagram:**
```
Botol masuk
    ↓
Cek sensor metal
    ↓
Metal detected? ──YES──→ Buzzer 3x → Pintu tutup → Ditolak
    ↓
   NO
    ↓
Cek ukuran (ultrasonik + load cell)
    ↓
Ukuran valid? ──YES──→ Buzzer 1x → Pintu buka → Diterima
    ↓
   NO
    ↓
Buzzer 2x → Pintu tutup → Ditolak
```

---

## 🧪 **Testing Sensor**

### **Test Program Sederhana:**
```cpp
void setup() {
  Serial.begin(115200);
  pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);
}

void loop() {
  int sensorValue = digitalRead(PIN_METAL_SENSOR);
  
  Serial.print("Sensor: ");
  Serial.print(sensorValue);
  Serial.print(" → ");
  
  if (sensorValue == LOW) {
    Serial.println("METAL DETECTED! ❌");
  } else {
    Serial.println("No metal ✅");
  }
  
  delay(500);
}
```

### **Expected Output:**
```
Sensor: 1 → No metal ✅
Sensor: 1 → No metal ✅
Sensor: 0 → METAL DETECTED! ❌  ← Kaleng didekatkan
Sensor: 0 → METAL DETECTED! ❌
Sensor: 1 → No metal ✅
```

---

## 📏 **Jarak Deteksi**

| Sensor Model | Jarak Deteksi | Target Material |
|--------------|---------------|-----------------|
| LJ12A3-4-Z/BX | 4mm | Besi/Steel |
| LJ18A3-8-Z/BX | 8mm | Besi/Steel |
| LJ30A3-15-Z/BX | 15mm | Besi/Steel |

**Catatan:**
- Jarak deteksi untuk aluminium: ~60% dari jarak nominal
- Jarak deteksi untuk stainless steel: ~70% dari jarak nominal

---

## 🔧 **Instalasi Fisik**

### **Posisi Sensor:**
```
        [Sensor Metal]
             ↓
    ┌────────────────┐
    │                │
    │   ← Botol →   │  ← Jalur botol
    │                │
    └────────────────┘
         [Servo]
```

### **Tips Instalasi:**
1. **Jarak optimal**: 2-5mm dari jalur botol
2. **Posisi**: Di depan sensor ultrasonik
3. **Mounting**: Gunakan bracket atau 3D printed holder
4. **Alignment**: Pastikan sensor tegak lurus dengan botol

---

## ⚠️ **Troubleshooting**

### **Problem 1: Sensor selalu LOW (selalu detect)**
**Solusi:**
- Cek jarak sensor ke metal (terlalu dekat?)
- Cek apakah ada metal di sekitar sensor
- Cek wiring (mungkin short circuit)
- Coba ganti sensor

### **Problem 2: Sensor tidak detect metal**
**Solusi:**
- Cek jarak sensor ke target (terlalu jauh?)
- Cek voltase VCC (harus sesuai spesifikasi)
- Cek koneksi signal ke GPIO 25
- Test dengan metal yang lebih besar (besi)

### **Problem 3: Pembacaan tidak stabil**
**Solusi:**
- Tambahkan capacitor 100nF di signal line
- Gunakan kabel yang lebih pendek
- Hindari kabel signal dekat dengan kabel power
- Tambahkan delay di kode (debouncing)

### **Problem 4: Sensor panas**
**Solusi:**
- Cek voltase VCC (jangan over voltage!)
- Cek arus konsumsi (max 200mA)
- Pastikan tidak ada short circuit
- Ganti sensor jika rusak

---

## 🔄 **Voltage Divider (Jika Perlu)**

Jika sensor output 12V atau 24V, gunakan voltage divider:

```
Sensor Signal ──┬── R1 (10kΩ) ──┬── GPIO 25
                │                │
               GND           R2 (4.7kΩ)
                                 │
                                GND
```

**Formula:**
```
Vout = Vin × (R2 / (R1 + R2))
Vout = 12V × (4.7kΩ / (10kΩ + 4.7kΩ))
Vout = 3.84V ✅ (Safe for ESP32)
```

---

## 📊 **Tabel Material yang Terdeteksi**

| Material | Terdeteksi? | Jarak Relatif |
|----------|-------------|---------------|
| Besi (Iron) | ✅ Yes | 100% |
| Aluminium | ✅ Yes | 60% |
| Stainless Steel | ✅ Yes | 70% |
| Tembaga (Copper) | ✅ Yes | 50% |
| Plastik | ❌ No | - |
| Kaca | ❌ No | - |
| Kayu | ❌ No | - |

---

## 💡 **Tips Optimasi**

### **1. Debouncing**
Tambahkan delay untuk menghindari false positive:
```cpp
bool readMetalSensorStable() {
  int count = 0;
  for (int i = 0; i < 5; i++) {
    if (digitalRead(PIN_METAL_SENSOR) == LOW) {
      count++;
    }
    delay(10);
  }
  return count >= 3;  // Minimal 3 dari 5 pembacaan
}
```

### **2. LED Indicator**
Tambahkan LED untuk visual feedback:
```cpp
#define PIN_METAL_LED 2

void setup() {
  pinMode(PIN_METAL_LED, OUTPUT);
}

void loop() {
  if (readMetalSensor()) {
    digitalWrite(PIN_METAL_LED, HIGH);  // LED nyala
  } else {
    digitalWrite(PIN_METAL_LED, LOW);   // LED mati
  }
}
```

### **3. Logging**
Log setiap deteksi metal untuk analisis:
```cpp
if (isMetalDetected) {
  Serial.println("[Metal] Detected at: " + String(millis()));
  // Kirim ke database untuk statistik
}
```

---

## 🎓 **Penjelasan Teknis**

### **Prinsip Kerja Inductive Sensor:**
1. Sensor menghasilkan medan elektromagnetik
2. Metal di dekat sensor mengubah medan
3. Perubahan medan terdeteksi oleh sensor
4. Output berubah dari HIGH ke LOW

### **NPN vs PNP:**
- **NPN (Normally Open)**: Output LOW saat detect
- **PNP (Normally Closed)**: Output HIGH saat detect

**Kode ini menggunakan NPN!**

### **Kenapa Botol Logam Ditolak?**
1. **Kontaminasi**: Logam bisa mengandung zat berbahaya
2. **Daur ulang**: Proses daur ulang logam berbeda
3. **Nilai ekonomi**: Logam lebih mahal, dijual terpisah
4. **Keamanan**: Hindari kerusakan mesin crusher

---

## 📞 **Support**

Jika masih ada masalah:
1. Cek datasheet sensor untuk spesifikasi
2. Test dengan multimeter (cek voltase output)
3. Coba sensor di Arduino/ESP32 lain
4. Ganti sensor jika rusak

---

## 📚 **Referensi**

- [Inductive Sensor Basics](https://www.electronics-tutorials.ws/io/io_2.html)
- [LJ12A3 Datasheet](https://www.google.com/search?q=LJ12A3+datasheet)
- [ESP32 GPIO Guide](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/)
- [Voltage Divider Calculator](https://ohmslawcalculator.com/voltage-divider-calculator)

---

## 🛒 **Rekomendasi Pembelian**

### **Sensor Metal Proximity:**
- **Tokopedia**: Cari "LJ12A3-4-Z/BX NPN"
- **Shopee**: Cari "Proximity Sensor 12mm NPN"
- **AliExpress**: $2-5 per sensor
- **Lokal**: Toko elektronik industri

### **Alternatif:**
- Capacitive proximity sensor (bisa detect plastik juga)
- Hall effect sensor (khusus magnet)
- Optical sensor (infrared)

**Rekomendasi: LJ12A3-4-Z/BX (murah, reliable, mudah didapat)**
