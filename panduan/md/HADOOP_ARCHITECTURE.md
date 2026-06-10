# 🏗️ Hadoop Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      IoT Smart Bottle System                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │          ESP32 Device (IoT)            │
        │  • Ultrasonic Sensor (HC-SR04)         │
        │  • Servo Motor                         │
        │  • LCD Display                         │
        │  • WiFi Connection                     │
        └────────────────────────────────────────┘
                              │
                              │ HTTP POST
                              ▼
        ┌────────────────────────────────────────┐
        │       Next.js API Server               │
        │       (localhost:3000)                 │
        │                                        │
        │  • /api/iot/transaction                │
        │  • /api/hadoop/sync                    │
        │  • /api/hadoop/list                    │
        │  • /api/hadoop/read                    │
        └────────────────────────────────────────┘
                   │                    │
                   │                    │
        ┌──────────▼──────────┐  ┌─────▼──────────────┐
        │                     │  │                     │
        │   Supabase DB       │  │  Hadoop HDFS       │
        │   (Real-time)       │  │  (Big Data)        │
        │                     │  │                     │
        │  • transactions     │  │  /iot-data/        │
        │  • devices          │  │  ├── transactions/ │
        │  • iot_sessions     │  │  ├── devices/      │
        │  • profiles         │  │  ├── sessions/     │
        │                     │  │  ├── daily/        │
        └─────────────────────┘  │  └── backup/       │
                                 │                     │
                                 │  • Distributed      │
                                 │  • Fault-tolerant   │
                                 │  • Scalable         │
                                 └─────────────────────┘
```

---

## Data Flow

### 1. Real-time Transaction Flow

```
ESP32 Device
    │
    │ POST /api/iot/transaction
    ▼
Next.js API
    │
    ├─► Validate data
    ├─► Save to Supabase (immediate)
    └─► Return response to ESP32
    
Supabase
    │
    └─► Real-time updates to web dashboard
```

### 2. Backup Flow (Scheduled)

```
Scheduled Task (Daily 23:00)
    │
    │ Run scheduled-hadoop-sync.ts
    ▼
Script
    │
    ├─► Fetch data from Supabase (last 24h)
    ├─► Format as JSON with metadata
    └─► Upload to Hadoop HDFS
    
Hadoop HDFS
    │
    └─► Store distributed across DataNodes
```

### 3. Analytics Flow

```
Hadoop HDFS
    │
    │ Read historical data
    ▼
MapReduce / Spark
    │
    ├─► Process large datasets
    ├─► Generate insights
    └─► Create reports
    
Dashboard
    │
    └─► Display analytics results
```

---

## Component Details

### A. Next.js API Layer

**Purpose:** Bridge antara IoT devices, Supabase, dan Hadoop

**Files:**
- `src/lib/hadoop-config.ts` - Configuration
- `src/lib/hadoop-client.ts` - HDFS operations
- `src/app/api/hadoop/sync/route.ts` - Sync endpoint
- `src/app/api/hadoop/list/route.ts` - List files
- `src/app/api/hadoop/read/route.ts` - Read files

**Responsibilities:**
- Accept data from ESP32
- Save to Supabase (real-time)
- Backup to Hadoop (batch)
- Provide query interface

---

### B. Supabase Database

**Purpose:** Real-time transactional database

**Tables:**
```sql
transactions {
  id: uuid
  user_id: uuid
  device_id: text
  bottle_type: text
  bottle_size: text
  points: integer
  created_at: timestamp
}

devices {
  id: uuid
  device_id: text
  user_id: uuid
  device_name: text
  is_active: boolean
}

iot_sessions {
  id: uuid
  device_id: text
  qr_token: text
  expires_at: timestamp
}
```

**Advantages:**
- ⚡ Fast queries
- 🔄 Real-time subscriptions
- 🔐 Built-in auth
- 📊 Easy to use

**Limitations:**
- 💰 Cost scales with data size
- 📈 Not optimized for huge datasets
- 🕐 Historical data management

---

### C. Hadoop HDFS

**Purpose:** Distributed file system for big data

**Architecture:**
```
Hadoop Cluster (Single-node for dev)
│
├── NameNode (Master)
│   ├── Manages metadata
│   ├── Tracks file locations
│   └── Port: 9870 (Web UI)
│
└── DataNode (Worker)
    ├── Stores actual data blocks
    ├── Replication (default: 1)
    └── Heartbeat to NameNode
```

**Directory Structure:**
```
/
└── iot-data/
    ├── transactions/
    │   ├── transactions_2026-06-08T10-30-00.json
    │   ├── transactions_2026-06-07T10-30-00.json
    │   └── ...
    ├── devices/
    │   └── devices_2026-06-08T10-30-00.json
    ├── sessions/
    │   └── iot_sessions_2026-06-08T10-30-00.json
    ├── daily/
    ├── monthly/
    └── backup/
```

**Advantages:**
- 💾 Cheap storage
- 📈 Scales horizontally
- 🔒 Fault-tolerant
- 🚀 Batch processing

**Limitations:**
- 🐌 Not for real-time queries
- 🔧 Complex setup
- 🖥️ Requires dedicated resources

---

## Integration Benefits

### Why Both Supabase AND Hadoop?

| Aspect | Supabase | Hadoop |
|--------|----------|--------|
| **Purpose** | Real-time operations | Historical analytics |
| **Speed** | ⚡ Very fast (ms) | 🐌 Slower (seconds) |
| **Data Size** | Best: < 100GB | Best: > 1TB |
| **Query Type** | Transactional (OLTP) | Analytical (OLAP) |
| **Cost** | $$ per GB | $ per GB |
| **Setup** | ☁️ Cloud, easy | 🔧 Self-hosted, complex |
| **Use Case** | Live dashboard | Reports, ML training |

### Best of Both Worlds

```
┌───────────────────────────────────────────────────┐
│                  Hot Data (Recent)                │
│              Supabase PostgreSQL                  │
│         Last 30 days • Fast queries               │
└───────────────────────────────────────────────────┘
                        │
                        │ Daily Sync
                        ▼
