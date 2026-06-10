# 🔧 Fix: ESP32 Register Device Error "Invalid API key"

## ❌ Error Message
```
[Register] ❌ Failed! Code: 500
[Register] Response: {"error":"Invalid API key"}
```

## 🎯 Penyebab

Error ini terjadi karena:
1. ❌ `SUPABASE_SERVICE_ROLE_KEY` di `.env` masih placeholder
2. ❌ API `/api/iot/register-device` tidak bisa create Supabase client
3. ❌ ESP32 tidak bisa register IP ke database

---

## ✅ Solusi 1: Fix Service Role Key (RECOMMENDED)

### **Step 1: Get Service Role Key dari Supabase**

1. **Buka Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/dsdtxqpzofrvzxpyktoo
   ```

2. **Navigate to Settings:**
   ```
   Settings → API → Project API keys
   ```

3. **Copy service_role key:**
   - Scroll ke bagian "Project API keys"
   - Cari yang bertulisan **"service_role (secret)"**
   - Click **👁️ Reveal** untuk show key
   - Click **📋 Copy** untuk copy key

   Key akan berbentuk seperti ini:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

### **Step 2: Update .env File**

Edit file `.env`:

```env
# SEBELUM (❌ Wrong):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.YOUR_SERVICE_ROLE_KEY_HERE

# SESUDAH (✅ Correct):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.Kq8Z... (paste real key dari dashboard)
```

⚠️ **PENTING:** Paste key yang REAL dari dashboard, bukan yang ada `YOUR_SERVICE_ROLE_KEY_HERE`!

### **Step 3: Restart Next.js Dev Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

Server harus restart untuk load environment variables yang baru!

### **Step 4: Test ESP32 Lagi**

1. Reset ESP32 (tekan tombol reset)
2. Check Serial Monitor
3. Expected output:
   ```
   [Register] Registering device IP to cloud...
   [Register] Payload: {"device_id":"ESP32-BOTOL-01","ip_address":"192.168.1.14"}
   [Register] ✅ Device IP registered successfully!
   ```

✅ **Error akan hilang!**

---

## ✅ Solusi 2: Make API Public (Quick Fix - Development Only)

Jika tidak mau fix service key sekarang, bisa buat API tidak memerlukan authentication.

**⚠️ WARNING:** Ini hanya untuk development! Production harus pakai Solusi 1!

### **Update API Route:**

Edit file: `src/app/api/iot/register-device/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // ← Change: Use anon key

