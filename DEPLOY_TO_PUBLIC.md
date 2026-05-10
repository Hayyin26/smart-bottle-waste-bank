# 🌐 Deploy ke Public - Step by Step

## 🎯 Tujuan:
Deploy aplikasi agar bisa diakses dari internet (tidak hanya localhost)

---

## 🚀 Option 1: Vercel (RECOMMENDED - GRATIS!)

### Keuntungan Vercel:
- ✅ **100% GRATIS** untuk project ini
- ✅ **Otomatis deploy** setiap kali push ke GitHub
- ✅ **HTTPS gratis** (SSL certificate)
- ✅ **Global CDN** (cepat di seluruh dunia)
- ✅ **Custom domain** (opsional)
- ✅ **Zero configuration** (Next.js native)

---

## 📝 Step 1: Push ke GitHub

### 1.1 Initialize Git (jika belum)
```bash
# Check apakah sudah ada git
git status

# Jika error "not a git repository", initialize:
git init
```

### 1.2 Add .gitignore
Pastikan file `.gitignore` sudah benar:
```
# .gitignore
node_modules/
.next/
.env
.env.local
.vercel
*.log
.DS_Store
```

**PENTING:** `.env` harus di-ignore agar tidak ter-upload ke GitHub!

### 1.3 Commit Code
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - IoT Bank Sampah Digital"
```

### 1.4 Create GitHub Repository

**Via GitHub Website:**
1. Buka https://github.com
2. Login (atau Sign Up jika belum punya akun)
3. Klik tombol **"+"** di kanan atas
4. Pilih **"New repository"**
5. Isi:
   - Repository name: `iot-bank-sampah`
   - Description: `IoT Bank Sampah Digital dengan QR Code System`
   - Public atau Private: **Public** (gratis)
6. **JANGAN** centang "Initialize with README"
7. Klik **"Create repository"**

### 1.5 Push ke GitHub
```bash
# Add remote (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/iot-bank-sampah.git

# Rename branch ke main
git branch -M main

# Push
git push -u origin main
```

**Jika diminta login:**
- Username: username GitHub Anda
- Password: gunakan **Personal Access Token** (bukan password biasa)

**Cara buat Personal Access Token:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Pilih scope: `repo`
5. Copy token (simpan, tidak bisa dilihat lagi!)

---

## 📝 Step 2: Deploy ke Vercel

### 2.1 Sign Up Vercel
1. Buka https://vercel.com
2. Klik **"Sign Up"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel

### 2.2 Import Project
1. Di Vercel dashboard, klik **"Add New..."**
2. Pilih **"Project"**
3. Pilih repository: `iot-bank-sampah`
4. Klik **"Import"**

### 2.3 Configure Project
```
Framework Preset: Next.js (auto-detected)
Root Directory: ./
Build Command: npm run build (auto)
Output Directory: .next (auto)
Install Command: npm install (auto)
```

### 2.4 Add Environment Variables
**PENTING!** Tambahkan environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk
```

**Cara add:**
1. Scroll ke **"Environment Variables"**
2. Klik **"Add"**
3. Name: `NEXT_PUBLIC_SUPABASE_URL`
4. Value: (paste URL Supabase Anda)
5. Klik **"Add"** lagi untuk variable kedua
6. Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Value: (paste anon key Anda)

### 2.5 Deploy!
1. Klik **"Deploy"**
2. Tunggu 2-3 menit
3. ✅ **DONE!**

### 2.6 Get Your URL
Setelah deploy selesai, Anda akan dapat URL seperti:
```
https://iot-bank-sampah.vercel.app
```

atau

```
https://iot-bank-sampah-username.vercel.app
```

**URL ini bisa diakses dari mana saja!** 🌍

---

## 📝 Step 3: Update ESP32 Code

Sekarang update ESP32 code dengan URL production:

### 3.1 Edit `iot-permanent-qr.ino`
```cpp
// Ganti dari:
const char* api_active_session = "http://192.168.1.100:3000/api/iot/active-session";

// Menjadi (ganti dengan URL Vercel Anda):
const char* api_active_session = "https://iot-bank-sampah.vercel.app/api/iot/active-session";
```

### 3.2 Upload ke ESP32
1. Buka Arduino IDE
2. Upload code yang sudah diupdate
3. Open Serial Monitor
4. Verify ESP32 bisa connect ke API production

---

## 📝 Step 4: Generate Production QR Code

