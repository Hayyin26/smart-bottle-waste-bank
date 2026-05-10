# 🔐 Panduan Strategi Logout - Auto vs Manual

## 🎯 Dua Strategi Logout

| Strategi | Kapan Logout | User Experience | Keamanan | Use Case |
|----------|--------------|-----------------|----------|----------|
| **AUTO-LOGOUT** | Setelah setiap transaksi | Harus scan QR setiap kali | ⭐⭐⭐⭐⭐ Tinggi | Tempat umum |
| **MANUAL LOGOUT** | User logout sendiri atau timeout | Scan QR sekali, bisa transaksi berkali-kali | ⭐⭐⭐ Sedang | Pribadi/kantor |

---

## 🔄 Strategi 1: AUTO-LOGOUT (Default - Saat Ini)

### Flow:
```
1. User scan QR
   ↓
2. Login berhasil
   LCD: "HELLO! John Doe"
   ↓
3. User masukkan botol
   ↓
4. Transaksi berhasil
   LCD: "SUCCESS! SEDANG 10PT"
   ↓
5. ⚡ AUTO-LOGOUT (Otomatis!)
   LCD: "LOGGING OUT..."
   → Session dihapus dari database
   → Token dihapus dari ESP32
   ↓
6. Selesai
   LCD: "THANK YOU! John Doe"
   ↓
7. Kembali ke awal
   LCD: "SCAN QR CODE TO LOGIN"
```

### Kelebihan:
- ✅ **Keamanan maksimal**: User lain tidak bisa pakai akun yang sama
- ✅ **Privacy terjaga**: Poin tidak terlihat user lain
- ✅ **Hygiene**: Setiap transaksi = sesi baru
- ✅ **Cocok tempat umum**: Sekolah, kampus, mall, kantor besar
- ✅ **Tidak perlu tombol logout**: Otomatis
- ✅ **Tidak ada session menumpuk**: Database bersih

### Kekurangan:
- ❌ **Harus scan QR berulang**: Setiap kali mau transaksi
- ❌ **Ribet untuk multiple bottles**: User mau masukkan 10 botol = scan 10x
- ❌ **Lambat**: Proses login + logout setiap transaksi

### Cocok Untuk:
- 🏫 Sekolah/Kampus (banyak siswa)
- 🏢 Kantor besar (banyak karyawan)
- 🏪 Mall/Tempat umum
- 🎪 Event/Festival
- 🏘️ Komunitas/RT (banyak warga)

### Kode Saat Ini:
```cpp
// Auto-logout setelah transaksi (untuk keamanan)
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  lcdPrintLine(1, "LOGGING OUT...");
  delay(1000);
  deleteSession();  // ← Hapus session dari database
  lcdPrintLine(0, "THANK YOU!");
  lcdPrintLine(1, current_user_name.substring(0, 16));
  delay(2000);
}

gateState = USE_QR_LOGIN ? WAIT_USER : WAIT_BOTTLE;  // ← Kembali ke login
```

---

## 🔓 Strategi 2: MANUAL LOGOUT

### Flow:
```
1. User scan QR
   ↓
2. Login berhasil
   LCD: "HELLO! John Doe"
   ↓
3. User masukkan botol #1
   ↓
4. Transaksi berhasil
   LCD: "SUCCESS! SEDANG 10PT"
   ↓
5. ⚡ TETAP LOGIN (Tidak logout!)
   LCD: "John Doe"
   LCD: "MASUKKAN LAGI?"
   ↓
6. User masukkan botol #2
   ↓
7. Transaksi berhasil lagi
   LCD: "SUCCESS! BESAR 15PT"
   ↓
8. User selesai → Logout manual
   - Tekan tombol logout, atau
   - Kirim command "LOGOUT", atau
   - Tunggu timeout (5 menit)
   ↓
9. Kembali ke awal
   LCD: "SCAN QR CODE TO LOGIN"
```

### Kelebihan:
- ✅ **Convenient**: Scan QR sekali, bisa transaksi berkali-kali
- ✅ **Cepat**: Tidak perlu login ulang
- ✅ **User-friendly**: Cocok untuk user yang mau masukkan banyak botol
- ✅ **Efisien**: Hemat waktu

### Kekurangan:
- ❌ **Keamanan rendah**: User lain bisa pakai akun yang lupa logout
- ❌ **Privacy issue**: Poin terlihat user lain
- ❌ **Butuh tombol logout**: Atau command manual
- ❌ **Session menumpuk**: Jika user lupa logout

### Cocok Untuk:
- 🏠 Rumah pribadi
- 🏢 Kantor kecil (user saling kenal)
- 👨‍👩‍👧‍👦 Keluarga
- 🏪 Toko kecil
- 📦 Warehouse (petugas tetap)

