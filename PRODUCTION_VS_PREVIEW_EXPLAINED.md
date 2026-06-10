# 🚀 Production vs Preview Deployment - Penjelasan Lengkap

## ❓ Pertanyaan: Apakah Production dan Preview Sama?

**Jawaban Singkat:** ❌ **TIDAK SAMA!**

Production dan Preview adalah 2 environment berbeda dengan tujuan dan karakteristik yang berbeda.

---

## 📊 Comparison Table

| Aspek | Production | Preview |
|-------|-----------|---------|
| **URL** | Fixed (custom domain) | Random (unique per commit) |
| **Branch** | `main` atau `master` | Branch lain (PR/feature) |
| **Trigger** | Merge/push ke main | Push ke branch apapun |
| **Environment Variables** | Production env | Preview env (bisa beda) |
| **Purpose** | Live users | Testing/review |
| **Stability** | Must be stable | Can be experimental |
| **Database** | Production DB | Preview/Dev DB (optional) |
| **Lifetime** | Permanent | Temporary (sampai PR merged/closed) |
| **SEO Indexed** | Yes | No (noindex) |
| **Analytics** | Full tracking | Optional |
| **Monitoring** | Critical | Less critical |

---

## 🎯 Production Deployment

### **Karakteristik:**

```
┌─────────────────────────────────────────┐
│   PRODUCTION                            │
├─────────────────────────────────────────┤
│ URL: smart-bottle-waste-bank.vercel.app│
│      (atau custom domain)               │
│                                          │
│ Branch: main/master                     │
│ Users: Real users (public)              │
│ Database: Production Supabase           │
│ Stability: HIGH (must work!)            │
│ Testing: Already tested                 │
└─────────────────────────────────────────┘
```

### **Kapan Ter-deploy:**
```bash
# Setiap kali push/merge ke branch main
git checkout main
git add .
git commit -m "Add feature"
git push origin main  ← Trigger production deploy!
```

### **URL Pattern:**
```
https://smart-bottle-waste-bank.vercel.app
https://yourdomain.com (jika pakai custom domain)
```

### **Environment Variables:**
```
Production Environment:
✓ NEXT_PUBLIC_SUPABASE_URL=https://...
✓ SUPABASE_SERVICE_ROLE_KEY=production_key
✓ HADOOP_HOST=production-server.com
```

**Contoh Use Case:**
- ✅ User final mengakses aplikasi
- ✅ IoT device production mengirim data
- ✅ Dashboard admin production
- ✅ QR code untuk user asli

---

## 🧪 Preview Deployment

### **Karakteristik:**

```
┌─────────────────────────────────────────┐
│   PREVIEW                               │
├─────────────────────────────────────────┤
│ URL: smart-bottle-abc123-vercel.app    │
│      (unique per commit/PR)             │
│                                          │
│ Branch: feature-xyz, dev, testing       │
│ Users: Developers/testers only          │
│ Database: Dev/Staging Supabase          │
│ Stability: LOW (can break!)             │
│ Testing: For testing new features       │
└─────────────────────────────────────────┘
```

### **Kapan Ter-deploy:**
```bash
# Setiap kali push ke branch SELAIN main
git checkout feature-led-buzzer
git add .
git commit -m "Add LED feature"
git push origin feature-led-buzzer  ← Trigger preview deploy!
```

### **URL Pattern:**
```
https://smart-bottle-waste-bank-git-feature-led-abc123.vercel.app
https://smart-bottle-waste-bank-abc123.vercel.app
```

URL berubah setiap commit baru!

### **Environment Variables:**
```
Preview Environment:
✓ NEXT_PUBLIC_SUPABASE_URL=https://... (same atau dev DB)
✓ SUPABASE_SERVICE_ROLE_KEY=preview_key (bisa beda!)
✓ HADOOP_HOST=localhost atau dev-server
```

