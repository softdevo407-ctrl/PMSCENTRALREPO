# Role Management Feature - Complete Implementation Guide

## 📋 Overview

A comprehensive role management system for administrators to manage employee registrations, assign roles, and handle programme director assignments in the PMS (Project Management System).

---

## ✨ Features

### 1. **Employee Management**
- View all registered employees
- Filter by role, status, and search by name/employee code
- Soft delete employees
- Display employee information with role and programme assignments

### 2. **Programme Assignment**
- Assign programmes to Programme Directors
- Change assigned programmes
- Modal-based assignment workflow
- Validation to ensure only Programme Directors can be assigned

### 3. **Role-Based Access**
- Only Admin users can access this feature
- Sidebar menu item shows "Role Management"
- Orange gradient color for Admin role theme

### 4. **Advanced Filtering & Search**
- Search by employee name or code
- Filter by role (Admin, Project Director, Programme Director, Chairman)
- Filter by approval status (Pending, Approved, Rejected)

---

## 🎨 Frontend Implementation

### **File: RoleManagementPage.tsx**
**Location:** `src/components/pages/RoleManagementPage.tsx`

#### Key Features:
- **Tab-free Interface**: Clean table-based layout
- **Search & Filters**: Real-time filtering
- **Programme Assignment Modal**: Dedicated modal for assigning programmes
- **Action Buttons**: Edit (Change), Delete buttons for each employee
- **Status Indicators**: Color-coded badges for approval status
- **Error Handling**: Comprehensive error and success messaging
- **Loading States**: Loading indicators for async operations

#### Main Components:
```tsx
interface RegisteredEmployee {
  id: number;
  employeeName: string;
  employeeCode: string;
  assignedRole: string;
  assignedProgramme?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
}

interface Programme {
  id: number;
  programmeName: string;
}
```

#### Key Functions:
- `loadEmployees()` - Fetch all employees (currently mock data)
- `loadProgrammes()` - Fetch all available programmes
- `handleAssignProgramme()` - Assign programme to director
- `handleDeleteEmployee()` - Soft delete employee
- Filtering and search logic

#### UI Elements:
1. **Header Section**
   - Title and description
   - Error/Success message containers

2. **Filter Section**
   - Search by name/employee code
   - Role dropdown filter
   - Approval status filter

3. **Employees Table**
   - Employee name, code, role, programme, status, date
   - Action buttons (Change/Assign, Delete)
   - Empty state messaging

4. **Assignment Modal**
   - Selected employee display
   - Programme selection dropdown
   - Validation messages
   - Cancel/Assign buttons

#### Validations:
- Employee code required
- Only Programme Directors can be assigned programmes
- Valid programme selection required
- Employee must be approved before assignment
- Confirmation before deletion

---

## 🔧 Backend Implementation

### **1. DTOs (Data Transfer Objects)**

#### **RegisteredEmployeeDTO.java**
**Location:** `pms-backend/src/main/java/com/pms/dto/RegisteredEmployeeDTO.java`

```java
public class RegisteredEmployeeDTO {
    private Long id;
    private String employeeName;
    private String employeeCode;
    private String assignedRole;
    private String assignedProgramme;
    private String approvalStatus;
    private LocalDateTime submissionDate;
}
```

#### **AssignProgrammeRequest.java**
**Location:** `pms-backend/src/main/java/com/pms/dto/AssignProgrammeRequest.java`

```java
public class AssignProgrammeRequest {
    private Long programmeId;
    private String programmeName;
}
```

#### **ProgrammeDTO.java**
**Location:** `pms-backend/src/main/java/com/pms/dto/ProgrammeDTO.java`

```java
public class ProgrammeDTO {
    private Long id;
    private String programmeName;
    private String programmeCode;
}
```

### **2. Service Layer**

#### **RoleManagementService.java**
**Location:** `pms-backend/src/main/java/com/pms/service/RoleManagementService.java`

