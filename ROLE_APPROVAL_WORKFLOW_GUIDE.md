# Role Approval Workflow - Implementation Guide

## 📋 Overview

Complete backend-integrated role approval system where:
1. Users register with desired role request
2. Admin reviews pending requests in RoleManagementPage
3. Admin approves/rejects requests
4. Only approved users can login with their assigned role
5. Programme Directors must have a programme assigned during approval

---

## 🎯 Workflow

```
User Registration
    ↓
  (active = false, pending approval)
    ↓
Admin views in RoleManagementPage
    ↓
Admin Approves or Rejects
    ↓
If Approve + PROGRAMME_DIRECTOR → Assign Programme
    ↓
  (active = true, can now login)
    ↓
User Login
    ↓
Dashboard with assigned role
```

---

## 🎨 Frontend Implementation

### **RoleManagementPage.tsx**

**Two Tabs:**
1. **Pending Requests** - Shows users awaiting approval
   - Displays: Name, Code, Requested Role, Submission Date
   - Actions: Approve button, Reject button

2. **Approved Employees** - Shows approved users
   - Displays: Name, Code, Assigned Role, Assigned Programme, Approval Date
   - Read-only view

### **Key Functions:**

**Load Data:**
```typescript
- GET /api/admin/role-management/pending-requests
- GET /api/admin/role-management/approved-employees
- GET /api/admin/role-management/programmes
```

**Approve Request:**
```typescript
POST /api/admin/role-management/pending-requests/{userId}/approve
{
  programmeId: number | null
}
```

**Reject Request:**
```typescript
POST /api/admin/role-management/pending-requests/{userId}/reject
{
  rejectionReason: string
}
```

### **Features:**
- Real-time search by name/code
- Programme assignment modal for Programme Directors
- Rejection reason modal with validation
- Real-time list updates after action
- Error and success messaging
- Loading states

---

## 🔧 Backend Implementation

### **DTOs**

#### **PendingRoleRequestDTO**
```java
{
  id: Long,
  employeeName: String,
  employeeCode: String,
  requestedRole: String,
  submissionDate: LocalDateTime,
  status: String (PENDING, APPROVED, REJECTED)
}
```

#### **ApproveRoleRequest**
```java
{
  programmeId: Long (optional, required for PROGRAMME_DIRECTOR)
}
```

#### **RejectRoleRequest**
```java
{
  rejectionReason: String (required, min 5 chars)
}
```

### **Service Layer: RoleApprovalService**

**Methods:**

1. **getPendingRoleRequests()**
   - Returns all users where `active = false`
   - Converts to PendingRoleRequestDTO

2. **getApprovedEmployees()**
   - Returns all users where `active = true`
   - Converts to RegisteredEmployeeDTO with programme info

3. **approvePendingRequest(Long userId, ApproveRoleRequest request)**
   - Validates user exists and is pending
   - For PROGRAMME_DIRECTOR: validates programme is provided
   - Sets `user.active = true`
   - Assigns programme if provided

4. **rejectPendingRequest(Long userId, RejectRoleRequest request)**
   - Validates user exists and is pending
   - Validates rejection reason provided (min 5 chars)
   - Stores rejection reason (requires User entity update)
   - Keeps user inactive

5. **getAllProgrammes()**
   - Returns available programmes

### **Controller Layer: RoleApprovalController**

**Base URL:** `/api/admin/role-management`

**Endpoints:**

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/pending-requests` | Get all pending role requests | `List<PendingRoleRequestDTO>` |
| GET | `/approved-employees` | Get all approved employees | `List<RegisteredEmployeeDTO>` |
| POST | `/pending-requests/{userId}/approve` | Approve a pending request | `PendingRoleRequestDTO` |
| POST | `/pending-requests/{userId}/reject` | Reject a pending request | `Void` |
| GET | `/programmes` | Get all available programmes | `List<ProgrammeDTO>` |

**Validations:**
- User ID must be positive
- Request body validation
- Rejection reason minimum 5 characters
- Programme ID required for PROGRAMME_DIRECTOR

---

## 📊 User Journey

### For New User:

1. **Registration Page**
   - User selects desired role
   - Clicks "Register"
   - Backend creates user with `active = false`

2. **Database State**
   ```sql
   INSERT INTO users (
     employee_code, 
     full_name, 
     password, 
     role_id, 
     active,
     created_at
   ) VALUES (
     'EMP999',
     'John Doe',
     'encrypted_password',
     3, -- PROGRAMME_DIRECTOR role
     false, -- PENDING APPROVAL
     NOW()
   );
   ```

3. **Admin Review**
   - Admin logs in as ADMIN role
   - Navigates to Role Management
   - Sees "Pending Requests" tab
   - Sees John Doe's request for PROGRAMME_DIRECTOR

4. **Admin Approves**
   - Clicks "Approve" button
   - If PROGRAMME_DIRECTOR, modal opens asking for programme
   - Admin selects "GSLV" programme
   - Clicks "Approve"

5. **Backend Processing**
   ```sql
   UPDATE users 
   SET active = true,
       programme_id = 1
   WHERE id = (John's user ID);
   ```

6. **User Can Now Login**
   - User can login with credentials
   - Role is PROGRAMME_DIRECTOR
   - Can access programme-specific projects

### For Admin Rejection:

1. Admin clicks "Reject" on pending request
2. Modal opens asking for rejection reason
3. Admin types reason (min 5 chars)
4. Admin clicks "Reject"
5. User status remains inactive, cannot login

---

## 🔐 Security Validations

**Frontend:**
- ✅ Search/filter sanitization
- ✅ Modal validation before submission
- ✅ Confirmation before destructive actions
- ✅ Error handling with user-friendly messages

**Backend:**
- ✅ Input parameter validation
- ✅ User existence check
- ✅ Business logic validation
- ✅ Role-based operation checks
- ✅ String length validation
- ✅ Null/empty string checks
- ✅ HTTP status codes per operation

---

## 📝 API Examples

### Get Pending Requests
```bash
curl -X GET http://localhost:8080/api/admin/role-management/pending-requests \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "success": true,
  "message": "Pending role requests retrieved successfully",
  "data": [
    {
      "id": 10,
      "employeeName": "John Doe",
      "employeeCode": "EMP999",
      "requestedRole": "PROGRAMME_DIRECTOR",
      "submissionDate": "2026-01-12T10:30:00",
      "status": "PENDING"
    }
  ]
}
```

### Approve with Programme Assignment
```bash
curl -X POST http://localhost:8080/api/admin/role-management/pending-requests/10/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"programmeId": 1}'