### Cara Implementasi:

#### Opsi A: Logout Manual via Command
```cpp
// Di bagian serial commands
else if (command == "LOGOUT") {
  if (USE_QR_LOGIN && current_user_id.length() > 0) {
    deleteSession();
    Serial.println("[Command] Logged out");
    lcdPrintLine(0, "LOGGED OUT");
    lcdPrintLine(1, "SCAN QR AGAIN");
    buzzShort(2);
    delay(2000);
  }
}
```

**Cara pakai:**
```
1. Buka Serial Monitor
2. Ketik: LOGOUT
3. Enter
```

#### Opsi B: Logout Manual via Button
```cpp
// Tambahkan pin button
#define PIN_LOGOUT_BUTTON 25

// Di setup()
pinMode(PIN_LOGOUT_BUTTON, INPUT_PULLUP);

// Di loop()
if (digitalRead(PIN_LOGOUT_BUTTON) == LOW) {
  if (USE_QR_LOGIN && current_user_id.length() > 0) {
    deleteSession();
    lcdPrintLine(0, "LOGGED OUT");
    lcdPrintLine(1, "SCAN QR AGAIN");
    buzzShort(2);
    delay(2000);
  }
}
```

**Hardware:**
```
Button → GPIO 25
Button → GND
(Internal pull-up enabled)
```

#### Opsi C: Auto-Logout Setelah Timeout (Hybrid)
```cpp
// Tambahkan variabel
unsigned long lastActivityTime = 0;
#define INACTIVITY_TIMEOUT 300000 // 5 menit

// Update setiap ada aktivitas
if (bottlePresent) {
  lastActivityTime = millis();
}

// Auto-logout jika tidak ada aktivitas
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  if (millis() - lastActivityTime > INACTIVITY_TIMEOUT) {
    Serial.println("[Session] Auto-logout due to inactivity");
    deleteSession();
    lcdPrintLine(0, "SESSION TIMEOUT");
    lcdPrintLine(1, "SCAN QR AGAIN");
    buzzShort(3);
    delay(2000);
    lastActivityTime = millis();
  }
}
```

---

## 🎯 Strategi 3: HYBRID (Best of Both Worlds)

Kombinasi auto-logout dan manual logout:

### Aturan:
1. **User tetap login** setelah transaksi
2. **Auto-logout** jika:
   - Tidak ada aktivitas selama 5 menit
   - User tekan tombol logout
   - User kirim command "LOGOUT"
3. **Session check** setiap 10 detik

### Flow:
```
1. User scan QR → Login
2. User masukkan botol #1 → Transaksi berhasil → TETAP LOGIN
3. User masukkan botol #2 → Transaksi berhasil → TETAP LOGIN
4. User masukkan botol #3 → Transaksi berhasil → TETAP LOGIN
5. User selesai:
   - Opsi A: Tekan tombol logout
   - Opsi B: Kirim command "LOGOUT"
   - Opsi C: Tunggu 5 menit (auto-logout)
6. Kembali ke awal
```

### Kelebihan:
- ✅ **Convenient**: Bisa transaksi berkali-kali
- ✅ **Aman**: Auto-logout jika lupa
- ✅ **Fleksibel**: User bisa logout kapan saja
- ✅ **Best practice**: Balance antara UX dan security

### Implementasi:
```cpp
// 1. Tidak auto-logout setelah transaksi
gateState = WAIT_BOTTLE;  // ← Tetap di WAIT_BOTTLE

// 2. Tambahkan inactivity timeout
unsigned long lastActivityTime = millis();
#define INACTIVITY_TIMEOUT 300000 // 5 menit

// 3. Tambahkan logout button
#define PIN_LOGOUT_BUTTON 25

// 4. Tambahkan logout command
else if (command == "LOGOUT") {
  deleteSession();
}
```

---

## 📊 Perbandingan Detail

| Aspek | Auto-Logout | Manual Logout | Hybrid |
|-------|-------------|---------------|--------|
| **Keamanan** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Convenience** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Privacy** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Speed** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Complexity** | ⭐⭐⭐⭐⭐ Simple | ⭐⭐⭐ Medium | ⭐⭐ Complex |
| **Hardware** | Tidak butuh | Butuh button | Butuh button |
| **User Training** | Minimal | Perlu training | Perlu training |

---

## 🔧 Cara Mengubah Strategi

### Dari Auto-Logout → Manual Logout

