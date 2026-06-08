# 🔧 Fix: Subnet Mask Issue - IP 200 Tidak Valid

## ❌ **Masalah:**

1. **IP 200 tidak bisa connect** ❌
2. **IP 134 (sama dengan laptop) connect tapi token expired** ❌

---

## 🔍 **Root Cause: Subnet Mask `/26`**

**Subnet Mask:** `255.255.255.192` = `/26`

### **Perhitungan Subnet:**

```
IP Address:    192.168.73.134
Subnet Mask:   255.255.255.192 (/26)

Binary Subnet: 11111111.11111111.11111111.11000000
                                           ^^
                                           6 bits untuk host
                                           
Host Bits: 6 → 2^6 = 64 addresses
Network Size: 64 IPs per subnet
```

### **Subnet Range:**

```
Network Address:    192.168.73.128  (128 = 134 & 192 dalam binary)
First Usable IP:    192.168.73.129  (Gateway)
Last Usable IP:     192.168.73.190
Broadcast Address:  192.168.73.191

Total Usable IPs: 129-190 = 62 IPs
```

### **Kenapa IP 200 Tidak Valid?**

```
IP yang dicoba: 192.168.73.200

Valid Range: 192.168.73.129 - 192.168.73.190
             ^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^
                 129                190

200 > 190 → ❌ DI LUAR RANGE!
```

**Akibat:**
- ESP32 tidak bisa join network
- Router reject karena IP tidak dalam subnet
- WiFi connect tapi tidak dapat IP yang benar

### **Kenapa IP 134 (Laptop) Token Expired?**

```
IP yang dicoba: 192.168.73.134 (SAMA dengan laptop!)

Laptop IP:  192.168.73.134
ESP32 IP:   192.168.73.134  ← ❌ IP CONFLICT!
```

**Akibat:**
- ESP32 dan laptop punya IP yang sama
- Network confusion - request bisa salah kirim
- QR code redirect ke laptop (bukan ESP32)
- Token tidak sampai ke ESP32 yang benar
- Token expired karena tidak pernah divalidasi oleh ESP32

---

## ✅ **Solusi: Gunakan IP Dalam Range & Berbeda**

### **IP Valid dalam Subnet `/26`:**

```
Gateway:        192.168.73.129  (Router)
Laptop:         192.168.73.134  (Anda)

Available IPs untuk ESP32:
192.168.73.130 ✅
192.168.73.131 ✅
192.168.73.132 ✅
192.168.73.133 ✅
192.168.73.135 ✅ (skip 134 karena laptop)
192.168.73.136 ✅
...
192.168.73.150 ✅ (PILIHAN TERBAIK - mudah diingat)
...
192.168.73.190 ✅
```

**Pilihan:** `192.168.73.150` ✅

**Alasan:**
- ✅ Dalam range subnet (129-190)
- ✅ Berbeda dari laptop (134)
- ✅ Berbeda dari gateway (129)
- ✅ Mudah diingat
- ✅ Jauh dari IP yang sering digunakan

---

## 🔧 **Konfigurasi Final:**

### **ESP32 (main.cpp):**
```cpp
IPAddress local_IP(192, 168, 73, 150);    // ✅ Dalam range 129-190
IPAddress gateway(192, 168, 73, 129);     // ✅ Gateway benar
IPAddress subnet(255, 255, 255, 192);     // ✅ Subnet benar
```

### **Web App (iot-auth/page.tsx):**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.73.150");  // ✅ IP ESP32 baru
```

---

## 📊 **Network Configuration:**

| Device | IP Address | In Range? | Unique? | Status |
|--------|------------|-----------|---------|--------|
| **Gateway** | `192.168.73.129` | ✅ | ✅ | Router |
| **Laptop** | `192.168.73.134` | ✅ | ✅ | OK |
| **ESP32** | `192.168.73.150` | ✅ | ✅ | **PERFECT!** ✅ |

```
Subnet Range: [129 ======================== 190]
                ↑               ↑         ↑
              Gateway       Laptop     ESP32
               (129)         (134)     (150)
```

---

## 🧪 **Testing:**

### **Test 1: Upload ESP32**
```
Arduino IDE → Upload

Expected Serial Monitor:
✅ WiFi Connected!
IP Address: 192.168.73.150  ← HARUS 150!
```

### **Test 2: Ping dari Laptop**
```cmd
ping 192.168.73.150