Response:
{
  "success": true,
  "message": "Role request approved successfully",
  "data": {
    "id": 10,
    "employeeName": "John Doe",
    "employeeCode": "EMP999",
    "requestedRole": "PROGRAMME_DIRECTOR",
    "submissionDate": "2026-01-12T10:30:00",
    "status": "APPROVED"
  }
}
```

### Reject with Reason
```bash
curl -X POST http://localhost:8080/api/admin/role-management/pending-requests/10/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rejectionReason": "Employee code does not match company records"}'

Response:
{
  "success": true,
  "message": "Role request rejected successfully",
  "data": null
}
```

---

## 🗄️ Database Requirements

### User Table Updates Needed:
```sql
-- Add approval status tracking if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_date TIMESTAMP NULL;

-- Add programme relationship if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS programme_id BIGINT;
ALTER TABLE users ADD CONSTRAINT FOREIGN KEY (programme_id) REFERENCES programmes(id);
```

### Query for Pending Users:
```sql
SELECT * FROM users WHERE active = false;
```

### Query for Approved Users:
```sql
SELECT * FROM users WHERE active = true;
```

---

## 🚀 Integration Steps

### Step 1: Compile Backend
```bash
cd pms-backend
mvn clean compile
```

### Step 2: Update User Entity (if needed)
- Add `active` field (default false)
- Add `rejectionReason` field
- Add programme relationship

### Step 3: Test API Endpoints
```bash
# Test pending requests
curl http://localhost:8080/api/admin/role-management/pending-requests

# Test programmes
curl http://localhost:8080/api/admin/role-management/programmes
```

### Step 4: Test Frontend Flow
1. Register as new user with PROGRAMME_DIRECTOR role
2. Login as ADMIN
3. Navigate to Role Management
4. Approve request with programme assignment
5. Logout and login as new user
6. Verify access to role-specific features

---

## ✅ Testing Checklist

### Frontend Tests:
- [ ] Pending requests tab loads with API data
- [ ] Approved tab loads with API data
- [ ] Search filters both tabs
- [ ] Approve button shows programme modal for PD
- [ ] Approve button works for non-PD roles
- [ ] Reject button shows reason modal
- [ ] Rejection reason validation works (min 5 chars)
- [ ] List updates after approval/rejection
- [ ] Success/error messages display correctly
- [ ] Loading states show during operations
- [ ] Refresh button reloads data

### Backend Tests:
- [ ] GET /pending-requests returns inactive users
- [ ] GET /approved-employees returns active users
- [ ] POST /approve sets active = true
- [ ] POST /approve assigns programme for PD
- [ ] POST /reject validates reason
- [ ] All validations work correctly
- [ ] Error messages are appropriate
- [ ] HTTP status codes are correct

---

## 🐛 Troubleshooting

### Issue: Pending requests not showing
**Cause:** New users might not have `active = false` set on registration
**Solution:** Check registration logic sets `active = false`

### Issue: Can't approve as Programme Director
**Cause:** Programme modal not opening or programme API not working
**Solution:** Check /programmes endpoint returns data

### Issue: User can login despite pending approval
**Cause:** Login logic not checking `active` field
**Solution:** Update login validation to check `active = true`

### Issue: API returns 404
**Cause:** Endpoints not registered or URL mismatch
**Solution:** Verify controller is in correct package and @RestController is present

---

## 📈 Future Enhancements

1. **Email Notifications**
   - Send email to user on approval
   - Send email with rejection reason

2. **Bulk Operations**
   - Bulk approve/reject multiple requests
   - Batch programme assignments

3. **Audit Trail**
   - Log who approved/rejected and when
   - Track rejection reasons for analytics

4. **Advanced Filtering**
   - Filter by role requested
   - Filter by date range
   - Sort by submission date

5. **Request History**
   - View previous rejections
   - Allow reapplication

---

## 📞 Quick Reference

**Files Created/Modified:**

Frontend:
- `src/components/pages/RoleManagementPage.tsx` - Complete UI with tabs

Backend:
- `src/main/java/com/pms/dto/PendingRoleRequestDTO.java` - DTO for pending requests
- `src/main/java/com/pms/dto/ApproveRoleRequest.java` - Approve request DTO
- `src/main/java/com/pms/dto/RejectRoleRequest.java` - Reject request DTO
- `src/main/java/com/pms/service/RoleApprovalService.java` - Business logic
- `src/main/java/com/pms/controller/RoleApprovalController.java` - REST endpoints

**API Endpoints:**
- `GET /api/admin/role-management/pending-requests`
- `GET /api/admin/role-management/approved-employees`
- `POST /api/admin/role-management/pending-requests/{userId}/approve`
- `POST /api/admin/role-management/pending-requests/{userId}/reject`
- `GET /api/admin/role-management/programmes`

---

**Status:** ✅ Complete Frontend & Backend Implementation  
**Last Updated:** January 12, 2026  
**Version:** 1.0
