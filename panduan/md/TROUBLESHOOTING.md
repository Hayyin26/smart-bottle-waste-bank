# 🔧 Troubleshooting - Data Tidak Muncul di Dashboard

## Checklist Debugging

### 1. ✅ Check Environment Variables

**File `.env` harus berisi:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzM5NzcsImV4cCI6MjA1MTIwOTk3N30.sb_publishable_Xm9drrlGVmprn3M0dYTajA_5XAzlT3R
```

**PENTING**: 
- Variable name harus `NEXT_PUBLIC_SUPABASE_ANON_KEY` (bukan PUBLISHABLE_KEY)
- Key harus lengkap (dimulai dengan `eyJ...`)

**Cara mendapatkan key yang benar:**
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Settings** → **API**
4. Copy **anon/public key** (yang panjang, bukan service_role)

---

### 2. ✅ Check Browser Console

**Buka Dashboard:**
```
http://localhost:3000/dashboard
```

**Buka Browser Console:**
- Chrome/Edge: `F12` atau `Ctrl+Shift+I`
- Firefox: `F12`
- Safari: `Cmd+Option+I`

**Cari error messages:**
- ❌ "Missing Supabase environment variables"
- ❌ "Failed to fetch"
- ❌ "Invalid API key"
- ❌ Network errors

**Screenshot atau copy error message yang muncul!**

---

### 3. ✅ Check Database

**Jalankan query ini di Supabase SQL Editor:**

```sql
-- Check apakah ada data di profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check apakah ada data di transactions
SELECT COUNT(*) as total_transactions FROM transactions;

-- Check apakah ada data di iot_devices
SELECT COUNT(*) as total_devices FROM iot_devices;

-- Check data lengkap
SELECT 
  p.id,
  p.full_name,
  p.total_points,
  COUNT(t.id) as transaction_count
FROM profiles p
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.full_name, p.total_points
ORDER BY p.total_points DESC;
```

**Expected Results:**
- `total_profiles` > 0
- `total_transactions` > 0
- `total_devices` > 0

**Jika semua 0**, berarti data belum di-insert. Jalankan `test-data.sql`

---

### 4. ✅ Check RLS Policies

**Jalankan query ini:**

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'transactions', 'iot_devices');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'transactions', 'iot_devices');
```

**Jika tidak ada policies**, jalankan ini:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies untuk public read access
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON iot_devices FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);

-- Allow insert untuk transactions (untuk IoT device)
CREATE POLICY "Enable insert for all users" ON transactions FOR INSERT WITH CHECK (true);
```

---

### 5. ✅ Check Network Requests

**Di Browser Console → Network Tab:**

1. Refresh dashboard
2. Filter by "supabase"
3. Check requests ke Supabase API

**Look for:**
- ❌ 401 Unauthorized → API key salah
- ❌ 403 Forbidden → RLS policy issue
- ❌ 404 Not Found → URL salah
- ✅ 200 OK → Request berhasil

**Click pada request dan check:**
- Request Headers (ada apikey?)
- Response (ada data?)

---

### 6. ✅ Test Supabase Connection

**Buat file test:** `test-connection.js`

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dsdtxqpzofrvzxpyktoo.supabase.co';
const supabaseKey = 'PASTE_YOUR_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);
  
  console.log('Profiles:', profiles);
  console.log('Profiles Error:', profilesError);
  
  // Test 2: Fetch transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .limit(5);
  
  console.log('Transactions:', transactions);
  console.log('Transactions Error:', transactionsError);
  
  // Test 3: Fetch devices
  const { data: devices, error: devicesError } = await supabase
    .from('iot_devices')
    .select('*');
  
  console.log('Devices:', devices);
  console.log('Devices Error:', devicesError);
}

testConnection();
```

**Run:**
```bash
node test-connection.js
```

---

## Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"

**Solusi:**
1. Check file `.env` ada di root project
2. Variable name harus `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart development server: `npm run dev`

---

### Issue 2: Data kosong tapi tidak ada error

**Solusi:**
1. Check apakah sudah buat users di Supabase Auth
2. Check apakah sudah jalankan `test-data.sql`
3. Verify data ada di database (query di atas)

---

### Issue 3: "Invalid API key" atau 401 Error

**Solusi:**
1. Buka Supabase Dashboard → Settings → API
2. Copy **anon/public key** (bukan service_role!)
3. Update `.env`:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
4. Restart server

---

### Issue 4: RLS Policy Error

**Solusi:**
Jalankan query di Section 4 untuk create policies

---

### Issue 5: CORS Error

**Solusi:**
1. Buka Supabase Dashboard → Settings → API
2. Scroll ke "API Settings"
3. Add `http://localhost:3000` ke allowed origins
4. Save

---

## Step-by-Step Debug Process

### Step 1: Verify Environment Variables

```bash
# Check .env file
cat .env

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Step 2: Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Step 3: Open Dashboard

```
http://localhost:3000/dashboard
```

### Step 4: Check Console

Press `F12` → Console tab

**Look for:**
- Loading messages
- Error messages
- Network requests

### Step 5: Check Network

Press `F12` → Network tab → Refresh page

**Look for:**
- Requests to supabase.co
- Status codes (200 = OK, 401 = Auth error, 403 = Permission error)

### Step 6: Check Database

Run queries from Section 3 in Supabase SQL Editor

---

## Quick Fix Checklist

- [ ] File `.env` exists in root folder
- [ ] Variable name is `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not PUBLISHABLE_KEY)
- [ ] API key is complete (starts with `eyJ`)
- [ ] Development server restarted after changing `.env`
- [ ] Users exist in `auth.users` table
- [ ] Data exists in `profiles`, `transactions`, `iot_devices` tables
- [ ] RLS policies created for public read access
- [ ] No errors in browser console
- [ ] Network requests return 200 OK

---

## Still Not Working?

**Provide this information:**

1. **Browser Console Errors:**
   - Screenshot atau copy paste error messages

2. **Network Tab:**
   - Status code dari requests ke Supabase
   - Response body dari failed requests

3. **Database Check:**
   - Result dari query di Section 3

4. **Environment Variables:**
   - Confirm `.env` file location
   - Confirm variable names (hide the actual key values)

5. **Server Logs:**
   - Any errors when running `npm run dev`

---

## Contact for Help

Jika masih stuck, provide:
- Browser console screenshot
- Network tab screenshot
- Database query results
- Server terminal output
