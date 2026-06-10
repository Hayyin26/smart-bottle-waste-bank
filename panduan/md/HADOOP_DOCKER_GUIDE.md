# 🐳 Hadoop with Docker - Complete Guide

## Why Docker?
- ✅ **1-command setup**: No manual Java/Hadoop installation
- ✅ **Portable**: Works on Windows, Mac, Linux
- ✅ **Isolated**: Doesn't mess with your system
- ✅ **Easy deployment**: Deploy to any cloud with Docker support
- ✅ **Production-ready**: Same environment everywhere

---

## 📋 Prerequisites

### Install Docker Desktop
1. Download: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop
3. Start Docker Desktop
4. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

**Expected output**:
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Hadoop Cluster

```bash
# Start all Hadoop services
docker-compose -f docker-compose.hadoop.yml up -d
```

**What happens**:
- ✅ Download Hadoop Docker images (first time: ~2GB)
- ✅ Start NameNode (port 9870)
- ✅ Start DataNode (port 9864)
- ✅ Start ResourceManager (port 8088)
- ✅ Create persistent volumes

**Expected output**:
```
[+] Running 5/5
 ✔ Container hadoop-namenode           Started
 ✔ Container hadoop-datanode            Started
 ✔ Container hadoop-resourcemanager     Started
 ✔ Container hadoop-nodemanager         Started
 ✔ Container hadoop-historyserver       Started
```

---

### Step 2: Verify Hadoop is Running

```bash
# Check running containers
docker ps
```

**Expected output**:
```
CONTAINER ID   IMAGE                                          STATUS
abc123         bde2020/hadoop-namenode:2.0.0-hadoop3.2.1     Up 30 seconds
def456         bde2020/hadoop-datanode:2.0.0-hadoop3.2.1     Up 30 seconds
...
```

---

### Step 3: Access Hadoop Web UI

Open browser:
- **NameNode UI**: http://localhost:9870
- **DataNode UI**: http://localhost:9864
- **ResourceManager UI**: http://localhost:8088

---

### Step 4: Upload Sample Data

Create sample data directory:
```bash
mkdir hadoop-data
```

Create sample file:
```bash
# Create sample transaction data
echo "transaction_id,user_id,device_id,bottle_size,points_earned,created_at" > hadoop-data/transactions.csv
echo "1,user001,ESP32-BOTOL-01,KECIL,5,2026-06-01 10:00:00" >> hadoop-data/transactions.csv
echo "2,user001,ESP32-BOTOL-01,SEDANG,10,2026-06-01 10:05:00" >> hadoop-data/transactions.csv
echo "3,user002,ESP32-BOTOL-01,BESAR,15,2026-06-01 10:10:00" >> hadoop-data/transactions.csv
```

Upload to HDFS:
```bash
# Copy file from local to HDFS
docker exec hadoop-namenode hdfs dfs -mkdir -p /user/admin/transactions
docker exec hadoop-namenode hdfs dfs -put /data/transactions.csv /user/admin/transactions/
```

Verify upload:
```bash
# List files in HDFS
docker exec hadoop-namenode hdfs dfs -ls -R /user/admin/
```

**Expected output**:
```
drwxr-xr-x   - root supergroup          0 2026-06-09 /user/admin/transactions
-rw-r--r--   1 root supergroup        256 2026-06-09 /user/admin/transactions/transactions.csv
```

---

## 🎯 Update Web App Configuration

### Update Hadoop Config

Edit `src/lib/hadoop-config.ts`:

```typescript
export const hadoopConfig = {
  // Docker Hadoop (local development)
  nameNodeUrl: process.env.NEXT_PUBLIC_HADOOP_URL || 'http://localhost:9870',
  
  // WebHDFS API endpoint
  webhdfsUrl: process.env.NEXT_PUBLIC_HADOOP_WEBHDFS_URL || 'http://localhost:9870/webhdfs/v1',
};
```

### Test Web Dashboard

