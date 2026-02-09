# PMSApp Docker - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Docker Desktop installed and running
- Windows PowerShell or Command Prompt

### Step 1: Navigate to Project
```powershell
cd f:\21012026\PMSApp
```

### Step 2: Build & Start
```powershell
docker-compose up -d
```

### Step 3: Wait for Services (about 30 seconds)
```powershell
docker-compose ps
```

### Step 4: Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:7080/api
- **Database:** localhost:5432

---

## 📋 Command Cheat Sheet

| Command | Description |
|---------|-------------|
| `docker-compose build` | Build all images |
| `docker-compose up -d` | Start all services (background) |
| `docker-compose down` | Stop all services |
| `docker-compose ps` | Show running containers |
| `docker-compose logs -f` | View live logs |
| `docker-compose logs backend` | View backend logs only |
| `docker-compose restart` | Restart all services |
| `docker-compose exec backend sh` | Access backend container shell |
| `docker-compose down -v` | Remove all containers & volumes (⚠️ deletes data) |

---

## 🔧 Configuration

### Change Ports
Edit `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8000:3000"    # Access on localhost:8000

backend:
  ports:
    - "8080:7080"    # Access on localhost:8080

postgres:
  ports:
    - "5433:5432"    # Access on localhost:5433
```

### Change Database Credentials
Edit `docker-compose.yml`:
```yaml
postgres:
  environment:
    POSTGRES_DB: mydb
    POSTGRES_USER: myuser
    POSTGRES_PASSWORD: mypassword

backend:
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb
    SPRING_DATASOURCE_USERNAME: myuser
    SPRING_DATASOURCE_PASSWORD: mypassword
```

### Change JWT Secret (Important for Production!)
Edit `docker-compose.yml`:
```yaml
backend:
  environment:
    JWT_SECRET: your-very-long-random-string-256-bits-minimum
```

---

## 🎯 Common Tasks

### View Logs
```powershell
# All services
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail 100

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access Database
```powershell
# Connect to PostgreSQL
docker exec -it pms-postgres psql -U postgres -d bms

# Inside psql:
\dt                    # List tables
SELECT * FROM users;   # Query example
\q                     # Quit
```

### Check Service Health
```powershell
# Show status
docker-compose ps

# Check specific service
docker-compose exec backend curl http://localhost:7080/api/health
```

### Stop Everything (Keep Data)
```powershell
docker-compose down
```

### Complete Clean (Delete Everything)
```powershell
docker-compose down -v
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting

### Services won't start
```powershell
# Check logs
docker-compose logs

# Rebuild everything
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use
```powershell
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID 1234 /F

# Or change port in docker-compose.yml
```

### Database connection error
```powershell
# Check postgres is running
docker-compose logs postgres

# Verify connection
docker-compose exec postgres pg_isready -U postgres
```

### Frontend can't reach backend
```powershell
# Check backend is running
docker-compose logs backend

# Test API
docker-compose exec frontend curl http://backend:7080/api/health

# Or from host
curl http://localhost:7080/api/health
```

### Out of disk space
```powershell
# Clean up
docker system prune -a --volumes
```

---

## 📊 Service Details

### Frontend (React)
- **Container:** pms-frontend
- **Port:** 3000
- **Build:** Multi-stage, Alpine-based
- **Health Check:** Every 30 seconds

### Backend (Spring Boot)
- **Container:** pms-backend
- **Port:** 7080
- **Build:** Maven, JRE 17 Alpine
- **Health Check:** Every 30 seconds
- **Memory:** 256MB-512MB

### Database (PostgreSQL)
- **Container:** pms-postgres
- **Port:** 5432
- **Database:** bms
- **User:** postgres
- **Password:** postgres
- **Volume:** postgres_data (persistent)

---

## 🔐 Security Notes

1. ⚠️ Change `JWT_SECRET` in production
2. ⚠️ Change database password
3. ⚠️ Update `CORS_ALLOWED_ORIGINS` for your domain
4. ✅ All containers run with health checks
5. ✅ Network isolation with Docker bridge network
6. ✅ Volumes for data persistence

---

## 📈 Production Checklist

- [ ] Update JWT_SECRET to 256+ bit random string
- [ ] Change database password
- [ ] Update CORS_ALLOWED_ORIGINS to your domain
- [ ] Enable HTTPS/TLS on reverse proxy
- [ ] Set resource limits (CPU, Memory)
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Use managed database service (RDS, Azure, GCP)
- [ ] Implement CI/CD pipeline
- [ ] Monitor container health
- [ ] Set up alerting

---

## 📚 More Info

See `DOCKER_DEPLOYMENT_GUIDE.md` for detailed documentation

---

**Quick Help:**
```powershell
# Start everything
docker-compose up -d

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

**That's it!** Your PMSApp is now containerized and ready to deploy! 🎉
