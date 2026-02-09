# Docker Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Issue: Docker Service Won't Start

### Symptoms
```
Error: Cannot connect to Docker daemon
```

### Solutions

**Solution 1: Docker Desktop Not Running**
1. Open Docker Desktop application
2. Wait for it to fully load (status icon at top)
3. Try again: `docker-compose up -d`

**Solution 2: Docker Service Crashed**
1. Restart Docker Desktop
   - Windows: Settings → General → Restart Docker
2. Or restart Windows

**Solution 3: Docker Permission Issues (Windows)**
1. Run PowerShell as Administrator
2. Check Docker status: `docker ps`
3. If still failing, reinstall Docker

---

## 🔴 Issue: Port Already in Use

### Symptoms
```
Error: bind: address already in use [:]:3000
Error: port is allocated
```

### Solution 1: Find & Kill Process (Windows)

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Output example:
# TCP  0.0.0.0:3000  0.0.0.0:0  LISTENING  12345

# Kill the process (replace 12345 with PID)
taskkill /PID 12345 /F
```

### Solution 2: Change Docker Port

Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8000:3000"    # Changed from 3000 to 8000

backend:
  ports:
    - "8080:7080"    # Changed from 7080 to 8080
```

Then restart:
```powershell
docker-compose down
docker-compose up -d
```

### Solution 3: Stop Conflicting Services

```powershell
# Stop Docker containers using that port
docker-compose down

# Stop other applications using the port
# (e.g., IIS, Node server, etc.)
```

---

## 🔴 Issue: Containers Start But Crash Immediately

### Symptoms
```
docker-compose ps shows "Exited" status
Container keeps restarting
```

### Solutions

**Check Logs First:**
```powershell
docker-compose logs -f
```

**Common Causes & Fixes:**

### Backend Crashes

#### Database Connection Error
```
Error: Connection to localhost:5432 refused
```

**Fix:** Database hasn't started yet
```powershell
# Wait for PostgreSQL to be ready
docker-compose logs postgres

# Restart backend
docker-compose restart backend
```

#### Out of Memory
```
OutOfMemoryError: Java heap space
```

**Fix:** Increase JVM memory in `docker-compose.yml`:
```yaml
backend:
  environment:
    JAVA_OPTS: -Xmx1g -Xms512m    # Increased to 1GB max
```

Rebuild and restart:
```powershell
docker-compose build
docker-compose up -d
```

#### Port Already in Use
```
Bind exception: Address already in use
```

**Fix:** Change backend port or kill process
```powershell
# Option 1: Change port in docker-compose.yml
# ports:
#   - "8080:7080"

# Option 2: Kill process using port 7080
netstat -ano | findstr :7080
taskkill /PID <PID> /F
```

### Frontend Crashes

```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Fix:** Rebuild frontend
```powershell
docker-compose build frontend --no-cache
docker-compose restart frontend
```

### Database Won't Start

```
Error: initdb failed
```

**Fix:** Remove corrupted volume and restart
```powershell
docker-compose down -v
docker-compose up -d
```

⚠️ **Warning:** This deletes all database data!

---

## 🔴 Issue: Frontend Can't Connect to Backend

### Symptoms
```
API calls return: Failed to fetch
CORS error in browser console
Connection refused
```

### Solutions

**Check Backend is Running:**
```powershell
docker-compose ps
# backend should show "Up"

# Check backend logs
docker-compose logs backend
```

**Test Backend Directly:**
```powershell
# From Windows
curl http://localhost:7080/api/health

# From frontend container
docker-compose exec frontend curl http://backend:7080/api/health
```

**Update CORS Configuration:**

Edit `docker-compose.yml` backend section:
```yaml
backend:
  environment:
    CORS_ALLOWED_ORIGINS: http://localhost:3000,http://frontend:3000,http://localhost:5173
```

Then restart:
```powershell
docker-compose restart backend
```

**Check API URL in Frontend:**

The frontend code should call:
```javascript
// Local development
fetch('http://localhost:7080/api/...')

// Or with environment variable
fetch(`${process.env.REACT_APP_API_URL}/...`)
```

---

## 🔴 Issue: Database Connection Fails

### Symptoms
```
org.postgresql.util.PSQLException: Connection to localhost:5432 refused
PSQLException: FATAL: Ident authentication failed
```

### Solutions

**Verify PostgreSQL is Running:**
```powershell
docker-compose ps
# postgres should show "Up"

docker-compose logs postgres
```

**Test Database Connection:**
```powershell
# From Windows
docker exec -it pms-postgres psql -U postgres -c "SELECT 1"

# Or with database
docker exec -it pms-postgres psql -U postgres -d bms -c "SELECT 1"
```

**Check Connection String:**

In `docker-compose.yml`, backend should use service name, not localhost:
```yaml
# ✗ WRONG (localhost)
SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/bms

# ✓ CORRECT (service name)
SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bms
```

**Database Credentials Mismatch:**

Verify credentials match:
```yaml
postgres:
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres

backend:
  environment:
    SPRING_DATASOURCE_USERNAME: postgres
    SPRING_DATASOURCE_PASSWORD: postgres
