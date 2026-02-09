# Project Actuals Backend API Documentation

## Overview
Complete REST API for managing project actuals (planned vs actual expenditure) with full CRUD operations and advanced filtering capabilities.

## Base URL
```
http://localhost:7080/api/project-actuals
```

## Database Table
```sql
CREATE TABLE pmsmaintables.projectactuals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    missionprojectcode VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    planned NUMERIC(18,2),
    actuals NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### 1. Get All Project Actuals
Retrieve all project actuals records from database.

**Request:**
```
GET /api/project-actuals
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "missionProjectCode": "2025P007",
    "year": 2017,
    "planned": 221.70,
    "actuals": 152.50,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  },
  {
    "id": 2,
    "missionProjectCode": "2025P007",
    "year": 2018,
    "planned": 1219.70,
    "actuals": 556.30,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  }
]
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

### 2. Get Project Actuals by Project Code
Retrieve actuals for a specific project, sorted by year.

**Request:**
```
GET /api/project-actuals/{missionProjectCode}
Authorization: Bearer {token}
```

**Example:**
```
GET /api/project-actuals/2025P007
```

**Response:**
```json
[
  {
    "id": 1,
    "missionProjectCode": "2025P007",
    "year": 2017,
    "planned": 221.70,
    "actuals": 152.50,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  },
  {
    "id": 2,
    "missionProjectCode": "2025P007",
    "year": 2018,
    "planned": 1219.70,
    "actuals": 556.30,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  }
]
```

**Status Codes:**
- `200 OK`: Success (returns empty array if no data)
- `400 Bad Request`: Invalid project code
- `500 Internal Server Error`: Server error

---

### 3. Get Distinct Project Codes
Get all unique project codes that have actuals data.

**Request:**
```
GET /api/project-actuals/codes/distinct
Authorization: Bearer {token}
```

**Response:**
```json
[
  "2025P007",
  "2025P008",
  "2025P009",
  "2025P010"
]
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

### 4. Get Actuals by Year Range
Retrieve actuals for all projects within a specific year range.

**Request:**
```
GET /api/project-actuals/range?startYear=2017&endYear=2020
Authorization: Bearer {token}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startYear | Integer | Yes | Start year (2000-2100) |
| endYear | Integer | Yes | End year (2000-2100) |

**Response:**
```json
[
  {
    "id": 1,
    "missionProjectCode": "2025P007",
    "year": 2017,
    "planned": 221.70,
    "actuals": 152.50,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  },
  {
    "id": 2,
    "missionProjectCode": "2025P007",
    "year": 2018,
    "planned": 1219.70,
    "actuals": 556.30,
    "createdAt": "2026-01-23T11:57:28",
    "updatedAt": "2026-01-23T11:57:28"
  }
]
```

**Validation Errors:**
```json
{
  "error": "Start year cannot be greater than end year"
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid year range
- `500 Internal Server Error`: Server error

---

### 5. Create Project Actuals
Create a new project actuals record.

**Request:**
```
POST /api/project-actuals
Content-Type: application/json
Authorization: Bearer {token}

