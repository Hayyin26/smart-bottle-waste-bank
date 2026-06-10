# 🔄 Sync IoT dengan Web App - Complete Guide

## ✅ Yang Sudah Dilakukan

### 1. **ESP32 menggunakan DHCP** ✅
- IP otomatis dari router
- No IP conflict
- Flexible dan mudah

### 2. **Web App dengan Dynamic IP Input** ✅
- Input field untuk ESP32 IP
- Save ke localStorage (persistent)
- Easy to update

---

## 🎯 Cara Sync (4 Langkah)

### 1️⃣ Upload ESP32 Code

```bash
cd IOT\PBL
pio run -t upload
```

### 2️⃣ Check ESP32 IP

Buka Serial Monitor:
```bash
pio device monitor
```

Expected output:
```
✅ WiFi Connected!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 SSID:           [Your WiFi]
🌐 IP Address:     192.168.1.150  ← COPY INI!
🚪 Gateway:        192.168.1.1
🔢 Subnet:         255.255.255.0
📶 Signal:         -45 dBm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  PENTING: Copy IP di atas dan update di web app!
   File: src/app/(user)/iot-auth/page.tsx
   Ganti esp32Ip = "192.168.1.150"
```

**COPY IP Address!** (Contoh: 192.168.1.150)

---

### 3️⃣ Update Web App

Ada 2 cara:

#### Cara A: Via UI (MUDAH!) ⭐ RECOMMENDED

1. Start Next.js:
   ```bash
   npm run dev
   ```

2. Buka: `http://localhost:3000/iot-auth`

3. Login/Register

4. Setelah login, lihat bagian **ESP32 IP Address**

5. Klik **✏️ Edit**

6. Masukkan IP dari Serial Monitor (misal: `192.168.1.150`)

7. Klik **✓ Save**

**Done!** IP tersimpan di localStorage dan akan dipakai untuk QR code.

---

#### Cara B: Edit Code Manual

Buka: `src/app/(user)/iot-auth/page.tsx`

Cari baris ini (sekitar line 16-20):
```typescript
const [esp32Ip, setEsp32Ip] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('esp32Ip') || "192.168.1.100"; // ← GANTI DEFAULT INI
  }
  return "192.168.1.100"; // ← DAN INI
});
```

Ganti `192.168.1.100` dengan IP dari Serial Monitor.

Save file dan restart Next.js.

---

### 4️⃣ Test QR Login

1. **Start Next.js** (jika belum):
   ```bash
   npm run dev
   ```

2. **Buka di HP**:
   ```
   http://192.168.1.7:3000/iot-auth?device=ESP32-BOTOL-01
   ```
   (Ganti 192.168.1.7 dengan IP laptop Anda)

3. **Login/Register**

4. **QR Code muncul** dengan URL:
   ```
   http://192.168.1.150/set-token?token=xxx...
   ```

5. **Scan QR dengan HP**

6. **ESP32 Serial Monitor** akan menampilkan:
   ```
   [HTTP] Token received from QR scan!
   [HTTP] Token: xxx...
   [API] Getting user from session...
   [API] Response Code: 200
   [Session] ✅ User found!
   [Session] Name: John Doe
   ```

7. **LCD ESP32** menampilkan nama user

**SUCCESS!** ✅

---

## 🎨 UI Features

### ESP32 IP Configuration Card

```
┌─────────────────────────────────────┐
│  Device: ESP32-BOTOL-01             │
│                                     │
│  ESP32 IP Address:                  │
│  ┌───────────────────────────────┐ │
│  │ 192.168.1.150        ✏️ Edit │ │
│  └───────────────────────────────┘ │
│  💡 Get IP from ESP32 Serial Monitor│
└─────────────────────────────────────┘
```

**Edit Mode:**
```
┌─────────────────────────────────────┐
│  ESP32 IP Address:                  │
│  ┌───────────────────────────────┐ │
│  │ [192.168.1.150____________]  │ │
│  └───────────────────────────────┘ │
│  ┌──────────┐  ┌──────────┐       │
│  │ ✓ Save   │  │ ✗ Cancel │       │
│  └──────────┘  └──────────┘       │
└─────────────────────────────────────┘
```

---

## 📊 Data Flow

```
1. ESP32 Connect WiFi (DHCP)
   ↓
2. ESP32 dapat IP: 192.168.1.150
   ↓
3. User copy IP dari Serial Monitor
   ↓
4. User buka web app & edit IP via UI
   ↓
5. IP save ke localStorage
   ↓
6. QR code generated dengan IP tersebut
   ↓
7. User scan QR → ESP32 terima token
   ↓
8. ESP32 call API ke laptop
   ↓
9. LCD menampilkan nama user
```

---

## 💾 localStorage Persistence

**Key:** `esp32Ip`  
**Value:** `192.168.1.150` (IP ESP32)

### Check localStorage (Browser Console):

```javascript
// Get current IP
localStorage.getItem('esp32Ip')

// Set IP manually
localStorage.setItem('esp32Ip', '192.168.1.200')

// Clear
localStorage.removeItem('esp32Ip')
```

**Benefit:**
- IP tetap tersimpan meskipun refresh page
- Tidak perlu edit code setiap kali
- Easy to update via UI

---

## 🔄 Kalau IP ESP32 Berubah

### Scenario: ESP32 restart, dapat IP baru

**Langkah:**

1. **Check Serial Monitor** untuk IP baru
   ```
   🌐 IP Address: 192.168.1.175  ← IP BARU!
   ```

