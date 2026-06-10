# 🔧 Fix Hadoop Issues - Quick Guide

## Issues
1. ❌ Hadoop dashboard tidak ada data
2. ❌ Setelah deploy ke Vercel, Hadoop offline

---

## ✅ Fix Issue 1: Hadoop Tidak Ada Data

### Penyebab:
Hadoop HDFS masih kosong, belum ada file yang diupload.

### Solution:
Upload sample data ke Hadoop HDFS.

### Steps:

1. **Start Hadoop** (kalau belum jalan):
   ```bash
   .\start-hadoop.cmd
   ```

2. **Upload sample data**:
   ```bash
   .\upload-data-to-hadoop.cmd
   ```

3. **Verify di Hadoop Web UI**:
   - Buka: http://localhost:9870
   - Click: **Utilities** → **Browse the file system**
   - Navigate: `/user/admin/transactions`
   - Should see: `sample_transactions.csv`

4. **Verify di Web Dashboard**:
   - Buka: http://localhost:3000/hadoop
   - Should see:
     - ✅ Status: Connected
     - ✅ Files: 3 files
     - ✅ Storage: ~1KB used

---

## ✅ Fix Issue 2: Hadoop Offline di Production (Vercel)

### Penyebab:
Vercel adalah **serverless platform**, tidak bisa run Hadoop. Hadoop butuh dedicated server.

### Understanding:

```
┌─────────────────────────────────────┐
│  Vercel (Cloud - Serverless)        │
│  ✅ Next.js app                     │
│  ✅ API routes                      │
│  ❌ Hadoop (NOT SUPPORTED)          │
└─────────────────────────────────────┘
         ↓ (tries to connect)
         ✗ (fails)
         ↓
┌─────────────────────────────────────┐
│  Your Laptop (Local)                │
│  ✅ Hadoop running here             │
│  ❌ Not accessible from internet    │
└─────────────────────────────────────┘
```

### Solution A: Hide Hadoop in Production (Quick Fix)

**Done!** I already updated the code.

**What changed**:
- Hadoop menu only shows in **development mode** (localhost)
- In production (Vercel), Hadoop menu is **hidden**
- Users won't see "offline" status

**Test it**:
1. Local: `npm run dev` → Hadoop menu visible ✅
2. Production: https://smart-bottle-waste-bank.vercel.app → Hadoop menu hidden ✅

**Deploy**:
```bash
git add .
git commit -m "Hide Hadoop menu in production"
git push
```

Vercel will auto-deploy. Hadoop menu won't appear in production.

---

### Solution B: Deploy Hadoop to Cloud (Production Ready)

**When needed**: For real production with big data analytics.

**Options**:
1. **AWS EC2** (recommended) - ~$20/month
2. **Google Cloud VM** - ~$25/month
3. **DigitalOcean** - ~$15/month

**Steps** (AWS EC2):
1. Create EC2 instance (t3.medium, 4GB RAM)
2. Install Java 11 & Hadoop 3.3.6
3. Configure security group (open port 9870)
4. Get public IP (e.g., `3.15.123.45`)
5. Update environment variable:
   ```
   NEXT_PUBLIC_HADOOP_URL=http://3.15.123.45:9870
   ```

**See**: `AWS_INTEGRATION_GUIDE.md` for detailed tutorial.

**Note**: AWS Free Tier gives 12 months free!

---

## 📋 What to Do Now

### For Development/Testing:
1. ✅ Run `.\upload-data-to-hadoop.cmd`
2. ✅ Test locally: http://localhost:3000/hadoop
3. ✅ Hadoop menu visible only in dev mode

### For Production Demo:
1. ✅ Deploy current code to Vercel
2. ✅ Hadoop menu automatically hidden
3. ✅ Clean UI without "offline" errors

### For Production (Real Users):
1. 📖 Read `HADOOP_DEPLOYMENT_OPTIONS.md`
2. 🚀 Deploy Hadoop to AWS EC2
3. 🔧 Add `NEXT_PUBLIC_HADOOP_URL` to Vercel env vars
4. ✅ Hadoop accessible from anywhere

---

## 🧪 Test Checklist

### Local Development:
- [ ] Start Hadoop: `.\start-hadoop.cmd`
- [ ] Upload data: `.\upload-data-to-hadoop.cmd`
- [ ] Check Hadoop UI: http://localhost:9870
- [ ] Check Web Dashboard: http://localhost:3000/hadoop
- [ ] Verify "Connected" status
- [ ] Verify files listed (3 files)

### Production (Vercel):
- [ ] Deploy latest code
- [ ] Visit: https://smart-bottle-waste-bank.vercel.app
- [ ] Login as admin
- [ ] Verify Hadoop menu NOT visible
- [ ] Check other features work

---

## 🎯 Quick Commands

### Start Hadoop:
```bash
.\start-hadoop.cmd
```

### Upload Sample Data:
```bash
.\upload-data-to-hadoop.cmd
```

### Check Hadoop Status:
```bash
hadoop version
jps
```

### View Files in HDFS:
```bash
hadoop fs -ls -R /user/admin/
```

### Cat File Content:
```bash
hadoop fs -cat /user/admin/transactions/sample_transactions.csv
```

### Stop Hadoop:
```bash
.\stop-hadoop.cmd
```

---

## 📊 Expected Results

### After Upload Data:

**Hadoop Web UI** (http://localhost:9870):
```
Configured Capacity: ~100GB
DFS Used: ~1KB
Files: 3
Directories: 4
```

**Web Dashboard** (http://localhost:3000/hadoop):
```
Status: ✅ Connected
Storage Used: 1KB / 100GB
Files in HDFS: 3 files

Recent Files:
- /user/admin/transactions/sample_transactions.csv
- /user/admin/users/sample_users.csv
- /user/admin/devices/sample_devices.csv
```

---

## 🐛 Troubleshooting

### Problem: upload-data-to-hadoop.cmd fails

**Error**: "Hadoop not found"

**Fix**:
1. Start Hadoop first: `.\start-hadoop.cmd`
2. Wait 30 seconds for services to start
3. Run upload script again

---

### Problem: Web dashboard shows "Offline"

**Causes**:
1. Hadoop not running
2. Wrong URL in config

**Fix**:
```bash
# Check Hadoop status
jps

# Expected output:
# NameNode
# DataNode
# SecondaryNameNode

# If not running:
.\start-hadoop.cmd
```

---

### Problem: Files uploaded but not showing in dashboard

**Fix**:
1. Refresh page (Ctrl + F5)
2. Check browser console for errors
3. Verify API endpoint works:
   ```
   http://localhost:3000/api/hadoop/files
   ```

---

## 📚 Related Files

- `upload-data-to-hadoop.cmd` - Upload sample data script
- `start-hadoop.cmd` - Start Hadoop services
- `stop-hadoop.cmd` - Stop Hadoop services
- `HADOOP_DEPLOYMENT_OPTIONS.md` - Deployment guide
- `AWS_INTEGRATION_GUIDE.md` - AWS deployment tutorial
- `src/config/site.tsx` - Navigation config (Hadoop menu)

---

## ✅ Success Criteria

- [x] Hadoop running locally
- [x] Sample data uploaded to HDFS
- [x] Web dashboard shows "Connected"
- [x] Files visible in dashboard
- [x] Hadoop menu hidden in production
- [ ] (Optional) Hadoop deployed to cloud

---

**Created**: 2026-06-09
**Status**: Local development working, production hiding Hadoop menu
**Next Step**: Deploy Hadoop to AWS for production (optional)
