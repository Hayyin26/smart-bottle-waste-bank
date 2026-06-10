# 🔧 Quick Fix: SUPABASE_SERVICE_ROLE_KEY Missing

## ❌ Error

```
Error: Server configuration error: Missing environment variables. 
Please check SUPABASE_SERVICE_ROLE_KEY in .env.local
```

---

## ⚡ Quick Fix (3 Steps)

### 1️⃣ Get Service Role Key from Supabase

**URL:** https://supabase.com/dashboard/project/dsdtxqpzofrvzxpyktoo/settings/api

**Steps:**
1. Login to Supabase
2. Click **Project Settings** (⚙️ icon)
3. Click **API** in sidebar
4. Find **"service_role secret"** key
5. Click **Reveal** button
6. Click **Copy** to clipboard

**Key looks like:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.VERY_LONG_STRING_HERE
```

---

### 2️⃣ Update .env File

Open `.env` and replace the placeholder:

**BEFORE:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_SERVICE_ROLE_KEY_HERE
```

**AFTER:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.[PASTE_YOUR_ACTUAL_KEY_HERE]
```

**Tips:**
- Paste the FULL key (sangat panjang!)
- No spaces at start/end
- No line breaks
- Save file (Ctrl+S)

---

### 3️⃣ Restart Next.js

```bash
# Stop server (Ctrl+C in terminal)

# Start again
npm run dev
```

**Expected output (NO ERRORS):**
```
  ▲ Next.js 15.0.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.7:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

---

## ✅ Verification

### Test Web App

```
http://localhost:3000
```

Should load WITHOUT errors.

### Check Terminal

Should NOT see:
```
❌ Missing Supabase environment variables!
❌ SUPABASE_SERVICE_ROLE_KEY: Missing
```

---

## 🎯 Why This Key is Needed?

**Files yang membutuhkan:**
- `src/app/api/admin/delete-user/route.ts` - Delete user (admin)
- `src/app/api/admin/update-user/route.ts` - Update user (admin)
- `src/app/api/user/tukar-point/route.ts` - Exchange points

**Service Role Key digunakan untuk:**
- ✅ Admin operations (bypass RLS)
- ✅ Server-side API calls dengan full access
- ✅ Data manipulation yang aman

---

## ⚠️ SECURITY WARNING

**Service Role Key = ADMIN ACCESS!**

**DO NOT:**
- ❌ Commit to Git/GitHub
- ❌ Share with others
- ❌ Use in client-side code
- ❌ Expose in browser console

**File .env sudah ada di .gitignore** ✅

---

## 🐛 Troubleshooting

### Still Getting Error After Update?

**1. Check .env file location**
```
✅ Correct: ./data/Hayyin/Kuliah/Semester 6/PBL/smart/.env
❌ Wrong:   ./data/Hayyin/Kuliah/Semester 6/PBL/smart/src/.env
```

**2. Check key format**
- Must start with: `eyJ...`
- Very long (200+ characters)
- No spaces, no line breaks

**3. Restart Next.js properly**
```bash
# STOP: Ctrl+C (wait for "Gracefully stopping...")
# START: npm run dev
```

**4. Clear Next.js cache (if still error)**
```bash
rm -rf .next
npm run dev
```

---

### Key Invalid or Expired?

**Get new key from Supabase:**
1. Go to Project Settings → API
2. Copy service_role key again
3. Update .env
4. Restart

---

### .env File Not Found?

**Create it:**
```bash
# Windows Command Prompt
type nul > .env

# Then edit with VSCode
code .env
```

**Paste this:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk

# Service Role Key (Get from Supabase Dashboard)
SUPABASE_SERVICE_ROLE_KEY=[PASTE_YOUR_KEY_HERE]

# Hadoop Configuration
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

---

## 📝 Complete .env Template

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk

# ⚠️ ADMIN KEY - Server-side only!
# Get from: Supabase Dashboard → Project Settings → API → service_role
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.[YOUR_ACTUAL_KEY_HERE]

# Hadoop Configuration
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

---

## ✅ Checklist

- [ ] Login to Supabase Dashboard
- [ ] Go to Project Settings → API
- [ ] Copy service_role key
- [ ] Open .env file
- [ ] Paste key (replace placeholder)
- [ ] Save file
- [ ] Stop Next.js (Ctrl+C)
- [ ] Start Next.js (npm run dev)
- [ ] Check no errors
- [ ] Test web app works

---

## 🎉 Success!

When successful, you'll see:

**Terminal:**
```
✓ Starting...
✓ Ready in 2.3s
```

**Browser:**
```
http://localhost:3000 → Web app loads ✅
```

**No error messages about missing SUPABASE_SERVICE_ROLE_KEY!**

---

**Need more help?** See: `GET_SUPABASE_SERVICE_ROLE_KEY.md`

---

**Status:** 🔧 Get key → Update .env → Restart → ✅ Fixed!
