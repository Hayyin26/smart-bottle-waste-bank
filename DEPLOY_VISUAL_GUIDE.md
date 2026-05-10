# 🎨 Deploy Visual Guide

Panduan visual step-by-step untuk deploy ke public!

---

## 🗺️ Overview

```
┌─────────────────────────────────────────────────────────┐
│              DEPLOYMENT FLOW                            │
└─────────────────────────────────────────────────────────┘

Local Computer                GitHub                Vercel
     │                           │                     │
     │  1. git push              │                     │
     ├──────────────────────────►│                     │
     │                           │                     │
     │                           │  2. webhook         │
     │                           ├────────────────────►│
     │                           │                     │
     │                           │  3. clone repo      │
     │                           │◄────────────────────┤
     │                           │                     │
     │                           │  4. build & deploy  │
     │                           │                     │
     │                           │  5. ✅ live!        │
     │                           │                     │
     │  6. access via URL        │                     │
     │◄──────────────────────────┴─────────────────────┤
     │                                                  │
     │  https://your-app.vercel.app                    │
     └──────────────────────────────────────────────────┘
```

---

## 📋 Step 1: Local to GitHub

```
┌─────────────────────────────────────────────────────────┐
│                  YOUR COMPUTER                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 iot-bank-sampah/                                    │
│  ├── src/                                               │
│  ├── public/                                            │
│  ├── package.json                                       │
│  ├── .env  ← NOT uploaded (in .gitignore)              │
│  └── ...                                                │
│                                                         │
│  $ git add .                                            │
│  $ git commit -m "Initial commit"                      │
│  $ git push origin main                                │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Upload via HTTPS/SSH
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    GITHUB                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📦 Repository: iot-bank-sampah                         │
│  ├── main branch                                        │
│  ├── All files (except .env)                           │
│  └── Commit history                                     │
│                                                         │
│  🔗 https://github.com/USERNAME/iot-bank-sampah        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Step 2: GitHub to Vercel

```
┌─────────────────────────────────────────────────────────┐
│                    GITHUB                               │
│  📦 iot-bank-sampah                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Import Project
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    VERCEL                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Clone repository                                    │
│     ├── Download all files                             │
│     └── Read package.json                              │
│                                                         │
│  2. Install dependencies                                │
│     $ npm install                                       │
│                                                         │
│  3. Add environment variables                           │
│     ├── NEXT_PUBLIC_SUPABASE_URL                       │
│     └── NEXT_PUBLIC_SUPABASE_ANON_KEY                  │
│                                                         │
│  4. Build project                                       │
│     $ npm run build                                     │
│     ├── Compile TypeScript                             │
│     ├── Optimize images                                │
│     ├── Generate static pages                          │
│     └── Bundle JavaScript                              │
│                                                         │
│  5. Deploy to CDN                                       │
│     ├── Upload to global servers                       │
│     ├── Configure HTTPS                                │
│     └── Setup routing                                  │
│                                                         │
│  6. ✅ LIVE!                                            │
│     🔗 https://iot-bank-sampah.vercel.app              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🌍 Global Deployment

```
┌─────────────────────────────────────────────────────────┐
│              VERCEL GLOBAL CDN                          │
└─────────────────────────────────────────────────────────┘

        🌎 Americas          🌍 Europe          🌏 Asia
           │                    │                  │
           │                    │                  │
    ┌──────▼──────┐      ┌──────▼──────┐   ┌──────▼──────┐
    │   Server    │      │   Server    │   │   Server    │
    │   USA       │      │   Germany   │   │   Singapore │
    └──────┬──────┘      └──────┬──────┘   └──────┬──────┘
           │                    │                  │
           │                    │                  │
           ▼                    ▼                  ▼
    ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
    │   User      │      │   User      │   │   User      │
    │   Brazil    │      │   France    │   │   Indonesia │
    └─────────────┘      └─────────────┘   └─────────────┘

    Fast access from anywhere! 🚀
```

---

## 📱 User Access Flow