### 4.1 Buka Production URL
```
https://iot-bank-sampah.vercel.app/device-qr
```

### 4.2 Generate QR
1. Device ID: `ESP32-BOTOL-01`
2. Klik "Update"
3. Download PNG
4. Print dengan kualitas tinggi (300 DPI)
5. Laminate untuk durability
6. Tempel di device IoT

---

## 📝 Step 5: Test End-to-End

### 5.1 Test dari Smartphone
```
1. Scan QR code dengan smartphone
2. Harusnya buka: https://iot-bank-sampah.vercel.app/iot-auth?device=ESP32-BOTOL-01
3. Login atau Register
4. Harusnya redirect ke: https://iot-bank-sampah.vercel.app/user
5. Lihat dashboard pribadi
```

### 5.2 Test ESP32
```
1. ESP32 harusnya detect user yang login
2. LCD: "HELLO! [User Name]"
3. Serial Monitor: "Active user found!"
```

### 5.3 Test Transaction
```
1. Masukkan botol
2. ESP32 validate dan kirim ke Supabase
3. User refresh dashboard
4. Points harusnya bertambah
```

---

## 🎉 SELESAI!

Aplikasi Anda sekarang bisa diakses dari mana saja!

### URLs:
```
Dashboard Admin:  https://iot-bank-sampah.vercel.app/dashboard
Generate QR:      https://iot-bank-sampah.vercel.app/device-qr
User Login:       https://iot-bank-sampah.vercel.app/iot-auth
User Dashboard:   https://iot-bank-sampah.vercel.app/user
```

### Share dengan User:
```
"Scan QR code di device untuk login dan mulai kumpulin poin!"
```

---

## 🔄 Auto-Deploy

Setiap kali Anda push ke GitHub, Vercel akan **otomatis deploy** versi terbaru!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel will auto-deploy! ✅
```

---

## 💰 Biaya

### Vercel Free Tier:
- ✅ Unlimited projects
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month (cukup untuk ribuan users!)
- ✅ HTTPS gratis
- ✅ Global CDN
- ✅ **$0/month**

### Supabase Free Tier:
- ✅ 500 MB database
- ✅ Unlimited API requests
- ✅ Unlimited auth users
- ✅ **$0/month**

**Total: $0/month!** 🎉

---

## 🌐 Custom Domain (Opsional)

Jika Anda punya domain sendiri (contoh: `banksampah.com`):

### 1. Beli Domain
- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Niagahoster: ~Rp 100.000/year

### 2. Add ke Vercel
1. Vercel Dashboard → Project → Settings
2. Domains → Add Domain
3. Masukkan domain Anda
4. Follow instruksi untuk update DNS

### 3. Done!
```
https://banksampah.com
```

---

## 🔐 Security Checklist

### ✅ Before Going Public:
- [ ] `.env` di-ignore (tidak ter-upload ke GitHub)
- [ ] Environment variables di-set di Vercel
- [ ] Supabase RLS policies enabled
- [ ] Database trigger installed
- [ ] Test dengan multiple users
- [ ] Monitor error logs

---

## 📊 Monitoring

### Vercel Dashboard:
- View deployment logs
- Monitor bandwidth usage
- Check error rates
- View analytics

### Supabase Dashboard:
- Monitor database size
- Check API requests
- View active users
- Monitor real-time connections

---

## 🚨 Troubleshooting

### Problem: Build Failed
```
Error: Module not found
```
**Solution:**
```bash
# Make sure all dependencies installed
npm install

# Test build locally
npm run build

# If success, push again
git push
```

### Problem: Environment Variables Not Working
**Solution:**
1. Check Vercel → Settings → Environment Variables
2. Make sure variables ada
3. Redeploy: Deployments → ... → Redeploy

### Problem: ESP32 Can't Connect
**Solution:**
```cpp
// Make sure URL correct (HTTPS, not HTTP)
const char* api_active_session = "https://iot-bank-sampah.vercel.app/api/iot/active-session";

// Check Serial Monitor for errors
```

---

## 📞 Support

### Vercel Support:
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

### Supabase Support:
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

---

## 🎯 Next Steps

1. ✅ Deploy ke Vercel
2. ✅ Update ESP32 code
3. ✅ Generate production QR
4. ✅ Test end-to-end
5. ✅ Share dengan users!

---

**Status:** Production Ready! 🚀
**Cost:** $0/month 💰
**Accessibility:** Global 🌍

---

**Last Updated:** 6 Mei 2026
