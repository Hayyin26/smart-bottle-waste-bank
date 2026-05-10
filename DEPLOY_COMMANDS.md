# 🚀 Deploy Commands - Quick Reference

Copy-paste commands untuk deploy ke public!

---

## 📋 Prerequisites

```bash
# Check Node.js version (harus 18+)
node --version

# Check npm version
npm --version

# Check git installed
git --version
```

---

## 🔧 Step 1: Prepare Code

```bash
# Make sure di root folder project
cd /path/to/iot-bank-sampah

# Install dependencies (jika belum)
npm install

# Test build locally
npm run build

# Jika success, lanjut!
```

---

## 📦 Step 2: Git Setup

```bash
# Initialize git (jika belum)
git init

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit - IoT Bank Sampah Digital"

# Check branch name
git branch

# Rename to main (jika masih master)
git branch -M main
```

---

## 🌐 Step 3: Push to GitHub

### Create Repository di GitHub:
1. Buka: https://github.com/new
2. Repository name: `iot-bank-sampah`
3. Public
4. Create repository

### Push Code:
```bash
# Add remote (GANTI USERNAME!)
git remote add origin https://github.com/USERNAME/iot-bank-sampah.git

# Verify remote
git remote -v

# Push
git push -u origin main
```

### Jika Diminta Login:
```bash
# Username: your-github-username
# Password: your-personal-access-token (bukan password!)
```

### Create Personal Access Token:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Note: `Vercel Deploy`
5. Expiration: 90 days
6. Select scopes: ✅ repo
7. Generate token
8. **COPY TOKEN** (tidak bisa dilihat lagi!)

---

## ☁️ Step 4: Deploy to Vercel

### Via Vercel Website (Easiest):

1. **Sign Up:**
   ```
   https://vercel.com/signup
   ```
   - Continue with GitHub
   - Authorize Vercel

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select `iot-bank-sampah`
   - Click "Import"

3. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Done!

### Via Vercel CLI (Alternative):

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? (your account)
# Link to existing project? N
# Project name? iot-bank-sampah
# Directory? ./
# Override settings? N

# Deploy to production
vercel --prod
```

---

## 🔗 Step 5: Get Your URL

After deployment, you'll get:
```
https://iot-bank-sampah.vercel.app
```

Or:
```
https://iot-bank-sampah-username.vercel.app
```

**Test it:**
```bash
# Open in browser
https://your-url.vercel.app

# Test API
curl https://your-url.vercel.app/api/iot/active-session?device=ESP32-BOTOL-01
```

---

## 🤖 Step 6: Update ESP32

### Edit `iot-permanent-qr.ino`:
```cpp
// OLD (localhost):
const char* api_active_session = "http://192.168.1.100:3000/api/iot/active-session";

// NEW (production):
const char* api_active_session = "https://iot-bank-sampah.vercel.app/api/iot/active-session";
```

### Upload to ESP32:
```bash
# 1. Open Arduino IDE
# 2. Open iot-permanent-qr.ino
# 3. Update api_active_session URL
# 4. Click Upload (Ctrl+U)
# 5. Open Serial Monitor (Ctrl+Shift+M)
# 6. Verify connection
```

---

## 📱 Step 7: Generate Production QR

```bash
# Open in browser:
https://your-url.vercel.app/device-qr

# Steps:
# 1. Device ID: ESP32-BOTOL-01
# 2. Click "Update"
# 3. Download PNG
# 4. Print (300 DPI recommended)
# 5. Laminate
# 6. Mount on device
```

---

## 🧪 Step 8: Test Everything

### Test 1: Web Access
```bash
# Dashboard
https://your-url.vercel.app/dashboard

# Device QR
https://your-url.vercel.app/device-qr

# User Login
https://your-url.vercel.app/iot-auth?device=ESP32-BOTOL-01
```

### Test 2: User Flow
```
1. Scan QR with smartphone
2. Login/Register
3. Check dashboard
4. Insert bottle
5. Check points updated
```

### Test 3: ESP32
```
1. Open Serial Monitor
2. Check: "WiFi Connected"
3. Check: "Checking active session..."
4. After user login: "Active user found!"
5. LCD: "HELLO! [User Name]"
```

---

## 🔄 Update & Redeploy

### Make Changes:
```bash
# Edit files
# ...

# Commit
git add .
git commit -m "Update feature X"

# Push
git push

# Vercel will auto-deploy! ✅
```

### Manual Redeploy:
```bash
# Via CLI
vercel --prod

# Via Website
# Vercel Dashboard → Deployments → ... → Redeploy
```

---

## 🔍 Check Deployment Status

### Via Website:
```
1. Vercel Dashboard
2. Select project
3. Deployments tab
4. See status: Building / Ready / Error
```

### Via CLI:
```bash
# List deployments
vercel ls

# Check logs
vercel logs
```

---

## 🐛 Troubleshooting Commands

### Build Failed:
```bash
# Test build locally
npm run build

# Check errors
npm run build 2>&1 | tee build.log

# Fix errors, then push again
git add .
git commit -m "Fix build errors"
git push
```

### Environment Variables:
```bash
# Via CLI
vercel env ls

# Add variable
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Remove variable
vercel env rm NEXT_PUBLIC_SUPABASE_URL
```

### Clear Cache:
```bash
# Remove .next folder
rm -rf .next

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

---

## 📊 Monitoring Commands

### Check Bandwidth:
```bash
# Vercel Dashboard → Analytics
```

### Check Logs:
```bash
# Via CLI
vercel logs

# Via Website
# Vercel Dashboard → Deployments → [deployment] → Logs
```

### Check Performance:
```bash
# Via Website
# Vercel Dashboard → Analytics → Performance
```

---

## 🔐 Security Commands

### Check .gitignore:
```bash
# View .gitignore
cat .gitignore

# Should include:
# .env
# .env.local
# node_modules/
# .next/
```

### Verify .env not in Git:
```bash
# Check if .env is tracked
git ls-files | grep .env

# Should return nothing!
# If it returns .env, remove it:
git rm --cached .env
git commit -m "Remove .env from git"
git push
```

---

## 💡 Useful Commands

### Check Vercel Version:
```bash
vercel --version
```

### Get Project Info:
```bash
vercel inspect
```

### Open Project in Browser:
```bash
vercel open
```

### Get Domain Info:
```bash
vercel domains ls
```

### Add Custom Domain:
```bash
vercel domains add yourdomain.com
```

---

## 📞 Get Help

### Vercel Help:
```bash
vercel help
vercel help deploy
```

### Check Status:
```
https://www.vercel-status.com
```

---

## ✅ Deployment Checklist

```bash
# Before Deploy:
[ ] npm run build works locally
[ ] .env in .gitignore
[ ] All dependencies in package.json
[ ] No console errors

# During Deploy:
[ ] GitHub repository created
[ ] Code pushed to GitHub
[ ] Vercel project created
[ ] Environment variables added
[ ] Deployment successful

# After Deploy:
[ ] Website accessible
[ ] API endpoints working
[ ] ESP32 updated with production URL
[ ] QR code generated and printed
[ ] End-to-end test passed
```

---

## 🎉 Success!

Your app is now live at:
```
https://your-project.vercel.app
```

Share with the world! 🌍

---

**Quick Deploy:** `git push` → Auto-deploy! ✅
**Cost:** $0/month 💰
**Speed:** Global CDN 🚀
