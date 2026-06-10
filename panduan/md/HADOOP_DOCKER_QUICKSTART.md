# 🐳 Hadoop Docker - Quick Start (5 Minutes)

## ✅ Advantages of Docker Hadoop

| Feature | Native Hadoop | Docker Hadoop |
|---------|--------------|---------------|
| **Setup Time** | 1-2 hours | 5 minutes |
| **Complexity** | High (Java, paths, env vars) | Low (1 command) |
| **Portability** | Windows only | Windows/Mac/Linux |
| **Clean Uninstall** | Manual cleanup | 1 command |
| **Production Deploy** | Complex | Simple (push to cloud) |
| **Isolation** | Affects system | Isolated container |

**Recommendation**: ✅ Use Docker Hadoop!

---

## 📋 Prerequisites

### 1. Install Docker Desktop

**Download**: https://www.docker.com/products/docker-desktop/

**Install**: Run installer, restart computer

**Verify**:
```bash
docker --version
```

**Expected**: `Docker version 24.x.x`

---

## 🚀 3-Step Setup

### Step 1: Start Hadoop (2 minutes)

Double-click or run:
```bash
.\hadoop-docker-start.cmd
```

**What happens**:
- ✅ Downloads Hadoop images (first time: 2GB, ~3 min)
- ✅ Starts NameNode (port 9870)
- ✅ Starts DataNode (port 9864)
- ✅ Starts ResourceManager (port 8088)

**Wait for**: `Hadoop Cluster Started Successfully!`

---

### Step 2: Upload Sample Data (1 minute)

```bash
.\hadoop-docker-upload-data.cmd
```

**What happens**:
- ✅ Creates sample CSV files (transactions, users, devices)
- ✅ Uploads to HDFS
- ✅ Verifies upload

**Expected output**: List of files in HDFS

---

### Step 3: View Dashboard (30 seconds)

```bash
# Start web app
npm run dev
```

Open browser:
- **Hadoop UI**: http://localhost:9870
- **Web Dashboard**: http://localhost:3000/hadoop

**Should see**:
- ✅ Status: Connected
- ✅ Files: 3 files
- ✅ Storage: ~1KB used

---

## 🎯 Complete! You're Done!

Hadoop is now running with sample data.

---

## 📊 What's Running?

```bash
# Check status
docker ps
```

**Running containers**:
- `hadoop-namenode` → Master node (port 9870)
- `hadoop-datanode` → Data storage (port 9864)
- `hadoop-resourcemanager` → YARN manager (port 8088)
- `hadoop-nodemanager` → YARN worker (port 8042)
- `hadoop-historyserver` → Job history (port 8188)

---

## 🛑 Stop Hadoop

```bash
.\hadoop-docker-stop.cmd
```

**Note**: Data is preserved in Docker volumes. Restart with `.\hadoop-docker-start.cmd`

---

## 🔄 Daily Workflow

### Start Development:
```bash
# 1. Start Hadoop
.\hadoop-docker-start.cmd

# 2. Start web app
npm run dev

# 3. Work on your project
# http://localhost:3000
```

### End of Day:
```bash
# Stop Hadoop (saves resources)
.\hadoop-docker-stop.cmd
```

---

## 🚀 Deploy to Production

### Option 1: DigitalOcean Droplet ($15/month)

```bash
# 1. Create droplet with Docker
# 2. Copy files
scp docker-compose.hadoop.yml root@YOUR_IP:/root/
scp hadoop-docker-*.cmd root@YOUR_IP:/root/

# 3. SSH and start
ssh root@YOUR_IP
./hadoop-docker-start.cmd

# 4. Update web app
# Vercel env: NEXT_PUBLIC_HADOOP_URL=http://YOUR_IP:9870
```

---

### Option 2: AWS ECS (Managed Docker)

1. Push images to ECR
2. Create ECS cluster
3. Deploy with docker-compose
4. Get public IP
5. Update web app env

**Cost**: ~$30-40/month

---

## 🐛 Troubleshooting

### Problem: "Docker is not running"

**Fix**:
1. Open Docker Desktop
2. Wait for whale icon in system tray
3. Try again

---

### Problem: Port already in use