{
  "missionProjectCode": "2025P007",
  "year": 2025,
  "planned": 1500.00,
  "actuals": 1200.50
}
```

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| missionProjectCode | String | Yes | Not blank, max 50 chars |
| year | Integer | Yes | 2000-2100 |
| planned | BigDecimal | Yes | >= 0.00 |
| actuals | BigDecimal | Yes | >= 0.00 |

**Response (201 Created):**
```json
{
  "id": 10,
  "missionProjectCode": "2025P007",
  "year": 2025,
  "planned": 1500.00,
  "actuals": 1200.50,
  "createdAt": "2026-01-23T12:30:45",
  "updatedAt": "2026-01-23T12:30:45"
}
```

**Validation Error Response:**
```json
{
  "error": "Year must be between 2000 and 2100"
}
```

**Status Codes:**
- `201 Created`: Successfully created
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

---

### 6. Update Project Actuals
Update an existing project actuals record. If record with same project code and year exists, it updates; otherwise creates new.

**Request:**
```
PUT /api/project-actuals/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "missionProjectCode": "2025P007",
  "year": 2025,
  "planned": 1600.00,
  "actuals": 1300.50
}
```

**Example:**
```
PUT /api/project-actuals/10
```

**Response (200 OK):**
```json
{
  "id": 10,
  "missionProjectCode": "2025P007",
  "year": 2025,
  "planned": 1600.00,
  "actuals": 1300.50,
  "createdAt": "2026-01-23T12:30:45",
  "updatedAt": "2026-01-23T12:35:20"
}
```

**Status Codes:**
- `200 OK`: Successfully updated
- `400 Bad Request`: Validation error
- `404 Not Found`: Record not found
- `500 Internal Server Error`: Server error

---

### 7. Delete Project Actuals by ID
Delete a specific project actuals record.

**Request:**
```
DELETE /api/project-actuals/{id}
Authorization: Bearer {token}
```

**Example:**
```
DELETE /api/project-actuals/10
```

**Response (204 No Content):**
```
(Empty body)
```

**Error Response (404):**
```json
{
  "error": "Project Actuals with id 10 not found"
}
```

**Status Codes:**
- `204 No Content`: Successfully deleted
- `404 Not Found`: Record not found
- `500 Internal Server Error`: Server error

---

### 8. Delete All Actuals for Project Code
Delete all project actuals records for a specific project.

**Request:**
```
DELETE /api/project-actuals/code/{missionProjectCode}
Authorization: Bearer {token}
```

**Example:**
```
DELETE /api/project-actuals/code/2025P007
```

**Response (204 No Content):**
```
(Empty body)
```

**Error Response (404):**
```json
{
  "error": "No project actuals found for code: 2025P007"
}
```

**Status Codes:**
- `204 No Content`: Successfully deleted
- `404 Not Found`: No records for project code
- `500 Internal Server Error`: Server error

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Mission Project Code is required"
}
```

**404 Not Found:**
```json
{
  "error": "Project Actuals with id 1 not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Implementation Details

### Files Created

1. **Entity**: `com.pms.entity.ProjectActuals`
   - JPA entity with auto-generated ID
   - Timestamps for created_at and updated_at
   - BigDecimal for precise financial values

2. **DTOs**: 
   - `com.pms.dto.ProjectActualsRequest` - Request validation
   - `com.pms.dto.ProjectActualsResponse` - Response serialization

3. **Repository**: `com.pms.repository.ProjectActualsRepository`
   - Extends JpaRepository
   - Custom queries for filtering by project code, year range
   - Distinct project code lookup

4. **Service**: `com.pms.service.ProjectActualsService`
   - Business logic layer
   - Validation and error handling
   - Data transformation

5. **Controller**: `com.pms.controller.ProjectActualsController`
   - REST endpoint definitions
   - Request validation
   - Response formatting
   - Comprehensive logging

---

## Usage Examples

### JavaScript/TypeScript Frontend

```typescript
// Fetch all actuals
const response = await fetch('http://localhost:7080/api/project-actuals', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const allActuals = await response.json();

// Fetch for specific project
const projectActuals = await fetch('http://localhost:7080/api/project-actuals/2025P007', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await projectActuals.json();

// Create new record
const newRecord = await fetch('http://localhost:7080/api/project-actuals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    missionProjectCode: '2025P007',
    year: 2025,
    planned: 1500.00,
    actuals: 1200.50
  })
});
const created = await newRecord.json();
```

### cURL Examples

```bash
# Get all actuals
curl -X GET http://localhost:7080/api/project-actuals \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific project
curl -X GET http://localhost:7080/api/project-actuals/2025P007 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create new record
curl -X POST http://localhost:7080/api/project-actuals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "missionProjectCode": "2025P007",
    "year": 2025,
    "planned": 1500.00,
    "actuals": 1200.50
  }'

# Update record
curl -X PUT http://localhost:7080/api/project-actuals/10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "missionProjectCode": "2025P007",
    "year": 2025,
    "planned": 1600.00,
    "actuals": 1300.50
  }'

# Delete record
curl -X DELETE http://localhost:7080/api/project-actuals/10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All amounts are in ₹ Crores
- Timestamps are in ISO 8601 format (UTC)
- BigDecimal with 18 digits total, 2 decimal places
- Authentication required for all endpoints
- CORS enabled for frontend at `http://localhost:5173`
- Comprehensive logging at INFO level for audit trail