**Step 1: Edit kode WAIT_PASS state**
```cpp
// HAPUS bagian ini:
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  lcdPrintLine(1, "LOGGING OUT...");
  delay(1000);
  deleteSession();  // ← HAPUS INI
  lcdPrintLine(0, "THANK YOU!");
  lcdPrintLine(1, current_user_name.substring(0, 16));
  delay(2000);
}

// GANTI dengan:
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  lcdPrintLine(0, current_user_name.substring(0, 16));
  lcdPrintLine(1, "MASUKKAN LAGI?");
  delay(2000);
}

// UBAH state:
gateState = WAIT_BOTTLE;  // ← Bukan WAIT_USER
```

**Step 2: Tambahkan logout manual**
```cpp
// Via command
else if (command == "LOGOUT") {
  deleteSession();
  lcdPrintLine(0, "LOGGED OUT");
  lcdPrintLine(1, "SCAN QR AGAIN");
}

// Via button (opsional)
if (digitalRead(PIN_LOGOUT_BUTTON) == LOW) {
  deleteSession();
}
```

**Step 3: Upload ke ESP32**

---

### Dari Manual Logout → Auto-Logout

**Step 1: Edit kode WAIT_PASS state**
```cpp
// TAMBAHKAN kembali:
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  lcdPrintLine(1, "LOGGING OUT...");
  delay(1000);
  deleteSession();  // ← TAMBAHKAN INI
  lcdPrintLine(0, "THANK YOU!");
  lcdPrintLine(1, current_user_name.substring(0, 16));
  delay(2000);
}

// UBAH state:
gateState = USE_QR_LOGIN ? WAIT_USER : WAIT_BOTTLE;  // ← Kembali ke WAIT_USER
```

**Step 2: Upload ke ESP32**

---

## 💡 Rekomendasi Berdasarkan Use Case

### Use Case 1: Sekolah/Kampus (Banyak Siswa)
**Rekomendasi**: **AUTO-LOGOUT** ⭐⭐⭐⭐⭐
- Keamanan prioritas
- Banyak user
- Privacy penting

### Use Case 2: Kantor Kecil (10-20 Orang)
**Rekomendasi**: **HYBRID** ⭐⭐⭐⭐
- Balance UX dan security
- User saling kenal
- Bisa logout manual

### Use Case 3: Rumah Pribadi
**Rekomendasi**: **MANUAL LOGOUT** atau **DEFAULT USER** ⭐⭐⭐⭐⭐
- Convenience prioritas
- Tidak butuh keamanan tinggi
- Satu keluarga

### Use Case 4: Mall/Tempat Umum
**Rekomendasi**: **AUTO-LOGOUT** ⭐⭐⭐⭐⭐
- Keamanan maksimal
- Banyak user tidak saling kenal
- Privacy sangat penting

### Use Case 5: Event/Festival
**Rekomendasi**: **AUTO-LOGOUT** ⭐⭐⭐⭐⭐
- Cepat, banyak user
- Tidak ada waktu untuk logout manual
- Keamanan penting

---

## 🐛 Troubleshooting

### Problem 1: User lupa logout (Manual Logout)
**Solusi**: Tambahkan inactivity timeout
```cpp
#define INACTIVITY_TIMEOUT 300000 // 5 menit
```

### Problem 2: Auto-logout terlalu cepat
**Solusi**: User mau masukkan banyak botol, gunakan Manual Logout

### Problem 3: User komplain harus scan QR terus
**Solusi**: Ubah ke Manual Logout atau Hybrid

### Problem 4: Session menumpuk di database
**Solusi**: Gunakan Auto-logout atau tambahkan cleanup cron job

---

## 📝 Checklist Implementasi

### Auto-Logout (Default)
- [x] Sudah diimplementasi di `ESP32_UPDATED_CODE.ino`
- [ ] Test: Transaksi → Auto-logout
- [ ] Test: Cek database → Session dihapus

### Manual Logout
- [ ] Edit kode: Hapus `deleteSession()` setelah transaksi
- [ ] Tambahkan logout command atau button
- [ ] Test: Transaksi → Tetap login
- [ ] Test: Logout manual → Kembali ke login screen

### Hybrid
- [ ] Edit kode: Hapus auto-logout
- [ ] Tambahkan inactivity timeout
- [ ] Tambahkan logout button
- [ ] Test: Multiple transaksi tanpa logout
- [ ] Test: Auto-logout setelah 5 menit
- [ ] Test: Manual logout via button

---

## 🎉 Summary

**Saat Ini (Default)**: **AUTO-LOGOUT** ✅
- User logout otomatis setelah setiap transaksi
- User TIDAK perlu logout manual
- Cocok untuk tempat umum

**Jika Ingin Manual Logout**:
- Lihat file: `ESP32_MANUAL_LOGOUT_VERSION.ino`
- Ikuti instruksi di atas
- Cocok untuk pribadi/kantor kecil

**Rekomendasi**: Tetap pakai **AUTO-LOGOUT** untuk production! 🚀