##### Key Methods:

**1. Get All Employees**
```java
public List<RegisteredEmployeeDTO> getAllRegisteredEmployees()
```
- Returns all registered employees with their roles and programme assignments
- Includes both approved and pending employees

**2. Get Approved Employees**
```java
public List<RegisteredEmployeeDTO> getApprovedEmployees()
```
- Returns only active/approved employees
- Filters by `active = true`

**3. Get Employees by Role**
```java
public List<RegisteredEmployeeDTO> getEmployeesByRole(String roleName)
```
- Filter employees by specific role
- Throws `IllegalArgumentException` if role not found
- Roles: ADMIN, PROJECT_DIRECTOR, PROGRAMME_DIRECTOR, CHAIRMAN

**4. Get Specific Employee Groups**
```java
public List<RegisteredEmployeeDTO> getProgrammeDirectors()
public List<RegisteredEmployeeDTO> getProjectDirectors()
```
- Helper methods to get employees by role

**5. Get Employee by ID**
```java
public RegisteredEmployeeDTO getEmployeeById(Long employeeId)
```
- Returns single employee by ID
- Throws exception if not found

**6. Get Employee by Code**
```java
public RegisteredEmployeeDTO getEmployeeByCode(String employeeCode)
```
- Returns employee by employee code
- Throws exception if not found

**7. Assign Programme to Director**
```java
public RegisteredEmployeeDTO assignProgrammeToDirector(Long employeeId, AssignProgrammeRequest request)
```

**Validations:**
- Employee exists
- Employee is a Programme Director
- Employee is active/approved
- Valid programme ID provided

**8. Delete Employee**
```java
public void deleteEmployee(Long employeeId)
```
- Soft delete (marks as inactive)
- Throws exception if employee not found

**9. Get All Programmes**
```java
public List<ProgrammeDTO> getAllProgrammes()
```
- Returns available programmes
- TODO: Implement once Programme entity is created

#### **Validation Methods:**

**Employee Code Validation**
```java
public boolean validateEmployeeCode(String employeeCode)
```
- Cannot be empty
- Minimum 3 characters
- Only uppercase letters and numbers
- Throws `IllegalArgumentException` on invalid input

**Employee Name Validation**
```java
public boolean validateEmployeeName(String employeeName)
```
- Cannot be empty
- Minimum 3 characters
- Only letters and spaces
- Throws `IllegalArgumentException` on invalid input

**Check Employee Code Exists**
```java
public boolean employeeCodeExists(String employeeCode)
```
- Returns true if employee code already exists

### **3. Controller Layer**

#### **RoleManagementController.java**
**Location:** `pms-backend/src/main/java/com/pms/controller/RoleManagementController.java`

**Base URL:** `/api/admin/role-management`

##### Endpoints:

**1. GET /employees**
- Get all registered employees
- Returns: `ApiResponse<List<RegisteredEmployeeDTO>>`
- Status: 200 OK or 500 Internal Server Error

**2. GET /employees/approved**
- Get all approved/active employees
- Returns: `ApiResponse<List<RegisteredEmployeeDTO>>`

**3. GET /employees/role/{roleName}**
- Get employees by specific role
- Path Parameter: `roleName` (ADMIN, PROJECT_DIRECTOR, etc.)
- Returns: `ApiResponse<List<RegisteredEmployeeDTO>>`
- Validations: Role name required, must be valid role

**4. GET /programme-directors**
- Get all Programme Directors
- Returns: `ApiResponse<List<RegisteredEmployeeDTO>>`

**5. GET /project-directors**
- Get all Project Directors
- Returns: `ApiResponse<List<RegisteredEmployeeDTO>>`

**6. GET /employees/{employeeId}**
- Get single employee by ID
- Path Parameter: `employeeId` (positive integer)
- Returns: `ApiResponse<RegisteredEmployeeDTO>`
- Status: 200 OK, 400 Bad Request, or 404 Not Found

