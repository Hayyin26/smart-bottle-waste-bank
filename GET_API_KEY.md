# 🔑 Cara Mendapatkan API Key yang Benar

## ❗ Masalah Saat Ini

File `.env` Anda menggunakan key yang tidak lengkap atau salah format.

## ✅ Cara Mendapatkan API Key yang Benar

### **Step 1: Buka Supabase Dashboard**

1. Buka https://supabase.com/dashboard
2. Login dengan akun Anda
3. Pilih project: **dsdtxqpzofrvzxpyktoo**

### **Step 2: Buka Settings → API**

1. Klik **Settings** (icon gear) di sidebar kiri bawah
2. Klik **API**

### **Step 3: Copy anon/public Key**

Anda akan melihat 2 keys:

#### ❌ **JANGAN gunakan ini:**
```
service_role key (secret)
```
**Ini untuk server-side only, JANGAN digunakan di client!**

#### ✅ **GUNAKAN ini:**
```
anon / public key
```

Key ini akan terlihat seperti:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzM5NzcsImV4cCI6MjA1MTIwOTk3N30.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Ciri-ciri key yang benar:**
- ✅ Dimulai dengan `eyJ`
- ✅ Panjang (200+ karakter)
- ✅ Ada 3 bagian dipisah titik (.)
- ✅ Labeled sebagai "anon" atau "public"

### **Step 4: Update File .env**

1. Buka file `.env` di root project
2. Ganti dengan format ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
```

**PENTING:**
- Variable name harus `NEXT_PUBLIC_SUPABASE_ANON_KEY` (bukan PUBLISHABLE_KEY)
- Paste key yang lengkap (jangan dipotong)

### **Step 5: Restart Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Step 6: Test**

Buka http://localhost:3000/dashboard

---

## 📸 Screenshot Panduan

### Lokasi API Key di Dashboard:

```
Dashboard
  └── Settings (⚙️)
       └── API
            ├── Project URL: https://dsdtxqpzofrvzxpyktoo.supabase.co
            ├── anon/public key: eyJhbGci... ← COPY INI
            └── service_role key: eyJhbGci... ← JANGAN INI
```

---

## 🔍 Verify Key Format

Key yang benar terdiri dari 3 bagian:

```
HEADER.PAYLOAD.SIGNATURE
```

Contoh:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header
.
eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRz...  ← Payload
.
Xm9drrlGVmprn3M0dYTajA_5XAzlT3R           ← Signature
```

---

## ✅ Checklist

- [ ] Buka Supabase Dashboard
- [ ] Settings → API
- [ ] Copy **anon/public** key (bukan service_role)
- [ ] Paste ke `.env` dengan variable name `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Key lengkap (tidak terpotong)
- [ ] Restart server
- [ ] Test dashboard

---

## 🐛 Troubleshooting

### Key terpotong saat copy?
- Klik icon "copy" di sebelah key (jangan select manual)
- Atau double-click key untuk select all, lalu copy

### Masih error setelah update?
1. Verify key di `.env` lengkap
2. Restart server (WAJIB!)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console untuk error baru

---

## 📝 Example .env yang Benar

```env
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzM5NzcsImV4cCI6MjA1MTIwOTk3N30.Xm9drrlGVmprn3M0dYTajA_5XAzlT3R
```

**Note:** Key di atas mungkin tidak lengkap. Gunakan key dari dashboard Anda!

---

## 🎯 Next Steps

1. ✅ Dapatkan anon key dari dashboard
2. ✅ Update `.env`
3. ✅ Restart server
4. ✅ Test dashboard
5. ✅ Jika masih error, share screenshot error baru

**Dapatkan API key yang benar dari dashboard sekarang!** 🔑
