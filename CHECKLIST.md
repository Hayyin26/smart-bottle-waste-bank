# ✅ Setup Checklist - IoT QR System

## 📋 Pre-requisites

- [x] Supabase project sudah dibuat
- [x] Database schema sudah ada (profiles, iot_devices, transactions)
- [x] Environment variables sudah dikonfigurasi (.env)
- [x] Node.js dan npm terinstall

## 🗄️ Database Setup

### 1. SQL Functions (WAJIB)
- [ ] Buka Supabase Dashboard
- [ ] Klik SQL Editor → New Query
- [ ] Copy isi file `supabase-functions.sql`
- [ ] Paste dan Run
- [ ] Verify: Function `increment_user_points` sudah dibuat

### 2. Test Data (Opsional)
- [ ] Buka SQL Editor
- [ ] Copy isi file `test-data.sql`
- [ ] **PENTING**: Ganti UUID dengan ID real dari auth.users
- [ ] Paste dan Run
- [ ] Verify: Data muncul di Table Editor

### 3. RLS Policies
- [ ] Check RLS enabled untuk semua tabel
- [ ] Verify policies untuk public access
- [ ] Test insert/select dari aplikasi

## 🚀 Application Setup

### 1. Install Dependencies
```bash
- [ ] npm install
```

### 2. Environment Variables
```bash
- [x] File .env sudah ada
- [x] NEXT_PUBLIC_SUPABASE_URL configured
- [x] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY configured
- [ ] Restart development server
```

### 3. Start Development Server
```bash
- [ ] npm run dev
- [ ] Buka http://localhost:3000/dashboard
- [ ] Verify: Dashboard loading tanpa error
```

## 🧪 Testing

### 1. Dashboard
- [ ] Buka `/dashboard`
- [ ] Verify: Stats cards menampilkan data
- [ ] Verify: Transaction list muncul
- [ ] Verify: Device status muncul
- [ ] Verify: Leaderboard muncul

### 2. History Page
- [ ] Buka `/history`
- [ ] Verify: Transaction history muncul
- [ ] Verify: Stats cards correct

### 3. QR Generator
- [ ] Buka `/qr-generator`
- [ ] Verify: User list muncul
- [ ] Select user
- [ ] Verify: QR code generated
- [ ] Download QR code
- [ ] Verify: File downloaded successfully

### 4. Real-time Updates
- [ ] Buka dashboard di browser
- [ ] Buka Supabase SQL Editor di tab lain
- [ ] Insert transaction baru:
```sql
INSERT INTO transactions (user_id, device_id, points_earned) VALUES
  ('your-user-uuid', 'device-001', 10);
```
- [ ] Verify: Dashboard auto-update tanpa refresh
- [ ] Verify: Points user bertambah

## 📱 IoT Device Integration

### 1. Register Device
```sql
- [ ] INSERT INTO iot_devices (device_id, location, is_active) VALUES
      ('your-device-id', 'Your Location', true);
```

### 2. Test API Endpoint
```bash
- [ ] Test dengan curl atau Postman:
curl -X POST https://dsdtxqpzofrvzxpyktoo.supabase.co/rest/v1/transactions \
  -H "apikey: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"uuid","device_id":"device-001","points_earned":10}'
```

### 3. Program IoT Device
- [ ] Copy example code dari IOT_INTEGRATION.md
- [ ] Sesuaikan dengan device Anda (ESP32/Arduino/Raspberry Pi)
- [ ] Upload code ke device
- [ ] Test scan QR code
- [ ] Verify: Transaction tercatat di dashboard

## 🔐 Security

### 1. Environment Variables
- [x] .env di .gitignore
- [ ] Credentials tidak ter-commit ke git
- [ ] Service role key tidak digunakan di client

### 2. RLS Policies
- [ ] Review policies di Supabase
- [ ] Sesuaikan dengan kebutuhan keamanan
- [ ] Test access control

### 3. API Keys
- [ ] Gunakan anon key untuk IoT devices
- [ ] Implement rate limiting (optional)
- [ ] Monitor API usage di Supabase

## 📊 Monitoring

### 1. Supabase Dashboard
- [ ] Monitor API usage
- [ ] Check error logs
- [ ] Review database performance

### 2. Application Logs
- [ ] Check browser console untuk errors
- [ ] Monitor WebSocket connection
- [ ] Review network requests

## 🎯 Production Checklist

### 1. Before Deploy
- [ ] Test semua fitur
- [ ] Verify real-time updates
- [ ] Check mobile responsiveness
- [ ] Test dengan multiple users
- [ ] Verify QR codes working

### 2. Deployment
- [ ] Build production: `npm run build`
- [ ] Test production build locally
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Configure environment variables di hosting
- [ ] Test deployed application

### 3. Post-Deploy
- [ ] Verify all features working
- [ ] Test real-time updates
- [ ] Monitor error logs
- [ ] Setup monitoring/analytics

## 📚 Documentation Review

- [ ] Read `README_IOT.md`
- [ ] Read `IOT_INTEGRATION.md`
- [ ] Read `QUICK_START.md`
- [ ] Understand database schema
- [ ] Review API services

## 🐛 Troubleshooting

### Common Issues Checklist

#### Data tidak muncul
- [ ] Check browser console untuk errors
- [ ] Verify environment variables
- [ ] Check Supabase connection
- [ ] Verify RLS policies
- [ ] Restart development server

#### Real-time tidak bekerja
- [ ] Enable Realtime di Supabase settings
- [ ] Check WebSocket connection di Network tab
- [ ] Verify subscription code
- [ ] Check browser console untuk errors

#### Points tidak update
- [ ] Verify function `increment_user_points` exists
- [ ] Check Supabase logs
- [ ] Test manual update di SQL Editor
- [ ] Verify user_id valid

#### QR Code tidak generate
- [ ] Check user list loading
- [ ] Verify QR API accessible
- [ ] Check browser console
- [ ] Test with different user

## ✅ Final Verification

### All Systems Go
- [ ] Dashboard working ✅
- [ ] History working ✅
- [ ] QR Generator working ✅
- [ ] Real-time updates working ✅
- [ ] IoT device can send transactions ✅
- [ ] Points system working ✅
- [ ] Leaderboard working ✅
- [ ] Device monitoring working ✅

## 🎉 Ready for Production!

Jika semua checklist di atas sudah ✅, aplikasi Anda siap untuk production!

---

**Need Help?**
- Check `IOT_INTEGRATION.md` untuk troubleshooting
- Review Supabase logs untuk errors
- Check browser console untuk client-side errors