**Contoh Use Case:**
- ✅ Test fitur LED baru sebelum merge
- ✅ Show fitur ke client/dosen (demo)
- ✅ Test API changes tanpa ganggu production
- ✅ QA testing

---

## 🔄 Workflow Typical

### **Development Flow:**

```
1. LOCAL DEVELOPMENT
   ├─ Work on laptop: localhost:3000
   ├─ Test fitur baru
   └─ Commit ke feature branch
        │
        ▼
2. PREVIEW DEPLOYMENT (Automatic)
   ├─ Push feature branch ke GitHub
   ├─ Vercel auto-deploy ke preview URL
   ├─ Test di URL preview
   ├─ Share link ke team untuk review
   └─ Fix bugs jika ada
        │
        ▼
3. PULL REQUEST
   ├─ Create PR: feature → main
   ├─ Code review oleh team
   ├─ Preview URL attached to PR
   └─ Approve PR
        │
        ▼
4. PRODUCTION DEPLOYMENT (Automatic)
   ├─ Merge PR ke main
   ├─ Vercel auto-deploy ke production
   ├─ Production URL updated
   └─ Real users see new feature
```

---

## 🌍 Real Example (Your Project)

### **Scenario: Adding LED Feature**

#### **Step 1: Local Development**
```bash
# Work di laptop
git checkout -b feature-led-indicator
# Edit IOT/PBL/src/main.cpp (add LED code)
git add .
git commit -m "Add LED indicator for bottle accept/reject"
```

**Access:** `http://localhost:3000`

---

#### **Step 2: Push untuk Preview**
```bash
git push origin feature-led-indicator
```

**Vercel Action:**
```
✓ Building...
✓ Deploying to preview...
✓ Preview URL: https://smart-bottle-waste-bank-git-feature-led-abc123.vercel.app
```

**Access:** Preview URL dari Vercel dashboard

**Testing:**
- Test LED feature di preview
- Show ke dosen: "Lihat Pak, ini fitur baru LED"
- Fix bugs jika ada
- Push lagi → Preview URL updated

---

#### **Step 3: Merge ke Production**
```bash
# Create Pull Request di GitHub
# After approved, merge to main
```

**Vercel Action:**
```
✓ Building...
✓ Deploying to production...
✓ Production URL: https://smart-bottle-waste-bank.vercel.app
```

**Access:** Production URL (same as before, tapi dengan feature baru)

**Impact:**
- ✅ Real users sekarang bisa lihat LED feature
- ✅ ESP32 production bisa akses API baru
- ✅ All traffic go to updated version

---

## 🔐 Environment Variables Management

### **Setup Environment Variables:**

**Di Vercel Dashboard:**
```
Settings → Environment Variables
```

**3 Options:**

1. **Production** - Hanya untuk production deployment
2. **Preview** - Hanya untuk preview deployment
3. **Development** - Untuk local dev (vercel dev)

---

### **Example Setup:**

#### **Production Environment:**
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
SUPABASE_SERVICE_ROLE_KEY=prod_key_12345

# Hadoop
HADOOP_HOST=hadoop-prod.company.com
HADOOP_PORT=9870

# API Keys
STRIPE_SECRET_KEY=live_key
SENDGRID_API_KEY=live_key
```

#### **Preview Environment:**
```env
# Database (bisa same atau staging)
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
SUPABASE_SERVICE_ROLE_KEY=staging_key_12345

# Hadoop (dev server atau skip)
HADOOP_HOST=localhost
HADOOP_PORT=9870

