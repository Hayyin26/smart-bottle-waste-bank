# 🔄 Supabase ↔ Hadoop Integration Guide

## Question: Apakah Perlu Sambungkan Supabase dengan Hadoop?

**Answer**: **TIDAK perlu** sambung langsung. Mereka punya fungsi berbeda dan bekerja secara independen.

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Web Application                   │
│         (Frontend + API Routes + Dashboard)                  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ↓                              ↓
┌──────────────────────────────┐  ┌─────────────────────────┐
│   Supabase (PostgreSQL)      │  │    Hadoop (HDFS)        │
│   ═══════════════════        │  │   ═══════════════       │
│   Purpose: OLTP              │  │   Purpose: OLAP         │
│   Real-time operations       │  │   Big data analytics    │
│                              │  │                         │
│   Data:                      │  │   Data:                 │
│   • User authentication      │  │   • Historical records  │
│   • Live transactions        │  │   • Archived data       │
│   • IoT sessions             │  │   • Analytics datasets  │
│   • Device registration      │  │   • ML training data    │
│                              │  │                         │
│   Queries:                   │  │   Queries:              │
│   • Fast (<1s)               │  │   • Batch (min-hours)   │
│   • Small data (MB-GB)       │  │   • Large data (TB-PB)  │
│   • ACID transactions        │  │   • MapReduce jobs      │
└──────────────────────────────┘  └─────────────────────────┘
         (Always online)                  (Optional)
       (Production database)         (Analytics only)
```

---

## 🎯 Why Keep Them Separate?

### Different Purposes:

**Supabase** = **Operational Database** (OLTP)
- Real-time user queries
- Transaction processing
- Authentication
- Data integrity (ACID)

**Hadoop** = **Analytics Database** (OLAP)
- Historical data analysis
- Big data processing
- Data warehousing
- Machine learning

**Analogy**:
- Supabase = Cash register (fast, real-time)
- Hadoop = Warehouse (storage, analysis)

---

## ✅ Data Flow Strategy

### Option 1: Manual Sync (Recommended for Your Project)

```
Daily/Weekly Schedule:

1. Users interact → Data goes to Supabase ✅
2. Every day/week → Export Supabase → Hadoop 📤
3. Hadoop processes → Analytics 📊
4. Display results on dashboard 🖥️
```

**Commands**:
```bash
# Run manually
.\sync-supabase-to-hadoop.cmd

# Or schedule (Windows Task Scheduler)
# Every night at 2 AM
```

**Pros**:
- ✅ Simple implementation
- ✅ No direct connection needed
- ✅ Independent databases
- ✅ Easy to understand
- ✅ Low complexity

**Cons**:
- ⚠️ Data in Hadoop not real-time (delayed by sync interval)
- ⚠️ Manual trigger required (can be automated with Task Scheduler)

---

### Option 2: Automatic Sync (Advanced)

```
Real-time Flow:

1. Transaction created → Supabase
2. Supabase Webhook triggers → Cloud Function
3. Cloud Function → Export to Hadoop
4. Hadoop always up-to-date
```

**Technologies**:
- Supabase Database Webhooks
- Cloud Function (Vercel Edge Function / AWS Lambda)
- HTTP API to Hadoop

**Pros**:
- ✅ Automatic synchronization
- ✅ Near real-time data in Hadoop
- ✅ No manual intervention

**Cons**:
- ⚠️ More complex setup
- ⚠️ Higher cost (cloud functions)
- ⚠️ Requires advanced knowledge

---

### Option 3: Event-Driven Architecture (Production Grade)

```
Enterprise Flow:

1. Transaction → Event Bus (Kafka/RabbitMQ)
2. Event Bus → Multiple consumers:
   - Consumer 1 → Supabase
   - Consumer 2 → Hadoop
3. Both databases updated simultaneously
```

**Technologies**:
- Apache Kafka / RabbitMQ
- Event-driven microservices
- Message queues

**Pros**:
- ✅ True real-time sync
- ✅ Highly scalable
- ✅ Enterprise-grade

**Cons**:
- ❌ Very complex
- ❌ Expensive infrastructure
- ❌ Overkill for small projects

---

## 🚀 Implementation: Manual Sync (Recommended)

I've created a sync script for you!

### Step 1: Install Dependencies

```bash
# Already done if you have the project
npm install
```

### Step 2: Run Sync

```bash
# Manual sync
.\sync-supabase-to-hadoop.cmd
```

**What it does**:
1. ✅ Exports transactions from Supabase
2. ✅ Exports users from Supabase
3. ✅ Exports devices from Supabase
4. ✅ Converts to CSV format
5. ✅ Uploads to Hadoop HDFS
6. ✅ Verifies upload

**Output**:
```
============================================
Supabase → Hadoop Sync
============================================

[1/5] Checking Hadoop container...
✅ Hadoop is running

[2/5] Exporting data from Supabase...
[Transactions] Found 150 records
[Transactions] Saved to hadoop-data\transactions_1234567890.csv
[Users] Found 25 records
[Users] Saved to hadoop-data\users_1234567890.csv
[Devices] Found 1 records
[Devices] Saved to hadoop-data\devices_1234567890.csv

[3/5] Uploading to Hadoop HDFS...
[HDFS] ✅ Upload successful: /user/admin/transactions/transactions_1234567890.csv
[HDFS] ✅ Upload successful: /user/admin/users/users_1234567890.csv
[HDFS] ✅ Upload successful: /user/admin/devices/devices_1234567890.csv

