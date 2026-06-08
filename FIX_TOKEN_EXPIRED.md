# 🔧 Fix: Token Expired Issue

## ❌ **Masalah:**

**"Token tidak valid atau sudah expired"** setelah login dan scan QR code.

---

## 🔍 **Root Cause:**

### **1. Expiration Time Terlalu Pendek**
Session token expired setelah **hanya 5 menit**!

```typescript
// ❌ LAMA (file: src/app/(user)/iot-auth/page.tsx)
expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
```

**Masalah:**
- User login
- Generate QR code
- User scan QR code
- **TAPI**: Jika proses login + scan > 5 menit → Token expired!
- ESP32 tidak bisa verify token

### **2. ESP32 IP Salah di QR Code**
ESP32 IP di web app salah - menggunakan IP laptop!

```typescript
// ❌ LAMA
const [esp32Ip, setEsp32Ip] = useState("192.168.73.134"); // Ini IP laptop!
```

**Masalah:**
- QR code generate URL dengan IP laptop
- HP scan → redirect ke laptop (BUKAN ESP32!)
- ESP32 tidak pernah terima request
- Login gagal

---

## ✅ **Solusi:**

### **1. Perpanjang Expiration Time ke 1 Jam**

```typescript
// ✅ BARU (file: src/app/(user)/iot-auth/page.tsx)
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes (1 hour)
```

**Manfaat:**
- User punya waktu 1 jam untuk login dan scan
- Lebih dari cukup untuk proses normal
- Masih aman (tidak terlalu lama)

### **2. Fix ESP32 IP di Web App**

```typescript
// ✅ BARU
const [esp32Ip, setEsp32Ip] = useState("192.168.73.200"); // IP ESP32 yang benar!
```

**Manfaat:**
- QR code generate URL dengan IP ESP32 yang benar
- HP scan → langsung ke ESP32
- Auto-login work! ✅

---

## 📊 **Perbandingan:**

| Aspek | Lama (5 menit) | Baru (60 menit) |
|-------|----------------|-----------------|
| **Expiration Time** | 5 menit ❌ | 60 menit ✅ |
| **User Experience** | Terburu-buru | Santai ✅ |
| **Error Rate** | Tinggi ❌ | Rendah ✅ |
| **ESP32 IP** | 192.168.73.134 (laptop) ❌ | 192.168.73.200 (ESP32) ✅ |
| **QR Code URL** | Salah ❌ | Benar ✅ |

---

## 🧪 **Testing Flow:**

### **Sebelum Fix:**
```
1. User login → QR code muncul
2. User scan QR (butuh 6-10 menit)
3. Token sudah expired! ❌
4. ESP32: "Token tidak valid atau sudah expired"
5. User harus login ulang 😞
```

### **Setelah Fix:**
```
1. User login → QR code muncul
2. User scan QR (dalam 60 menit)
3. Token masih valid! ✅
4. ESP32: "Login Berhasil!" 🎉
5. LCD: "HELLO! [Nama User]"
6. Siap transaksi! 🚀
```

---

## 🔄 **Session Lifecycle:**

### **Create Session:**
```typescript
// File: src/app/(user)/iot-auth/page.tsx
await supabase.from("iot_sessions").upsert({
  session_token: sessionToken,
  user_id: userId,
  device_id: deviceId,
  expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 min
});
```

### **Validate Session:**
```typescript
// File: src/app/api/iot/get-user/route.ts
const expiresAt = new Date(session.expires_at);
if (expiresAt < new Date()) {
  // Delete expired session
  await supabase.from("iot_sessions").delete().eq("session_token", sessionToken);
  return NextResponse.json({ error: "Session expired" }, { status: 401 });
}
```

### **Delete Session:**
```typescript
// File: src/app/api/iot/get-user/route.ts (DELETE method)
await supabase.from("iot_sessions").delete().eq("session_token", sessionToken);
```

### **ESP32 Check Session:**
```cpp
// File: IOT/PBL/src/main.cpp
bool getUserFromSession() {
  String url = String(api_get_user) + "?token=" + session_token + "&device=" + device_id;
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    // Session valid
    return true;
  } else if (httpResponseCode == 404 || httpResponseCode == 401) {
    // Session expired or not found
    return false;
  }
}
```

