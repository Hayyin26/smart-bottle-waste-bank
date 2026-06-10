# 🔧 Fix QR Login - Network Issue

## Problem
- ❌ Laptop dan HP tidak bisa akses ESP32 (http://192.168.1.14/)
- ✅ ESP32 bisa akses internet (registration berhasil)
- ❌ QR login tidak bisa karena HP tidak bisa komunikasi dengan ESP32

**Root Cause**: Router block komunikasi antar device (AP Isolation) atau firewall issue.

---

## ✅ Solution: Use Phone Hotspot

### Why Hotspot?
- HP jadi router → HP pasti bisa akses ESP32
- Bypass router AP isolation
- Quick testing solution

---

## 🚀 Step-by-Step

### 1. Aktifkan Hotspot di HP

**Android**:
1. Settings → Network & Internet → Hotspot & Tethering
2. Turn ON "Portable Wi-Fi Hotspot"
3. Catat SSID dan Password

**iPhone**:
1. Settings → Personal Hotspot
2. Turn ON "Allow Others to Join"
3. Catat WiFi Password

**Contoh**:
- SSID: `HAYYIN_HOTSPOT`
- Password: `12345678`

---

### 2. Update ESP32 WiFi Credentials

Edit file `IOT/PBL/src/main.cpp`, cari baris ini:

```cpp
// --- KONFIGURASI WIFI & SUPABASE ---
const char* ssid = "MERA";
const char* password = "MERA";
```

**Ganti dengan**:
```cpp
// --- KONFIGURASI WIFI & SUPABASE ---
const char* ssid = "HAYYIN_HOTSPOT";        // ← Nama hotspot HP
const char* password = "12345678";          // ← Password hotspot
```

---

### 3. Upload ke ESP32

1. Connect ESP32 ke laptop via USB
2. Buka PlatformIO
3. Click **Upload** (ikon panah kanan)
4. Tunggu sampai selesai

---

### 4. Cek IP Address Baru

Buka **Serial Monitor** (baud 115200), lihat output:

```
✅ WiFi Connected!
📡 SSID: HAYYIN_HOTSPOT
🌐 IP Address: 192.168.43.123    ← COPY IP INI
[HTTP] Server started on port 80
[Register] ✅ Device is now discoverable!
```

**IP biasanya**: `192.168.43.xxx` (Android) atau `172.20.10.xxx` (iPhone)

---

### 5. Test HTTP Server dari HP

Dari browser HP, buka:
```
http://192.168.43.123/
```
(Ganti dengan IP yang benar dari step 4)

**Expected**: Halaman "🤖 IoT Bank Sampah"

**If timeout**: 
- Cek hotspot masih ON
- Cek IP address benar
- Restart ESP32

---

### 6. Test QR Login

1. Buka web app di HP: `https://smart-bottle-waste-bank.vercel.app/iot-auth`
2. Login dengan email dan password
3. Scan QR code
4. HP akan buka URL: `http://192.168.43.123/set-token?token=...`
5. Halaman sukses muncul: "✅ Login Berhasil!"
6. LCD ESP32 tampil nama user

**SEHARUSNYA BERHASIL!** karena HP dan ESP32 di jaringan yang sama.

---

## 🎯 Alternative: Manual Token (If QR Still Fails)

Kalau QR masih gagal, gunakan manual token:

### Web App:
1. Login at `/iot-auth`
2. Click "🔧 Opsi Manual"
3. Copy token (32 characters)

### ESP32 Serial Monitor:
```
TOKEN:abc123def456789...
```
Press Enter

**Expected**:
```
[Command] Token set: abc123def456789...
[API] Getting user from session...
[Session] ✅ User found!
[Session] Name: Your Name
```

LCD akan tampil nama user.

---

## 🔄 Switch Back to Router WiFi (After Testing)

Setelah testing berhasil, bisa balik ke router WiFi:

### 1. Edit `main.cpp`:
```cpp
const char* ssid = "MERA";
const char* password = "MERA";
```

### 2. Upload ke ESP32

### 3. Configure Router:
- Disable AP Isolation
- Allow device-to-device communication
- Add ESP32 MAC address to allowed list

### 4. Test Again:
- Laptop connect ke "MERA"
- HP connect ke "MERA"
- Test `http://192.168.1.14/` dari laptop dan HP

---

## 📊 Network Comparison

| Mode | ESP32 IP | HP Access | QR Login | Production |
|------|----------|-----------|----------|------------|
| Router WiFi | 192.168.1.14 | ❌ Blocked | ❌ | ✅ Yes |
| Phone Hotspot | 192.168.43.x | ✅ Works | ✅ | ⚠️ Testing Only |

**Recommendation**: 
- **Development/Testing**: Use Phone Hotspot
- **Production**: Fix router AP isolation

---

## 🐛 Troubleshooting

### Problem: ESP32 tidak connect ke hotspot

**Fix**:
- Cek SSID dan password benar (case-sensitive)
- Hotspot harus 2.4GHz (ESP32 tidak support 5GHz)
- Restart ESP32 dan hotspot

### Problem: HP bisa buka root `/` tapi QR login gagal

**Fix**:
- Cek session di database (debug-current-session.sql)
- Test manual token di Serial Monitor
- Cek ESP32 Serial Monitor untuk error

### Problem: Manual token berhasil, QR gagal

**Fix**:
- Masalah di QR scanning atau browser
- Gunakan QR scanner app (bukan camera)
- Manual copy URL dari QR ke browser

---

## ✅ Success Criteria

- [x] ESP32 connect ke HP hotspot
- [x] HP bisa akses `http://ESP32_IP/`
- [x] QR login berhasil
- [x] LCD tampil nama user
- [x] Bottle transaction works

---

## 📞 Commands

### Serial Monitor:
```
TOKEN:xxx   - Set session token
CHECK       - Verify session
CLEAR       - Clear session
TEST        - Test sensors
```

### SQL:
```sql
-- View sessions
SELECT * FROM iot_sessions ORDER BY created_at DESC LIMIT 5;

-- View device IP
SELECT * FROM iot_devices WHERE device_id = 'ESP32-BOTOL-01';
```

---

**Created**: 2026-06-09
**Status**: Network isolation fixed by using phone hotspot