[4/5] Verifying uploads...
Transactions: ✅
Users: ✅
Devices: ✅

[5/5] Sync complete!

============================================
View files in HDFS:
  http://localhost:9870
============================================
```

---

### Step 3: Schedule Automatic Sync (Optional)

**Windows Task Scheduler**:

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Sync Supabase to Hadoop"
4. Trigger: Daily at 2:00 AM
5. Action: Start a program
6. Program: `C:\path\to\project\sync-supabase-to-hadoop.cmd`
7. Save

**Now it runs automatically every night!**

---

## 📊 When to Use Which Database?

### Use Supabase for:
- ✅ User login/logout
- ✅ Today's transactions
- ✅ Real-time queries
- ✅ CRUD operations
- ✅ Data that changes frequently

**Example queries**:
```sql
-- Get user current points
SELECT total_points FROM profiles WHERE id = 'user123';

-- Get today's transactions
SELECT * FROM transactions WHERE DATE(created_at) = CURRENT_DATE;

-- Check device status
SELECT * FROM iot_devices WHERE device_id = 'ESP32-BOTOL-01';
```

---

### Use Hadoop for:
- ✅ Historical data (months/years)
- ✅ Big data analytics
- ✅ Pattern analysis
- ✅ Machine learning datasets
- ✅ Data warehousing

**Example queries**:
```bash
# Analyze trends over 1 year
hadoop jar analytics.jar \
  --input /user/admin/transactions/2025/ \
  --output /results/yearly_trends/

# Find top 10 users by bottle count
pig -x mapreduce analyze_top_users.pig

# Train ML model on historical data
spark-submit train_model.py \
  --data hdfs:///user/admin/transactions/
```

---

## 🎓 For Your Thesis/Presentation

### Show This Architecture:

```
┌─────────────────────────────────────────────────────┐
│  Hybrid Database Architecture                       │
│                                                     │
│  Supabase (OLTP)        +        Hadoop (OLAP)     │
│  ═══════════════                  ═══════════       │
│  Real-time operations             Big data analytics│
│                                                     │
│  Connected via:                                     │
│  • Periodic ETL (Extract-Transform-Load)           │
│  • Nightly batch sync                              │
│  • Event-driven updates (advanced)                 │
└─────────────────────────────────────────────────────┘
```

### Explain Benefits:
1. ✅ **Separation of Concerns**: Each database optimized for its purpose
2. ✅ **Performance**: Supabase fast for operations, Hadoop scalable for analytics
3. ✅ **Cost-effective**: Only run Hadoop when needed
4. ✅ **Scalability**: Can scale each independently
5. ✅ **Best Practices**: Industry-standard architecture (Lambda Architecture)

### Key Points:
- "We use **hybrid database architecture**"
- "Supabase for **operational** data (OLTP)"
- "Hadoop for **analytical** data (OLAP)"
- "Synced via **ETL pipeline**"
- "Follows **Lambda Architecture** pattern"

**Bonus**: This shows advanced database knowledge!

---

## 🔧 Advanced: Real-time Sync (Optional)

If you want to implement automatic sync (Option 2):

### Create Supabase Database Webhook

1. Go to Supabase Dashboard
2. Database → Webhooks
3. Create new webhook
4. Event: `INSERT` on `transactions` table
5. Endpoint: Your cloud function URL
6. Save

### Create Cloud Function (Vercel Edge Function)

```typescript
// api/sync-to-hadoop.ts
export default async function handler(req: Request) {
  const { record } = await req.json();
  
  // Convert to CSV
  const csv = `${record.id},${record.user_id},${record.device_id},...`;
  
  // Upload to Hadoop (via HTTP API)
  await fetch('http://hadoop-server:9870/webhdfs/v1/user/admin/transactions/latest.csv', {
    method: 'PUT',
    body: csv,
  });
  
  return new Response('OK');
}
```

---

## 🎯 Recommendation

**For your project**, use **Option 1: Manual Sync**:

### Why?
- ✅ Simple to implement (script already created!)
- ✅ Easy to demonstrate in presentation
- ✅ Shows understanding of ETL
- ✅ No extra cost
- ✅ Sufficient for proof-of-concept
- ✅ Can be automated with Task Scheduler

### How?
```bash
# Run manually when needed
.\sync-supabase-to-hadoop.cmd

# Or schedule to run daily
# (Windows Task Scheduler)
```

---

## 📚 Summary

| Aspect | Supabase | Hadoop | Connection |
|--------|----------|--------|------------|
| **Purpose** | Operational | Analytics | Periodic sync |
| **Data Type** | Current | Historical | ETL pipeline |
| **Query Speed** | Fast (ms) | Slow (min) | Not direct |
| **Data Size** | Small-Medium | Large-Huge | Via export |
| **Use Case** | Real-time | Batch | Independent |
| **Always On?** | Yes | Optional | N/A |

**Conclusion**: 
- ❌ NO need for direct connection
- ✅ YES need for periodic sync
- ✅ Use sync script provided
- ✅ Schedule automatic sync (optional)

---

## 🆘 Quick Commands

```bash
# Manual sync (run anytime)
.\sync-supabase-to-hadoop.cmd

# Start Hadoop (if needed)
.\hadoop-docker-start.cmd

# View Hadoop files
# http://localhost:9870 → Utilities → Browse file system

# View in web dashboard
# http://localhost:3000/hadoop
```

---

**Created**: 2026-06-09
**Architecture**: Lambda Architecture (Hybrid OLTP + OLAP)
**Recommendation**: Manual sync with optional scheduling
