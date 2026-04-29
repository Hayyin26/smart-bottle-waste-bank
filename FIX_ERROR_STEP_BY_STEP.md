# 🔧 Fix Error: Step by Step

## Error yang Anda Alami:
```
Error: Error counting users: {}
```

Ini berarti aplikasi tidak bisa fetch data dari Supabase.

---

## ✅ Checklist Fix (Ikuti Urutan Ini!)

### **Step 1: Verify .env File** ✅

File `.env` sudah benar! Berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Step 2: RESTART SERVER** (WAJIB!)

```bash
# 1. Stop server
# Tekan Ctrl+C di terminal

# 2. Clear cache
Remove-Item -Recurse -Force .next

# 3. Start lagi
npm run dev
```

**PENTING**: Setiap kali ubah `.env`, WAJIB restart server!

---

### **Step 3: Fix RLS Policies**

Buka Supabase SQL Editor dan jalankan:

```sql
-- Copy semua isi file: fix-rls-policies.sql
-- Paste ke SQL Editor
-- Run
```

Atau copy ini:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON iot_devices;
DROP POLICY IF EXISTS "Enable read access for all users" ON transactions;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read devices" ON iot_devices FOR SELECT USING (true);
CREATE POLICY "Allow public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON transactions FOR INSERT WITH CHECK (true);
```

---

### **Step 4: Verify Data Exists**

Di SQL Editor, jalankan:

```sql
-- Check data
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_devices FROM iot_devices;
SELECT COUNT(*) as total_transactions FROM transactions;
```

**Jika semua 0**, berarti belum ada data:
1. Buat users via Dashboard (Authentication → Users)
2. Jalankan `supabase-functions.sql`
3. Jalankan `test-data.sql`

---

### **Step 5: Test Connection**

Buka browser console (F12) dan jalankan:

```javascript
// Test fetch profiles
fetch('https://dsdtxqpzofrvzxpyktoo.supabase.co/rest/v1/profiles?select=count', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk'
  }
})
.then(r => r.json())
.then(d => console.log('Result:', d))
.catch(e => console.error('Error:', e));
```

**Expected Result:**
```json
[{"count": 3}]
```

**Jika error:**
- 401 = API key salah
- 403 = RLS policy issue
- 404 = URL salah

---

### **Step 6: Hard Refresh Browser**

```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

Atau:
1. F12 → Network tab
2. Klik kanan refresh button
3. "Empty Cache and Hard Reload"

---

### **Step 7: Check Browser Console**

Buka http://localhost:3000/dashboard

Press F12 → Console tab

**Look for:**
- ✅ No errors = Good!
- ❌ "Missing Supabase environment variables" = Restart server
- ❌ "Failed to fetch" = RLS policy issue
- ❌ "401 Unauthorized" = API key issue

---

## 🎯 Quick Checklist

- [ ] File `.env` ada dan benar ✅
- [ ] Server sudah di-restart (Ctrl+C, npm run dev)
- [ ] RLS policies sudah dibuat (jalankan fix-rls-policies.sql)
- [ ] Data exists di database (check dengan query)
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] No errors di browser console

---

## 🐛 Troubleshooting

### Masih Error Setelah Restart?

**1. Check apakah server benar-benar restart:**
```bash
# Terminal harus show:
# ▲ Next.js 15.x.x
# - Local: http://localhost:3000
```

**2. Check environment variables loaded:**

Buka browser console dan ketik:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

Keduanya harus show values (bukan undefined).

**3. Check Network tab:**

F12 → Network → Refresh page

Look for requests ke `supabase.co`:
- Status 200 = OK ✅
- Status 401 = Auth error ❌
- Status 403 = Permission error ❌

---

## 📝 Common Issues

### Issue 1: "Error counting users: {}"

**Penyebab:**
- RLS policies belum dibuat
- API key salah
- Server belum restart

**Solusi:**
1. Jalankan `fix-rls-policies.sql`
2. Restart server
3. Hard refresh browser

---

### Issue 2: Data masih kosong

**Penyebab:**
- Belum ada data di database

**Solusi:**
1. Buat users via Dashboard
2. Jalankan `test-data.sql`
3. Verify dengan query

---

### Issue 3: 401 Unauthorized

**Penyebab:**
- API key salah atau expired

**Solusi:**
1. Dapatkan key baru dari Dashboard
2. Update `.env`
3. Restart server

---

## ✅ Expected Result

Setelah semua fix, dashboard harus show:
- Total Users: X
- Total Scans: X
- Points Distributed: X
- IoT Devices: X
- Recent transactions list
- User leaderboard
- Device status

---

## 🚀 Action Items

**DO THIS NOW:**

1. ✅ Restart server (Ctrl+C, npm run dev)
2. ✅ Jalankan `fix-rls-policies.sql` di Supabase
3. ✅ Hard refresh browser (Ctrl+Shift+R)
4. ✅ Check browser console (F12)
5. ✅ Share screenshot jika masih error

**Lakukan 3 hal pertama sekarang dan share hasilnya!** 🔧
