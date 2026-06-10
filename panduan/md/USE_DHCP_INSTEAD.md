# ✅ Solusi: Pakai DHCP (Dynamic IP)

## 🔴 Problem

IP Static **192.168.1.200** tidak bisa dipakai karena:
- Sudah dipakai device lain
- Router tidak allow static IP di range tersebut
- IP conflict

---

## ✅ Solution: DHCP (Lebih Mudah!)

### Keuntungan DHCP:
- ✅ **Otomatis** - Router assign IP sendiri
- ✅ **No conflict** - Router pilih IP yang available
- ✅ **Mudah setup** - Tidak perlu konfigurasi manual
- ✅ **Flexible** - Bisa ganti network tanpa edit code

---

## 🔧 Yang Sudah Diupdate

### File: `IOT/PBL/src/main.cpp`

**BEFORE (Static IP):**
```cpp
IPAddress local_IP(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
WiFi.begin(ssid, password);
```

**AFTER (DHCP):**
```cpp
// Langsung connect, router akan kasih IP otomatis
WiFi.begin(ssid, password);
```

---

## 🎯 Cara Pakai (3 Langkah)

### 1️⃣ Upload Code ke ESP32

```bash
cd IOT\PBL
pio run -t upload
```

### 2️⃣ Check Serial Monitor

```bash
pio device monitor
```

**Expected output:**
```
🔧 Setting up WiFi with DHCP...
   (IP akan otomatis dari router)

🔄 Connecting to WiFi...
   SSID: [Your WiFi]
   Progress: .....

✅ WiFi Connected!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 SSID:           [Your WiFi]
🌐 IP Address:     192.168.1.XXX  ← COPY INI!
🚪 Gateway:        192.168.1.1
🔢 Subnet:         255.255.255.0
📶 Signal:         -45 dBm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  PENTING: Copy IP di atas dan update di web app!
   File: src/app/(user)/iot-auth/page.tsx
   Ganti esp32Ip = "192.168.1.XXX"
```

**COPY IP Address yang muncul!** (Contoh: 192.168.1.150)

---

### 3️⃣ Update Web App

Buka: `src/app/(user)/iot-auth/page.tsx`

**BEFORE:**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.1.200");
```

**AFTER (ganti dengan IP dari Serial Monitor):**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.1.150"); // ← GANTI INI!
```

**Save file** dan restart Next.js:
```bash
npm run dev
```

---

## ✅ Verification

### Test ESP32 HTTP Server

Buka browser (ganti XXX dengan IP ESP32):
```
http://192.168.1.XXX/
```

Expected response:
```
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 192.168.1.XXX
```

### Test QR Login

1. Buka: `http://192.168.1.7:3000/iot-auth`
2. Login/Register
3. QR code muncul
4. Scan dengan HP
5. ESP32 terima token! ✅

---

## 📋 IP Allocation

### Typical Router DHCP Range:
```
192.168.1.1      → Router
192.168.1.2-100  → DHCP Pool (ESP32 akan dapat dari sini)
192.168.1.101+   → Static devices
```

### Your Network:
```
192.168.1.1      → Router (Gateway)
192.168.1.7      → Laptop
192.168.1.XXX    → ESP32 (DHCP otomatis)
```

---

## 🔄 Kalau IP ESP32 Berubah?

**Scenario:** ESP32 restart, dapat IP baru

### Quick Fix:

1. **Check Serial Monitor** untuk IP baru
2. **Update web app:**
   ```typescript
   // src/app/(user)/iot-auth/page.tsx
   const [esp32Ip, setEsp32Ip] = useState("192.168.1.NEW_IP");
   ```
3. **Restart Next.js**

---

## 💡 Tips: Reserve IP di Router

Kalau tidak mau IP berubah-ubah, reserve IP di router:

### Steps (Generic):
1. Login ke router admin (biasanya: http://192.168.1.1)
2. Cari menu: **DHCP Reservation** atau **Static DHCP**
3. Tambah entry:
   - MAC Address: (lihat Serial Monitor ESP32)
   - IP Address: 192.168.1.150 (pilih yang available)
4. Save & Reboot router

**Benefit:**
- ESP32 selalu dapat IP yang sama
- Tidak perlu edit web app lagi
- Best of both worlds!

---

## 🐛 Troubleshooting

### ❌ ESP32 tidak dapat IP (terus retry)

**Solutions:**

1. **Check SSID & Password**
   ```cpp
   const char* ssid = "YOUR_WIFI_NAME";      // ← Benar?
   const char* password = "YOUR_PASSWORD";    // ← Benar?
   ```

2. **Pastikan WiFi 2.4GHz** (bukan 5GHz)
   - ESP32 hanya support 2.4GHz
   - Check router settings

3. **Router DHCP enabled**
   - Login ke router
   - Check DHCP server enabled

4. **Restart ESP32**
   - Press reset button
   - Re-upload code

---

### ❌ IP selalu berubah setiap restart

**Solutions:**

**Option 1: Manual update setiap kali** (quick)
- Check Serial Monitor
- Update web app
- Restart Next.js

**Option 2: Reserve IP di router** (permanent)
- See "Tips: Reserve IP di Router" di atas

**Option 3: Make web app dynamic** (advanced)
- Add input field untuk user input ESP32 IP
- Save to localStorage

---

### ❌ Cannot access ESP32 HTTP server

**Checklist:**
- [ ] ESP32 connected? (check Serial Monitor)
- [ ] Using correct IP? (check Serial Monitor output)
- [ ] Ping ESP32: `ping 192.168.1.XXX`
- [ ] Laptop & ESP32 di WiFi yang sama?
- [ ] Firewall blocking? (try disable temporarily)

---

## 📊 Comparison: Static vs DHCP

| Aspect | Static IP | DHCP |
|--------|-----------|------|
| **Setup** | Complex | Easy ✅ |
| **Conflict** | Possible | No ✅ |
| **IP Change** | Never | Sometimes |
| **Maintenance** | Manual | Auto ✅ |
| **Best for** | Production | Development ✅ |

**Recommendation:** Use DHCP untuk development, reserve IP di router untuk stability.

---

## ✅ Checklist

- [ ] Upload code dengan DHCP ke ESP32
- [ ] Check Serial Monitor untuk IP
- [ ] Copy IP Address
- [ ] Update `src/app/(user)/iot-auth/page.tsx`
- [ ] Save file
- [ ] Restart Next.js
- [ ] Test ESP32 HTTP: `http://192.168.1.XXX/`
- [ ] Test QR login works
- [ ] (Optional) Reserve IP di router

---

## 🎉 Summary

**Before:**
- ❌ Static IP 192.168.1.200 conflict
- ❌ Complex configuration
- ❌ Error prone

**After:**
- ✅ DHCP automatic
- ✅ Easy setup
- ✅ No conflicts
- ✅ Just copy IP from Serial Monitor!

---

**Status:** ✅ DHCP Enabled - Upload & Check Serial Monitor! 📡

**Next:** Upload code → Get IP → Update web app → Test! 🚀
