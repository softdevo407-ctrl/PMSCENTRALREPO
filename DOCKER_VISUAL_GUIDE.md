# PMSApp Docker Deployment - Visual Guide & Diagrams

## 🏗️ Architecture Overview

### Complete System Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         USER'S BROWSER                                ║
╚═══════════════════════════════════════════════════════════════════════╝
                              ↓
                    http://localhost:3000
                              ↓
╔═══════════════════════════════════════════════════════════════════════╗
║                         DOCKER HOST (Windows PC)                       ║
║                                                                        ║
║  ┌────────────────────────────────────────────────────────────────┐  ║
║  │            Docker Network: pms-network (bridge)               │  ║
║  │                                                                │  ║
║  │  ┌──────────────────────┐    ┌──────────────────────┐        │  ║
║  │  │  FRONTEND CONTAINER  │    │  BACKEND CONTAINER   │        │  ║
║  │  │ (pms-frontend)       │    │ (pms-backend)        │        │  ║
║  │  │                      │    │                      │        │  ║
║  │  │ Node 18 Alpine       │    │ JRE 17 Alpine        │        │  ║
║  │  │ React App (Vite)     │    │ Spring Boot 3.1.5    │        │  ║
║  │  │                      │    │ Maven Build          │        │  ║
║  │  │ :3000               │    │ :7080                │        │  ║
║  │  │                      │    │ /api                 │        │  ║
║  │  │ serve dist           │    │ Health: /api/health  │        │  ║
║  │  │                      │    │ Memory: 512MB max    │        │  ║
║  │  │ Health Check: 30s    │    │ Health Check: 30s    │        │  ║
║  │  └──────────────────────┘    └──────────┬───────────┘        │  ║
║  │           ↓                             ↓                    │  ║
║  │      Calls API                   Connects to DB              │  ║
║  │      http://backend:7080          jdbc:postgresql://        │  ║
║  │      /api                         postgres:5432/bms         │  ║
║  │                                                               │  ║
║  │                    ┌──────────────────────────┐              │  ║
║  │                    │  DATABASE CONTAINER      │              │  ║
║  │                    │ (pms-postgres)           │              │  ║
║  │                    │                          │              │  ║
║  │                    │ PostgreSQL 15 Alpine     │              │  ║
║  │                    │ :5432                    │              │  ║
║  │                    │ Database: bms            │              │  ║
║  │                    │ User: postgres           │              │  ║
║  │                    │ Pass: postgres           │              │  ║
║  │                    │ Health Check: 10s        │              │  ║
║  │                    │                          │              │  ║
║  │                    │ Volume:                  │              │  ║
║  │                    │ postgres_data (📁)       │              │  ║
║  │                    └──────────────────────────┘              │  ║
║  │                                                               │  ║
║  │  Service Dependencies:                                       │  ║
║  │  Backend ← PostgreSQL (depends_on: postgres healthy)         │  ║
║  │  Frontend ← Backend (depends_on: backend running)            │  ║
║  └────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║                         EXPOSED PORTS                                 ║
║  Port 3000 → pms-frontend:3000 (React App)                           ║
║  Port 7080 → pms-backend:7080 (REST API)                            ║
║  Port 5432 → pms-postgres:5432 (Database)                           ║
║                                                                        ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 📦 Build Process Flow

### Frontend Build Pipeline
```
Source Code (TypeScript + React)
         ↓
    npm install
         ↓
    npm run build (Vite)
         ↓
    dist/ folder created
         ↓
    Docker Multi-Stage Build
         ↓
    Stage 1: Builder (Node 18 Alpine)
         ├─ Copy source
         ├─ npm ci
         └─ npm run build → produces dist/
         ↓
    Stage 2: Runtime (Node 18 Alpine)
         ├─ npm install -g serve
         ├─ Copy dist from builder
         └─ serve -s dist -l 3000
         ↓
    Final Image: pms-frontend:latest
    Size: ~200MB
```