**Fix**:
```bash
# Stop native Hadoop if running
.\stop-hadoop.cmd

# Or change ports in docker-compose.hadoop.yml
ports:
  - "19870:9870"  # Use 19870 instead of 9870
```

---

### Problem: Container won't start

**Check logs**:
```bash
docker-compose -f docker-compose.hadoop.yml logs namenode
```

**Common causes**:
- Insufficient memory → Allocate more in Docker Desktop settings
- Disk full → Clean up: `docker system prune`

---

## 📚 Useful Commands

```bash
# View logs (real-time)
docker-compose -f docker-compose.hadoop.yml logs -f

# Execute HDFS command
docker exec hadoop-namenode hdfs dfs -ls /

# View file content
docker exec hadoop-namenode hdfs dfs -cat /user/admin/transactions/transactions.csv

# Access NameNode shell
docker exec -it hadoop-namenode bash

# Restart services
docker-compose -f docker-compose.hadoop.yml restart

# Remove everything (⚠️ deletes data)
docker-compose -f docker-compose.hadoop.yml down -v
```

---

## ✅ Comparison: Native vs Docker

### Native Hadoop (Current):
```bash
# Setup
1. Install Java
2. Download Hadoop
3. Fix JAVA_HOME paths
4. Configure hadoop-env.cmd
5. Fix permissions
6. Start services
Total: 1-2 hours

# Daily use
.\start-hadoop.cmd
# Sometimes fails, need to debug

# Uninstall
Manual cleanup, registry edits
```

### Docker Hadoop (Recommended):
```bash
# Setup
.\hadoop-docker-start.cmd
Total: 5 minutes (first time: 8 min with download)

# Daily use
.\hadoop-docker-start.cmd
# Always works consistently

# Uninstall
docker-compose down -v
# Clean removal, 10 seconds
```

---

## 🎓 For Your Thesis/Project

### Show in Presentation:

**Development**:
- ✅ "Used Docker for consistent environment"
- ✅ "Easy to replicate on any machine"
- ✅ "Follows industry best practices"

**Production**:
- ✅ "Deployed to cloud with Docker"
- ✅ "Scalable and maintainable"
- ✅ "Production-grade architecture"

**Bonus Points**:
- Container orchestration (Docker Compose)
- Microservices architecture
- DevOps practices
- Cloud-native deployment

---

## 💰 Cost Comparison

| Deployment | Monthly Cost | Effort | Recommended |
|------------|-------------|--------|-------------|
| Local only | $0 | Low | ✅ Development |
| DigitalOcean Droplet | $15 | Low | ✅ Production |
| AWS EC2 | $20-30 | Medium | ✅ Enterprise |
| AWS ECS | $30-40 | Low | ⚠️ Advanced |
| Native on Server | $50+ | High | ❌ Outdated |

---

## 🎯 Summary

### Before (Native Hadoop):
```
❌ Hard to setup (JAVA_HOME errors)
❌ Hard to maintain
❌ Hard to deploy
❌ Platform-specific
```

### After (Docker Hadoop):
```
✅ 5-minute setup
✅ One-command start/stop
✅ Easy cloud deployment
✅ Works everywhere
```

---

## 📞 Quick Reference

### Start Everything:
```bash
.\hadoop-docker-start.cmd
.\hadoop-docker-upload-data.cmd
npm run dev
```

### Access Points:
- Hadoop UI: http://localhost:9870
- Web Dashboard: http://localhost:3000/hadoop
- ResourceManager: http://localhost:8088

### Stop Everything:
```bash
.\hadoop-docker-stop.cmd
```

---

## ✅ Next Steps

1. ✅ Install Docker Desktop
2. ✅ Run `.\hadoop-docker-start.cmd`
3. ✅ Run `.\hadoop-docker-upload-data.cmd`
4. ✅ Start web app: `npm run dev`
5. ✅ Test dashboard: http://localhost:3000/hadoop

**Time to complete**: 10 minutes

---

**Recommendation**: Switch to Docker Hadoop immediately. It's easier, cleaner, and more professional.

**Migration**: No data loss. You can keep both (native uses port 9870, Docker can use different ports if needed).

---

**Created**: 2026-06-09
**Recommended for**: Development & Production
**Difficulty**: ⭐ Easy (1/5)