┌───────────────────────────────────────────────────┐
│              Cold Data (Historical)               │
│                  Hadoop HDFS                      │
│        All time • Batch analytics                 │
└───────────────────────────────────────────────────┘
```

---

## Scalability Strategy

### Current Setup (Development)
- Single machine
- Supabase: All data
- Hadoop: Backup copy
- Manual sync

### Future Production Setup

#### Phase 1: Automated Backup (0-1000 users)
```
Supabase (Primary) → [Daily Sync] → Hadoop (Backup)
```

#### Phase 2: Archival Strategy (1000-10000 users)
```
Supabase (Last 30 days) → [Archive old data] → Hadoop (Historical)
                ↓
        Delete old records from Supabase
```

#### Phase 3: Distributed Processing (10000+ users)
```
IoT Devices
    ↓
Kafka / Event Stream
    ├─► Supabase (Real-time)
    └─► Hadoop (Batch)
         ↓
      Spark Processing
         ↓
    Analytics Dashboard
```

---

## Data Lifecycle

```
Day 1-7:   Supabase Only
           ├─ Real-time queries
           └─ Dashboard display

Day 7:     Daily Backup
           └─ Sync to Hadoop

Day 30:    Archive
           ├─ Keep in Hadoop
           └─ (Optional) Delete from Supabase

Day 365:   Long-term Storage
           ├─ Compress in Hadoop
           └─ ML training datasets
```

---

## Performance Optimization

### Query Patterns

**Real-time queries → Supabase**
```sql
-- Today's transactions
SELECT * FROM transactions 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- User points
SELECT SUM(points) FROM transactions 
WHERE user_id = 'xxx';
```

**Analytics queries → Hadoop**
```javascript
// Monthly statistics
const data = await hadoopClient.readFile(
  '/iot-data/monthly/2026-06.json'
)

// Process with MapReduce or Spark
```

---

## Security Architecture

### Current (Development)
```
Next.js API
    ├─► Supabase: RLS (Row Level Security)
    └─► Hadoop: Simple auth (user.name)
```

### Recommended (Production)
```
Next.js API
    ├─► Supabase: RLS + API Keys
    │   └─ Service role for admin operations
    │
    └─► Hadoop: Kerberos authentication
        ├─ HTTPS for WebHDFS
        └─ Firewall rules (only API server access)
```

---

## Disaster Recovery

### Backup Strategy

```
Primary Data: Supabase
    ├─ Automatic Supabase backups (built-in)
    └─ Point-in-time recovery

Secondary Backup: Hadoop
    ├─ Daily snapshots
    └─ Multiple copies (replication)

Tertiary Backup: Cloud Storage (optional)
    └─ Weekly exports to S3/GCS
```

### Recovery Scenarios

**Scenario 1: Supabase data loss**
```
1. Restore from Hadoop backup
2. Re-import last snapshot
3. Minimal data loss (< 24 hours)
```

**Scenario 2: Hadoop failure**
```
1. No impact on real-time operations
2. Re-sync from Supabase
3. Zero downtime
```

---

## Monitoring & Observability

### Health Checks

```typescript
// Automated health check
setInterval(async () => {
  // Check Supabase
  const { error: supabaseError } = await supabase
    .from('transactions')
    .select('count')
  
  // Check Hadoop
  const hadoopHealth = await hadoopClient.exists('/')
  
  // Alert if unhealthy
  if (supabaseError || !hadoopHealth) {
    sendAlert('System unhealthy')
  }
}, 60000) // Every minute
```

### Metrics to Track

- ✅ Sync success rate
- ⏱️ Sync duration
- 💾 Data size growth
- 🐘 Hadoop disk usage
- ⚡ Query latency

---

## Cost Analysis

### Monthly Cost Estimate (1000 active users)

**Supabase:**
- Data: 1000 users × 10 transactions/day × 1KB ≈ 10MB/day × 30 = 300MB
- Free tier covers up to 500MB
- Cost: $0 (or $25/month Pro plan)

**Hadoop:**
- Infrastructure: Self-hosted on existing machine
- Storage: 300MB/month × 12 months = 3.6GB/year
- Cost: $0 (uses local resources)

**Total:** $0-25/month

---

## Future Enhancements

### 1. Real-time Streaming
```
Apache Kafka → Spark Streaming → Hadoop
```

### 2. Machine Learning
```
Hadoop Data → Spark MLlib → ML Models
```

### 3. Advanced Analytics
```
Hadoop → Apache Hive → SQL queries on big data
```

### 4. Data Visualization
```
Hadoop → Apache Superset → Interactive dashboards
```

---

## Summary

✅ **Dual-database architecture**
- Supabase for speed
- Hadoop for scale

✅ **Clear separation of concerns**
- Real-time → Supabase
- Analytics → Hadoop

✅ **Scalable design**
- Start small
- Grow as needed

✅ **Cost-effective**
- Use free tiers
- Self-host Hadoop

✅ **Disaster recovery**
- Multiple backups
- Easy restoration

---

**Architecture Philosophy:**
*"Use the right tool for the right job"*

- 🎯 Supabase = Fast transactional database
- 🐘 Hadoop = Cheap scalable storage
- 🚀 Next.js = Smart orchestration layer

---

Made with ❤️ for PBL IoT Project
