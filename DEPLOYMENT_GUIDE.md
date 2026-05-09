# 🚀 Deployment Guide - IoT Bank Sampah Digital

Panduan lengkap untuk deploy sistem ke production.

---

## 📋 Pre-Deployment Checklist

### ✅ Development Testing
- [ ] Semua fitur berfungsi di local
- [ ] ESP32 bisa connect ke WiFi
- [ ] Transaksi berhasil masuk database
- [ ] Points auto-update dengan trigger
- [ ] QR login berfungsi (jika digunakan)
- [ ] Dashboard menampilkan data real-time
- [ ] Tidak ada error di browser console
- [ ] Tidak ada error di Serial Monitor ESP32

### ✅ Database Setup
- [ ] Trigger `auto_update_points` sudah installed
- [ ] Table `iot_sessions` sudah dibuat (jika pakai QR)
- [ ] RLS policies sudah dikonfigurasi
- [ ] Test data sudah dibersihkan (opsional)

### ✅ Code Quality
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Environment variables sudah benar
- [ ] Sensitive data tidak di-commit ke Git

---

## 🌐 Deploy Frontend (Next.js)

### Option 1: Vercel (Recommended - Free)

#### Step 1: Push to GitHub
```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/username/iot-bank-sampah.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy ke Vercel
1. Buka https://vercel.com
2. Sign in dengan GitHub
3. Click "New Project"
4. Import repository Anda
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. Click "Deploy"

#### Step 3: Get Production URL
```
Your app will be available at:
https://your-project.vercel.app
```

### Option 2: Netlify (Alternative - Free)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Build command: npm run build
# - Publish directory: .next
```

### Option 3: Self-Hosted (VPS)

```bash
# On your VPS (Ubuntu/Debian):

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/username/iot-bank-sampah.git
cd iot-bank-sampah

# Install dependencies
npm install

# Build
npm run build

# Install PM2 (process manager)
sudo npm install -g pm2

# Start app
pm2 start npm --name "iot-bank-sampah" -- start

# Save PM2 config
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/iot-bank-sampah

# Add this config:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/iot-bank-sampah /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🗄️ Database (Supabase)

### Already Hosted!
Supabase sudah cloud-hosted, tidak perlu deploy lagi.

### Production Checklist:
```sql
-- 1. Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_update_points';

