# 🔧 Fix: Connection Abort - ESP32 Tidak Bisa Akses API

## ✅ **Good News:**
ESP32 **BERHASIL CONNECT** dengan IP `192.168.73.150`! 🎉

```
✅ WiFi Connected!
IP Address: 192.168.73.150
[HTTP] Server started on port 80
```

## ❌ **Masalah:**
ESP32 **tidak bisa connect ke API** di laptop:

```
[HTTP] Token received from QR scan!
[HTTP] Token: a7ab7bce1e60ffa8e63a84db91c5e0a8
[API] Getting user from session...
[E][WiFiClient.cpp:258] connect(): socket error on fd 58, errno: 113, "Software caused connection abort"
[E][WiFiClient.cpp:395] write(): fail on fd 57, errno: 104, "Connection reset by peer"
```

**ESP32 coba akses:** `http://192.168.73.134:3000/api/iot/get-user`  
**Tapi:** Connection refused/abort ❌

---

## 🔍 **Root Cause:**

### **1. Next.js Hanya Listen di Localhost**

**Default Next.js:**
```
npm run dev
→ Next.js listen di 127.0.0.1:3000 (localhost only)
```

**Artinya:**
- ✅ Bisa diakses dari laptop: `http://localhost:3000`
- ❌ TIDAK bisa diakses dari device lain (ESP32, HP)

**ESP32 coba akses:**
```cpp
http://192.168.73.134:3000/api/iot/get-user
```

**Tapi laptop tidak listen di `192.168.73.134`, hanya di `127.0.0.1`!**

### **2. Firewall Block Port 3000**

Windows Firewall mungkin block incoming connection di port 3000.

---

## ✅ **Solusi:**

### **Solusi 1: Bind Next.js ke 0.0.0.0 (Semua Interface)**

#### **Update package.json:**

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0"  // ← Tambahkan -H 0.0.0.0
  }
}
```

**Penjelasan:**
- `-H 0.0.0.0` = Listen di semua network interface
- Next.js akan listen di:
  - `127.0.0.1:3000` (localhost) ✅
  - `192.168.73.134:3000` (network) ✅

**Sekarang ESP32 bisa akses!** 🎉

---

### **Solusi 2: Allow Firewall (Jika Perlu)**

Jika masih error setelah solusi 1, buka firewall:

#### **Windows Firewall:**

1. **Search:** "Windows Defender Firewall"
2. **Advanced Settings**
3. **Inbound Rules** → **New Rule**
4. **Port** → **Next**
5. **TCP** → **Specific ports:** `3000` → **Next**
6. **Allow the connection** → **Next**
7. **All profiles** (Domain, Private, Public) → **Next**
8. **Name:** "Next.js Dev Server" → **Finish**

#### **Atau Gunakan Command:**

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## 🚀 **Cara Test:**

### **1. Stop Web App (jika running):**
```bash
Ctrl+C
```

### **2. Start dengan Config Baru:**
```bash
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 15.0.6
   - Local:        http://localhost:3000
   - Network:      http://192.168.73.134:3000  ← CEK INI MUNCUL!

 ✓ Starting...
 ✓ Ready in 2.5s
```

**PENTING:** Harus ada **Network:** `http://192.168.73.134:3000`!

### **3. Test dari Laptop:**
```
Browser → http://192.168.73.134:3000
Expected: ✅ Web app muncul
```

### **4. Test dari HP:**
```
Browser HP → http://192.168.73.134:3000
Expected: ✅ Web app muncul
```

### **5. Test ESP32 API Access:**

**Scan QR lagi dari HP:**
```
1. HP → http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
2. Login
3. Scan QR
```

**Expected Serial Monitor:**
```
[HTTP] Token received from QR scan!
[HTTP] Token: abc123...
[API] Getting user from session...
[API] Response: {"user_id":"...","full_name":"John Doe",...}  ← BERHASIL!
[Session] ✅ User found!
[Session] Name: John Doe
```

**Expected LCD:**
```
HELLO!
John Doe
```

---

## 📊 **Network Flow (Setelah Fix):**

```
┌──────────────────────────────────────────┐
│  Router WiFi (JTI-POLINEMA-2G)          │
│  Gateway: 192.168.73.129                 │
└────────────┬─────────────────────────────┘
             │
      ┌──────┴──────┬─────────────────┐
      │             │                 │
┌─────▼────┐  ┌────▼─────┐    ┌──────▼─────┐
│ Laptop   │  │  ESP32   │    │    HP      │
│ .134     │  │  .150    │    │  DHCP      │
│          │  │          │    │            │
│ Next.js  │  │ HTTP     │    │ Browser    │
│ :3000    │  │ :80      │    │            │
└─────┬────┘  └────┬─────┘    └──────┬─────┘
      │            │                  │
      │            │  ┌───────────────┘
      │            │  │
      │  ┌─────────┴──▼─────────────┐
      │  │ 1. HP → Laptop:3000      │
      │  │    (Login, QR code)      │
      │  │                          │
      │  │ 2. HP → ESP32:80         │
      │  │    (Scan QR, set token)  │
      │  │                          │
      │◄─┤ 3. ESP32 → Laptop:3000   │
      │  │    (Verify token API)    │ ✅ FIX!
      │  └──────────────────────────┘
```