**7. GET /employees/code/{employeeCode}**
- Get single employee by employee code
- Path Parameter: `employeeCode`
- Returns: `ApiResponse<RegisteredEmployeeDTO>`
- Status: 200 OK, 400 Bad Request, or 404 Not Found

**8. PUT /employees/{employeeId}/assign-programme**
- Assign programme to Programme Director
- Path Parameter: `employeeId`
- Request Body: `AssignProgrammeRequest`
- Returns: `ApiResponse<RegisteredEmployeeDTO>`
- Validations:
  - Employee ID positive
  - Request body not null
  - Programme ID valid
  - Employee is Programme Director
  - Employee is approved

**9. DELETE /employees/{employeeId}**
- Soft delete employee
- Path Parameter: `employeeId` (positive integer)
- Returns: `ApiResponse<Void>`
- Status: 200 OK, 400 Bad Request, or 404 Not Found

**10. GET /programmes**
- Get all available programmes
- Returns: `ApiResponse<List<ProgrammeDTO>>`

**11. POST /validate/employee-code**
- Validate employee code format
- Query Parameter: `employeeCode`
- Returns: `ApiResponse<Boolean>`
- Validations:
  - Not empty
  - Minimum 3 characters
  - Uppercase letters and numbers only

**12. POST /validate/employee-name**
- Validate employee name format
- Query Parameter: `employeeName`
- Returns: `ApiResponse<Boolean>`
- Validations:
  - Not empty
  - Minimum 3 characters
  - Letters and spaces only

**13. GET /check-employee-code**
- Check if employee code already exists
- Query Parameter: `employeeCode`
- Returns: `ApiResponse<Boolean>`

#### Error Handling:
- All endpoints include try-catch with appropriate HTTP status codes
- Bad Request (400): Validation errors
- Not Found (404): Employee/role not found
- Internal Server Error (500): Unexpected errors
- Custom `ApiResponse` wrapper for consistent response format

---

## 🔌 API Integration Points

### Frontend Calls to Backend:

1. **Load Employees List**
```typescript
// In RoleManagementPage.tsx
const response = await fetch('/api/admin/role-management/employees');
const data = await response.json();
```

2. **Assign Programme**
```typescript
const response = await fetch(
  `/api/admin/role-management/employees/${employeeId}/assign-programme`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programmeId })
  }
);
```

3. **Delete Employee**
```typescript
await fetch(
  `/api/admin/role-management/employees/${employeeId}`,
  { method: 'DELETE' }
);
```

4. **Get Programmes**
```typescript
const response = await fetch('/api/admin/role-management/programmes');
const programmes = await response.json();
```

---

## 📁 File Structure

```
Frontend:
src/components/pages/RoleManagementPage.tsx

Backend:
pms-backend/src/main/java/com/pms/
├── dto/
│   ├── RegisteredEmployeeDTO.java
│   ├── AssignProgrammeRequest.java
│   └── ProgrammeDTO.java
├── service/
│   └── RoleManagementService.java
└── controller/
    └── RoleManagementController.java
```

---

## 🔐 Security & Authorization

1. **Admin-Only Access**
   - Only users with `Admin` role can access RoleManagementPage
   - Protected in App.tsx routing: `userRole === 'Admin'`

2. **API Authentication**
   - All endpoints require Admin authentication (TODO: implement JWT validation)
   - Add `@PreAuthorize("hasRole('ADMIN')")` annotation to controller

3. **Validation**
   - Input validation on both frontend and backend
   - Employee code uniqueness check
   - Role verification before programme assignment

---

## 🧪 Testing Checklist

