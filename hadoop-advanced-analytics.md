# 🚀 Hadoop Advanced Analytics - Beyond Storage

## Current Status: Storage Only ✅

Right now, you're using Hadoop for **file storage** (HDFS). That's just **20%** of Hadoop's power!

---

## 🎯 What Else Can You Do?

### Level 1: Storage (Current) ✅
```
CSV files → Hadoop HDFS → View files
```
**Achievement**: Basic big data storage

---

### Level 2: Data Processing 📊

**Add MapReduce** - Process data in parallel

#### Example 1: Count Bottles by Size
```python
# mapper.py
import sys

for line in sys.stdin:
    data = line.strip().split(',')
    if len(data) >= 4:
        bottle_size = data[3]  # KECIL, SEDANG, BESAR
        print(f'{bottle_size}\t1')

# reducer.py
import sys

current_size = None
current_count = 0

for line in sys.stdin:
    size, count = line.strip().split('\t')
    count = int(count)
    
    if current_size == size:
        current_count += count
    else:
        if current_size:
            print(f'{current_size}\t{current_count}')
        current_size = size
        current_count = count

if current_size:
    print(f'{current_size}\t{current_count}')
```

**Run**:
```bash
# Upload scripts
docker cp mapper.py hadoop-namenode:/tmp/
docker cp reducer.py hadoop-namenode:/tmp/

# Run MapReduce
docker exec hadoop-namenode hadoop jar /opt/hadoop/share/hadoop/tools/lib/hadoop-streaming-*.jar \
  -input /user/admin/transactions/*.csv \
  -output /user/admin/results/bottle_counts \
  -mapper "python3 /tmp/mapper.py" \
  -reducer "python3 /tmp/reducer.py"

# View results
docker exec hadoop-namenode hdfs dfs -cat /user/admin/results/bottle_counts/*
```

**Output**:
```
KECIL    8
SEDANG   7
BESAR    8
```

---

### Level 3: SQL Queries with Hive 🗃️

**Add Hive** - Query HDFS data with SQL

#### Setup Hive:
```yaml
# Add to docker-compose.hadoop.yml
hive-server:
  image: bde2020/hive:2.3.2-postgresql-metastore
  container_name: hive-server
  depends_on:
    - namenode
    - datanode
  environment:
    HIVE_CORE_CONF_javax_jdo_option_ConnectionURL: "jdbc:postgresql://hive-metastore/metastore"
  ports:
    - "10000:10000"
```

#### Query Data:
```sql
-- Create external table
CREATE EXTERNAL TABLE transactions (
  id INT,
  user_id STRING,
  device_id STRING,
  bottle_size STRING,
  points_earned INT,
  created_at TIMESTAMP
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/user/admin/transactions/';

-- Top users by points
SELECT user_id, SUM(points_earned) as total_points
FROM transactions
GROUP BY user_id
ORDER BY total_points DESC
LIMIT 10;

-- Bottles per day
SELECT DATE(created_at) as date, COUNT(*) as bottle_count
FROM transactions
GROUP BY DATE(created_at)
ORDER BY date;

-- Average points by bottle size
SELECT bottle_size, AVG(points_earned) as avg_points
FROM transactions
GROUP BY bottle_size;
```

---

### Level 4: Real-time Analytics with Spark ⚡

**Add Spark** - Fast in-memory processing

#### Docker Compose Addition:
```yaml
spark-master:
  image: bde2020/spark-master:3.3.0-hadoop3.3
  container_name: spark-master
  ports:
    - "8080:8080"
    - "7077:7077"
  environment:
    - INIT_DAEMON_STEP=setup_spark
```

#### Python Spark Script:
```python
from pyspark.sql import SparkSession

# Create Spark session
spark = SparkSession.builder \
    .appName("Bottle Analytics") \
    .getOrCreate()

# Read from HDFS
df = spark.read.csv("hdfs://namenode:9000/user/admin/transactions/*.csv", 
                    header=True, inferSchema=True)

# Analytics
print("=== Total Transactions ===")
print(df.count())

print("\n=== Bottles by Size ===")
df.groupBy("bottle_size").count().show()

print("\n=== Top 10 Users ===")
df.groupBy("user_id") \
  .sum("points_earned") \
  .orderBy("sum(points_earned)", ascending=False) \
  .show(10)

# Machine Learning: Predict bottle type
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.feature import VectorAssembler

# Feature engineering
assembler = VectorAssembler(
    inputCols=["points_earned"],
    outputCol="features"
)

# Train model
rf = RandomForestClassifier(labelCol="bottle_size_encoded", featuresCol="features")
model = rf.fit(train_data)

# Predict
predictions = model.transform(test_data)
```

---

### Level 5: Web Dashboard with Analytics 📊

**Enhance your web dashboard** to show analytics

#### API Routes to Add:

