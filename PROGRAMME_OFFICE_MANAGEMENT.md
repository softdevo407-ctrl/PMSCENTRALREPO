# Programme Office Management - CRUD Implementation

## Overview
Complete CRUD (Create, Read, Update, Delete) system for managing Programme Office data in the admin dashboard with full validations.

## Features
- **Create**: Add new programme offices with automatic validation
- **Read**: View all, active, or inactive programme offices
- **Update**: Modify existing programme office details
- **Deactivate**: Set toDate to make offices inactive (without deletion)
- **Delete**: Permanently remove programme offices
- **Filtering**: View by status (All, Active, Inactive)
- **Validations**: Comprehensive form validations on both frontend and backend

## Backend Components

### 1. Entity (`ProgrammeOffice.java`)
- Location: `/pms-backend/src/main/java/com/pms/entity/ProgrammeOffice.java`
- Mapped to table: `pmsgeneric.programmeoffice`
- Key fields:
  - `programmeOfficeCode` (PK, max 5 chars)
  - `programmeOfficeFullName` (required)
  - `programmeOfficeShortName` (required, unique)
  - `hierarchyOrder` (required, positive number)
  - `fromDate` (required)
  - `toDate` (optional - empty = active indefinitely)
  - `userId` (required)
  - `regStatus` (required, single character)
- Method: `isActive()` - returns true if toDate is null or in future

### 2. Repository (`ProgrammeOfficeRepository.java`)
- Location: `/pms-backend/src/main/java/com/pms/repository/ProgrammeOfficeRepository.java`
- Methods:
  - `findAllActive()` - queries toDate IS NULL or > CURRENT_DATE
  - `findAllInactive()` - queries toDate NOT NULL and <= CURRENT_DATE
  - `findByProgrammeOfficeShortName(String)` - ensures uniqueness
  - `findAllByOrderByHierarchyOrderAsc()` - returns ordered list

### 3. DTOs
**Request DTO** (`ProgrammeOfficeRequest.java`)
- Used for API input validation
- Contains all writable fields

**Response DTO** (`ProgrammeOfficeResponse.java`)
- Used for API output
- Includes computed `active` field

### 4. Service (`ProgrammeOfficeService.java`)
- Location: `/pms-backend/src/main/java/com/pms/service/ProgrammeOfficeService.java`
- Methods:
  - `getAllProgrammeOffices()` - ordered by hierarchy
  - `getActiveProgrammeOffices()` - only active
  - `getInactiveProgrammeOffices()` - only inactive
  - `getProgrammeOfficeByCode(String code)` - single office
  - `createProgrammeOffice(request)` - with validation
  - `updateProgrammeOffice(code, request)` - with validation
  - `deactivateProgrammeOffice(code)` - sets toDate to today
  - `deleteProgrammeOffice(code)` - permanent delete
- Comprehensive validations:
  - Required field checks
  - Code length validation (max 5 chars)
  - Unique code and short name
  - Positive hierarchy order
  - toDate >= fromDate check
  - Single character regStatus

### 5. Controller (`ProgrammeOfficeController.java`)
- Location: `/pms-backend/src/main/java/com/pms/controller/ProgrammeOfficeController.java`
- Base URL: `/api/programme-offices`
- Endpoints:
  - `GET /` - get all
  - `GET /active` - get active only
  - `GET /inactive` - get inactive only
  - `GET /{code}` - get by code
  - `POST /` - create
  - `PUT /{code}` - update
  - `PUT /{code}/deactivate` - deactivate
  - `DELETE /{code}` - delete
- CORS enabled for frontend ports

## Frontend Components

### 1. Service (`programmeOfficeService.ts`)
- Location: `/src/services/programmeOfficeService.ts`
- Base URL: `http://localhost:7080/api`
- Methods mirror backend endpoints
- Authentication headers automatically included
- Error handling and logging included

### 2. React Component (`ProgrammeOfficeManagementPage.tsx`)
- Location: `/src/components/pages/ProgrammeOfficeManagementPage.tsx`
- Features:
  - List view with filters (All/Active/Inactive)
  - Create modal with form validation
  - Edit modal for existing offices
  - Delete confirmation dialog
  - Deactivate button for active offices
  - Real-time status display (Active/Inactive badge)
  - Loading states and error messages
  - Responsive table layout

### 3. App Integration
- Import added to `App.tsx`
- Route condition: `currentPage === 'programme-offices' && userRole === 'Admin'`
- Only accessible to Admin users

### 4. Sidebar Integration
- Added to `CoreUISidebar.tsx`
- Appears in Admin menu
- Icon: Users icon
- Navigation label: "Programme Offices"

## Validations

### Frontend Validations
- Code: Required, max 5 characters
- Full Name: Required
- Short Name: Required
- Hierarchy Order: Required, must be positive number
- From Date: Required
- To Date: Must be >= From Date
- User ID: Required
- Status: Required, single character

### Backend Validations
- All required field checks
- Unique constraints on code and short name
- Date logic validation
- Enum validation for status
- Character length limits

## Usage Flow

### Creating a Programme Office
1. Admin clicks "New Office" button
2. Modal opens with empty form
3. Admin fills all required fields
4. Frontend validates on blur/submit
5. On submit, API request sent to backend
6. Backend validates and checks duplicates
7. Office created and added to database
8. Page refreshes to show new office
9. Success state shown in table

### Deactivating (Making Inactive)
1. Click eye-off icon on active office
2. System sets toDate to today's date
3. Office marked as Inactive
4. Can be reactivated by editing and clearing toDate

### Editing
1. Click edit icon
2. Modal opens with current data (code field disabled)
3. Update fields and submit
4. Backend validates and updates
5. Table refreshes

### Deleting
1. Click trash icon
2. Confirmation dialog appears
3. Click delete to confirm
4. Office permanently removed
5. Table refreshes

## API Response Examples

### Create Response (201)
```json
{
  "programmeOfficeCode": "POHQ1",
  "programmeOfficeFullName": "Space Infrastructure Programme Office",
  "programmeOfficeShortName": "SIPO",
  "hierarchyOrder": 1,
  "fromDate": "2025-01-01",
  "toDate": null,
  "userId": "IS03651",
  "regStatus": "R",
  "active": true
}
```

### List Response (200)
```json
[
  {
    "programmeOfficeCode": "POHQ1",
    "programmeOfficeFullName": "Space Infrastructure Programme Office",
    "programmeOfficeShortName": "SIPO",
    "hierarchyOrder": 1,
    "fromDate": "2025-01-01",
    "toDate": null,
    "userId": "IS03651",
    "regStatus": "R",
    "active": true
  }
]
```

## Database Schema

Table: `pmsgeneric.programmeoffice`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| programmeofficecode | varchar(5) | PRIMARY KEY | Code identifier |
| programmeofficefullname | varchar(255) | NOT NULL | Full name |
| programmeofficeshortname | varchar(50) | NOT NULL | Short name |
| hierarchyorder | integer | NOT NULL | Display order |
| fromdate | date | NOT NULL | Effective from |
| todate | date | NULL | Deactivation date |
| userid | varchar(7) | NOT NULL | Creator/Admin ID |
| regstatus | varchar(1) | NOT NULL | Status flag |
| regtime | date | NULL | Registration time |

## Security
- Admin role check in frontend and backend
- Authentication headers required for all API calls
- CORS configured for allowed origins

## Next Steps (Optional)
- Add audit logging for changes
- Add bulk operations
- Add export to CSV/Excel
- Add import functionality
- Add approval workflow for changes
