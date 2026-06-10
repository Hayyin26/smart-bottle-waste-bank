# 🔧 Fix: IoT Devices Table Missing Column Error

## ❌ Error Message
```
[Register] ❌ Failed! Code: 500
[Register] Response: {"error":"Could not find the 'ip_address' column of 'iot_devices' in the schema cache"}
```

## 🎯 Penyebab

Error ini berarti table `iot_devices` di Supabase:
1. ❌ Belum dibuat sama sekali, ATAU
2. ❌ Dibuat tapi tidak punya column `ip_address`

---

## ✅ Solusi: Run SQL Script di Supabase

### **Step 1: Buka Supabase SQL Editor**

1. Buka browser:
   ```
   https://supabase.com/dashboard/project/dsdtxqpzofrvzxpyktoo
   ```

2. Navigate ke **SQL Editor** (di sidebar kiri)

3. Click **+ New query** untuk buat query baru

---

### **Step 2: Copy-Paste SQL Script**

Copy seluruh isi file `fix-iot-devices-table.sql` dan paste ke SQL Editor.

Atau copy dari sini:

```sql
-- ============================================
-- FIX: IOT_DEVICES TABLE - Add Missing Columns
-- ============================================

-- Step 1: Create table if not exists
CREATE TABLE IF NOT EXISTS iot_devices (
  device_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Add ip_address column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE iot_devices ADD COLUMN ip_address TEXT NOT NULL DEFAULT '0.0.0.0';
    RAISE NOTICE 'Column ip_address added successfully';
  ELSE
    RAISE NOTICE 'Column ip_address already exists';
  END IF;
END $$;

-- Step 3: Add last_seen column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'iot_devices' AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE iot_devices ADD COLUMN last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
    RAISE NOTICE 'Column last_seen added successfully';
  ELSE
    RAISE NOTICE 'Column last_seen already exists';
  END IF;
END $$;

-- Step 4: Remove default from ip_address
ALTER TABLE iot_devices ALTER COLUMN ip_address DROP DEFAULT;

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_iot_devices_last_seen ON iot_devices(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_iot_devices_device_id ON iot_devices(device_id);

-- Step 6: Enable RLS
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop existing policies
DROP POLICY IF EXISTS "Allow public read device info" ON iot_devices;
DROP POLICY IF EXISTS "Allow service role to upsert devices" ON iot_devices;
DROP POLICY IF EXISTS "Allow anon to upsert devices" ON iot_devices;

-- Step 8: Create policies
CREATE POLICY "Allow public read device info" ON iot_devices
  FOR SELECT
  USING (true);

CREATE POLICY "Allow service role to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow anon to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'anon')
  WITH CHECK (auth.role() = 'anon');

-- Step 9: Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'iot_devices'
ORDER BY ordinal_position;
```

---

### **Step 3: Run Query**

1. Click button **RUN** (atau Ctrl+Enter)

2. Wait for execution

3. Check output di bagian bawah

---

### **Step 4: Verify Table Structure**

Expected output:

```
column_name  | data_type                   | is_nullable | column_default
-------------|----------------------------|-------------|----------------
device_id    | text                       | NO          | 
ip_address   | text                       | NO          | 
created_at   | timestamp with time zone   | NO          | now()
last_seen    | timestamp with time zone   | NO          | now()
```

✅ **Jika ada 4 columns di atas, table sudah benar!**

---

### **Step 5: Test ESP32 Lagi**

1. **Reset ESP32** (tekan tombol reset)

2. **Check Serial Monitor**

3. **Expected output:**
   ```
   [Register] Registering device IP to cloud...
   [Register] Payload: {"device_id":"ESP32-BOTOL-01","ip_address":"192.168.1.14"}
   [Register] ✅ Device IP registered successfully!
   [Register] Response: {"success":true,"device_id":"ESP32-BOTOL-01","ip_address":"192.168.1.14"}
   ```

✅ **Error hilang!**

---

## 🧪 Verification

### **Check 1: Query Table**

Di Supabase SQL Editor, run:

```sql
SELECT * FROM iot_devices;
```

**Expected result:**
```
device_id        | ip_address     | created_at              | last_seen
-----------------|----------------|------------------------|-------------------------
ESP32-BOTOL-01   | 192.168.1.14   | 2026-06-09 10:00:00    | 2026-06-09 10:00:00
```

---

### **Check 2: Test Web App**

Buka web app:
```
http://localhost:3000/iot-auth
```

Click **Refresh IP** button, harus muncul IP ESP32.

---

### **Check 3: Serial Monitor**

