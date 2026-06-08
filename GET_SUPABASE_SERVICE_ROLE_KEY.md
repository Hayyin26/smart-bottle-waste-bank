# 🔑 Cara Mendapatkan Supabase Service Role Key

## ❌ Error yang Muncul

```
Error: Server configuration error: Missing environment variables. 
Please check SUPABASE_SERVICE_ROLE_KEY in .env.local
```

---

## 🎯 Solusi Cepat

### Step 1: Buka Supabase Dashboard

1. Login ke: https://supabase.com/dashboard
2. Pilih project Anda: **dsdtxqpzofrvzxpyktoo**

### Step 2: Get Service Role Key

1. Klik **Project Settings** (icon ⚙️ di sidebar kiri bawah)
2. Klik **API** di menu Settings
3. Scroll ke section **Project API keys**
4. Cari key dengan label: **`service_role`** (secret)
5. Klik **Reveal** atau **Copy** untuk melihat key
6. Copy full key (sangat panjang, dimulai dengan `eyJ...`)

### Step 3: Update .env File

Buka file `.env` dan ganti placeholder:

```env
# BEFORE (placeholder):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_SERVICE_ROLE_KEY_HERE

# AFTER (paste your actual key):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.[REST_OF_YOUR_ACTUAL_KEY]
```

### Step 4: Restart Next.js

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 📸 Visual Guide

### Supabase Dashboard → Project Settings → API

```
┌─────────────────────────────────────────────────────────┐
│  Project Settings                                       │
├─────────────────────────────────────────────────────────┤
│  General                                                │
│  Database                                               │
│  API          ← CLICK HERE                             │
│  Authentication                                         │
│  Storage                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Project API keys                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  anon public                                     │  │
│  │  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        │  │
│  │  [Copy] [Reveal]                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  service_role secret  ← THIS ONE!                │  │
│  │  ••••••••••••••••••••••••••••••••••••••          │  │
│  │  [Copy] [Reveal]  ← CLICK REVEAL                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ SECURITY WARNING

### 🔴 Service Role Key adalah ADMIN KEY!

**Jangan PERNAH:**
- ❌ Commit ke Git/GitHub
- ❌ Share ke orang lain
- ❌ Gunakan di client-side code
- ❌ Expose di browser

**Hanya untuk:**
- ✅ Server-side API routes (`/api/*`)
- ✅ File `.env` (local development)
- ✅ Environment variables (production)

---

## 🔐 .gitignore Check

Pastikan `.env` sudah ada di `.gitignore`:

```gitignore
# .gitignore
.env
.env.local
.env*.local
```

Verify:
```bash
cat .gitignore | grep .env
```

Expected output:
```
.env
.env.local
.env*.local
```

---

## 📝 Complete .env Example

Your `.env` file should look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk

# Service Role Key (ADMIN - Server-side only!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.[YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE]

# Hadoop Configuration
HADOOP_HOST=localhost
HADOOP_PORT=9870
HADOOP_WEBHDFS_PORT=9870
HADOOP_USER=hadoop
HADOOP_PROTOCOL=http
```

---

## ✅ Verification

### Test 1: Check Environment Variable

Create test file: `test-env.js`

```javascript
// test-env.js
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
```

Run:
```bash
node -r dotenv/config test-env.js
```

Expected:
```
SUPABASE_SERVICE_ROLE_KEY: ✅ Set
```

### Test 2: Start Next.js

```bash
npm run dev
```

Expected output (NO ERRORS):
```
  ▲ Next.js 15.0.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.7:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

### Test 3: Access Web App

```
http://localhost:3000
```

Should load without errors.

---

## 🐛 Troubleshooting

### ❌ Still getting "Missing environment variables"

**Solutions:**

1. **Restart Next.js**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

2. **Check .env file location**
   - File harus di root project (sama level dengan `package.json`)
   - File name: `.env` (dengan titik di depan)

3. **Check key format**
   - Key harus dimulai dengan `eyJ...`
   - No spaces, no line breaks
   - Copy full key dari Supabase

4. **Clear Next.js cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

### ❌ "Invalid JWT"

- Key salah atau expired
- Copy lagi dari Supabase Dashboard
- Pastikan copy full key (sangat panjang)

### ❌ ".env file not found"

Check file exists:
```bash
# Windows
dir .env

# Expected output:
# .env
```

If not found, create it:
```bash
# Windows
type nul > .env

# Then edit with VSCode
code .env
```

---

## 🎯 Quick Reference

**Get Service Role Key:**
1. https://supabase.com/dashboard
2. Project Settings → API
3. Copy `service_role` key
4. Paste to `.env` → `SUPABASE_SERVICE_ROLE_KEY=...`
5. Restart Next.js

**Format:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI4NTE4MCwiZXhwIjoyMDkyODYxMTgwfQ.FULL_KEY_HERE
```

---

## 📚 Related Documentation

- **Supabase API Docs:** https://supabase.com/docs/guides/api
- **Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Next.js API Routes:** https://nextjs.org/docs/api-routes/introduction

---

**Status:** 🔧 Fix `.env` → Restart Next.js → ✅ Ready!
