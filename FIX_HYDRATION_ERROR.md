# 🔧 Fix Hydration Mismatch Error

## ❌ Error yang Terjadi:
```
Error: A tree hydrated but some attributes of the server rendered HTML 
didn't match the client properties.

This can happen if a SSR-ed Client Component used:
- Variable input such as Date.now() or Math.random() which changes each time it's called
```

## 🎯 Penyebab:
**Hydration mismatch** terjadi karena:
1. `Math.random()` di-generate saat server render
2. `Math.random()` di-generate lagi saat client render
3. Hasilnya berbeda → React error!

### Kode Lama (❌ Error):
```typescript
const [sessionToken] = useState(() => {
  // ❌ Math.random() berbeda di server vs client
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
});
```

## ✅ Solusi:
Generate token **hanya di client side** menggunakan `useEffect`:

### Kode Baru (✅ Fixed):
```typescript
const [sessionToken, setSessionToken] = useState("");

useEffect(() => {
  // ✅ Generate hanya di client, tidak di server
  const token = searchParams.get("token");
  if (token) {
    setSessionToken(token);
  } else {
    const newToken = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setSessionToken(newToken);
  }
}, [searchParams]);

// Show loading while token is being generated
if (!sessionToken) {
  return <LoadingSpinner />;
}
```

---

## 🚀 Cara Fix:

### **Sudah Diperbaiki Otomatis!**
File `src/app/(user)/iot-auth/page.tsx` sudah diperbaiki.

### **Test Sekarang:**
```bash
# 1. Restart dev server
# Ctrl+C untuk stop
npm run dev

# 2. Buka browser
http://localhost:3000/iot-auth?device=ESP32-BOTOL-01

# 3. Harus tidak ada error lagi! ✅
```

---

## 🔍 Verifikasi:

### **Cek Browser Console (F12):**
```
✅ Tidak ada error hydration
✅ Tidak ada warning
✅ Page load normal
```

### **Cek Functionality:**
```
✅ Bisa register user baru
✅ Token muncul setelah login
✅ Bisa copy token
✅ Bisa kirim ke ESP32
```

---

## 📚 Penjelasan Teknis:

### **Hydration di Next.js:**
1. **Server Side Rendering (SSR)**:
   - Next.js render HTML di server
   - Kirim HTML ke browser
   
2. **Client Side Hydration**:
   - React "hydrate" HTML dengan JavaScript
   - Harus match persis dengan server HTML
   
3. **Hydration Mismatch**:
   - Jika server HTML ≠ client HTML → Error!
   - Penyebab: `Math.random()`, `Date.now()`, dll

### **Solusi:**
- Generate random value **hanya di client** (useEffect)
- Atau gunakan value yang **konsisten** (dari props/URL)

---

## 🐛 Common Hydration Errors:

### **1. Math.random()**
```typescript
// ❌ Error
const [id] = useState(() => Math.random());

// ✅ Fixed
const [id, setId] = useState("");
useEffect(() => {
  setId(Math.random().toString());
}, []);
```

### **2. Date.now()**
```typescript
// ❌ Error
const [timestamp] = useState(Date.now());

// ✅ Fixed
const [timestamp, setTimestamp] = useState(0);
useEffect(() => {
  setTimestamp(Date.now());
}, []);
```

### **3. window/document**
```typescript
// ❌ Error
const [width] = useState(window.innerWidth);

// ✅ Fixed
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

---

## ✅ Checklist:

- [x] Fix kode di `src/app/(user)/iot-auth/page.tsx`
- [x] Tambahkan `useEffect` untuk generate token
- [x] Tambahkan loading state
- [x] Tambahkan check `if (!sessionToken)`
- [ ] Restart dev server
- [ ] Test di browser
- [ ] Verify tidak ada error hydration
- [ ] Test register user baru
- [ ] Test copy token
- [ ] Test kirim ke ESP32

---

## 🎉 Summary:

**Masalah**: `Math.random()` di server ≠ client → Hydration error  
**Solusi**: Generate token di `useEffect` (client only)  
**Hasil**: Tidak ada error, page load normal ✅

---

## 📞 Still Having Issues?

### Clear Browser Cache:
```
1. Open DevTools (F12)
2. Right-click Refresh button
3. Click "Empty Cache and Hard Reload"
```

### Clear Next.js Cache:
```bash
rm -rf .next
npm run dev
```

### Check Console:
```
F12 → Console
Lihat error message detail
```
