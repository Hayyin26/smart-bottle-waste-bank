# 🚀 Setup Complete Guide - Final Steps

## ✅ **IP Address Anda:**

Anda punya 2 IP:
1. **`172.29.87.114`** - VPN/Virtual Network (WSL/Docker)
2. **`192.168.100.53`** - WiFi ✅ **GUNAKAN INI!**

---

## 📝 **Konfigurasi Saat Ini:**

### **WiFi ESP32:**
```cpp
SSID: "Kost Premium"
Password: "kostbusripit"
```

### **API Endpoint:**
```cpp
http://192.168.100.53:3000/api/iot/get-user
```

⚠️ **PENTING**: ESP32 harus connect ke WiFi **"Kost Premium"** yang sama dengan komputer Anda!

---

## 🚀 **Langkah Selanjutnya (5 Steps):**

### **Step 1: Upload Kode ke ESP32**

```
1. Buka Arduino IDE
2. File sudah diupdate dengan IP: 192.168.100.53
3. Klik "Upload" (atau Ctrl+U)
4. Tunggu sampai selesai
5. Buka Serial Monitor (115200 baud)
```

**Expected Output:**
```
Connecting WiFi.....
✅ WiFi Connected!
IP Address: 192.168.X.X
=================================
IoT Bank Sampah Digital
=================================
Mode: QR LOGIN
Commands:
  TOKEN:<token>  - Set session token
  CHECK          - Check current session
  CLEAR          - Clear session
  LOGOUT         - Logout and delete session
=================================
```

---

### **Step 2: Pastikan Web App Running**

```bash
# Terminal
npm run dev
```

**Expected Output:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
○ Network: http://192.168.100.53:3000  ← CEK INI!
```

---

### **Step 3: Test API di Browser**

Buka browser, akses:
```
http://192.168.100.53:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01
```

**Expected Response:**
```json
{"error":"Session not found or expired"}
```

✅ Ini normal! Artinya API berjalan dengan baik.

---

### **Step 4: Test Koneksi dari ESP32**

Serial Monitor → Ketik:
```
CHECK
```

**Expected Output:**
```
[Command] Checking session...
[API] Getting user from session...
[API] Response: {"error":"Session not found or expired"}
[Session] Session expired or not found
```

✅ Ini normal! Artinya ESP32 bisa connect ke API.

---

### **Step 5: Test dengan Token Real**

#### A. Register/Login di Web App:
```
http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
```

1. Klik "Daftar"
2. Isi form:
   - Nama: Test User
   - Email: test@example.com
   - Password: 123456
3. Klik "Daftar"
4. Setelah berhasil, akan muncul kotak kuning dengan token
5. Klik "📋 Copy Token"

#### B. Kirim Token ke ESP32:
```
Serial Monitor → Paste token
Format: TOKEN:abc123def456...
Enter
```

**Expected Output:**
```
[Command] Token set: abc123def456...
[API] Getting user from session...
[API] Response: {"user_id":"...","full_name":"Test User",...}
[Session] ✅ User found!
[Session] User ID: ...
[Session] Name: Test User
```

#### C. Cek LCD:
```
┌────────────────┐
│ HELLO!         │
│ Test User      │
└────────────────┘

Lalu:
┌────────────────┐
│ Test User      │
│ MASUKKAN BOTOL │
└────────────────┘
```

---

## 🎯 **Test Transaksi:**

### **1. Masukkan Botol Sedang (18cm x 7cm)**

**LCD:**
```
┌────────────────┐
│ BOTOL SEDANG   │
│ +10 POIN       │
└────────────────┘
```

### **2. Gate Terbuka**

**LCD:**
```
┌────────────────┐
│ BOTOL SEDANG   │
│ +10 POIN       │
└────────────────┘
```

### **3. Masukkan Botol**

**LCD:**
```
┌────────────────┐
│ +10 POIN       │
│ SENDING...     │
└────────────────┘
```

### **4. Success!**

**LCD:**
```
┌────────────────┐
│ SUCCESS!       │
│ SEDANG 10PT    │
└────────────────┘
```

### **5. Auto-Logout**

**LCD:**
```
┌────────────────┐
│ LOGGING OUT... │
│                │
└────────────────┘