```
┌─────────────────────────────────────────────────────────┐
│                  USER JOURNEY                           │
└─────────────────────────────────────────────────────────┘

1. User Scan QR Code
   ┌──────────┐
   │  📱 QR   │
   │  Scanner │
   └────┬─────┘
        │
        ▼
   https://iot-bank-sampah.vercel.app/iot-auth?device=ESP32

2. Open in Browser
   ┌──────────────────────────────────────┐
   │  🌐 Browser                          │
   │  ┌────────────────────────────────┐  │
   │  │ IoT Bank Sampah Digital        │  │
   │  │                                │  │
   │  │ Login / Register               │  │
   │  │                                │  │
   │  │ Email: [____________]          │  │
   │  │ Password: [____________]       │  │
   │  │                                │  │
   │  │ [Login]  [Register]            │  │
   │  └────────────────────────────────┘  │
   └──────────────────────────────────────┘

3. Redirect to Dashboard
   ┌──────────────────────────────────────┐
   │  🌐 User Dashboard                   │
   │  ┌────────────────────────────────┐  │
   │  │ Welcome, John! 👋              │  │
   │  │                                │  │
   │  │ Total Points: 150              │  │
   │  │ Transactions: 15               │  │
   │  │ Rank: #3                       │  │
   │  │                                │  │
   │  │ Recent Transactions:           │  │
   │  │ ✅ +10 pts - 2 min ago         │  │
   │  │ ✅ +10 pts - 5 min ago         │  │
   │  │                                │  │
   │  │ Leaderboard:                   │  │
   │  │ 🥇 Alice - 250 pts             │  │
   │  │ 🥈 Bob - 180 pts               │  │
   │  │ 🥉 You - 150 pts ⭐            │  │
   │  └────────────────────────────────┘  │
   └──────────────────────────────────────┘
```

---

## 🤖 ESP32 Connection Flow

```
┌─────────────────────────────────────────────────────────┐
│                  ESP32 FLOW                             │
└─────────────────────────────────────────────────────────┘

1. ESP32 Boot
   ┌──────────┐
   │  ESP32   │
   │  Device  │
   └────┬─────┘
        │
        ▼
   Connect to WiFi
   ✅ Connected!

2. Check Active Session (every 30s)
   ┌──────────┐
   │  ESP32   │
   └────┬─────┘
        │
        │ HTTP GET
        ▼
   https://iot-bank-sampah.vercel.app/api/iot/active-session?device=ESP32
        │
        ▼
   ┌──────────────────────────────────┐
   │  Vercel Server                   │
   │  ├── Query Supabase              │
   │  ├── Find active session         │
   │  └── Return user info            │
   └────────┬─────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────┐
   │  Response:                       │
   │  {                               │
   │    "user_id": "abc-123",         │
   │    "full_name": "John Doe",      │
   │    "total_points": 150           │
   │  }                               │
   └────────┬─────────────────────────┘
            │
            ▼
   ┌──────────┐
   │  ESP32   │
   │  LCD:    │
   │  HELLO!  │
   │  John    │
   └──────────┘

3. Transaction
   User inserts bottle
        │
        ▼
   ┌──────────┐
   │  ESP32   │
   │  Validate│
   └────┬─────┘
        │
        │ HTTP POST
        ▼
   https://iot-bank-sampah.vercel.app/rest/v1/transactions
        │
        ▼
   ┌──────────────────────────────────┐
   │  Supabase                        │
   │  ├── Insert transaction          │
   │  ├── Trigger: update points      │
   │  └── Broadcast real-time         │
   └────────┬─────────────────────────┘
            │
            ▼
   ┌──────────────────────────────────┐
   │  User Dashboard                  │
   │  Points: 150 → 160 ✅            │
   └──────────────────────────────────┘
```

---

## 🔄 Auto-Deploy Flow

