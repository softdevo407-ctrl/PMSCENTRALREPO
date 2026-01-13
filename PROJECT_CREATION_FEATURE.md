# Project Creation Feature - Backend Integration

## Overview
Converted the hardcoded "+ New Project" feature in ProjectDirectorDashboard to use a backend REST API with full CRUD operations.

## Backend Changes

### 1. Entity Creation
**File:** `pms-backend/src/main/java/com/pms/entity/ProjectDefinition.java`
- Created ProjectDefinition JPA entity
- Fields: projectName, shortName, programmeName, category, budgetCode, leadCentre, sanctionedAmount, dates, status
- Relations: ManyToOne with User (projectDirector and programmeDirector)
- Auto-generated timestamps (createdDate, updatedDate)

**File:** `pms-backend/src/main/java/com/pms/entity/ProjectStatus.java`
- Created enum: ON_TRACK, AT_RISK, DELAYED, COMPLETED, ON_HOLD

### 2. DTO (Data Transfer Objects)
**File:** `pms-backend/src/main/java/com/pms/dto/ProjectDefinitionRequest.java`
- Input DTO for creating/updating projects
- Fields: projectName, shortName, programmeName, category, budgetCode, leadCentre, sanctionedAmount, endDate, programmeDirId
- All fields validated

**File:** `pms-backend/src/main/java/com/pms/dto/ProjectDefinitionResponse.java`
- Output DTO for returning project data
- Includes user names (projectDirectorName, programmeDirectorName)
- Includes both original and revised amounts/dates

### 3. Repository
**File:** `pms-backend/src/main/java/com/pms/repository/ProjectDefinitionRepository.java`
- JpaRepository for ProjectDefinition entity
- Custom queries:
  - findByProjectDirector() - Get projects by project director
  - findByProgrammeDirector() - Get projects by programme director
  - findByShortName() - Unique short name lookup
  - findByCategory() - Filter by category

### 4. Service
**File:** `pms-backend/src/main/java/com/pms/service/ProjectDefinitionService.java`
- Business logic for project operations
- Methods:
  - getAllProjects() - Get all projects
  - getProjectsByProjectDirector() - Get director's projects
  - getProjectsByProgrammeDirector() - Get programme director's projects
  - getProjectById() - Get single project
  - createProject() - Create new project with validations
  - updateProject() - Update existing project
  - deleteProject() - Delete project
- Validations:
  - Project director existence check
  - Unique short name validation
  - Date format parsing
- Automatic role mapping in responses

### 5. Controller
**File:** `pms-backend/src/main/java/com/pms/controller/ProjectDefinitionController.java`
- REST endpoints:
  - GET /projects - Get all projects
  - GET /projects/director/{id} - Get projects by director
  - GET /projects/programme/{id} - Get projects by programme director
  - GET /projects/{id} - Get single project
  - POST /projects - Create new project (authenticated)
  - PUT /projects/{id} - Update project
  - DELETE /projects/{id} - Delete project
- Automatic user extraction from Spring Security context
- CORS enabled for localhost:5173 and localhost:3000

### 6. Database Migration
**File:** `pms-backend/src/main/resources/db/migration/V002__create_project_definitions.sql`
- Creates project_definitions table with proper relationships
- Indexes on: project_director_id, programme_director_id, short_name, category, status
- Default status: ON_TRACK

## Frontend Changes

### 1. Project Service
**File:** `src/services/projectService.ts`
- New service for project API calls
- Methods:
  - getAllProjects() - GET /projects
  - getProjectsByDirector(id) - GET /projects/director/{id}
  - getProjectById(id) - GET /projects/{id}
  - createProject(data, token) - POST /projects
  - updateProject(id, data) - PUT /projects/{id}
  - deleteProject(id) - DELETE /projects/{id}
- Error handling with proper messages
- Authorization header support for authenticated requests

