# 🌐 Auto IP Discovery untuk ESP32

## 📋 Fitur

Sistem **auto-discovery** yang membuat web app **otomatis mendapatkan IP ESP32** tanpa perlu input manual.

### ✅ Keuntungan
- ✅ **Tidak perlu manual input IP** setiap ganti WiFi
- ✅ **ESP32 otomatis broadcast IP** saat boot
- ✅ **Web app auto-fetch IP** dari database
- ✅ **Fallback ke manual input** jika auto-discovery gagal
- ✅ **Keep-alive mechanism** (re-register setiap 5 menit)

---

## 🏗️ Arsitektur

```
┌─────────────┐                 ┌──────────────┐                 ┌─────────────┐
│   ESP32     │                 │   Supabase   │                 │   Web App   │
│             │                 │   Database   │                 │             │
└─────────────┘                 └──────────────┘                 └─────────────┘
      │                                 │                                 │
      │ 1. WiFi.begin()                │                                 │
      │────────────────────────>       │                                 │
      │                                 │                                 │
      │ 2. POST /api/iot/register-device                                 │
      │    { device_id, ip_address }   │                                 │
      │────────────────────────────────>│                                 │
      │                                 │                                 │
      │ 3. Upsert to iot_devices table │                                 │
      │                                 │                                 │
      │                                 │  4. GET /api/iot/register-device?device=...
      │                                 │<────────────────────────────────│
      │                                 │                                 │
      │                                 │  5. Return { ip_address, is_online }
      │                                 │─────────────────────────────────>│
      │                                 │                                 │
      │                                 │  6. Generate QR with IP         │
      │                                 │                                 │
      │ 7. Re-register every 5 min     │                                 │
      │────────────────────────────────>│                                 │
```

---

## 📦 Setup

### **1. Buat Tabel di Supabase**

Jalankan SQL ini di Supabase SQL Editor:

```sql
-- File: create-iot-devices-table.sql
CREATE TABLE IF NOT EXISTS iot_devices (
  device_id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iot_devices_last_seen ON iot_devices(last_seen DESC);

ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read device info" ON iot_devices
  FOR SELECT
  USING (true);

CREATE POLICY "Allow service role to upsert devices" ON iot_devices
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### **2. Deploy API Endpoint**

Sudah tersedia di:
- `src/app/api/iot/register-device/route.ts`

Deploy ke Vercel:
```bash
git add .
git commit -m "feat: add auto IP discovery"
git push
```

### **3. Upload Kode ESP32**

File `IOT/PBL/src/main.cpp` sudah diupdate dengan:
- ✅ Fungsi `registerDeviceIp()`
- ✅ Auto-register saat boot
- ✅ Re-register setiap 5 menit

Upload ke ESP32 via PlatformIO/Arduino IDE.

### **4. Test**

1. **Reset ESP32**
2. **Buka Serial Monitor** → IP akan ter-register otomatis
3. **Buka web app** → IoT Auth page
4. **Login** → IP akan auto-fetch dari server
5. **Scan QR** → Otomatis login ke ESP32

---

## 🔍 Cara Kerja Detail

### **A. ESP32 Side**

#### **1. Boot Sequence**
```cpp
void setup() {
  // Connect to WiFi
  WiFi.begin(ssid, password);
  
  // Start HTTP server
  server.begin();
  
  // Register IP to cloud
  registerDeviceIp(); // ← AUTO-REGISTER!
}
```

#### **2. Periodic Re-registration**
```cpp
void loop() {
  // Re-register every 5 minutes (keep-alive)
  if (millis() - lastIpRegistration > IP_REGISTRATION_INTERVAL) {
    lastIpRegistration = millis();
    registerDeviceIp();
  }
}
```

### **B. Web App Side**

#### **1. Auto-Fetch on Mount**
```tsx
useEffect(() => {
  if (!esp32Ip) {
    fetchEsp32Ip(); // ← AUTO-FETCH!
  }
}, []);
```

#### **2. Fetch Function**
```tsx
const fetchEsp32Ip = async () => {
  const response = await fetch(`/api/iot/register-device?device=${deviceId}`);
  const data = await response.json();
  
  if (data.ip_address) {
    setEsp32Ip(data.ip_address);
    localStorage.setItem('esp32Ip', data.ip_address);
  }
};
```

---

## 🎯 User Experience

### **Sebelum (Manual)**
1. User buka Serial Monitor ESP32
2. Copy IP address
3. Paste ke web app
4. Scan QR

### **Sesudah (Auto)**
1. User login di web app
2. **IP auto-terdeteksi!** ✨
3. Scan QR

---

## 🔧 Troubleshooting

### **Problem: IP tidak terdeteksi**

**Solusi:**
1. Pastikan ESP32 sudah boot dan connect WiFi
2. Check Serial Monitor untuk konfirmasi registration
3. Klik tombol **🔄 Refresh** di web app
4. Jika masih gagal, gunakan **✏️ Edit** untuk input manual

### **Problem: Device offline**

**Cek:**
- ESP32 masih nyala?
- WiFi masih connect?
- Last seen timestamp di database

### **Problem: IP berubah terus**

**Solusi:**
- Set **static IP di router** (DHCP reservation)
- Atau set **static IP di ESP32** (edit kode WiFi.config())

---

## 📊 Database Schema

```sql
iot_devices
├── device_id (TEXT, PRIMARY KEY)
├── ip_address (TEXT)
├── last_seen (TIMESTAMPTZ)
└── created_at (TIMESTAMPTZ)
```

**Example Data:**
```
device_id        | ip_address     | last_seen           | created_at
-----------------+----------------+---------------------+--------------------
ESP32-BOTOL-01  | 192.168.1.123  | 2026-06-09 10:30:00 | 2026-06-09 09:00:00
```

---

## 🚀 Fitur Lanjutan (Opsional)

### **1. Multiple Devices**
Sistem sudah support multiple devices via `device_id`.

### **2. Device Status Monitoring**
Web app bisa cek `is_online` status (device dianggap offline jika `last_seen > 5 menit`)

### **3. Notification**
Bisa tambahkan notifikasi jika device offline.

---

## ✅ Testing Checklist

- [ ] ESP32 bisa register IP saat boot
- [ ] Web app bisa fetch IP dari server
- [ ] IP tersimpan di localStorage
- [ ] Tombol refresh berfungsi
- [ ] Fallback ke manual input berfungsi
- [ ] QR code ter-generate dengan IP yang benar
- [ ] Re-registration setiap 5 menit berjalan

---

## 📝 Notes

- **IP registration menggunakan HTTPS** (production)
- **Keep-alive mechanism** mencegah device dianggap offline
- **localStorage** menyimpan IP untuk faster load
- **Manual override** tersedia sebagai fallback

---

**Status:** ✅ Ready for deployment
**Last Updated:** June 9, 2026