```
┌─────────────────────────────────────────────────────────┐
│              AUTO-DEPLOY FLOW                           │
└─────────────────────────────────────────────────────────┘

Developer makes changes:
┌──────────────┐
│  Developer   │
│  Edit code   │
└──────┬───────┘
       │
       │ $ git add .
       │ $ git commit -m "Update"
       │ $ git push
       ▼
┌──────────────────────────────────┐
│  GitHub                          │
│  ├── Receive push                │
│  ├── Trigger webhook             │
│  └── Notify Vercel               │
└──────┬───────────────────────────┘
       │
       │ Webhook
       ▼
┌──────────────────────────────────┐
│  Vercel                          │
│  ├── Detect changes              │
│  ├── Clone latest code           │
│  ├── Install dependencies        │
│  ├── Build project               │
│  ├── Run tests (if any)          │
│  ├── Deploy to production        │
│  └── ✅ Live in 2-3 minutes!     │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Users                           │
│  See updated version             │
│  automatically! 🎉               │
└──────────────────────────────────┘
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION ARCHITECTURE                    │
└─────────────────────────────────────────────────────────┘

                    Internet 🌍
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ User    │    │ ESP32   │    │ Admin   │
   │ Phone   │    │ Device  │    │ Browser │
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
        │              │              │
        └──────────────┼──────────────┘
                       │
                       │ HTTPS
                       ▼
        ┌──────────────────────────────┐
        │      VERCEL CDN              │
        │  (Global Edge Network)       │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │ Static  │    │   API   │    │  SSR    │
   │ Assets  │    │ Routes  │    │ Pages   │
   └─────────┘    └────┬────┘    └─────────┘
                       │
                       │ Database Queries
                       ▼
        ┌──────────────────────────────┐
        │      SUPABASE                │
        │  ├── PostgreSQL Database     │
        │  ├── REST API                │
        │  ├── Real-time Subscriptions │
        │  └── Authentication          │
        └──────────────────────────────┘
```

---

## 💰 Cost Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                  COST ANALYSIS                          │
└─────────────────────────────────────────────────────────┘

FREE TIER LIMITS:

Vercel:
├── Projects: Unlimited ✅
├── Deployments: Unlimited ✅
├── Bandwidth: 100 GB/month
│   └── Enough for: ~10,000 users/month
├── Build Time: 6000 minutes/month
│   └── Enough for: ~200 deploys/month
└── Cost: $0/month 💰

Supabase:
├── Database: 500 MB
│   └── Enough for: ~100,000 transactions
├── API Requests: Unlimited ✅
├── Auth Users: Unlimited ✅
├── Storage: 1 GB
└── Cost: $0/month 💰

TOTAL: $0/month! 🎉

When to Upgrade:
├── Vercel Pro ($20/month):
│   └── If bandwidth > 100 GB/month
├── Supabase Pro ($25/month):
│   └── If database > 500 MB
└── Total if needed: $45/month
```

---

## ✅ Deployment Checklist Visual

```
┌─────────────────────────────────────────────────────────┐
│              DEPLOYMENT CHECKLIST                       │
└─────────────────────────────────────────────────────────┘

BEFORE DEPLOY:
[ ] ✅ Code works locally
[ ] ✅ npm run build success
[ ] ✅ .env in .gitignore
[ ] ✅ No sensitive data in code
[ ] ✅ All dependencies in package.json

GITHUB SETUP:
[ ] ✅ Repository created
[ ] ✅ Code pushed
[ ] ✅ .env not uploaded

VERCEL SETUP:
[ ] ✅ Account created
[ ] ✅ Project imported
[ ] ✅ Environment variables added
[ ] ✅ Deployment successful

POST-DEPLOY:
[ ] ✅ Website accessible
[ ] ✅ API working
[ ] ✅ Database connected
[ ] ✅ ESP32 updated
[ ] ✅ QR code generated
[ ] ✅ End-to-end test passed

MONITORING:
[ ] ✅ Check error logs
[ ] ✅ Monitor bandwidth
[ ] ✅ Check performance
[ ] ✅ User feedback

🎉 ALL DONE!
```

---

## 🎯 Success Indicators

```
┌─────────────────────────────────────────────────────────┐
│              SUCCESS METRICS                            │
└─────────────────────────────────────────────────────────┘

✅ Website Status:
   └── https://iot-bank-sampah.vercel.app
       ├── Status: 200 OK
       ├── Load Time: < 2 seconds
       └── HTTPS: Enabled

✅ API Status:
   └── /api/iot/active-session
       ├── Status: 200 OK (with user) or 404 (no user)
       ├── Response Time: < 500ms
       └── CORS: Enabled

✅ Database Status:
   └── Supabase
       ├── Connection: Active
       ├── Queries: < 100ms
       └── Real-time: Working

✅ ESP32 Status:
   └── Device
       ├── WiFi: Connected
       ├── API: Reachable
       └── LCD: Showing user

✅ User Experience:
   └── Flow
       ├── QR Scan: Working
       ├── Login: Fast
       ├── Dashboard: Loading
       └── Transaction: Recording

🎉 ALL GREEN!
```

---

**Visual Guide Complete!** 🎨
**Ready to Deploy!** 🚀