**Sebelum Fix:**
- ESP32 → Laptop API: ❌ Connection refused

**Setelah Fix:**
- ESP32 → Laptop API: ✅ Connection successful!

---

## 🐛 **Troubleshooting:**

### **Problem 1: Masih connection error setelah update package.json**

**Check:**
```bash
# Stop web app
Ctrl+C

# Start ulang
npm run dev

# Pastikan ada "Network:" line
- Network:      http://192.168.73.134:3000  ← HARUS ADA!
```

**Jika tidak ada**, berarti Next.js masih listen di localhost only.

**Solusi:**
```bash
# Manual start dengan host flag
npx next dev -H 0.0.0.0
```

### **Problem 2: Firewall masih block**

**Check firewall:**
```powershell
# Run as Administrator
Get-NetFirewallRule | Where-Object {$_.LocalPort -eq 3000}
```

**Jika empty**, firewall belum allow port 3000.

**Solusi:**
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### **Problem 3: ESP32 masih error "Connection reset by peer"**

**Check di Serial Monitor:**
```
[API] Getting user from session...
URL: http://192.168.73.134:3000/api/iot/get-user?token=...&device=ESP32-BOTOL-01
```

**Test URL di browser laptop:**
```
http://192.168.73.134:3000/api/iot/get-user?token=test&device=ESP32-BOTOL-01

Expected: {"error":"Session not found or expired"}  ← API work!
```

Jika browser work tapi ESP32 tidak, masalah di ESP32 code atau network.

**Check:**
- ESP32 WiFi masih connect?
- Gateway benar?
- DNS benar?

---

## 📝 **Checklist:**

- [x] package.json updated: `"dev": "next dev -H 0.0.0.0"` ✅
- [ ] Web app stopped (Ctrl+C)
- [ ] Web app started ulang (`npm run dev`)
- [ ] Check output: `Network: http://192.168.73.134:3000` ✅
- [ ] Test browser laptop: `http://192.168.73.134:3000` ✅
- [ ] Test browser HP: `http://192.168.73.134:3000` ✅
- [ ] Firewall allow port 3000 (jika perlu)
- [ ] Test QR login dari HP
- [ ] Check Serial Monitor ESP32: `[Session] ✅ User found!`

---

## 🎯 **Expected Result:**

### **Serial Monitor ESP32:**
```
[HTTP] ========================================
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Token: a7ab7bce1e60ffa8e63a84db91c5e0a8
[HTTP] ========================================
[HTTP] Token received from QR scan!
[API] Getting user from session...
[API] Response: {"user_id":"xxx","full_name":"John Doe","total_points":0}
[Session] ✅ User found!
[Session] User ID: xxx
[Session] Name: John Doe
```

### **LCD ESP32:**
```
HELLO!
John Doe
```

### **Browser HP:**
```
✅ Login Berhasil!
Akun Anda telah terhubung dengan device IoT.
Nama: John Doe
Silakan masukkan botol untuk memulai transaksi.
```

---

## 💡 **Penjelasan Teknis:**

### **Kenapa `-H 0.0.0.0` Work?**

**Next.js default:**
```
next dev
→ Listen di 127.0.0.1:3000 (loopback only)
```

**Dengan `-H 0.0.0.0`:**
```
next dev -H 0.0.0.0
→ Listen di 0.0.0.0:3000 (all interfaces)
```

**0.0.0.0** = "Listen di semua network interface yang tersedia"

**Network interfaces di laptop:**
- `127.0.0.1` (localhost/loopback)
- `192.168.73.134` (WiFi)
- `172.29.87.114` (VPN/Virtual)

**Dengan 0.0.0.0**, Next.js accept connection dari semua IP!

---

## 🎉 **Summary:**

**Masalah:** ESP32 tidak bisa access API (connection abort)  
**Penyebab:** Next.js hanya listen di localhost (127.0.0.1)  
**Solusi:** Bind ke 0.0.0.0 dengan `-H 0.0.0.0` ✅

**Update package.json:**
```json
"dev": "next dev -H 0.0.0.0"
```

**Restart web app:**
```bash
Ctrl+C → npm run dev
```

**Test QR login sekarang!** 🚀