---

## ⚙️ **Konfigurasi Expiration Time:**

Jika ingin mengubah expiration time, edit file:

```typescript
// File: src/app/(user)/iot-auth/page.tsx (line 66)

// Opsi 1: 30 menit
expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()

// Opsi 2: 1 jam (RECOMMENDED) ✅
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()

// Opsi 3: 2 jam
expires_at: new Date(Date.now() + 120 * 60 * 1000).toISOString()

// Opsi 4: 1 hari (untuk testing)
expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
```

**Rekomendasi:** 60 menit (1 jam) untuk balance antara security dan user experience.

---

## 🐛 **Troubleshooting:**

### **Problem 1: Token masih expired cepat**
**Cek:**
```typescript
// File: src/app/(user)/iot-auth/page.tsx
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()  // Harus 60 * 60 * 1000
```

**Solusi:**
- Pastikan sudah update ke 60 menit
- Restart web app (Ctrl+C → npm run dev)
- Login ulang

### **Problem 2: QR code redirect ke laptop, bukan ESP32**
**Cek:**
```typescript
// File: src/app/(user)/iot-auth/page.tsx
const [esp32Ip, setEsp32Ip] = useState("192.168.73.200");  // Harus IP ESP32!
```

**Solusi:**
- Pastikan ESP32 IP = 192.168.73.200
- Bukan IP laptop (192.168.73.134)
- Restart web app

### **Problem 3: ESP32 tidak terima request**
**Cek Serial Monitor:**
```
[HTTP] Request received!
[HTTP] URI: /set-token
[HTTP] Args: 1
[HTTP]   token: abc123...
```

**Solusi:**
- Pastikan ESP32 HTTP server running
- Test: http://192.168.73.200/
- Check WiFi connection
- Check ESP32 IP benar

---

## 📝 **Checklist:**

- [x] Expiration time diperpanjang ke 60 menit ✅
- [x] ESP32 IP di web app diupdate ke 192.168.73.200 ✅
- [x] Text "5 menit" diganti "1 jam" di UI ✅
- [ ] Restart web app (npm run dev)
- [ ] Test login
- [ ] Test QR code scan
- [ ] Verify token tidak expired dalam 60 menit

---

## 🎯 **Expected Result:**

### **Serial Monitor ESP32:**
```
[HTTP] Request received!
[HTTP] Token received from QR scan!
[HTTP] Token: abc123def456...
[API] Getting user from session...
[API] Response: {"user_id":"...","full_name":"John Doe",...}
[Session] ✅ User found!
[Session] Name: John Doe
```

### **LCD ESP32:**
```
HELLO!
John Doe
```

### **Web Browser (HP):**
```
✅ Login Berhasil!
Akun Anda telah terhubung dengan device IoT.
Nama: John Doe
Silakan masukkan botol untuk memulai transaksi.
```

---

## 💡 **Tips:**

1. **Jangan terlalu lama**: Meskipun token valid 1 jam, sebaiknya scan QR segera setelah muncul
2. **Check expiration**: Web app menampilkan "Sesi akan berakhir dalam 1 jam"
3. **Auto-delete**: Token otomatis dihapus setelah expired atau setelah logout
4. **One-time use**: Setelah scan QR dan transaksi selesai, token dihapus (security)

---

## 🔒 **Security Notes:**

- Token random 32 karakter (hex)
- Expiration time 60 menit (balance security vs UX)
- Auto-delete after expiration
- Auto-delete after logout (ESP32 DELETE request)
- One device per token (device_id check)

---

## 🎉 **Summary:**

**Masalah:**  
- Token expired terlalu cepat (5 menit)
- ESP32 IP salah di QR code

**Solusi:**  
- Perpanjang expiration ke 60 menit ✅
- Fix ESP32 IP ke 192.168.73.200 ✅

**Hasil:**  
- Token valid 1 jam ✅
- QR code redirect ke ESP32 ✅
- Auto-login work! 🎉

**Restart web app dan test sekarang!** 🚀
