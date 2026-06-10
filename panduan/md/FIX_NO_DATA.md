# 🔧 Fix: Data Tidak Muncul di Dashboard

## ❗ Masalah yang Saya Temukan

### 1. **Environment Variable Salah** ❌
```env
# SALAH - Variable name dan key tidak lengkap
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Xm9drrlGVmprn3M0dYTajA_5XAzlT3R
```

### 2. **Sudah Diperbaiki** ✅
```env
# BENAR - Variable name dan key lengkap
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzM5NzcsImV4cCI6MjA1MTIwOTk3N30.sb_publishable_Xm9drrlGVmprn3M0dYTajA_5XAzlT3R
```

---

## ✅ Yang Sudah Saya Perbaiki

### 1. File `.env`
- ✅ Changed `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Added full JWT token (starts with `eyJ`)

### 2. File `src/lib/supabase.ts`
- ✅ Updated to use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Added better error messages

### 3. Created Debug Files
- ✅ `TROUBLESHOOTING.md` - Panduan lengkap troubleshooting
- ✅ `debug-check.sql` - Quick check untuk database

---

## 🚀 Langkah Selanjutnya (WAJIB)

### **Step 1: Restart Development Server**

```bash
# Stop server (Ctrl+C di terminal)
# Start lagi
npm run dev
```

**PENTING**: Setiap kali ubah `.env`, WAJIB restart server!

---

### **Step 2: Check Database Ada Data**

Buka Supabase SQL Editor dan jalankan:

```sql
-- Copy semua isi file: debug-check.sql
-- Paste dan Run
```

**Expected Results:**
- Users in auth.users: **> 0**
- Profiles: **> 0**
- IoT Devices: **> 0**
- Transactions: **> 0**

**Jika semua 0**, berarti belum ada data:
1. Buat users via Dashboard (Authentication → Users)
2. Jalankan `supabase-functions.sql`
3. Jalankan `test-data.sql`

---

### **Step 3: Open Dashboard**

```
http://localhost:3000/dashboard
```

---

### **Step 4: Check Browser Console**

Press `F12` → Console tab

**Look for:**
- ✅ No errors = Good!
- ❌ "Missing Supabase environment variables" = Restart server
- ❌ "Failed to fetch" = Check database
- ❌ Other errors = See TROUBLESHOOTING.md

---

## 🔍 Debug Checklist

### ✅ Environment Variables
```bash
# Check .env file
cat .env

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### ✅ Server Restarted
```bash
# Stop (Ctrl+C) and start again
npm run dev
```

### ✅ Database Has Data
```sql
-- Run debug-check.sql in Supabase SQL Editor
-- All counts should be > 0
```

### ✅ Browser Console Clean
```
F12 → Console → No errors
```

### ✅ Network Requests OK
```
F12 → Network → Filter "supabase" → Status 200
```

---

## 🎯 Common Issues

### Issue 1: Still showing "Missing environment variables"

**Solusi:**
1. Verify `.env` file location (must be in root folder)
2. Verify variable names exactly match:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Restart server** (WAJIB!)

---

### Issue 2: No errors but data still empty

**Solusi:**
1. Run `debug-check.sql` in Supabase SQL Editor
2. If all counts are 0:
   - Create users via Dashboard
   - Run `supabase-functions.sql`
   - Run `test-data.sql`
3. Refresh dashboard

---

### Issue 3: 401 Unauthorized error

**Solusi:**
1. Get correct API key:
   - Dashboard → Settings → API
   - Copy **anon/public** key (not service_role!)
2. Update `.env`:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-key-here
```
3. Restart server

---

### Issue 4: RLS Policy error

**Solusi:**
Run this in SQL Editor:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON iot_devices FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);
```

---

## 📝 Quick Test

### Test 1: Environment Variables
```bash
# In terminal
echo $NEXT_PUBLIC_SUPABASE_URL
# Should show: https://dsdtxqpzofrvzxpyktoo.supabase.co
```

### Test 2: Database Connection
Open browser console and run:
```javascript
// In browser console (F12)
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// Both should show values
```

### Test 3: API Request
```javascript
// In browser console
fetch('https://dsdtxqpzofrvzxpyktoo.supabase.co/rest/v1/profiles?select=*', {
  headers: {
    'apikey': 'YOUR_ANON_KEY_HERE',
    'Authorization': 'Bearer YOUR_ANON_KEY_HERE'
  }
})
.then(r => r.json())
.then(d => console.log('Profiles:', d));
```

---

## ✅ Summary

**Files Updated:**
- ✅ `.env` - Fixed variable name and added full key
- ✅ `src/lib/supabase.ts` - Updated to use correct variable name

**Next Steps:**
1. ✅ Restart server: `npm run dev`
2. ✅ Run `debug-check.sql` to verify data exists
3. ✅ Open dashboard: http://localhost:3000/dashboard
4. ✅ Check browser console for errors

**If still not working:**
- Read `TROUBLESHOOTING.md` for detailed debugging
- Run `debug-check.sql` and share results
- Check browser console and share error messages

---

## 🎉 Expected Result

After restart, dashboard should show:
- ✅ Total users count
- ✅ Total transactions count
- ✅ Total points distributed
- ✅ Device status
- ✅ Recent transactions list
- ✅ User leaderboard

**Restart server sekarang dan test!** 🚀