-- 2. Verify RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 3. Clean test data (optional)
DELETE FROM transactions WHERE created_at < '2026-05-01';
DELETE FROM iot_sessions WHERE expires_at < NOW();

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_device_id ON transactions(device_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_iot_sessions_expires_at ON iot_sessions(expires_at);

-- 5. Setup automatic cleanup (optional)
-- Run this daily via cron or Supabase Edge Function
DELETE FROM iot_sessions WHERE expires_at < NOW() - INTERVAL '1 day';
```

---

## 🔌 Deploy ESP32

### Step 1: Update Configuration

```cpp
// iot-improved.ino

// 1. Update WiFi credentials (production WiFi)
const char* ssid = "YOUR_PRODUCTION_WIFI";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. Keep Supabase URL (already production)
const char* supabase_url = "https://dsdtxqpzofrvzxpyktoo.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// 3. Update API endpoint (if using QR login)
const char* api_get_user = "https://your-project.vercel.app/api/iot/get-user";

// 4. Choose mode
#define USE_QR_LOGIN true  // true for production, false for testing

// 5. Update default user (if using simple mode)
const char* default_user_id = "9db3ac82-dc1c-4f28-abe2-a8482986735f";
```

### Step 2: Upload to ESP32

```bash
# 1. Open Arduino IDE
# 2. Open iot-improved.ino
# 3. Select Board: ESP32 Dev Module
# 4. Select Port: (your ESP32 port)
# 5. Click Upload (Ctrl+U)
# 6. Wait for "Done uploading"
# 7. Open Serial Monitor (115200 baud)
# 8. Verify WiFi connection
```

### Step 3: Physical Installation

```
1. Mount ESP32 in enclosure
2. Connect power supply (5V 2A minimum)
3. Position sensors correctly:
   - Height sensor: above bottle entry
   - Length sensor: side of bottle entry
4. Mount servo for gate control
5. Mount LCD for user feedback
6. Connect buzzer for audio feedback
7. Test all components
8. Secure all wiring
9. Label device with ID (ESP32-BOTOL-01)
10. Print and mount QR code (if using QR login)
```

---

## 🔐 Security Hardening

### 1. Environment Variables
```bash
# NEVER commit .env to Git!
# Add to .gitignore:
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. Supabase Security

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies (example for profiles)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Create policies for transactions
CREATE POLICY "Transactions are viewable by everyone"
ON transactions FOR SELECT
USING (true);

CREATE POLICY "Service role can insert transactions"
ON transactions FOR INSERT
WITH CHECK (true);

-- Create policies for iot_sessions
CREATE POLICY "Sessions are viewable by owner"
ON iot_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create sessions"
ON iot_sessions FOR INSERT
WITH CHECK (true);
```

### 3. API Rate Limiting

```typescript
// src/middleware.ts (create this file)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const limit = 100; // requests per minute
  const windowMs = 60 * 1000; // 1 minute

  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return NextResponse.next();
  }

  if (record.count >= limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  record.count++;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### 4. CORS Configuration

```typescript
// src/app/api/iot/get-user/route.ts
export async function GET(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Change to specific domain in production
    'Access-Control-Allow-Methods': 'GET, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // ... rest of code
  
  return NextResponse.json(data, { headers });
}
```

---

## 📊 Monitoring & Analytics

### 1. Supabase Dashboard
- Monitor database usage
- Check API requests
- View real-time connections
- Monitor storage usage

### 2. Vercel Analytics (Free)
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Error Tracking (Sentry - Optional)
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Configure in sentry.client.config.ts
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

### 4. Uptime Monitoring
- Use UptimeRobot (free): https://uptimerobot.com
- Monitor: https://your-project.vercel.app
- Alert via email/SMS if down

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🧪 Production Testing

### 1. Smoke Tests
```bash
# Test homepage
curl https://your-project.vercel.app

# Test API endpoint
curl https://your-project.vercel.app/api/iot/get-user?token=test&device=ESP32-BOTOL-01

# Test dashboard
curl https://your-project.vercel.app/dashboard
```

### 2. Load Testing (Optional)
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 https://your-project.vercel.app/
```

### 3. ESP32 Testing
```
1. Power on ESP32
2. Check Serial Monitor for WiFi connection
3. Insert test bottle
4. Verify transaction in dashboard
5. Check points updated
6. Test QR login (if enabled)
7. Verify LCD display
8. Test buzzer sounds
9. Test servo movement
10. Monitor for 24 hours
```

---

## 📱 Mobile Access

### PWA (Progressive Web App) - Optional

Add to `src/app/layout.tsx`:

```typescript
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#1e40af',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bank Sampah',
  },
};
```

Create `public/manifest.json`:

```json
{
  "name": "IoT Bank Sampah Digital",
  "short_name": "Bank Sampah",
  "description": "Sistem IoT untuk Bank Sampah Digital",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 Maintenance

### Daily Tasks
- [ ] Check dashboard for anomalies
- [ ] Monitor ESP32 uptime
- [ ] Check error logs

### Weekly Tasks
- [ ] Review transaction data
- [ ] Clean expired sessions
- [ ] Check database size
- [ ] Update leaderboard

### Monthly Tasks
- [ ] Update dependencies (`npm update`)
- [ ] Review security patches
- [ ] Backup database
- [ ] Review analytics

### Database Backup
```bash
# Supabase automatic backups (Pro plan)
# Or manual export:
# 1. Go to Supabase Dashboard
# 2. Database → Backups
# 3. Download backup

# Restore from backup:
# 1. Create new project
# 2. Run SQL from backup file
```

---

## 🚨 Rollback Plan

### If deployment fails:

#### Vercel Rollback
```bash
# Via Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"

# Via CLI:
vercel rollback
```

#### ESP32 Rollback
```bash
# 1. Open Arduino IDE
# 2. Open previous working .ino file
# 3. Upload to ESP32
```

#### Database Rollback
```sql
-- Restore from backup
-- Or manually revert changes
```

---

## 📞 Support & Troubleshooting

### Common Production Issues

#### Issue: ESP32 can't connect to production API
```cpp
// Check HTTPS vs HTTP
// Vercel uses HTTPS, ESP32 might need:
#include <WiFiClientSecure.h>
WiFiClientSecure client;
client.setInsecure(); // For testing only!
```

#### Issue: CORS errors in browser
```typescript
// Add CORS headers to API routes
headers: {
  'Access-Control-Allow-Origin': '*',
}
```

#### Issue: High database usage
```sql
-- Add indexes
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Clean old data
DELETE FROM iot_sessions WHERE expires_at < NOW() - INTERVAL '7 days';
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Database triggers working
- [ ] ESP32 connected and sending data
- [ ] QR login functional (if enabled)
- [ ] Dashboard showing real-time data
- [ ] No errors in logs
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on system

---

## 🎉 Go Live!

Congratulations! Your IoT Bank Sampah Digital is now in production! 🚀

### Share Your Project:
- Production URL: `https://your-project.vercel.app`
- QR Code: Print and distribute
- Documentation: Share with team
- Demo: Show to stakeholders

---

**Last Updated:** 6 Mei 2026  
**Version:** 1.0  
**Status:** Ready for Production ✅