### Backend Build Pipeline
```
Source Code (Java + Spring Boot)
         ↓
    Maven (pom.xml)
         ↓
    Docker Multi-Stage Build
         ↓
    Stage 1: Builder (Maven 3.9 + JDK 17)
         ├─ Copy pom.xml
         ├─ mvn dependency:go-offline
         ├─ Copy src
         └─ mvn clean package → JAR file
         ↓
    Stage 2: Runtime (JRE 17 Alpine)
         ├─ Copy JAR from builder
         └─ java -jar app.jar
         ↓
    Final Image: pms-backend:latest
    Size: ~350MB
```

---

## 🔄 Data Flow Diagram

### Application Flow
```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                    │
└─────────────────────────────────────────────────────────┘
         ↓
   1. User opens browser
   2. Navigates to http://localhost:3000
         ↓
┌─────────────────────────────────────────────────────────┐
│           FRONTEND (React / TypeScript)                 │
│  - Displays UI components                              │
│  - Handles user input                                  │
│  - Makes API calls to backend                          │
└─────────────────────────────────────────────────────────┘
         ↓
   API Request: GET/POST/PUT/DELETE
   Endpoint: http://localhost:7080/api/...
   Headers: Authorization, Content-Type
   Body: JSON data
         ↓
┌─────────────────────────────────────────────────────────┐
│           BACKEND (Spring Boot)                         │
│  - Receives HTTP request                               │
│  - Validates data                                      │
│  - Processes business logic                            │
│  - Queries database                                    │
└─────────────────────────────────────────────────────────┘
         ↓
   SQL Query (JPA/Hibernate)
   - SELECT, INSERT, UPDATE, DELETE
   - Connection: jdbc:postgresql://postgres:5432/bms
         ↓
┌─────────────────────────────────────────────────────────┐
│           DATABASE (PostgreSQL)                         │
│  - Executes SQL query                                  │
│  - Returns result set                                  │
│  - Persists data in postgres_data volume               │
└─────────────────────────────────────────────────────────┘
         ↓
   SQL Result
   Tables: users, projects, roles, etc.
         ↓
┌─────────────────────────────────────────────────────────┐
│           BACKEND (Spring Boot)                         │
│  - Converts result to JSON                             │
│  - Returns HTTP response                               │
└─────────────────────────────────────────────────────────┘
         ↓
   API Response (JSON)
   Status: 200, 400, 500, etc.
   Body: Data
         ↓
┌─────────────────────────────────────────────────────────┐
│           FRONTEND (React)                              │
│  - Parses JSON response                                │
│  - Updates UI                                          │
│  - Shows data to user                                  │
└─────────────────────────────────────────────────────────┘
         ↓
   User sees updated information
```

---

## 🚀 Deployment Lifecycle

### Container Startup Sequence
```
docker-compose up -d
         ↓
┌─────────────────┐
│ PostgreSQL      │  Start immediately
│ Container       │  Wait for pg_isready
│ (pms-postgres)  │  
└────────┬────────┘
         ↓ (port 5432 ready)
         ↓ (health check passes)
         ↓
┌─────────────────┐
│ Backend         │  Waits for PostgreSQL to be healthy
│ Container       │  Then starts
│ (pms-backend)   │  Connects to database
│                 │  Loads Spring Boot
└────────┬────────┘
         ↓ (port 7080 ready)
         ↓ (health check passes: /api/health)
         ↓
┌─────────────────┐
│ Frontend        │  Waits for Backend to be running
│ Container       │  Then starts
│ (pms-frontend)  │  Serves React app
│                 │  Ready to accept connections
└────────┬────────┘
         ↓ (port 3000 ready)
         ↓ (health check passes)
         ↓
All Services Ready! 🎉
         ↓
User can access:
- http://localhost:3000 (Frontend)
- http://localhost:7080/api (Backend)
- localhost:5432 (Database)
```

### Container Shutdown Sequence
```
docker-compose down
         ↓
┌─────────────────────────────────┐
│ Graceful Shutdown Initiated     │
│ 10 second timeout per container │
└────────────┬────────────────────┘
             ↓
┌─────────────────┐
│ Frontend        │  Stops accepting requests
│ Container       │  Gracefully shuts down
│ (pms-frontend)  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Backend         │  Closes connections
│ Container       │  Saves state
│ (pms-backend)   │  Shuts down Spring Boot
└────────┬────────┘
         ↓
┌─────────────────┐
│ PostgreSQL      │  Closes connections
│ Container       │  Saves data
│ (pms-postgres)  │  postgres_data volume persisted
└────────┬────────┘
         ↓
All Containers Stopped ✓
Data Persisted ✓
```