### Frontend Tests:
- [ ] Page loads with employee list
- [ ] Search filters by name/code in real-time
- [ ] Role filter works correctly
- [ ] Approval status filter works
- [ ] Click "Change/Assign" opens modal
- [ ] Modal shows correct employee
- [ ] Programme dropdown populates
- [ ] Can select programme and submit
- [ ] Success message displays
- [ ] Employee list updates after assignment
- [ ] Delete button shows confirmation
- [ ] Employee deleted from list after confirmation
- [ ] Error messages display on failure
- [ ] Loading states show during async operations

### Backend Tests:
- [ ] GET /employees returns all employees
- [ ] GET /employees/approved returns only approved
- [ ] GET /employees/role/{role} filters by role
- [ ] GET /programme-directors returns correct role
- [ ] GET /employees/{id} returns single employee
- [ ] GET /employees/code/{code} returns by code
- [ ] PUT /assign-programme updates correctly
- [ ] DELETE /employees/{id} soft deletes
- [ ] All validations work correctly
- [ ] All error codes return correct status
- [ ] Validation endpoints work

---

## 🚀 Integration Steps

1. **Compile Backend**
   ```bash
   cd pms-backend
   mvn clean compile
   ```

2. **Update Mock Data to API Calls**
   - Replace TODO comments in RoleManagementService with actual API calls
   - Implement Programme entity mapping
   - Set up Programme-Employee relationship

3. **Add API Security**
   - Add `@PreAuthorize` annotations to controller
   - Implement JWT token validation
   - Ensure only Admin role can call these endpoints

4. **Database Updates**
   - Create/update Programme entity if not exists
   - Add foreign key relationship between User and Programme
   - Create migration scripts for approval status tracking

5. **Test Thoroughly**
   - Unit tests for service layer
   - Integration tests for controller
   - End-to-end tests for complete workflow

---

## 📝 Mock Data Reference

The feature currently uses mock data for testing. Update these when API integration is complete:

**Employees:**
- EMP001 - Rajesh Kumar - PROJECT_DIRECTOR - APPROVED
- EMP002 - Priya Sharma - PROGRAMME_DIRECTOR - GSLV - APPROVED
- EMP003 - Vikram Singh - PROGRAMME_DIRECTOR - (unassigned) - APPROVED
- EMP004 - Anjali Patel - CHAIRMAN - APPROVED
- EMP005 - Rahul Verma - PROJECT_DIRECTOR - PENDING

**Programmes:**
- GSLV
- PSLV
- Chandrayaan
- Mangalyaan

---

## 🔄 Future Enhancements

1. **Bulk Operations**
   - Bulk approve/reject registrations
   - Bulk programme assignments
   - Bulk delete with audit trail

2. **Audit Logging**
   - Track all admin actions
   - Log who changed what and when
   - Export audit reports

3. **Advanced Filtering**
   - Date range filters
   - Multi-select programme filter
   - Custom column sorting

4. **Notifications**
   - Email notifications on approval/rejection
   - In-app notifications for status changes
   - Bulk notification support

5. **Export Functionality**
   - Export employee list to CSV/Excel
   - Export audit logs
   - Generate reports

---

## 🐛 Troubleshooting

### Issue: Role Management page not showing in sidebar
**Solution:** Ensure user role is set to 'Admin' and App.tsx has proper routing

### Issue: API calls returning 404
**Solution:** 
- Verify backend server is running on port 8080
- Check API endpoint URLs match exactly
- Ensure CORS is configured correctly

### Issue: Programme not being assigned
**Solution:**
- Verify employee is a PROGRAMME_DIRECTOR
- Check employee is APPROVED
- Ensure programme ID is valid

### Issue: Delete not working
**Solution:**
- Verify soft delete is implemented
- Check database connection
- Review error logs for details

---

## 📞 Support & Documentation

For additional details, refer to:
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Overall system architecture
- [Database Schema](./pms-backend/src/main/resources/db/migration/) - Database structure
- Backend API documentation via Swagger (when enabled)

---

**Last Updated:** January 12, 2026
**Version:** 1.0
**Status:** Complete Frontend & Backend Implementation Ready for Integration