**1. Analytics Summary** (`/api/hadoop/analytics/summary`)
```typescript
export async function GET() {
  // Run Hive query or Spark job
  const stats = {
    total_bottles: 1000,
    total_points: 15000,
    avg_bottles_per_day: 50,
    top_bottle_size: "SEDANG",
    growth_rate: "+15%"
  };
  
  return Response.json(stats);
}
```

**2. Trend Analysis** (`/api/hadoop/analytics/trends`)
```typescript
export async function GET() {
  // Historical data
  const trends = [
    { date: "2026-06-01", bottles: 45, points: 450 },
    { date: "2026-06-02", bottles: 52, points: 520 },
    // ...
  ];
  
  return Response.json(trends);
}
```

**3. User Rankings** (`/api/hadoop/analytics/rankings`)
```typescript
export async function GET() {
  // Top users from Hadoop
  const rankings = [
    { user: "Ahmad", points: 450, rank: 1 },
    { user: "Budi", points: 380, rank: 2 },
    // ...
  ];
  
  return Response.json(rankings);
}
```

#### Dashboard Enhancements:
```tsx
// src/app/(admin)/hadoop/analytics/page.tsx
export default function HadoopAnalytics() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* KPI Cards */}
      <Card>
        <CardHeader>Total Bottles</CardHeader>
        <CardBody>
          <div className="text-4xl font-bold">1,234</div>
          <div className="text-green-500">+15% from last month</div>
        </CardBody>
      </Card>
      
      {/* Charts */}
      <Card className="col-span-2">
        <CardHeader>Bottle Trends</CardHeader>
        <CardBody>
          <LineChart data={trendsData} />
        </CardBody>
      </Card>
      
      {/* Top Users Table */}
      <Card className="col-span-3">
        <CardHeader>Top Contributors</CardHeader>
        <CardBody>
          <DataTable data={topUsers} />
        </CardBody>
      </Card>
    </div>
  );
}
```

---

### Level 6: Machine Learning 🤖

**Predictive Analytics** on bottle data

#### Use Cases:
1. **Predict bottle size** from sensor data
2. **Anomaly detection** (unusual patterns)
3. **User behavior prediction**
4. **Optimal collection times**

#### Example with Spark MLlib:
```python
from pyspark.ml.regression import LinearRegression
from pyspark.ml.feature import VectorAssembler

# Prepare data
assembler = VectorAssembler(
    inputCols=["hour_of_day", "day_of_week"],
    outputCol="features"
)

# Train model
lr = LinearRegression(featuresCol="features", labelCol="bottle_count")
model = lr.fit(training_data)

# Predict tomorrow's bottle count
predictions = model.transform(test_data)
```

---

## 🎯 Recommended Implementation Plan

### Phase 1: Basic Analytics (This Week)
```
✅ Storage (HDFS) - Done
⬜ Add MapReduce for basic counts
⬜ Create analytics dashboard page
⬜ Show bottle statistics
```

### Phase 2: SQL Queries (Next Week)
```
⬜ Setup Hive
⬜ Create tables
⬜ Run SQL queries
⬜ Display query results in dashboard
```

### Phase 3: Advanced Analytics (Optional)
```
⬜ Setup Spark
⬜ Real-time processing
⬜ Machine learning models
⬜ Predictive analytics
```

---

## 💡 For Your Thesis: What to Show

### Minimum (Pass):
- ✅ Hadoop HDFS storage
- ✅ File browser
- ✅ Basic stats (file count, size)

### Good (B):
- ✅ MapReduce processing
- ✅ Analytics dashboard
- ✅ Charts and graphs

### Excellent (A):
- ✅ Hive SQL queries
- ✅ Spark analytics
- ✅ Machine learning
- ✅ Predictive insights

---

## 🚀 Quick Wins (Add This Week)

### 1. Analytics Dashboard Page

Create `/hadoop/analytics` page showing:
- Total bottles processed
- Bottles by size (pie chart)
- Daily trends (line chart)
- Top users (table)

### 2. Simple MapReduce Job

Count bottles by type and show results

### 3. Export to Excel

Add button to download analytics as Excel

---

## 📚 Resources to Learn

1. **MapReduce Tutorial**: 
   - https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html

2. **Hive Documentation**:
   - https://hive.apache.org/

3. **Spark with Hadoop**:
   - https://spark.apache.org/docs/latest/

---

## ✅ Summary

**Current**: Hadoop for storage only (20% capability)

**Possible**:
1. ⭐ Data processing (MapReduce)
2. ⭐⭐ SQL queries (Hive)
3. ⭐⭐⭐ Real-time analytics (Spark)
4. ⭐⭐⭐⭐ Machine learning
5. ⭐⭐⭐⭐⭐ Predictive insights

**Recommendation**: Start with MapReduce + Analytics Dashboard (⭐⭐)

---

**Question**: Apakah hanya begini saja?

**Answer**: TIDAK! Ini baru 20%. Kamu bisa tambahkan:
- Analytics dashboard dengan charts
- MapReduce untuk processing
- Hive untuk SQL queries
- Spark untuk ML (optional)

**Next Step**: Mau tambah fitur apa? Saya bisa buatkan! 🚀