### 2. ProjectDirectorDashboard Component
**File:** `src/components/ProjectDirectorDashboard.tsx`
- Integrated with useAuth hook to get current user
- State management:
  - myProjects: Array of ProjectDefinitionResponse
  - loading: Fetch state
  - error: Error messages
- useEffect: Fetch projects when user ID changes
- Features:
  - Loading state with spinner
  - Error state with retry button
  - Empty state with create project button
  - Real project table with data from backend
  - Creates projects via API and refreshes list
- Status colors match API response format (ON_TRACK, AT_RISK, DELAYED)

## API Endpoints Summary

### Base URL: `http://localhost:7080/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | Get all projects |
| GET | /projects/{id} | Get specific project |
| GET | /projects/director/{id} | Get projects by director |
| GET | /projects/programme/{id} | Get projects by programme director |
| POST | /projects | Create new project (requires auth) |
| PUT | /projects/{id} | Update project |
| DELETE | /projects/{id} | Delete project |

## Request/Response Examples

### Create Project Request
```json
{
  "projectName": "Advanced Launch Vehicle Development",
  "shortName": "ALVD-2024",
  "programmeName": "Space Transportation Program",
  "category": "Launch Vehicles",
  "budgetCode": "LV-2024-001",
  "leadCentre": "Vikram Sarabhai Space Centre",
  "sanctionedAmount": 50000000,
  "endDate": "2025-12-31",
  "programmeDirId": 3
}
```

### Project Response
```json
{
  "id": 1,
  "projectName": "Advanced Launch Vehicle Development",
  "shortName": "ALVD-2024",
  "programmeName": "Space Transportation Program",
  "category": "Launch Vehicles",
  "budgetCode": "LV-2024-001",
  "leadCentre": "Vikram Sarabhai Space Centre",
  "projectDirectorId": 2,
  "projectDirectorName": "Rajesh Kumar",
  "programmeDirId": 3,
  "programmeDirectorName": "Amit Patel",
  "sanctionedAmount": 50000000,
  "sanctionedDate": "2026-01-12",
  "endDate": "2025-12-31",
  "status": "ON_TRACK",
  "createdDate": "2026-01-12T10:30:00"
}
```

## Testing Checklist

- [ ] Backend compiles without errors: `mvn clean compile`
- [ ] Backend builds successfully: `mvn package -DskipTests`
- [ ] Database migrations run: Check V002__create_project_definitions.sql
- [ ] Frontend compiles: `npm run dev`
- [ ] Login as Project Director
- [ ] Click "+ New Project" button
- [ ] Fill in form with valid data
- [ ] Click "Create Project"
- [ ] Project appears in table immediately (no refresh needed)
- [ ] Refresh page - project still persists
- [ ] Create multiple projects - all appear in list
- [ ] Status colors display correctly
- [ ] Project counts update in statistics
- [ ] Error handling works (test with invalid data)

## Deployment Steps

1. **Compile Backend**
   ```bash
   cd pms-backend
   mvn clean package -DskipTests
   ```

2. **Start Backend**
   ```bash
   java -jar target/pms-backend-1.0.0.jar
   ```
   - Database migrations auto-run on startup
   - projectDefinitions table created
   - Roles inserted if missing

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Test Flow**
   - Register/Login as Project Director
   - Navigate to dashboard
   - Create a new project via the form
   - Verify it appears in the table and persists on refresh

## Key Features

✅ Full backend API integration
✅ Database persistence
✅ Role-based access (Project Director specific)
✅ Input validation on both frontend and backend
✅ Error handling with user feedback
✅ Loading states
✅ Real-time list updates after creation
✅ Date formatting for display
✅ Budget amount formatting (Millions)
✅ Status tracking (ON_TRACK, AT_RISK, DELAYED)

## Notes

- User is automatically identified from JWT token in Authorization header
- Programme Director is optional when creating projects
- Sanctioned amount is converted to rupees (₹) for display
- End date is parsed from ISO format (YYYY-MM-DD)
- Project status defaults to "ON_TRACK" on creation
- All timestamps are UTC in database