---

## 📊 File Organization

### Docker Files
```
PMSApp/
├── Dockerfile.frontend      ← Frontend build instructions
├── Dockerfile.backend       ← Backend build instructions
├── docker-compose.yml       ← Service orchestration
├── .dockerignore            ← Frontend exclusions
└── pms-backend/
    └── .dockerignore        ← Backend exclusions
```

### Configuration Files
```
PMSApp/
├── .env.example             ← Environment variables template
├── docker-compose.yml       ← All service configs
└── pms-backend/
    └── src/main/resources/
        └── application.properties  ← Spring Boot config
```

### Documentation
```
PMSApp/
├── DOCKER_DEPLOYMENT_GUIDE.md       ← Complete guide
├── DOCKER_QUICK_REFERENCE.md        ← Quick commands
├── DOCKER_TROUBLESHOOTING.md        ← Problem solutions
├── DOCKER_SETUP_SUMMARY.md          ← Setup summary
└── DOCKER_DEPLOYMENT_COMPLETE.md    ← Confirmation
```

---

## 🔌 Port Mapping Diagram

```
┌────────────────────────────┐         ┌──────────────────────┐
│   Host Machine (Windows)   │         │   Docker Container   │
│                            │         │                      │
│  localhost:3000 ◄────────► port 3000 │ pms-frontend:3000    │
│  (Browser Access)          │         │ (React App)          │
│                            │         └──────────────────────┘
├────────────────────────────┤
│  localhost:7080 ◄────────► port 7080 │ pms-backend:7080     │
│  (API Calls)               │         │ (Spring Boot)        │
│                            │         └──────────────────────┘
├────────────────────────────┤
│  localhost:5432 ◄────────► port 5432 │ pms-postgres:5432    │
│  (Database Tools)          │         │ (PostgreSQL)         │
│                            │         └──────────────────────┘
└────────────────────────────┘
```

---

## 💾 Volume Mapping Diagram

```
Host File System              Container File System
                                    
F:\21012026\PMSApp/
  pms-backend/
    uploads/ ◄──────────┬──────► /app/uploads
    (local files)       │       (container files)
                        │
                        │ Shared volume
                        │
                        ▼
                   Files persist
               between restarts!


Docker Named Volume:
  
  postgres_data (named volume)
        ↓
  ┌─────────────────────────┐
  │ Stored on Host Machine  │
  │ (/var/lib/docker/       │
  │  volumes/...)           │
  │                         │
  │ Container:              │
  │ /var/lib/postgresql/    │
  │ data/pgdata             │
  └─────────────────────────┘
        ↓
  Persists Database
  Between Restarts!
```

---

## 🔒 Security Layers Diagram

```
┌─────────────────────────────────────────────────┐
│          Security Implementation                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: Network Isolation                    │
│  ──────────────────────────────                │
│  Services communicate via Docker Network       │
│  Only exposed ports accessible                 │
│                                                │
│           Frontend         Backend             │
│             ↓                 ↓                │
│         pms-network ◄──────────┘               │
│                                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 2: Service Authentication               │
│  ────────────────────────────────              │
│  • Database credentials (postgres/postgres)   │
│  • JWT for API authentication                 │
│  • Spring Security                            │
│                                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 3: Data Protection                      │
│  ──────────────────────────                   │
│  • Persistent volumes                         │
│  • Encrypted connections (configurable)       │
│  • CORS configuration                         │
│                                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 4: Health Monitoring                    │
│  ──────────────────────────────               │
│  • Container health checks                    │
│  • Service restart policies                   │
│  • Dependency validation                      │
│                                                │
└─────────────────────────────────────────────────┘
```

---

## 📈 Performance & Scaling