1. Start Next.js: `npm run dev`
2. Visit: http://localhost:3000/hadoop
3. Should see:
   - ✅ Status: Connected
   - ✅ Files: 1 file
   - ✅ Storage used

---

## 📦 Docker Commands Cheat Sheet

### Start/Stop Hadoop

```bash
# Start Hadoop cluster
docker-compose -f docker-compose.hadoop.yml up -d

# Stop Hadoop cluster
docker-compose -f docker-compose.hadoop.yml down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose -f docker-compose.hadoop.yml down -v

# Restart Hadoop
docker-compose -f docker-compose.hadoop.yml restart
```

---

### View Logs

```bash
# View all logs
docker-compose -f docker-compose.hadoop.yml logs

# View NameNode logs
docker-compose -f docker-compose.hadoop.yml logs namenode

# Follow logs (real-time)
docker-compose -f docker-compose.hadoop.yml logs -f namenode
```

---

### Execute Commands in Container

```bash
# Access NameNode shell
docker exec -it hadoop-namenode bash

# Run HDFS command
docker exec hadoop-namenode hdfs dfs -ls /

# Upload file to HDFS
docker exec hadoop-namenode hdfs dfs -put /local/path/file.csv /hdfs/path/

# Download file from HDFS
docker exec hadoop-namenode hdfs dfs -get /hdfs/path/file.csv /local/path/

# View file content
docker exec hadoop-namenode hdfs dfs -cat /hdfs/path/file.csv
```

---

### Manage Containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container resource usage
docker stats

# Remove stopped containers
docker container prune
```

---

## 🚀 Deploy to Production

### Option 1: Deploy to AWS ECS (Docker on Cloud)

1. **Create ECR Repository** (Docker registry):
   ```bash
   aws ecr create-repository --repository-name hadoop-cluster
   ```

2. **Push Docker images**:
   ```bash
   docker tag bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 YOUR_ECR_URL/hadoop-namenode
   docker push YOUR_ECR_URL/hadoop-namenode
   ```

3. **Create ECS Cluster**:
   - Use `docker-compose.hadoop.yml`
   - ECS will convert to task definitions

4. **Update web app**:
   ```env
   NEXT_PUBLIC_HADOOP_URL=http://YOUR_ECS_PUBLIC_IP:9870
   ```

**Cost**: ~$30-50/month

---

### Option 2: Deploy to DigitalOcean with Docker

1. **Create Droplet** with Docker pre-installed

2. **Copy docker-compose file**:
   ```bash
   scp docker-compose.hadoop.yml root@YOUR_DROPLET_IP:/root/
   ```

3. **SSH and start**:
   ```bash
   ssh root@YOUR_DROPLET_IP
   docker-compose -f docker-compose.hadoop.yml up -d
   ```

4. **Open firewall**:
   ```bash
   ufw allow 9870/tcp
   ```

5. **Update web app**:
   ```env
   NEXT_PUBLIC_HADOOP_URL=http://YOUR_DROPLET_IP:9870
   ```

**Cost**: ~$15-20/month

---

### Option 3: Deploy to Google Cloud Run (Serverless Docker)

1. **Build and push to GCR**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/hadoop-namenode
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy hadoop --image gcr.io/PROJECT_ID/hadoop-namenode --platform managed
   ```

3. **Get public URL** and update web app

**Cost**: Pay per use, ~$10-30/month

---

## 🔧 Advanced Configuration

### Increase Memory Allocation

Edit `docker-compose.hadoop.yml`:

```yaml
services:
  namenode:
    # ... existing config ...
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

---

### Enable Data Persistence

Data is already persistent with Docker volumes:
- `hadoop_namenode` - NameNode metadata
- `hadoop_datanode` - Actual data storage

**Location** (Windows): `\\wsl$\docker-desktop-data\data\docker\volumes\`

---

### Custom Hadoop Configuration

Create `hadoop-custom-config` directory:

```bash
mkdir hadoop-custom-config
```

Add custom config files:
- `core-site.xml`
- `hdfs-site.xml`
- `yarn-site.xml`

Mount in docker-compose:
```yaml
volumes:
  - ./hadoop-custom-config:/opt/hadoop/etc/hadoop