export async function POST(request: NextRequest) {
  try {
    const { device_id, ip_address } = await request.json();

    if (!device_id || !ip_address) {
      return NextResponse.json(
        { error: "device_id and ip_address required" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey); // ← Change: Use anon key

    // ... rest of code unchanged ...
  }
}
```

**Catatan:** Ini akan work HANYA jika RLS policy di table `iot_devices` allow public insert.

---

## 🧪 Testing

### **Test 1: Check Environment Variable**

Di terminal server (tempat `npm run dev` jalan):

```bash
# Windows PowerShell
echo $env:SUPABASE_SERVICE_ROLE_KEY

# Harus keluar key yang BUKAN "YOUR_SERVICE_ROLE_KEY_HERE"
```

### **Test 2: Test API Endpoint**

```bash
# Test dengan curl atau Postman
curl -X POST https://smart-bottle-waste-bank.vercel.app/api/iot/register-device \
  -H "Content-Type: application/json" \
  -d '{"device_id":"TEST","ip_address":"192.168.1.100"}'

# Expected response:
# {"success":true,"device_id":"TEST","ip_address":"192.168.1.100"}
```

### **Test 3: Check Database**

```sql
-- Di Supabase SQL Editor
SELECT * FROM iot_devices WHERE device_id = 'ESP32-BOTOL-01';
```

Expected result: Row dengan IP `192.168.1.14`

---

## 📊 Debug Steps

### **Check 1: Service Key Format**

Service role key harus:
- ✅ Start dengan `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- ✅ Panjang ~200-300 characters
- ✅ Ada 2 titik (`.`) pemisah
- ❌ TIDAK ada `YOUR_SERVICE_ROLE_KEY_HERE`

### **Check 2: Restart Required**

Environment variables hanya di-load saat server start:
```bash
# WAJIB restart setelah edit .env!
# Ctrl+C (stop)
npm run dev  (start lagi)
```

### **Check 3: Vercel Deployment**

Jika sudah deploy ke Vercel, pastikan environment variable di-set di Vercel Dashboard:

```
Vercel Dashboard → Project → Settings → Environment Variables
→ Add: SUPABASE_SERVICE_ROLE_KEY = <paste key>
→ Redeploy project
```

---

## 🔒 Security Notes

### **Service Role Key:**

⚠️ **CRITICAL:** Service role key memiliki **FULL ACCESS** ke database!

**DO:**
- ✅ Simpan di `.env` (yang di `.gitignore`)
- ✅ Gunakan hanya di server-side code
- ✅ Set di Vercel environment variables
- ✅ Rotate key secara berkala

**DON'T:**
- ❌ Commit ke git
- ❌ Share ke orang lain
- ❌ Expose di client-side code
- ❌ Hardcode di ESP32 code

### **Why ESP32 Doesn't Send Key:**

ESP32 **TIDAK boleh** tahu service role key! Yang boleh:
- ✅ ESP32 → Next.js API
- ✅ Next.js API → Supabase (dengan service key)
- ❌ ESP32 → Supabase (direct dengan service key)

**Alasan:** Service key terlalu powerful untuk embedded device.

---

## 🎯 Recommendation

### **For Development:**
✅ **Gunakan Solusi 1** (Fix service role key)

**Alasan:**
- Proper security
- Work di production juga
- Learn proper environment variable management

### **For Testing Only:**
⚠️ Solusi 2 bisa digunakan jika:
- Mau cepat test tanpa fix key
- Development mode only
- Akan fix nanti sebelum production

### **For Production:**
🔒 **WAJIB Solusi 1** + security enhancements:
- Rate limiting
- API key validation
- Device authentication
- HTTPS only

---

## 📋 Quick Checklist

- [ ] Buka Supabase Dashboard
- [ ] Navigate: Settings → API → service_role key
- [ ] Click Reveal & Copy key
- [ ] Paste ke `.env` file
- [ ] Check tidak ada `YOUR_SERVICE_ROLE_KEY_HERE`
- [ ] Restart Next.js server (Ctrl+C, npm run dev)
- [ ] Reset ESP32
- [ ] Check Serial Monitor
- [ ] Expected: `✅ Device IP registered successfully!`

---

## 💡 Common Mistakes

### **Mistake 1: Tidak Restart Server**
```
❌ Edit .env → Test langsung (SALAH!)
✅ Edit .env → Restart server → Test (BENAR!)
```

### **Mistake 2: Copy Key yang Salah**
```
❌ Copy "anon (public)" key
✅ Copy "service_role (secret)" key
```

### **Mistake 3: Quotes Extra**
```
❌ SUPABASE_SERVICE_ROLE_KEY="eyJ..." (ada quotes)
✅ SUPABASE_SERVICE_ROLE_KEY=eyJ...  (tanpa quotes)
```

---

## 🚀 After Fix

Setelah fix, ESP32 akan bisa:
- ✅ Register IP otomatis saat boot
- ✅ Update IP setiap 5 menit (keep-alive)
- ✅ Web app auto-detect IP
- ✅ QR code auto-login work

---

**Status:** ⚠️ Blocking issue  
**Priority:** HIGH (harus fix untuk continue)  
**Solution:** Fix service role key di `.env`  
**Time:** ~2 menit  

**Last Updated:** June 9, 2026
