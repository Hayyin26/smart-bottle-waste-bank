# 🔧 Fix IP Mismatch - ESP32 IP Berubah

## ❌ **Masalah:**

IP ESP32 **berubah** dari `192.168.100.53` menjadi `192.168.100.87`

**Penyebab:**
- Router memberikan IP dinamis (DHCP)
- ESP32 restart → dapat IP baru
- Komputer restart → dapat IP baru

**Dampak:**
- QR code generate URL dengan IP lama
- HP tidak bisa connect ke ESP32
- Auto-login gagal

---

## ✅ **Solusi: Static IP (RECOMMENDED)**

### **Sudah Diimplementasikan!**

ESP32 sekarang menggunakan **Static IP: `192.168.100.87`**

IP ini **tidak akan berubah** lagi! ✅

---

## 🔧 **Konfigurasi Static IP:**

### **Di ESP32 Code:**
```cpp
// Static IP Configuration
IPAddress local_IP(192, 168, 100, 87);      // IP ESP32
IPAddress gateway(192, 168, 100, 1);        // Gateway router
IPAddress subnet(255, 255, 255, 0);         // Subnet mask
IPAddress primaryDNS(8, 8, 8, 8);           // Google DNS
IPAddress secondaryDNS(8, 8, 4, 4);         // Google DNS

WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
WiFi.begin(ssid, password);
```

### **Di Web App:**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.100.87");
```

**Sekarang IP ESP32 dan Web App SAMA!** ✅

---

## 📊 **Perbandingan:**

| Aspek | Dynamic IP (Lama) | Static IP (Baru) |
|-------|-------------------|------------------|
| **IP ESP32** | Berubah-ubah | Tetap: 192.168.100.87 |
| **Setelah Restart** | IP baru | IP sama |
| **QR Code** | Bisa salah | Selalu benar ✅ |
| **Maintenance** | Ribet | Mudah ✅ |

---

## 🚀 **Cara Pakai:**

### **1. Upload ESP32**
```
Arduino IDE → Upload
```

### **2. Cek IP di Serial Monitor**
```
✅ WiFi Connected!
IP Address: 192.168.100.87
⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!
```

**IP harus: `192.168.100.87`** ✅

### **3. Test HTTP Server**
```
Browser → http://192.168.100.87/
Harus tampil: "🤖 IoT Bank Sampah"
```

### **4. Test QR Login**
```
HP → http://192.168.100.87:3000/iot-auth?device=ESP32-BOTOL-01
→ Login
→ QR code muncul
→ Scan QR
→ Auto-login! ✅
```

---

## 🔍 **Cara Cek IP:**

### **Cek IP ESP32:**
```
Serial Monitor → Lihat saat boot:
IP Address: 192.168.100.87
```

### **Cek IP Komputer:**
```cmd
ipconfig | findstr "192.168"
```

### **Cek Gateway Router:**
```
Biasanya: 192.168.100.1 atau 192.168.1.1
```

---

## ⚙️ **Cara Ubah Static IP:**

Jika ingin ubah IP ESP32 ke IP lain:

### **1. Edit ESP32 Code:**
```cpp
// Ganti IP sesuai keinginan
IPAddress local_IP(192, 168, 100, 99);  // ← Ubah ini
```

### **2. Edit Web App:**
```typescript
const [esp32Ip, setEsp32Ip] = useState("192.168.100.99");  // ← Ubah ini
```

### **3. Upload & Restart**
```
Upload ESP32 → Restart web app
```

---

## 🐛 **Troubleshooting:**

### **Problem 1: IP masih berubah**
**Solusi:**
- Cek apakah static IP config berhasil
- Serial Monitor harus tampil: "IP Address: 192.168.100.87"
- Jika gagal, cek gateway dan subnet

### **Problem 2: Tidak bisa connect setelah set static IP**
**Solusi:**
- Pastikan IP tidak bentrok dengan device lain
- Cek gateway benar (biasanya .1)
- Cek subnet mask (biasanya 255.255.255.0)

### **Problem 3: QR code masih pakai IP lama**
**Solusi:**
- Restart web app (Ctrl+C → npm run dev)
- Clear browser cache
- Login ulang

---

## 📝 **Checklist:**

- [x] Set static IP di ESP32: `192.168.100.87`
- [x] Update IP di web app: `192.168.100.87`
- [ ] Upload ESP32
- [ ] Cek IP di Serial Monitor
- [ ] Test HTTP server: `http://192.168.100.87/`
- [ ] Test QR login
- [ ] Verify IP tidak berubah setelah restart

---

## 💡 **Tips:**

1. **Gunakan IP yang tidak dipakai** device lain
2. **Catat IP ESP32** untuk referensi
3. **Bookmark URL** untuk akses cepat
4. **Test setelah restart** untuk memastikan IP tetap

---

## 🎯 **Expected Result:**

### **Serial Monitor:**
```
Connecting WiFi.....
✅ WiFi Connected!
IP Address: 192.168.100.87
⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!

[HTTP] Server started on port 80
[HTTP] Access at: http://192.168.100.87
```

### **Web App:**
```typescript
esp32Ip: "192.168.100.87"
QR Code URL: http://192.168.100.87/set-token?token=...
```

### **Test:**
```
Browser → http://192.168.100.87/
✅ Tampil: "🤖 IoT Bank Sampah"

HP → Scan QR
✅ Auto-login berhasil!
```

---

## 🎉 **Summary:**

**Masalah:** IP ESP32 berubah-ubah  
**Solusi:** Set static IP `192.168.100.87`  
**Hasil:** IP tetap, QR login work! ✅

**Upload ESP32 dan test sekarang!** 🚀
