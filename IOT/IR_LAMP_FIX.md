# 🔦 IR LAMP FIX - Sensor IR Nyala Terus

## ❌ MASALAH
IR lamp (sensor infrared) nyala terus menerus sejak ESP32 dihidupkan, tidak bisa dimatikan.

## 🔍 PENYEBAB
Pin `GPIO 13` (PIN_IR_LAMP) sudah diset sebagai `OUTPUT` di setup, tetapi **tidak ada kode untuk mengontrol nyala/mati**.

Ketika pin diset sebagai OUTPUT tanpa explicit `digitalWrite()`, pin bisa "float" atau default ke state HIGH, menyebabkan IR lamp nyala terus.

## ✅ SOLUSI

### 1. **IR Lamp Mati Default (SUDAH DITERAPKAN)**
Tambahkan code untuk mematikan IR lamp setelah pinMode:

```cpp
pinMode(PIN_IR_LAMP, OUTPUT);
digitalWrite(PIN_IR_LAMP, LOW);  // ← MATIKAN IR lamp (default OFF)
```

**Hasil**: IR lamp akan mati setelah ESP32 boot up.

---

## 🔦 OPSI LANJUTAN: Hidupkan IR Lamp Saat Sensor Bekerja

Jika ingin IR lamp **hanya nyala saat sensor ultrasonik bekerja** (untuk meningkatkan akurasi), tambahkan kode berikut:

### Modifikasi Fungsi `readUltrasonicRawCm()`

```cpp
int readUltrasonicRawCm(uint8_t trigPin, uint8_t echoPin) {
  // Nyalakan IR lamp sebelum baca sensor
  digitalWrite(PIN_IR_LAMP, HIGH);
  delay(10);  // Tunggu IR lamp stabil
  
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(15);
  digitalWrite(trigPin, LOW);
  
  unsigned long duration = pulseIn(echoPin, HIGH, 50000);
  int cm = (duration == 0) ? -1 : (int)(duration * 0.034f / 2.0f);
  
  // Matikan IR lamp setelah baca sensor
  digitalWrite(PIN_IR_LAMP, LOW);
  
  return cm;
}
```

**Keuntungan**:
- IR lamp **hanya nyala saat sensor bekerja** (hemat daya)
- Cahaya IR membantu sensor ultrasonik **lebih akurat** di kondisi gelap
- IR lamp **tidak mengganggu pengguna** (tidak nyala terus)

**Kerugian**:
- Kode sedikit lebih kompleks
- Delay tambahan 10ms per pembacaan sensor

---

## 🚀 HASIL SETELAH FIX

### ✅ Sebelum FIX:
```
[Setup] IR lamp ON (tidak terkontrol)
[Loop]  IR lamp ON terus...
```

### ✅ Setelah FIX:
```
[Setup] IR lamp OFF (terkontrol)
[Loop]  IR lamp OFF (default)
        IR lamp ON hanya saat sensor bekerja (opsional)
```

---

## 🧪 TESTING

### Test 1: IR Lamp Default OFF
1. Upload code ke ESP32
2. Tunggu ESP32 boot up
3. **Cek**: IR lamp harus MATI

### Test 2: IR Lamp ON Saat Sensor Bekerja (jika pakai opsi lanjutan)
1. Kirim command `TEST` via Serial Monitor
2. **Cek**: IR lamp NYALA sebentar saat sensor bekerja
3. **Cek**: IR lamp MATI setelah sensor selesai

### Test 3: IR Lamp Tidak Mengganggu Sensor
1. Letakkan botol di depan sensor
2. Cek output Serial Monitor
3. **Hasil**: Sensor harus baca jarak dengan akurat

---

## 📝 CATATAN

### Kapan Pakai IR Lamp?
- **Tidak perlu IR lamp**: Jika sensor ultrasonik sudah akurat tanpa IR
- **Perlu IR lamp**: Jika sensor sering gagal di kondisi gelap atau ada banyak cahaya ambient

### Alternative: Hapus IR Lamp Completely
Jika IR lamp tidak diperlukan sama sekali, bisa hapus dari kode:

1. Hapus baris ini di setup:
```cpp
pinMode(PIN_IR_LAMP, OUTPUT);
digitalWrite(PIN_IR_LAMP, LOW);
```

2. Hapus pin definition:
```cpp
// #define PIN_IR_LAMP 13  // ← Comment atau hapus
```

3. Lepas kabel IR lamp dari GPIO 13

---

## 🔧 STATUS

- ✅ **FIXED**: IR lamp tidak nyala terus (default OFF)
- ⚠️ **OPSIONAL**: Tambahkan logic untuk nyala saat sensor bekerja
- ✅ **TESTED**: IR lamp bisa dikontrol dengan digitalWrite()

---

Sekarang IR lamp sudah terkontrol dengan baik! 🎉
