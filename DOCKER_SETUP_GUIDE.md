# 🐳 Complete Docker Setup Guide

## ✅ Issues Fixed & Root Causes

### 1️⃣ Database Table Missing Error
**Error**: `The table main.Project does not exist in the current database`

**Root Cause**:
- Migrations folder was being ignored in `.dockerignore` (line 20)
- Database was being created empty without running migrations

**Fix Applied**:
- ✅ Fixed `.dockerignore` to include `prisma/migrations`
- ✅ Added automatic migration execution in `docker-entrypoint.sh`

---

### 2️⃣ Prisma Engine Compatibility
**Error**: Platform mismatch between build and runtime

**Root Cause**:
- Different OS platforms (Windows vs Debian Linux)
- Prisma engines generated for wrong platform

**Fix Applied**:
- ✅ Added multi-platform `binaryTargets` in `prisma/schema.prisma`
- ✅ Switched to Debian base image for better compatibility

---

### 3️⃣ Volume Mounting Conflicts
**Issue**: Database persistence vs source code hot reload

**Fix Applied**:
- ✅ Optimized volume mounting strategy
- ✅ Separated source code from persisted data

---

## 🚀 Quick Start - Complete Setup

### Step 1: Clean & Start Fresh
```powershell
# Stop and remove all existing containers/volumes
docker compose down -v

# Build and start fresh
docker compose up --build -d
```

### Step 2: Initialize Database
```powershell
# Wait 30 seconds for container to fully start, then:

# 1. Run database migrations
docker compose exec app npx prisma migrate deploy

# 2. Seed the database with initial data
docker compose exec app npm run db:seed
```

### Step 3: Verify Setup
```powershell
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Access application
# Open browser: http://localhost:30001
```

---

## 📋 Complete Troubleshooting Reference

### If Database Issues Persist

#### Option 1: Reset Everything
```powershell
# COMPLETE RESET
docker compose down -v
docker system prune -f
docker compose up --build -d

# Wait for container, then run
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

#### Option 2: Database Push (Development Only)
```powershell
# Alternative - push schema directly (bypasses migrations)
docker compose exec app npx prisma db push

# Then seed
docker compose exec app npm run db:seed
```

---

## 🔧 Individual Docker Commands Reference

### Container Management
```powershell
# Start
docker compose up -d

# Stop
docker compose down

# Stop and delete volumes (DANGER: DELETES DATA)
docker compose down -v

# Restart
docker compose restart

# View status
docker compose ps
```

### Logs & Diagnostics
```powershell
# View logs
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100
```

### Inside the Container
```powershell
# Get a shell
docker compose exec app bash

# Run Prisma commands
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate status
docker compose exec app npx prisma studio
```

---

## 📁 File Changes Recap

All fixed/modified files:
1. `prisma/schema.prisma` - Multi-platform binary targets
2. `.dockerignore` - Include migrations folder
3. `docker-compose.yml` - Volume optimization
4. `Dockerfile` - Entrypoint + Debian base
5. `docker-entrypoint.sh` - Auto-initialization (new file)

---

## 💡 Development Tips

### Hot Reload
- Code changes in `./app`, `./components`, `./features` sync automatically
- Page refresh shows changes in browser

### Database
- Database is persisted in Docker volume `app_prisma_data`
- To reset: `docker compose down -v && docker compose up -d`

---

## ✅ Health Check List

After setup, verify:
- [ ] Container status: `Up (healthy)`
- [ ] Dashboard loads without database errors
- [ ] Can navigate between pages
- [ ] Tasks and Projects show up (if seeded)
- [ ] No "table does not exist" errors

---

## 🆘 Still Stuck?

Check these files for more info:
- `TROUBLESHOOTING.md` - Detailed troubleshooting
- `DOCKER.md` - Docker basics
- `PORT_CONFIG.md` - Port management

**Last Resort**: Delete everything and rebuild from scratch!