```

---

## 🐛 Troubleshooting

### Problem: Containers won't start

**Check logs**:
```bash
docker-compose -f docker-compose.hadoop.yml logs
```

**Common causes**:
- Port already in use (stop local Hadoop)
- Insufficient memory (allocate more in Docker Desktop)
- Docker daemon not running

**Fix**:
```bash
# Stop local Hadoop if running
.\stop-hadoop.cmd

# Restart Docker Desktop
# Then try again
docker-compose -f docker-compose.hadoop.yml up -d
```

---

### Problem: Cannot access web UI

**Check if container is running**:
```bash
docker ps | grep hadoop-namenode
```

**Check container logs**:
```bash
docker logs hadoop-namenode
```

**Test connectivity**:
```bash
curl http://localhost:9870
```

**Fix firewall** (Windows):
- Allow Docker in Windows Defender Firewall
- Or disable firewall temporarily for testing

---

### Problem: Upload fails

**Check HDFS health**:
```bash
docker exec hadoop-namenode hdfs dfsadmin -report
```

**Verify DataNode connected**:
```bash
docker exec hadoop-namenode hdfs dfsadmin -printTopology
```

**Fix permissions**:
```bash
docker exec hadoop-namenode hdfs dfs -chmod -R 777 /user
```

---

## ✅ Advantages vs Native Hadoop

| Feature | Native Hadoop | Docker Hadoop |
|---------|--------------|---------------|
| Setup Time | 1-2 hours | 5 minutes |
| Complexity | High | Low |
| Portability | Low | High |
| Production Deploy | Complex | Simple |
| Resource Usage | Heavy | Moderate |
| Isolation | None | Complete |
| Cleanup | Manual | 1 command |

---

## 📊 Resource Requirements

**Minimum**:
- RAM: 4GB
- CPU: 2 cores
- Disk: 10GB

**Recommended**:
- RAM: 8GB
- CPU: 4 cores
- Disk: 50GB

---

## 🎯 Complete Workflow

### Development:
```bash
# 1. Start Hadoop
docker-compose -f docker-compose.hadoop.yml up -d

# 2. Upload data
docker exec hadoop-namenode hdfs dfs -put /data/file.csv /user/admin/

# 3. Start web app
npm run dev

# 4. View dashboard
# http://localhost:3000/hadoop

# 5. Stop Hadoop when done
docker-compose -f docker-compose.hadoop.yml down
```

---

### Production:
```bash
# 1. Deploy to cloud (DigitalOcean example)
scp docker-compose.hadoop.yml root@DROPLET_IP:/root/
ssh root@DROPLET_IP
docker-compose -f docker-compose.hadoop.yml up -d

# 2. Configure firewall
ufw allow 9870/tcp

# 3. Update Vercel environment
# NEXT_PUBLIC_HADOOP_URL=http://DROPLET_IP:9870

# 4. Access from anywhere
# https://your-app.vercel.app/hadoop
```

---

## 📚 Resources

- Docker Hub: https://hub.docker.com/r/bde2020/hadoop-namenode
- Docker Docs: https://docs.docker.com/
- Hadoop WebHDFS: https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html

---

## 🆘 Quick Commands

```bash
# Start
docker-compose -f docker-compose.hadoop.yml up -d

# Status
docker ps

# Logs
docker-compose -f docker-compose.hadoop.yml logs -f

# Execute command
docker exec hadoop-namenode hdfs dfs -ls /

# Stop
docker-compose -f docker-compose.hadoop.yml down

# Remove everything (including data)
docker-compose -f docker-compose.hadoop.yml down -v
```

---

**Created**: 2026-06-09
**Version**: 1.0
**Docker Compose Version**: 3.8
**Hadoop Version**: 3.2.1