```

---

## 🔴 Issue: Slow or Out of Resources

### Symptoms
```
Containers running very slowly
System CPU/Memory maxed out
```

### Solutions

**Check Docker Resource Usage:**
```powershell
docker stats
```

**Limit Resource Usage:**

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

**Clean Up Unused Resources:**
```powershell
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything
docker system prune -a --volumes
```

**Increase Docker Desktop Resources:**
1. Docker Desktop Settings
2. Resources tab
3. Increase CPU, Memory, Disk
4. Apply & Restart

---

## 🔴 Issue: Build Fails

### Symptoms
```
Error during docker-compose build
Dockerfile syntax error
```

### Solutions

**Rebuild Without Cache:**
```powershell
docker-compose build --no-cache
```

**Validate docker-compose.yml:**
```powershell
docker-compose config
```

**Check for Syntax Errors:**
```powershell
# View the problematic file
code docker-compose.yml

# Common issues:
# - Missing colons in YAML
# - Incorrect indentation
# - Quotes not matching
```

**Backend Build Fails:**
```
Maven build failure
```

**Solution:**
```powershell
# Clean and rebuild
docker-compose build backend --no-cache

# If still failing, check pom.xml
# Verify all dependencies are available
```

**Frontend Build Fails:**
```
npm install error
```

**Solution:**
```powershell
# Clear node modules and rebuild
docker-compose build frontend --no-cache --no-build-cache

# Or manually clean
rm -r node_modules
docker-compose build frontend
```

---

## 🔴 Issue: Volumes Not Persisting Data

### Symptoms
```
Database data lost after restart
Files disappear from /uploads
```

### Solutions

**Verify Volumes Exist:**
```powershell
docker volume ls
# Should show "pms-postgres_data"
```

**Check Volume Mounting:**

In `docker-compose.yml`:
```yaml
services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
    driver: local
```

**Inspect Volume:**
```powershell
docker volume inspect postgres_data
```

**Don't Use Anonymous Volumes:**

❌ WRONG:
```yaml
volumes:
  - /var/lib/postgresql/data
```

✅ CORRECT:
```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

---

## 🔴 Issue: Cannot Access Application from Another Computer

### Symptoms
```
Can't connect to http://computer-ip:3000
Can't connect to http://computer-ip:7080
```

### Solutions

**Check if Windows Firewall is Blocking:**

```powershell
# Allow Docker ports through firewall
New-NetFirewallRule -DisplayName "Docker Frontend" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000

New-NetFirewallRule -DisplayName "Docker Backend" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 7080

New-NetFirewallRule -DisplayName "Docker Database" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5432
```

**Use Computer IP Instead of localhost:**

From another computer:
```
http://192.168.1.100:3000    (your computer's IP)
http://192.168.1.100:7080    (backend)
```

Find your IP:
```powershell
ipconfig
# Look for "IPv4 Address"
```

**Update CORS for External Access:**

Edit `docker-compose.yml`:
```yaml
backend:
  environment:
    CORS_ALLOWED_ORIGINS: http://192.168.1.100:3000,http://localhost:3000
```

---

## 🔴 Issue: Docker Desktop Out of Disk Space

### Symptoms
```
No space left on device
Error creating container
```

### Solutions

**Clean Up:**
```powershell
# Remove all unused images, containers, volumes
docker system prune -a --volumes

# Check disk space freed
```

**Increase Docker Desktop Disk:**

1. Docker Desktop Settings
2. Resources → Disk image size
3. Increase size
4. Apply & Restart

**Remove Large Images/Volumes:**
```powershell
# List images with size
docker images --format "table {{.Repository}}\t{{.Size}}"

# Remove specific image
docker rmi image-name

# Remove old volumes
docker volume prune
```

---

## 🟡 Warning: Slow Performance on Windows

### Root Cause
Windows file system mounting in Docker can be slow (especially with node_modules)

### Solutions

**Solution 1: Use Named Volumes (Recommended)**

```yaml
services:
  frontend:
    volumes:
      - frontend_data:/app/node_modules
      - .:/app

volumes:
  frontend_data:
```

**Solution 2: Use WSL2 Backend** (Recommended for Windows)

1. Windows → Settings → Docker Desktop
2. General → Use WSL 2 based engine
3. Restart Docker

**Solution 3: Adjust Resource Settings**

1. Docker Desktop Settings
2. Resources
3. Increase CPU cores and Memory
4. Apply & Restart

---

## 📋 Diagnostic Checklist

When something isn't working, go through this:

```powershell
# 1. Check Docker is running
docker ps

# 2. Check all containers
docker-compose ps

# 3. Check logs for errors
docker-compose logs

# 4. Check specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# 5. Test connectivity
docker-compose exec backend curl http://postgres:5432

# 6. Check resources
docker stats

# 7. Validate configuration
docker-compose config

# 8. Nuclear option - restart everything
docker-compose down -v
docker-compose up -d
```

---

## 🆘 Still Having Issues?

1. **Check the logs** - Most info is in logs
   ```powershell
   docker-compose logs -f
   ```

2. **Test individually** - Start one service at a time
   ```powershell
   docker-compose up -d postgres
   # Wait for it to be healthy
   docker-compose up -d backend
   # Test API
   docker-compose up -d frontend
   ```

3. **Use official Docker documentation**
   - https://docs.docker.com/
   - https://docs.docker.com/compose/

4. **Check service logs directly**
   ```powershell
   # PostgreSQL
   docker exec pms-postgres pg_dump -U postgres bms > backup.sql

   # Backend error log
   docker logs pms-backend

   # Frontend browser console
   Open http://localhost:3000 → F12 → Console tab
   ```

---

**Last Updated:** January 30, 2026
