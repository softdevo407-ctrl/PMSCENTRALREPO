# Project Creation Feature - Quick Testing Guide

## Files Modified

### Backend
- ✅ `pms-backend/src/main/java/com/pms/entity/ProjectDefinition.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/entity/ProjectStatus.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/dto/ProjectDefinitionRequest.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/dto/ProjectDefinitionResponse.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/repository/ProjectDefinitionRepository.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/service/ProjectDefinitionService.java` - NEW
- ✅ `pms-backend/src/main/java/com/pms/controller/ProjectDefinitionController.java` - NEW
- ✅ `pms-backend/src/main/resources/db/migration/V002__create_project_definitions.sql` - NEW

### Frontend
- ✅ `src/services/projectService.ts` - NEW
- ✅ `src/components/ProjectDirectorDashboard.tsx` - MODIFIED

## Build & Test Steps

### 1. Build Backend
```bash
cd F:\PBEMS\pms-backend
mvn clean package -DskipTests
```
**Expected Output:** BUILD SUCCESS

### 2. Start Backend Server
```bash
java -jar F:\PBEMS\pms-backend\target\pms-backend-1.0.0.jar
```
**Expected Output:**
```
Started PmsApplication in X.XXX seconds
Tomcat started on port(s): 7080 (http)
```

### 3. Verify Backend Health
```bash
curl http://localhost:7080/api/auth/health
```
**Expected Response:**
```json
{"success":true,"message":"Backend is running"}
```

### 4. Start Frontend
In another terminal:
```bash
cd F:\PBEMS
npm run dev
```
**Expected Output:**
```
  VITE v... running at:
  ➜  Local:   http://localhost:5173/
```

### 5. Test Workflow

#### Step 5a: Create Test User (First Time)
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form:
   - Full Name: `Project Director Test`
   - Employee Code: `PD001`
   - Password: `Test@123`
   - Confirm: `Test@123`
   - **Role: Project Director** (IMPORTANT!)
   - Check terms
4. Click "Create Account"
5. Wait for "Redirecting in 3 seconds"
6. **Expected:** Dashboard loads automatically

#### Step 5b: Create New Project
1. On dashboard, click "+ New Project" button
2. Fill in the form:
   - **Project Name:** `Test Project Alpha`
   - **Short Name:** `TPA-2024`
   - **Programme Name:** `Test Program`
   - **Budget Code:** `TP-2024-001`
   - **Lead Centre:** `Test Centre`
   - **Category:** `Launch Vehicles` (select from dropdown)
   - **Sanctioned Amount:** `100` (will be converted to ₹100,000,000)
   - **End Date:** `2025-12-31` (any future date)
3. Click "Create Project"
4. **Expected Results:**
   - Success alert appears
   - Modal closes
   - Project appears in "Your Projects" table
   - Statistics update: Total = 1, On Track = 1
   - No page refresh needed

#### Step 5c: Verify Persistence
1. Press F5 to refresh page
2. **Expected:** Project still visible in table
3. **Verify:** Dashboard still shows the created project

#### Step 5d: Create Multiple Projects
1. Click "+ New Project" again
2. Create another project with different name:
   - **Project Name:** `Test Project Beta`
   - **Short Name:** `TPB-2024`
   - Other fields same
3. **Expected:** Both projects show in table
4. **Verify:** Statistics show Total = 2

## Expected Project Table Display

After creating projects, the table should show:

| Project Name | Status | Budget | Progress | End Date | Action |
|---|---|---|---|---|---|
| Test Project Alpha | ON_TRACK | ₹100.0M | 0% | 31-12-2025 | View |
| Test Project Beta | ON_TRACK | ₹100.0M | 0% | 31-12-2025 | View |

## Troubleshooting

### Issue: Projects not loading after login
**Solution:** 
- Check browser console (F12) for errors
- Verify backend is running on port 7080
- Check user is logged in and has role "Project Director"
- Clear localStorage and try again

### Issue: "Failed to create project" error
**Solution:**
- Check all form fields are filled
- Verify date is in future (YYYY-MM-DD format)
- Check backend logs for validation errors
- Ensure project short name is unique

### Issue: Backend won't start
**Solution:**
- Verify PostgreSQL is running
- Check database connection: `jdbc:postgresql://localhost:5432/pms`
- Verify database exists: `psql -U postgres -l`
- Check logs for migration errors

### Issue: TypeScript compilation errors
**Solution:**
- Run: `npm install`
- Delete node_modules: `rm -r node_modules` 
- Run: `npm install` again
- Restart dev server

## Database Verification

### Check Projects Table Created
```bash
psql -U postgres -d pms -c "SELECT * FROM project_definitions;"
```

### Check Project Created
```bash
psql -U postgres -d pms -c "SELECT id, project_name, short_name, status FROM project_definitions;"
```

### Check Project Director User
```bash
psql -U postgres -d pms -c "SELECT u.id, u.full_name, r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'PROJECT_DIRECTOR';"
```

## API Testing (cURL)

### Get All Projects
```bash
curl http://localhost:7080/api/projects
```

### Get Projects by Director ID
```bash
curl http://localhost:7080/api/projects/director/2
```

### Create Project (with auth token)
```bash
curl -X POST http://localhost:7080/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "projectName": "Test Project",
    "shortName": "TP-2024",
    "programmeName": "Test Program",
    "category": "Launch Vehicles",
    "budgetCode": "TP-001",
    "leadCentre": "Test Centre",
    "sanctionedAmount": 50000000,
    "endDate": "2025-12-31"
  }'
```

## Success Criteria Checklist

- [ ] Backend builds successfully
- [ ] Backend starts without errors
- [ ] Frontend runs without compilation errors
- [ ] Can login as Project Director
- [ ] Dashboard loads automatically after login
- [ ] "+ New Project" button visible
- [ ] Form opens and closes properly
- [ ] Can create project with valid data
- [ ] Project appears in table immediately
- [ ] Statistics update correctly
- [ ] Projects persist after page refresh
- [ ] Can create multiple projects
- [ ] Status displays as "ON TRACK"
- [ ] Budget displays in Millions format (₹XXX.XM)
- [ ] Date displays in correct format (DD-MM-YYYY)
- [ ] Error handling works with invalid data
- [ ] Loading spinner shows while fetching
- [ ] Empty state message shows when no projects
