# 🌐 Network Setup Guide - IP Address Explained

## 📊 **Network Diagram:**

```
┌─────────────────────────────────────┐
│    Router WiFi "Kost Premium"       │
│    Gateway: 192.168.100.1           │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  Komputer   │  │   ESP32     │
│  (Web App)  │  │  (IoT)      │
│             │  │             │
│ IP: 192.168 │  │ IP: 192.168 │
│    .100.53  │  │    .100.87  │
│             │  │             │
│ Port: 3000  │  │ Port: 80    │
└─────────────┘  └─────────────┘
```

---

## 🎯 **IP Address Anda:**

| Device | IP Address | Port | URL |
|--------|------------|------|-----|
| **Komputer** | `192.168.100.53` | 3000 | `http://192.168.100.53:3000` |
| **ESP32** | `192.168.100.87` | 80 | `http://192.168.100.87` |

---

## 📱 **URL yang Benar:**

### **1. Akses Web App dari Komputer:**
```
✅ http://localhost:3000/iot-auth?device=ESP32-BOTOL-01
✅ http://127.0.0.1:3000/iot-auth?device=ESP32-BOTOL-01
✅ http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
```

### **2. Akses Web App dari HP:**
```
✅ http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
   ^^^^^^^^^^^^^^
   IP KOMPUTER!

❌ http://192.168.100.87:3000/iot-auth?device=ESP32-BOTOL-01
   ^^^^^^^^^^^^^^
   INI IP ESP32, BUKAN KOMPUTER!
```

### **3. Akses ESP32 HTTP Server:**
```
✅ http://192.168.100.87/
   ^^^^^^^^^^^^^^
   IP ESP32

❌ http://192.168.100.53/
   ^^^^^^^^^^^^^^
   INI IP KOMPUTER, BUKAN ESP32!
```

---

## 🔄 **Flow QR Login:**

```
1. User buka HP
   ↓
2. Akses: http://192.168.100.53:3000/iot-auth
   (IP KOMPUTER, port 3000)
   ↓
3. Login/Register
   ↓
4. Web app generate QR code dengan URL:
   http://192.168.100.87/set-token?token=xxx
   (IP ESP32, port 80)
   ↓
5. User scan QR dengan HP
   ↓
6. HP buka URL → Kirim request ke ESP32
   ↓
7. ESP32 terima token → Auto-login ✅
```

---

## 🎯 **Testing Guide:**

### **Test 1: Web App (Komputer)**
```
Browser di Komputer:
http://localhost:3000/iot-auth?device=ESP32-BOTOL-01

Expected: ✅ Tampil form login
```

### **Test 2: Web App (HP)**
```
Browser di HP:
http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01

Expected: ✅ Tampil form login
```

### **Test 3: ESP32 HTTP Server (Komputer)**
```
Browser di Komputer:
http://192.168.100.87/

Expected: ✅ Tampil "🤖 IoT Bank Sampah"
```

### **Test 4: ESP32 HTTP Server (HP)**
```
Browser di HP:
http://192.168.100.87/

Expected: ✅ Tampil "🤖 IoT Bank Sampah"
```

### **Test 5: QR Login (HP)**
```
1. HP → http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
2. Login
3. QR code muncul
4. Scan QR
5. HP buka: http://192.168.100.87/set-token?token=...
6. Expected: ✅ "Login Berhasil!"
7. ESP32 LCD: ✅ "HELLO! [Name]"
```

---

## 🐛 **Common Mistakes:**

### **❌ Mistake 1: Pakai IP ESP32 untuk Web App**
```
❌ http://192.168.100.87:3000/iot-auth
   ^^^^^^^^^^^^^^
   Salah! Ini IP ESP32, bukan komputer!

✅ http://192.168.100.53:3000/iot-auth
   ^^^^^^^^^^^^^^
   Benar! Ini IP komputer
```

### **❌ Mistake 2: Pakai IP Komputer untuk ESP32**
```
❌ http://192.168.100.53/
   ^^^^^^^^^^^^^^
   Salah! Ini IP komputer, bukan ESP32!

✅ http://192.168.100.87/
   ^^^^^^^^^^^^^^
   Benar! Ini IP ESP32
```

### **❌ Mistake 3: Lupa Port**
```
❌ http://192.168.100.53/iot-auth
   Salah! Lupa port 3000

✅ http://192.168.100.53:3000/iot-auth
   Benar! Ada port 3000
```

---

## 💡 **Tips:**

### **1. Bookmark URL:**
```
Komputer:
- http://localhost:3000/iot-auth?device=ESP32-BOTOL-01

HP:
- http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
- http://192.168.100.87/ (untuk test ESP32)
```

### **2. Cek IP Komputer:**
```cmd
ipconfig | findstr "192.168"
```

### **3. Cek IP ESP32:**
```
Serial Monitor → Lihat saat boot:
IP Address: 192.168.100.87
```

### **4. Test Koneksi:**
```
Ping dari komputer ke ESP32:
ping 192.168.100.87

Ping dari komputer ke komputer:
ping 192.168.100.53
```

---

## 📝 **Checklist:**

- [ ] Cek IP komputer: `192.168.100.53` ✅
- [ ] Cek IP ESP32: `192.168.100.87` ✅
- [ ] Test web app di komputer: `http://localhost:3000/iot-auth`
- [ ] Test web app di HP: `http://192.168.100.53:3000/iot-auth`
- [ ] Test ESP32 di komputer: `http://192.168.100.87/`
- [ ] Test ESP32 di HP: `http://192.168.100.87/`
- [ ] Test QR login dari HP
- [ ] Verify auto-login work

---

## 🎉 **Summary:**

**IP Komputer:** `192.168.100.53` (Web App, port 3000)  
**IP ESP32:** `192.168.100.87` (HTTP Server, port 80)

**URL untuk HP:**
```
Web App:  http://192.168.100.53:3000/iot-auth?device=ESP32-BOTOL-01
ESP32:    http://192.168.100.87/
```

**Sekarang test dari HP!** 🚀
