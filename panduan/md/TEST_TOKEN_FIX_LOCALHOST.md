# 🧪 Testing Token Fix di Localhost

## ✅ Perubahan yang Sudah Dilakukan

File `src/app/(user)/iot-auth/page.tsx` sudah diupdate:
```typescript
// BEFORE: 60 menit (1 jam) ❌
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()

// AFTER: 30 hari ✅
expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
```

---

## 🚀 Cara Testing

### **Step 1: Start Dev Server**

Buka terminal dan jalankan:

```bash
npm run dev
```

Dev server akan berjalan di `http://localhost:3000`

---

### **Step 2: Test Login & Check Token**

#### **A. Login Baru**
1. Buka browser: `http://localhost:3000/iot-auth`
2. Login dengan akun user
3. Setelah success, buka **Supabase Dashboard**

#### **B. Check Database**
Buka Supabase SQL Editor dan jalankan:

```sql
-- Lihat session yang baru dibuat
SELECT 
  session_token,
  user_id,
  device_id,
  expires_at,
  created_at,
  -- Hitung sisa waktu
  expires_at - NOW() as time_remaining,
  -- Hitung total durasi
  expires_at - created_at as total_duration
FROM iot_sessions
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
time_remaining: ~30 days (720 hours)
total_duration: ~30 days
```

---

### **Step 3: Test QR Scan (Optional)**

Kalau mau test dengan ESP32:

1. **Copy session token** dari database
2. **Send ke ESP32** via Serial Monitor:
   ```
   TOKEN:your_token_here
   ```
3. **Verify** ESP32 bisa dapat user info

---

## 🔍 Verification Checklist

### **✅ Token Expiry:**
- [ ] Login di web → Token dibuat
- [ ] Check database → `expires_at` = ~30 hari dari sekarang ✅
- [ ] Tunggu 2 jam → Token masih valid ✅
- [ ] Scan QR → Masih bisa login ✅

### **❌ Old Sessions (Kalau Ada):**
Session lama yang dibuat sebelum fix masih punya expiry 1 jam.

**Solution:** Hapus session lama:
```sql
-- Hapus semua session lama
DELETE FROM iot_sessions
WHERE expires_at < NOW() + INTERVAL '1 day';

-- Atau update expiry session lama
UPDATE iot_sessions
SET expires_at = NOW() + INTERVAL '30 days';
```

---

## 📊 Comparison Test

### **Test Scenario: Session Longevity**

| Action | Old (1 hour) | New (30 days) |
|--------|-------------|---------------|
| Login | Token created | Token created |
| +30 min | ✅ Valid | ✅ Valid |
| +1 hour | ❌ **EXPIRED** | ✅ Valid |
| +2 hours | ❌ Expired | ✅ Valid |
| +1 day | ❌ Expired | ✅ Valid |
| +7 days | ❌ Expired | ✅ Valid |
| +30 days | ❌ Expired | ❌ Expired |

---

## 🐛 Troubleshooting

### **Problem 1: Masih Expired Setelah 1 Jam**

**Cause:** Browser cache atau old session

**Solution:**
```bash
# 1. Clear browser cache
# 2. Logout
# 3. Delete old session dari database:
DELETE FROM iot_sessions WHERE user_id = 'YOUR_USER_ID';

# 4. Login ulang
# 5. Check expires_at di database
```

---

### **Problem 2: Token Tidak Tersimpan**

**Cause:** Service role key tidak di-set

**Check `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  ← CHECK THIS!
```

**Test:**
```bash
# Check environment variables
echo $env:SUPABASE_SERVICE_ROLE_KEY  # PowerShell
# atau
printenv | grep SUPABASE  # Bash
```

---

### **Problem 3: QR Scan Masih Error**

**Cause:** Old token masih digunakan

**Solution:**
1. Generate token baru (login ulang)
2. Atau update token di database:
   ```sql
   UPDATE iot_sessions
   SET expires_at = NOW() + INTERVAL '30 days'
   WHERE session_token = 'YOUR_OLD_TOKEN';
   ```

---

## 🎯 Quick Test Script

Copy-paste di Supabase SQL Editor:

```sql
-- 1. Check current sessions
SELECT 
  user_id,
  device_id,
  CASE 
    WHEN expires_at > NOW() THEN '✅ VALID'
    ELSE '❌ EXPIRED'
  END as status,
  expires_at - NOW() as time_remaining,
  expires_at - created_at as total_duration
FROM iot_sessions
ORDER BY created_at DESC;

-- 2. Clean expired sessions
DELETE FROM iot_sessions
WHERE expires_at < NOW();

-- 3. Extend all sessions to 30 days (for testing)
UPDATE iot_sessions
SET expires_at = NOW() + INTERVAL '30 days'
WHERE expires_at < NOW() + INTERVAL '7 days';

-- 4. Verify
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE expires_at > NOW()) as valid_sessions,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_sessions
FROM iot_sessions;
```

---

## 📝 Test Results Log

Fill this after testing:

```
Test Date: ___________
Dev Server: http://localhost:3000

Test 1: Login & Token Creation
- [ ] Token created successfully
- [ ] expires_at = ~30 days from now
- [ ] Token in database ✅

Test 2: Token Persistence
- [ ] Close browser
- [ ] Open again after 2 hours
- [ ] Token still valid ✅

Test 3: QR Scan
- [ ] QR generated with token
- [ ] ESP32 received token
- [ ] ESP32 validated token ✅
- [ ] User info displayed on LCD ✅

Test 4: Database Cleanup
- [ ] Old expired sessions deleted
- [ ] Active sessions = valid sessions

RESULT: ✅ PASS / ❌ FAIL
Notes: ________________________
```

---

## 🚀 Next Steps

### **After Local Testing:**

1. **✅ Verify** semua test pass
2. **Commit** changes:
   ```bash
   git add .
   git commit -m "fix: extend IoT session expiry to 30 days"
   ```
3. **Push** to repository:
   ```bash
   git push origin main
   ```
4. **Deploy** to Vercel (auto-deploy atau manual)
5. **Test** di production

---

## 💡 Pro Tips

### **Development:**
- **30 hari** → Tidak perlu khawatir expired saat testing

### **Production:**
Consider security trade-offs:
- **24 jam** → Balance antara UX dan security
- **7 hari** → Lebih convenient untuk user
- **30 hari** → Maximum convenience (current setting)

---

**Status:** ✅ Code updated, ready for testing  
**Next:** Start dev server dan test login  
**Last Updated:** June 9, 2026
