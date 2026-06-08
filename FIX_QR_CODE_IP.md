# 🔧 Fix QR Code IP - Masih Mengarah ke IP Komputer

## ❌ **Masalah:**

QR Code masih mengarah ke IP komputer:
```
http://10.139.60.155/set-token?token=...
```

Padahal seharusnya mengarah ke IP ESP32:
```
http://10.139.60.87/set-token?token=...
```

---

## 🔍 **Penyebab:**

Web app masih menggunakan **kode lama** yang ter-cache. Perubahan di `src/app/(user)/iot-auth/page.tsx` belum diterapkan karena:

1. ⚠️ Web app belum di-restart
2. ⚠️ Browser cache masih menyimpan kode lama
3. ⚠️ Next.js development server perlu di-rebuild

---

## ✅ **Solusi:**

### **Langkah 1: Stop Web App**

Tekan **Ctrl+C** di terminal yang menjalankan `npm run dev`

Atau kill process secara manual:

```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

# Atau cari process ID dan kill
taskkill /F /IM node.exe
```

---

### **Langkah 2: Clear Next.js Cache**

```bash
# Hapus folder .next (build cache)
rm -rf .next

# Hapus node_modules/.cache (optional, jika masih bermasalah)
rm -rf node_modules/.cache
```

---

### **Langkah 3: Restart Web App**

```bash
npm run dev
```

Tunggu sampai muncul:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
○ Network: http://10.139.60.155:3000
```

---

### **Langkah 4: Clear Browser Cache**

#### **Chrome/Edge:**
1. Tekan **Ctrl+Shift+Delete**
2. Pilih **Cached images and files**
3. Klik **Clear data**

#### **Atau Hard Refresh:**
- **Ctrl+Shift+R** (Windows/Linux)
- **Cmd+Shift+R** (Mac)

---

### **Langkah 5: Test QR Code**

1. Buka browser (gunakan **Incognito/Private mode** untuk memastikan tidak ada cache)
2. Akses: `http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01`
3. Login atau Register
4. **Cek QR code URL** dengan inspect element atau scan QR

**Expected QR Code URL:**
```
http://10.139.60.87/set-token?token=...&device=ESP32-BOTOL-01
```

**Bukan:**
```
http://10.139.60.155/set-token?token=...  ❌
```

---

## 🔍 **Verifikasi Kode:**

Mari kita pastikan kode sudah benar:

### **File: `src/app/(user)/iot-auth/page.tsx`**

Cari baris ini (sekitar baris 17):
```typescript
const [esp32Ip, setEsp32Ip] = useState("10.139.60.87"); // IP ESP32 untuk QR code
```

✅ **Harus:** `"10.139.60.87"`  
❌ **Bukan:** `"10.139.60.155"`

---

### **Cek QR Code Generation (baris 76-78):**
```typescript
const qrData = `http://${esp32Ip}/set-token?token=${sessionToken}&device=${deviceId}`;
```

Ini akan menghasilkan:
```
http://10.139.60.87/set-token?token=...&device=ESP32-BOTOL-01
```

---

## 🐛 **Debug QR Code:**

Jika masih salah, tambahkan console.log untuk debug:

### **Edit file `src/app/(user)/iot-auth/page.tsx`:**

Cari bagian `saveIotSession` function (sekitar baris 76), tambahkan:

```typescript
// Generate QR code for auto-login
try {
  const qrData = `http://${esp32Ip}/set-token?token=${sessionToken}&device=${deviceId}`;
  
  // 🔍 DEBUG: Print QR data
  console.log("🔍 QR Code URL:", qrData);
  console.log("🔍 ESP32 IP:", esp32Ip);
  
  const qrImage = await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  setQrCodeUrl(qrImage);
} catch (qrError) {
  console.error("QR Code generation error:", qrError);
}
```

Kemudian:
1. Restart web app
2. Buka browser console (F12)
3. Login/Register
4. Lihat output di console:
   ```
   🔍 QR Code URL: http://10.139.60.87/set-token?token=...
   🔍 ESP32 IP: 10.139.60.87
   ```

---

## 🚀 **Quick Fix (One-Liner):**

Jika Anda ingin cepat, jalankan ini:

```bash
# Stop web app (Ctrl+C), lalu:
rm -rf .next && npm run dev
```

Kemudian refresh browser dengan **Ctrl+Shift+R**

---

## 📱 **Test dari HP:**

Setelah fix:

1. **Connect HP ke WiFi "Slumk"**
2. **Buka browser di HP** (gunakan Incognito mode)
3. **Akses:** `http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01`
4. **Login/Register**
5. **Scan QR code**
6. **HP akan buka:** `http://10.139.60.87/set-token?token=...`
7. **Harus tampil:** "✅ Login Berhasil!"

---

## ⚠️ **Catatan Penting:**

### **Jika QR Code masih salah setelah restart:**

Kemungkinan ada **hardcoded IP** di tempat lain. Cari semua file yang menggunakan IP lama:

```bash
# Cari di semua file TypeScript/JavaScript
grep -r "10.139.60.155" src/
```

Atau gunakan VS Code:
1. Tekan **Ctrl+Shift+F**
2. Search: `10.139.60.155`
3. Ganti semua yang berhubungan dengan ESP32 ke `10.139.60.87`

---

## ✅ **Checklist:**

- [ ] Stop web app (Ctrl+C)
- [ ] Hapus cache: `rm -rf .next`
- [ ] Restart: `npm run dev`
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Test di Incognito mode
- [ ] Verifikasi QR code URL: `http://10.139.60.87/...`
- [ ] Test scan QR dari HP
- [ ] Harus tampil: "✅ Login Berhasil!"

---

## 🎯 **Summary:**

**Masalah:** QR code mengarah ke IP komputer (`10.139.60.155`)  
**Penyebab:** Web app cache belum di-refresh  
**Solusi:** Restart web app dan clear cache  
**Expected:** QR code mengarah ke IP ESP32 (`10.139.60.87`)

**Selamat mencoba! 🚀**
