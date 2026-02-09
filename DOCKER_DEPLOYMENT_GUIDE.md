# PMSApp Docker Deployment Guide

## Overview
This guide explains how to deploy the PMSApp (React + Spring Boot + PostgreSQL) using Docker and Docker Compose.

## Prerequisites

### Required Software
1. **Docker** - [Install Docker](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** - Included with Docker Desktop
3. **Git** (optional, for cloning)

### Verify Installation
```bash
docker --version
docker-compose --version
```

---

## Project Structure

```
PMSApp/
├── Dockerfile.frontend          # Frontend (React) Docker image
├── Dockerfile.backend           # Backend (Spring Boot) Docker image
├── docker-compose.yml           # Orchestration file for all services
├── .dockerignore                # Frontend dockerignore
├── pms-backend/
│   ├── .dockerignore            # Backend dockerignore
│   ├── pom.xml                  # Maven configuration
│   ├── src/                     # Source code
│   └── target/                  # Built JAR (generated)
├── src/                         # React source code
├── package.json                 # Node dependencies
└── [Other frontend files]
```

---

## Deployment Steps

### Step 1: Prepare the Environment

Navigate to the project root directory:
```bash
cd f:\21012026\PMSApp
```

### Step 2: Build All Images

Build the Docker images for all services:
```bash
docker-compose build
```

This will:
- Build the React frontend image
- Build the Spring Boot backend image
- Pull the PostgreSQL image

### Step 3: Start All Services

Start all containers:
```bash
docker-compose up -d
```

**Flags:**
- `-d` : Run in detached mode (background)
- Remove `-d` to see logs in real-time: `docker-compose up`

### Step 4: Verify Services are Running

Check container status:
```bash
docker-compose ps
```

You should see:
- `pms-postgres` - PostgreSQL database (port 5432)
- `pms-backend` - Spring Boot backend (port 7080)
- `pms-frontend` - React frontend (port 3000)

---

## Accessing the Application

### Frontend
- **URL:** http://localhost:3000
- Access the React application here

### Backend API
- **Base URL:** http://localhost:7080/api
- Use for API calls and testing

### Database
- **Host:** localhost
- **Port:** 5432
- **Database:** bms
- **Username:** postgres
- **Password:** postgres

---

## Common Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```
(Warning: This removes the PostgreSQL volume and all data)

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Start Fresh
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Access Container Shell
```bash
# Backend
docker exec -it pms-backend /bin/sh

# Frontend
docker exec -it pms-frontend /bin/sh

# Database
docker exec -it pms-postgres psql -U postgres
```

---

## Configuration

### Environment Variables

Edit `docker-compose.yml` to customize:

```yaml
# Backend Configuration
environment:
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/bms
  SPRING_DATASOURCE_USERNAME: postgres
  SPRING_DATASOURCE_PASSWORD: postgres
  JWT_SECRET: your-secret-key-change-this-in-production-with-a-long-random-string-atleast-256-bits
  CORS_ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173,http://frontend:3000
```

### Database Initialization

If you have a backup file (`backup.dump`), it will be automatically imported. Alternatively, modify the Dockerfile to run SQL scripts:

```yaml
volumes:
  - ./backup.dump:/docker-entrypoint-initdb.d/init.sql
```

### Port Configuration

Change ports in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3000:3000"  # HOST:CONTAINER
  
  backend:
    ports:
      - "7080:7080"
  
  postgres:
    ports:
      - "5432:5432"
```

---

## Production Deployment

### 1. Update Environment Variables
```yaml
# Use strong passwords and secrets
environment:
  SPRING_DATASOURCE_PASSWORD: <strong-password>
  JWT_SECRET: <long-random-string-256-bits>
  CORS_ALLOWED_ORIGINS: https://yourdomain.com
```

### 2. Use Production-Grade Database
Consider using managed PostgreSQL services (AWS RDS, Azure Database, etc.)

### 3. Add Reverse Proxy (Nginx/Traefik)
Use a reverse proxy for better security and load balancing

### 4. Enable HTTPS/TLS
Add SSL certificates for secure communication

### 5. Implement Health Checks
All services have health checks configured:
- Backend: `/api/health` endpoint
- Frontend: Port 3000 health check
- Database: `pg_isready` check

### 6. Resource Limits
Add resource constraints to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Troubleshooting

### 1. Port Already in Use
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### 2. Database Connection Error
```bash
# Check if postgres is running
docker-compose ps

# Check postgres logs
docker-compose logs postgres

# Verify connection string in backend logs
docker-compose logs backend
```

### 3. Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Verify backend is running: `docker-compose logs backend`

### 4. Out of Disk Space
```bash
# Clean up unused images and volumes
docker system prune -a --volumes
```

### 5. Build Fails
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check for syntax errors
docker-compose config
```

---

## Deployment to Cloud Platforms

### Docker Hub
```bash
# Tag image
docker tag pms-frontend:latest yourusername/pms-frontend:latest

# Push to Docker Hub
docker push yourusername/pms-frontend:latest
```

### AWS (ECS)
Use AWS ECR and ECS Fargate for managed container deployment

### Google Cloud (GKE)
Deploy using Kubernetes for scalability

### Azure (ACI/AKS)
Use Azure Container Instances or Kubernetes Service

---

## Performance Tips

1. **Use multi-stage builds** - Already implemented in Dockerfiles
2. **Optimize layer caching** - Order commands by frequency of change
3. **Minimize image size** - Use Alpine Linux for base images
4. **Health checks** - Monitor container health
5. **Resource limits** - Prevent runaway containers
6. **Volume mounts** - Use for logs and data persistence

---

## Security Best Practices

1. ✅ Don't store secrets in Dockerfiles
2. ✅ Use environment variables for configuration
3. ✅ Keep base images updated
4. ✅ Scan images for vulnerabilities
5. ✅ Use strong database passwords
6. ✅ Enable HTTPS in production
7. ✅ Implement rate limiting
8. ✅ Use network isolation (Docker networks)

---

## Next Steps

1. Verify all services are running
2. Test API endpoints
3. Configure environment variables for production
4. Set up automated backups for database
5. Implement CI/CD pipeline
6. Monitor logs and performance
7. Plan scaling strategy

---

## Support & Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [React in Docker](https://create-react-app.dev/deployment/)

---

**Last Updated:** January 30, 2026
**Version:** 1.0.0