ESP32 harus auto-register setiap 5 menit:
```
[Loop] Re-registering device IP...
[Register] ✅ Device IP registered successfully!
```

---

## 🔍 Troubleshooting

### **Problem 1: "Column ip_address added" tapi masih error**

**Penyebab:** Supabase cache belum refresh

**Solusi:**
1. Wait 30 seconds
2. Restart Next.js server
   ```bash
   # Ctrl+C
   npm run dev
   ```
3. Reset ESP32

---

### **Problem 2: "Permission denied for table iot_devices"**

**Penyebab:** RLS policies belum di-set

**Solusi:** Run policies script di Step 8 lagi:
```sql
DROP POLICY IF EXISTS "Allow anon to upsert devices" ON iot_devices;

CREATE POLICY "Allow anon to upsert devices" ON iot_devices
  FOR ALL
  USING (auth.role() = 'anon')
  WITH CHECK (auth.role() = 'anon');
```

---

### **Problem 3: "Table doesn't exist"**

**Penyebab:** Table belum dibuat

**Solusi:** Run Step 1 di script:
```sql
CREATE TABLE IF NOT EXISTS iot_devices (
  device_id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 📊 Table Schema Explanation

### **Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `device_id` | TEXT | NO | - | Unique device identifier (PK) |
| `ip_address` | TEXT | NO | - | Current IP address |
| `created_at` | TIMESTAMPTZ | NO | NOW() | First registration time |
| `last_seen` | TIMESTAMPTZ | NO | NOW() | Last keep-alive time |

### **Indexes:**

```sql
-- Primary key index (automatic)
device_id (PRIMARY KEY)

-- Performance indexes
idx_iot_devices_last_seen (last_seen DESC)
idx_iot_devices_device_id (device_id)
```

### **Policies (RLS):**

1. **Public Read** - Anyone can read device info
2. **Service Role Upsert** - Server can insert/update
3. **Anon Upsert** - ESP32 can insert/update without auth

---

## 🎯 Why This Error Happened?

### **Scenario 1: Table Never Created**

```
1. Deploy app to Vercel
2. ESP32 try to register
3. API call Supabase
4. Table doesn't exist → ERROR
```

**Fix:** Create table with script

---

### **Scenario 2: Table Created Without Column**

```
1. Create table manually dengan GUI
2. Lupa add column ip_address
3. ESP32 try to insert
4. Column not found → ERROR
```

**Fix:** Add missing column with ALTER TABLE

---

### **Scenario 3: Typo in Column Name**

```
1. Create table dengan column "ip_addr" (typo!)
2. Code expect "ip_address"
3. Column mismatch → ERROR
```

**Fix:** Rename column atau recreate table

---

## 💡 Prevention

### **Always Use SQL Scripts:**

✅ **Good:**
```
1. Write SQL script (create-iot-devices-table.sql)
2. Run script di Supabase
3. Version control di git
4. Reproducible!
```

❌ **Bad:**
```
1. Create table manually di GUI
2. Click-click columns
3. Lupa apa yang dibuat
4. Hard to reproduce
```

---

### **Test Locally First:**

```bash
# 1. Setup Supabase locally
npx supabase start

# 2. Run migrations
npx supabase db push

# 3. Test API
curl http://localhost:54321/rest/v1/iot_devices

# 4. Deploy to production
```

---

## 📋 Quick Checklist

### **Before Running Script:**
- [ ] Logged in to Supabase Dashboard
- [ ] Correct project selected (dsdtxqpzofrvzxpyktoo)
- [ ] SQL Editor opened

### **While Running Script:**
- [ ] Script pasted correctly
- [ ] No syntax errors shown
- [ ] Click RUN button
- [ ] Wait for success message

### **After Running Script:**
- [ ] Verify table structure (4 columns)
- [ ] Check policies enabled
- [ ] Test ESP32 registration
- [ ] Check data inserted

### **Verification:**
- [ ] ESP32 Serial: ✅ Device IP registered
- [ ] Supabase: Row inserted in iot_devices
- [ ] Web app: IP auto-detected
- [ ] No errors in logs

---

## 🚀 After Fix

ESP32 akan:
- ✅ Register IP saat boot
- ✅ Update IP setiap 5 menit
- ✅ Last_seen timestamp updated
- ✅ Web app auto-detect IP

Web app akan:
- ✅ Fetch IP dari database
- ✅ Auto-update QR code URL
- ✅ No manual IP input needed

---

**Status:** ⚠️ Critical (blocking ESP32 registration)  
**Priority:** HIGH  
**Solution:** Run SQL script in Supabase  
**Time:** ~2 menit  

**Last Updated:** June 9, 2026