┌────────────────┐
│ THANK YOU!     │
│ Test User      │
└────────────────┘

┌────────────────┐
│ SCAN QR CODE   │
│ TO LOGIN       │
└────────────────┘
```

---

## 🐛 Troubleshooting:

### Problem 1: ESP32 tidak connect WiFi
**Cek:**
- SSID benar: "Kost Premium"
- Password benar: "kostbusripit"
- WiFi 2.4GHz (bukan 5GHz)

### Problem 2: Masih "connection abort"
**Solusi:**
1. Cek ESP32 dan komputer di WiFi yang SAMA
2. Restart router
3. Restart ESP32
4. Cek IP komputer lagi (mungkin berubah)

### Problem 3: API tidak bisa diakses
**Solusi:**
1. Pastikan web app running (`npm run dev`)
2. Test API di browser dulu
3. Cek firewall Windows (allow port 3000)

### Problem 4: Token tidak diterima
**Solusi:**
1. Pastikan format: `TOKEN:abc123...` (tanpa spasi)
2. Cek Serial Monitor baud rate: 115200
3. Cek token tidak expired (< 5 menit)

---

## ✅ Complete Checklist:

### Database:
- [x] Run `FINAL_FIX_PROFILE.sql`
- [x] RLS policies fixed
- [x] Missing profiles created

### Web App:
- [x] Hydration error fixed
- [ ] Web app running (`npm run dev`)
- [ ] API accessible di browser

### ESP32:
- [x] IP updated: `192.168.100.53`
- [ ] Upload kode ke ESP32
- [ ] ESP32 connect ke WiFi
- [ ] Test command `CHECK`

### Integration:
- [ ] Register user di web app
- [ ] Copy token
- [ ] Kirim token ke ESP32
- [ ] LCD tampil "HELLO! [Name]"
- [ ] Test transaksi
- [ ] Data masuk database

---

## 📊 Network Diagram:

```
┌─────────────────────┐
│   Router WiFi       │
│   "Kost Premium"    │
│   192.168.100.1     │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
┌─────▼────┐ ┌─▼──────────────┐
│  ESP32   │ │  PC            │
│  WiFi    │ │  192.168.100.53│
└──────────┘ └────────┬───────┘
                      │
                ┌─────▼──────┐
                │ Web Server │
                │ Port 3000  │
                └────────────┘
```

---

## 🎉 Expected Final Result:

### Serial Monitor:
```
✅ WiFi Connected!
✅ System Ready
✅ Token received
✅ User found: Test User
✅ Transaction successful
✅ Data sent to Supabase
✅ Auto-logout
```

### LCD:
```
✅ "HELLO! Test User"
✅ "MASUKKAN BOTOL"
✅ "BOTOL SEDANG +10 POIN"
✅ "SUCCESS! SEDANG 10PT"
✅ "THANK YOU!"
✅ "SCAN QR CODE TO LOGIN"
```

### Database:
```sql
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 1;

-- Result:
-- user_id: ...
-- device_id: ESP32-BOTOL-01
-- points_earned: 10
-- bottle_size: SEDANG
-- created_at: 2026-05-07 ...
```

---

## 📞 Quick Commands:

### Cek IP:
```cmd
ipconfig | findstr "192.168"
```

### Test API:
```
http://192.168.100.53:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01
```

### ESP32 Commands:
```
TOKEN:<token>  - Set session token
CHECK          - Check current session
LOGOUT         - Logout
CLEAR          - Clear session
```

---

## 🚀 **NEXT: Upload Kode ke ESP32!**

Kode sudah diupdate dengan IP yang benar: **`192.168.100.53`**

**Langkah:**
1. Arduino IDE → Upload
2. Buka Serial Monitor
3. Cek WiFi connected
4. Test command `CHECK`
5. Register di web app
6. Copy token
7. Paste ke Serial Monitor
8. Test transaksi!

Good luck! 🎉
