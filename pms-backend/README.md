# PMS Backend - Spring Boot REST API

Project Management System Backend with Role-Based Access Control (RBAC)

## Features

- **Authentication & Authorization**: JWT-based authentication with RBAC
- **User Management**: Signup and login with employee codes
- **Role Management**: Support for multiple roles (Project Director, Programme Director, Chairman, Admin)
- **Database**: PostgreSQL with JPA/Hibernate
- **API Documentation**: RESTful endpoints for auth and user management

## Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 13+
- Port 7080 (configurable)

## Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE pms;
```

Update `src/main/resources/application.properties` with your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pms
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 2. Build the Project

```bash
mvn clean install
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

Or:

```bash
java -jar target/pms-backend-1.0.0.jar
```

The application will start on `http://localhost:7080/api`

## API Endpoints

### Authentication

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "employeeCode": "EMP001",
  "password": "password123",
  "confirmPassword": "password123",
  "agreeToTerms": true
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "employeeCode": "EMP001",
  "fullName": "John Doe",
  "role": "PROJECT_DIRECTOR",
  "success": true,
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "employeeCode": "EMP001",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "employeeCode": "EMP001",
  "fullName": "John Doe",
  "role": "PROJECT_DIRECTOR",
  "success": true,
  "message": "Login successful"
}
```

#### Health Check
```
GET /api/auth/health
```

### User Management

#### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>
```

#### Get User by ID (Admin/Chairman only)
```
GET /api/users/{id}
Authorization: Bearer <token>
```

#### Get All Users (Admin only)
```
GET /api/users
Authorization: Bearer <token>
```

## Default Roles

The system comes with 4 pre-configured roles:

1. **PROJECT_DIRECTOR** - Manages individual projects
2. **PROGRAMME_DIRECTOR** - Oversees multiple programs
3. **CHAIRMAN** - Executive oversight
4. **ADMIN** - Full system access

## JWT Configuration

Update in `application.properties`:

```properties
jwt.secret=your-secret-key-change-this-in-production-with-a-long-random-string-atleast-256-bits
jwt.expiration=86400000
```

## Security Features

- **Password Encryption**: BCrypt hashing
- **JWT Authentication**: Token-based stateless authentication
- **CORS Configuration**: Configured for frontend communication
- **Method-level Authorization**: @PreAuthorize annotations
- **Input Validation**: Jakarta validation annotations

## Demo Users

After initial setup, create demo users:

```bash
curl -X POST http://localhost:7080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "employeeCode": "EMP001",
    "password": "demo123",
    "confirmPassword": "demo123",
    "agreeToTerms": true
  }'
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `application.properties`
- Verify database `pms` exists

### JWT Token Invalid
- Token may have expired (24 hours)
- Secret key mismatch
- Include "Bearer " prefix in Authorization header

### CORS Issues
- Update allowed origins in `SecurityConfig.java` if using different port
- Ensure frontend sends "Authorization" header

## Project Structure

```
pms-backend/
├── src/main/java/com/pms/
│   ├── controller/        # REST API endpoints
│   ├── service/           # Business logic
│   ├── repository/        # Data access layer
│   ├── entity/            # JPA entities
│   ├── dto/               # Data transfer objects
│   ├── security/          # JWT & Security config
│   └── PmsApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/      # SQL migrations
└── pom.xml
```

## Technologies Used

- **Spring Boot 3.1.5**
- **Spring Security**
- **Spring Data JPA**
- **JWT (JJWT 0.12.3)**
- **PostgreSQL**
- **Lombok**
- **Maven**

## License

Proprietary - All rights reserved