Expected:
Reply from 192.168.73.150: bytes=32 time<10ms TTL=64
```

### **Test 3: Access ESP32 HTTP Server**
```
Browser → http://192.168.73.150/

Expected:
🤖 IoT Bank Sampah
Device: ESP32-BOTOL-01
Status: Connected
IP: 192.168.73.150
```

### **Test 4: QR Login**
```
1. HP → http://192.168.73.134:3000/iot-auth?device=ESP32-BOTOL-01
2. Login
3. QR code URL: http://192.168.73.150/set-token?token=...
              ✅ IP 150 (ESP32) ✅
4. Scan QR
5. Expected: "Login Berhasil!"
6. ESP32 LCD: "HELLO! [Nama]"
```

---

## 🐛 **Troubleshooting:**

### **Problem: ESP32 masih tidak connect dengan IP 150**
**Check:**
1. Subnet mask benar: `255.255.255.192` ✅
2. Gateway benar: `192.168.73.129` ✅
3. IP dalam range: `129 ≤ 150 ≤ 190` ✅
4. IP tidak bentrok dengan device lain

**Serial Monitor:**
```
✅ WiFi Connected!
IP Address: 192.168.73.150
```

Jika dapat IP lain (misal DHCP), berarti static IP config gagal.

### **Problem: Token masih expired**
**Check:**
1. Expiration time: `60 * 60 * 1000` (60 menit) ✅
2. ESP32 IP di web app: `192.168.73.150` ✅
3. QR code URL benar: `http://192.168.73.150/set-token?...`
4. Restart web app setelah update

**Test:**
```
Serial Monitor → Send command:
TOKEN:abc123def456...

Expected:
[HTTP] Token received!
[Session] ✅ User found!
```

---

## 📊 **Subnet Calculator Reference:**

```
Subnet Mask: 255.255.255.192 = /26

Block Size: 256 - 192 = 64

Subnet 0:  192.168.73.0   - 192.168.73.63   (Range: .1-.62)
Subnet 1:  192.168.73.64  - 192.168.73.127  (Range: .65-.126)
Subnet 2:  192.168.73.128 - 192.168.73.191  (Range: .129-.190) ← KITA DI SINI!
Subnet 3:  192.168.73.192 - 192.168.73.255  (Range: .193-.254)

Kita di Subnet 2:
- Network:   192.168.73.128
- Gateway:   192.168.73.129
- Usable:    192.168.73.129 - 192.168.73.190
- Broadcast: 192.168.73.191
```

---

## 💡 **Alternatif IP (Jika 150 Tidak Work):**

Jika IP 150 masih bermasalah, coba IP lain dalam range:

```cpp
// Pilihan 1: Dekat dengan laptop (mudah diingat)
IPAddress local_IP(192, 168, 73, 135);  // 134 + 1

// Pilihan 2: Tengah range
IPAddress local_IP(192, 168, 73, 150);  // RECOMMENDED

// Pilihan 3: Akhir range
IPAddress local_IP(192, 168, 73, 180);

// ❌ JANGAN gunakan:
IPAddress local_IP(192, 168, 73, 129);  // Gateway!
IPAddress local_IP(192, 168, 73, 134);  // Laptop!
IPAddress local_IP(192, 168, 73, 200);  // Di luar range!
```

---

## 📝 **Checklist:**

- [x] Subnet mask: `255.255.255.192` (/26) ✅
- [x] Valid range: `129-190` ✅
- [x] Gateway: `192.168.73.129` ✅
- [x] Laptop IP: `192.168.73.134` ✅
- [x] ESP32 IP: `192.168.73.150` ✅ (dalam range, berbeda dari laptop!)
- [x] ESP32 IP di web app: `192.168.73.150` ✅
- [x] Token expiration: 60 menit ✅
- [x] TIDAK ADA IP CONFLICT ✅

---

## 🎯 **Summary:**

**Masalah 1:** IP 200 tidak bisa connect  
**Penyebab:** IP 200 di luar subnet range (129-190)  
**Solusi:** Gunakan IP 150 (dalam range) ✅

**Masalah 2:** IP 134 connect tapi token expired  
**Penyebab:** IP 134 sama dengan laptop (IP conflict)  
**Solusi:** Gunakan IP 150 (berbeda dari laptop) ✅

**IP Final:** `192.168.73.150` ✅✅✅

**Upload ESP32 sekarang!** 🚀
