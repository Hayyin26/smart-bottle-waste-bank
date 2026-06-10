# 🚀 Hadoop Deployment Options

## Problem
Setelah deploy ke Vercel, Hadoop menunjukkan status "offline" karena Vercel deployment **tidak include Hadoop**.

**Why?**
- Hadoop butuh Java runtime dan system resources besar
- Vercel adalah serverless platform (tidak support Hadoop)
- Hadoop harus jalan di dedicated server

---

## 📊 Current Architecture

```
┌────────────────────────────────────────────────────┐
│  Production (Vercel)                               │
│  ✅ Next.js App: smart-bottle-waste-bank.vercel.app│
│  ✅ API Routes                                     │
│  ✅ User Interface                                 │
│  ❌ Hadoop: NOT AVAILABLE                          │
└────────────────────────────────────────────────────┘
         ↓
         ↓ (tries to connect)
         ↓
         ✗ (connection refused)
         ↓
┌────────────────────────────────────────────────────┐
│  Local Machine (Your Laptop)                       │
│  ✅ Hadoop HDFS                                    │
│  ✅ NameNode: http://localhost:9870                │
│  ❌ Not accessible from internet                   │
└────────────────────────────────────────────────────┘
```

**Result**: Vercel app cannot connect to Hadoop → Status: OFFLINE

---

## ✅ Solution Options

### Option 1: Local Development Only (Recommended for Testing)

**When to use**: Development, testing, presentation

**Setup**:
- Hadoop runs on local machine
- Web app runs on `http://localhost:3000`
- Both can communicate via localhost

**Steps**:
1. Start Hadoop: `.\start-hadoop.cmd`
2. Upload data: `.\upload-data-to-hadoop.cmd`
3. Start web app: `npm run dev`
4. Access: `http://localhost:3000/hadoop`

**Pros**:
- ✅ Easy to setup
- ✅ Free
- ✅ Full control

**Cons**:
- ❌ Only accessible from your machine
- ❌ Hadoop offline when laptop off

---

### Option 2: Deploy Hadoop to Cloud VM (Production)

**When to use**: Production deployment, always-on system

**Cloud Providers**:
1. **AWS EC2** (recommended)
2. **Google Cloud Compute Engine**
3. **Azure Virtual Machine**
4. **DigitalOcean Droplet**

**Steps**:
1. Create VM instance (minimum: 4GB RAM, 2 vCPU)
2. Install Java 11
3. Install Hadoop 3.3.6
4. Configure firewall (open port 9870)
5. Get public IP
6. Update web app config with public IP

**Cost**: ~$20-40/month

**Pros**:
- ✅ Accessible from anywhere
- ✅ Always online (24/7)
- ✅ Scalable

**Cons**:
- ❌ Monthly cost
- ❌ Requires server management

**See**: `AWS_INTEGRATION_GUIDE.md` for detailed steps

---

### Option 3: Hide Hadoop Feature in Production

**When to use**: Demo production without Hadoop cost

**Setup**:
- Hadoop menu hidden in production
- Only show in development
- Use Supabase for all data storage

**Implementation**:

Edit `src/config/site.tsx`:

```typescript
export const siteConfig = {
  navItems: [
    // ... other items
    
    // Only show Hadoop in development
    ...(process.env.NODE_ENV === 'development' ? [{
      label: "Hadoop",
      href: "/hadoop",
      icon: <Database className="w-5 h-5" />,
    }] : []),
  ],
};
```

**Pros**:
- ✅ No Hadoop cost in production
- ✅ Feature available in development
- ✅ Clean production UI

**Cons**:
- ❌ No big data analytics in production
- ❌ Limited to Supabase capabilities

---

### Option 4: Replace Hadoop with Cloud Storage

**When to use**: Want cloud analytics without Hadoop complexity

**Alternatives**:
1. **AWS S3 + Athena**: Query CSV files with SQL
2. **Google Cloud Storage + BigQuery**: Serverless analytics
3. **Supabase Storage + PostgreSQL**: Use PostgreSQL for analytics

**Example with Supabase**:
```sql
-- Create materialized view for analytics
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_transactions,
  SUM(points_earned) as total_points,
  bottle_size,
  device_id
FROM transactions
GROUP BY DATE(created_at), bottle_size, device_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW analytics_summary;
```

**Cost**: Minimal (included in Supabase free tier or ~$25/month)

**Pros**:
- ✅ Serverless (no VM management)
- ✅ Scales automatically
- ✅ Cheaper than dedicated Hadoop VM

**Cons**:
- ❌ Not "true" Hadoop (might not meet project requirements)
- ❌ Different query language

---

## 🎯 Recommendation Based on Use Case

### For College Project / Thesis:
**Option 2: Deploy Hadoop to AWS EC2**
- Shows real production deployment
- Demonstrates cloud integration
- Meets "big data" requirements

**Budget**: Use AWS Free Tier (12 months free)

---

### For Demo / Presentation:
**Option 1: Local Development**
- Show Hadoop dashboard locally
- No cost
- Full features during demo

**Note**: Mention in presentation that "in production, Hadoop would be on dedicated server"

---

### For Actual Production (Real Users):
**Option 4: Replace with Cloud Storage**
- More practical
- Lower cost
- Easier maintenance

---

## 🛠️ Quick Fix for Current Deployment

For now, to make the production deployment look clean:

### Hide Hadoop Menu in Production

```typescript
// src/config/site.tsx
export const siteConfig = {
  navItems: [
    // ... existing items ...
    
    // Conditionally show Hadoop
    ...(process.env.NEXT_PUBLIC_HADOOP_URL ? [{
      label: "Hadoop",
      href: "/hadoop",
      icon: <Database className="w-5 h-5" />,
    }] : []),
  ],
};
```

Add to `.env.local` (development):
```
NEXT_PUBLIC_HADOOP_URL=http://localhost:9870
```

**Don't add** to Vercel environment variables → Hadoop menu won't show in production.

---

## 📋 Implementation Checklist

### Immediate (Today):
- [ ] Run `upload-data-to-hadoop.cmd` to add sample data
- [ ] Test Hadoop dashboard locally (http://localhost:9870)
- [ ] Test web dashboard (http://localhost:3000/hadoop)
- [ ] Verify files appear in HDFS

### Short Term (This Week):
- [ ] Decide: Local only or cloud deployment?
- [ ] If cloud: Choose provider (AWS recommended)
- [ ] If local only: Hide Hadoop in production

### Long Term (Production):
- [ ] Deploy Hadoop to AWS EC2
- [ ] Update web app with public Hadoop URL
- [ ] Setup monitoring and backups
- [ ] Document deployment process

---

## 🆘 Support

### Start Hadoop Locally:
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

### View Hadoop Dashboard:
```
http://localhost:9870
```

### View Web Dashboard:
```
http://localhost:3000/hadoop
```

---

## 📚 Related Files

- `start-hadoop.cmd` - Start Hadoop services
- `upload-data-to-hadoop.cmd` - Upload sample data
- `AWS_INTEGRATION_GUIDE.md` - Deploy to AWS
- `src/app/(admin)/hadoop/page.tsx` - Hadoop dashboard page
- `src/lib/hadoop-client.ts` - Hadoop API client

---

**Created**: 2026-06-09
**Status**: Hadoop works locally, needs cloud deployment for production
