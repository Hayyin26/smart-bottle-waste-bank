# 🔧 Fix: Token Expired saat Scan QR

## 🔍 Masalah

Token expired saat user scan QR code untuk login ke IoT device.

**Error message:**
```
Session not found or expired
Session expired
```

---

## 🎯 Penyebab

### **1. Expiry Time Terlalu Pendek**
Token hanya berlaku **60 menit (1 jam)**:

```typescript
// BEFORE (terlalu pendek!)
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes
```

**Scenario:**
1. User login di web → token dibuat (expires 1 jam)
2. User tutup halaman
3. 2 jam kemudian → User buka lagi → **TOKEN EXPIRED!**
4. Scan QR → Error!

---

### **2. QR Code Static**
QR code tidak berubah, tapi token di database sudah expired.

---

### **3. Auto-Delete Expired Sessions**
Database otomatis hapus session yang sudah expired (di `create-iot-sessions-table.sql`).

---

## ✅ Solusi

### **SUDAH DIPERBAIKI! ✅**

Token sekarang berlaku **30 hari** (jauh lebih lama):

```typescript
// AFTER (sudah diperbaiki!)
expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
```

---

## 📊 Perbandingan Expiry Time

| Duration | Milliseconds | Use Case |
|----------|-------------|----------|
| **1 jam** | `60 * 60 * 1000` | ❌ Terlalu pendek (expired cepat) |
| **24 jam** | `24 * 60 * 60 * 1000` | ✅ Bagus untuk production |
| **7 hari** | `7 * 24 * 60 * 60 * 1000` | ✅ Lebih nyaman |
| **30 hari** | `30 * 24 * 60 * 60 * 1000` | ✅ Recommended untuk testing |

**Current setting:** ✅ **30 hari**

---

## 🔄 Cara Update

### **Option 1: Edit di Kode (SUDAH DILAKUKAN ✅)**

File: `src/app/(user)/iot-auth/page.tsx`

```typescript
expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
```

### **Option 2: Update Manual di Database**

Kalau ada token yang sudah expired, bisa diperpanjang manual:

```sql
-- Update session yang hampir expired
UPDATE iot_sessions
SET expires_at = NOW() + INTERVAL '30 days'
WHERE user_id = 'YOUR_USER_ID';

-- Atau update semua session
UPDATE iot_sessions
SET expires_at = NOW() + INTERVAL '30 days'
WHERE expires_at < NOW() + INTERVAL '1 day';
```

---

## 🛠️ Testing

### **1. Test Login Baru**
```bash
# 1. Login di web app
# 2. Check database
SELECT session_token, expires_at, 
       expires_at - NOW() as "time_remaining"
FROM iot_sessions
WHERE user_id = 'YOUR_USER_ID';

# Expected: time_remaining = ~30 days
```

### **2. Test Scan QR**
```bash
# 1. Login di web
# 2. Tunggu 1 jam
# 3. Scan QR → Seharusnya MASIH BISA ✅
```

### **3. Test Expired Session**
```sql
-- Force expire session (for testing)
UPDATE iot_sessions
SET expires_at = NOW() - INTERVAL '1 hour'
WHERE user_id = 'YOUR_USER_ID';

-- Try scan QR → Should get "Session expired" error ✅
```

---

## 🔐 Keamanan

### **Trade-off:**
- **Expiry Pendek (1 jam):** ✅ Lebih aman, ❌ UX buruk (sering expired)
- **Expiry Panjang (30 hari):** ✅ UX bagus, ⚠️ Sedikit kurang aman

### **Rekomendasi:**

**Development/Testing:**
- **30 hari** → Fokus ke fitur, tidak terganggu expired

**Production:**
- **24 jam** atau **7 hari** → Balance antara UX dan security

---

## 🎯 Best Practices

### **1. Session Management**
```typescript
// Auto-delete expired sessions
CREATE OR REPLACE FUNCTION delete_expired_iot_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.iot_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

### **2. Refresh Token (Optional - Advanced)**
Kalau mau lebih advanced, bisa implement refresh token:

```typescript
// Extend session saat user masih aktif
async function refreshSession(sessionToken: string) {
  await supabase
    .from('iot_sessions')
    .update({
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('session_token', sessionToken);
}
```

### **3. Multiple Active Sessions**
User bisa punya multiple session untuk different devices (sudah support di schema).

---

## 📋 Checklist

### **Sudah Fixed:**
- [x] Expiry time diperpanjang ke 30 hari
- [x] File `iot-auth/page.tsx` updated
- [x] Deploy ke production
- [x] Test login baru

### **Testing:**
- [ ] Login di web app
- [ ] Tunggu 2 jam
- [ ] Scan QR code
- [ ] Verify masih bisa login ✅

---

## 🚨 Troubleshooting

### **Problem: Masih expired padahal sudah update kode**

**Solution:**
1. Clear browser cache
2. Logout dan login ulang (generate token baru)
3. Check database:
   ```sql
   SELECT * FROM iot_sessions
   WHERE user_id = 'YOUR_USER_ID'
   ORDER BY created_at DESC;
   ```

### **Problem: QR scan tapi redirect ke error page**

**Solution:**
1. Check ESP32 IP address di QR
2. Pastikan ESP32 dan HP di network yang sama
3. Test manual: buka `http://ESP32_IP/set-token?token=XXX`

### **Problem: Session tidak tersimpan di database**

**Solution:**
1. Check `SUPABASE_SERVICE_ROLE_KEY` di Vercel environment variables
2. Check RLS policy di Supabase:
   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'iot_sessions';
   ```

---

## 📝 Catatan

### **Current Settings:**
- **Expiry:** 30 hari (720 jam)
- **Auto-delete:** Ya (via cron job - optional)
- **Multiple sessions:** Ya (per device)

### **Kalau Mau Ubah Lagi:**
Edit file `src/app/(user)/iot-auth/page.tsx` baris ~173:

```typescript
// 1 hour
expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()

// 24 hours (1 day)
expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

// 7 days
expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

// 30 days (current)
expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

// 1 year (extreme - not recommended)
expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
```

---

**Status:** ✅ **FIXED - Token sekarang berlaku 30 hari**  
**Last Updated:** June 9, 2026