### Resource Usage Per Service
```
┌─────────────────────────────────────────────┐
│ Frontend (pms-frontend)                     │
│ Image Size: ~200MB                          │
│ Memory: 100-300MB runtime                   │
│ CPU: Minimal (static serving)               │
│ Storage: 0 (stateless)                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Backend (pms-backend)                       │
│ Image Size: ~350MB                          │
│ Memory: 256MB-512MB (JVM heap)              │
│ CPU: Varies (depends on load)               │
│ Storage: Logs (configured)                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Database (pms-postgres)                     │
│ Image Size: ~60MB                           │
│ Memory: 200MB-1GB (buffer pools)            │
│ CPU: High during queries                    │
│ Storage: Variable (data volume)             │
└─────────────────────────────────────────────┘
```

### Scaling Strategy
```
Single Instance Setup (Current)
    ┌───────────────────────┐
    │  pms-frontend (x1)    │
    │  pms-backend (x1)     │
    │  pms-postgres (x1)    │
    └───────────────────────┘
            ↓
    Suitable for: Development, Testing
    Max users: ~50

Horizontal Scaling (Future)
    ┌───────────────────────┐
    │ Load Balancer (Nginx) │
    └───────────┬───────────┘
                ├─────────────┬─────────────┐
    ┌───────────▼────┐ ┌─────▼────────┐ ┌──▼──────────┐
    │ pms-backend-1  │ │pms-backend-2 │ │pms-backend-3│
    └────────────────┘ └──────────────┘ └─────────────┘
                └──────────┬──────────┘
            ┌──────────────▼──────────────┐
            │   pms-postgres (managed)    │
            │   AWS RDS / Azure Database  │
            └─────────────────────────────┘
    Suitable for: Production
    Max users: 1000+
```

---

## 🎯 Command Flow Diagram

### Starting Services
```
User Command
    ↓
docker-compose up -d
    ↓
┌─────────────────────────┐
│ Read docker-compose.yml │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ Create Docker network   │
│ (pms-network)           │
└────────┬────────────────┘
         ↓
┌──────────────────────────────────┐
│ Start PostgreSQL Container       │
│ - Pull image (if needed)         │
│ - Create container               │
│ - Mount volumes                  │
│ - Wait for health check          │
└────────┬─────────────────────────┘
         ↓ (postgres healthy)
┌──────────────────────────────────┐
│ Start Backend Container          │
│ - Build image (if needed)        │
│ - Create container               │
│ - Set environment vars           │
│ - Wait for health check          │
└────────┬─────────────────────────┘
         ↓ (backend healthy)
┌──────────────────────────────────┐
│ Start Frontend Container         │
│ - Build image (if needed)        │
│ - Create container               │
│ - Wait for health check          │
└────────┬─────────────────────────┘
         ↓
    ✓ All Services Ready!
    ↓
User can access application
```

---

## 📞 Quick Reference Diagram

```
QUICK REFERENCE FLOWCHART

                        Want to...?
                           ↓
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
    START APP         STOP APP          CHECK LOGS
        │                  │                  │
        ↓                  ↓                  ↓
    docker-compose      docker-compose   docker-compose
    up -d               down             logs -f
        │                  │                  │
        ↓                  ↓                  ↓
    Wait 30s           Container         Real-time logs
        ↓              stops              all services
    Check:             Data saved         ↓
    localhost:3000                    Press Ctrl+C
         ✓                            to exit


TROUBLESHOOTING FLOWCHART

                    Something Wrong?
                           ↓
                    Check logs first
                           ↓
            docker-compose logs -f
                           ↓
        ┌────────────────┬─────────────┬──────────────┐
        │                │             │              │
    Backend         Frontend        Database      Other
    error?          error?          error?        issue?
        │                │             │              │
        ↓                ↓             ↓              ↓
    Check API        Check CORS    Check pg_     Try:
    connection       setting       isready      rebuild
        │                │             │         clean
        ↓                ↓             ↓         restart
    See Docker       Update         Port in
    Troubleshooting  CORS in        use?
    Guide            docker-        Kill
                     compose.yml    process
```

---

**Visual Guide Created:** January 30, 2026  
**For detailed information, see the accompanying documentation files.**