2. **Update via UI:**
   - Buka http://localhost:3000/iot-auth
   - Login
   - Klik ✏️ Edit di ESP32 IP
   - Masukkan IP baru: `192.168.1.175`
   - Klik ✓ Save

3. **Scan QR lagi**

**Done!** QR code otomatis update dengan IP baru.

---

## 🛠️ Configuration Files

### Files yang Sudah Sync:

| File | Purpose | IP Setting |
|------|---------|------------|
| `IOT/PBL/src/main.cpp` | ESP32 Code | DHCP (auto) |
| `src/app/(user)/iot-auth/page.tsx` | Web App | Dynamic (UI input) |
| `.env` | Next.js Config | Laptop IP: 192.168.1.7 |

---

## ✅ Verification Checklist

### ESP32 Side:
- [ ] Code uploaded
- [ ] WiFi connected
- [ ] IP obtained (check Serial Monitor)
- [ ] HTTP server running on port 80
- [ ] Accessible: `http://192.168.1.XXX/`

### Web App Side:
- [ ] Next.js running
- [ ] ESP32 IP configured (via UI or code)
- [ ] QR code generated correctly
- [ ] QR URL format: `http://192.168.1.XXX/set-token?token=...`

### Integration Test:
- [ ] Open http://localhost:3000/iot-auth on phone
- [ ] Login/Register
- [ ] QR code appears
- [ ] Scan QR with phone camera
- [ ] ESP32 receives token (check Serial Monitor)
- [ ] LCD shows user name
- [ ] Ready for bottle transaction!

---

## 🐛 Troubleshooting

### ❌ QR Scan → ESP32 tidak terima token

**Check:**

1. **ESP32 IP di QR code benar?**
   - Scan QR, lihat URL
   - Harus: `http://192.168.1.XXX/set-token?token=...`
   - IP harus sama dengan Serial Monitor

2. **ESP32 HTTP server running?**
   - Serial Monitor: `[HTTP] Server started on port 80`
   - Test di browser: `http://192.168.1.XXX/`

3. **Phone & ESP32 di WiFi yang sama?**
   - Check WiFi SSID

4. **ESP32 IP berubah?**
   - Check Serial Monitor
   - Update web app via UI

---

### ❌ "Connection refused" saat scan QR

**Solutions:**

1. **Ping ESP32 dari phone:**
   - Install network tool app
   - Ping `192.168.1.XXX`
   - Harus reply

2. **Check firewall:**
   - Router might block inter-device communication
   - Try disable AP isolation

3. **Restart ESP32:**
   - Press reset button
   - Check Serial Monitor for new IP
   - Update web app

---

### ❌ Web app tidak save IP

**Check localStorage:**

Browser Console (F12):
```javascript
localStorage.getItem('esp32Ip')
```

If null, manually set:
```javascript
localStorage.setItem('esp32Ip', '192.168.1.150')
```

Then refresh page.

---

## 💡 Pro Tips

### Tip 1: Reserve IP di Router

Agar IP ESP32 tidak berubah:

1. Login ke router (`http://192.168.1.1`)
2. Find **DHCP Reservation**
3. Add:
   - MAC: (dari Serial Monitor)
   - IP: 192.168.1.150
4. Save & reboot

**Benefit:** ESP32 selalu dapat IP yang sama!

---

### Tip 2: QR Code Bookmarklet

Save this as bookmark di phone:

```javascript
javascript:(function(){window.location='http://192.168.1.7:3000/iot-auth?device=ESP32-BOTOL-01';})()
```

Tap bookmark → Langsung ke IoT auth page!

---

### Tip 3: Make Default IP Smart

Edit default IP based on your network:

```typescript
// src/app/(user)/iot-auth/page.tsx
return localStorage.getItem('esp32Ip') || "192.168.1.150"; // ← Network-specific default
```

---

## 📱 Phone Testing Checklist

### Before Scan:
- [ ] Phone connect ke WiFi yang sama
- [ ] Open http://192.168.1.7:3000/iot-auth
- [ ] Login/Register successful
- [ ] QR code visible
- [ ] Check QR URL includes correct ESP32 IP

### During Scan:
- [ ] Use phone camera app (not dedicated QR app)
- [ ] Allow URL open in browser
- [ ] Watch Serial Monitor ESP32 for logs

### After Scan:
- [ ] Serial Monitor: `[HTTP] Token received!`
- [ ] Serial Monitor: `[Session] ✅ User found!`
- [ ] LCD ESP32: Shows user name
- [ ] Ready to detect bottle!

---

## 🎉 Summary

**Before:**
- ❌ Fixed IP 192.168.1.200 conflict
- ❌ Hard-coded IP in web app
- ❌ Manual code edit setiap kali IP berubah

**After:**
- ✅ DHCP automatic IP
- ✅ Dynamic IP input via UI
- ✅ localStorage persistence
- ✅ Easy sync process
- ✅ User-friendly!

---

## 🚀 Quick Start Summary

```bash
# 1. Upload ESP32
cd IOT\PBL && pio run -t upload

# 2. Check IP
pio device monitor
# Copy: 192.168.1.XXX

# 3. Update Web App
npm run dev
# Login → Edit IP → Save

# 4. Test QR
# Phone: http://192.168.1.7:3000/iot-auth
# Scan QR → Done!
```

---

**Status:** ✅ ESP32 & Web App SYNCED!

**Documentation Created:**
- ✅ UI untuk edit ESP32 IP
- ✅ localStorage persistence
- ✅ DHCP configuration
- ✅ Complete sync guide

**Ready to test!** 🎊