# API Keys (test keys)
STRIPE_SECRET_KEY=test_key
SENDGRID_API_KEY=test_key
```

**Benefits:**
- ✅ Preview tidak ganggu production data
- ✅ Test dengan staging database
- ✅ Aman untuk experiment
- ✅ Tidak charge real payment di preview

---

## 🚨 Common Pitfalls

### **Mistake 1: Same Database for Both**

❌ **Bad:**
```
Production: uses prod_database
Preview: uses prod_database  ← BAHAYA!
```

**Problem:** Testing di preview bisa corrupt production data!

✅ **Good:**
```
Production: uses prod_database
Preview: uses staging_database  ← AMAN!
```

---

### **Mistake 2: Preview URL Public**

❌ **Bad:**
```
Share preview URL: https://...abc123.vercel.app
User bookmark → Broken setelah PR merged!
```

✅ **Good:**
```
Preview: For internal testing only
Production: Share to users
```

---

### **Mistake 3: No Testing Before Merge**

❌ **Bad:**
```
Write code → Push to main → Production broken!
```

✅ **Good:**
```
Write code → Push to feature branch → Preview deploy
→ Test on preview → Fix bugs → Merge to main
```

---

## 📱 IoT Device Consideration

### **Production IoT:**
```cpp
// ESP32 code untuk production
const char* api_endpoint = "https://smart-bottle-waste-bank.vercel.app/api/iot";
```

**Connects to:** Production database, production users

---

### **Preview IoT:**
```cpp
// ESP32 code untuk testing
const char* api_endpoint = "https://smart-bottle-waste-bank-abc123.vercel.app/api/iot";
```

**Connects to:** Staging database, test users

**Problem:** Preview URL berubah setiap commit!

**Solution:**
```cpp
// Use production for IoT, test API di preview dengan Postman
const char* api_endpoint = "https://smart-bottle-waste-bank.vercel.app/api/iot";
```

---

## 🎯 When to Use What?

### **Use Production When:**
- ✅ Fitur sudah tested & stable
- ✅ Ready untuk real users
- ✅ Production data
- ✅ IoT devices connect
- ✅ Custom domain needed

### **Use Preview When:**
- ✅ Testing new features
- ✅ Demo ke stakeholder
- ✅ PR review
- ✅ Experiment tanpa risk
- ✅ Show progress to dosen

---

## 💡 Best Practices

### **1. Never Skip Preview**
```
Always test di preview before merge to production!
```

### **2. Separate Databases**
```
Production DB ≠ Preview DB
```

### **3. Use Preview for Demos**
```
"Pak Dosen, lihat fitur baru di preview URL ini"
(Jangan show production dengan data asli user!)
```

### **4. Environment-Specific Config**
```typescript
// lib/config.ts
const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.production.com'
    : 'https://api.staging.com'
}
```

---

## 📊 Summary Comparison

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCTION                       │
│  - URL: Fixed                                       │
│  - Branch: main                                     │
│  - Users: Real                                      │
│  - Stable: Must be                                  │
│  - Database: Production                             │
│  - Purpose: Live service                            │
└─────────────────────────────────────────────────────┘
                        VS
┌─────────────────────────────────────────────────────┐
│                     PREVIEW                         │
│  - URL: Changes per commit                         │
│  - Branch: feature/dev/any                         │
│  - Users: Developers/testers                       │
│  - Stable: Can break                               │
│  - Database: Staging/dev                           │
│  - Purpose: Testing & review                       │
└─────────────────────────────────────────────────────┘
```

---

## 🔗 Useful Links

**Vercel Docs:**
- [Production vs Preview](https://vercel.com/docs/concepts/deployments/environments)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Recommendation untuk Project Anda

### **For Development:**
```
1. Work locally: localhost:3000
2. Push to feature branch
3. Test di preview URL
4. Show preview to dosen/team
5. Merge to main after approval
```

### **For Production:**
```
1. Keep main branch stable
2. Only merge tested features
3. Use production environment variables
4. Monitor production closely
```

### **For IoT Device:**
```
- Always connect to production URL
- Test API changes di preview dengan Postman
- Don't hardcode preview URLs (they change!)
```

---

**Bottom Line:**
- **Production** = Live, stable, real users
- **Preview** = Testing, temporary, developers only
- **NOT the same!**

---

**Last Updated:** June 9, 2026
