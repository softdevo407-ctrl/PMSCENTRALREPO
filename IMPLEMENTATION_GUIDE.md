# Project Management System - Architecture & Implementation Guide

## 🎯 Overview
This document outlines the complete architecture for a comprehensive Project Management System (PMS) with role-based access control, programme director management, and comprehensive project lifecycle management.

---

## 📋 System Architecture

### 1. **Status Updation System** ✅

#### What Changed:
- **Activity-First Approach**: Only activities can have direct status updates
- **Derived Milestone Status**: Milestone status is automatically derived from its activities
- **No Manual Phase/Milestone Updates**: Status flows from activities upward

#### Status Derivation Logic:
```
Milestone Status Derivation:
- All Activities COMPLETED → Milestone is COMPLETED
- All Activities NOT_STARTED → Milestone is NOT_STARTED
- Any Activity ON_HOLD → Milestone is ON_HOLD
- Otherwise → Milestone is IN_PROGRESS
```

#### UI Behavior:
- Activities show editable dropdown for status selection
- Milestone status displays as read-only badge showing derived status
- Real-time calculation as activity statuses change

**File Modified**: `StatusUpdationModal.tsx`

---

## 👥 Role-Based Access Control (RBAC)

### Roles in System:

#### 1. **Admin**
- Access: Full system administration
- Responsibilities:
  - Approve/Reject employee role requests
  - Manage employee enrollments
  - Assign Programme Directors to Programmes
  - View all system data

#### 2. **Chairman**
- Access: View all projects across all programmes
- Responsibilities:
  - Strategic oversight of all projects
  - View comprehensive project dashboard
  - Access to all project details and milestones

#### 3. **Programme Director**
- Access: Projects only in assigned programme
- Responsibilities:
  - Approve/monitor projects in their programme
  - Review project submissions
  - Update project statuses
  - View programme-specific reports

#### 4. **Project Director**
- Access: Assigned projects only
- Responsibilities:
  - Create and manage project phases
  - Update activity/milestone status
  - Submit projects for approval
  - View project-specific details

---

## 🔐 Authentication & Registration Flow

### New Registration Process:

1. **User Signup**
   - User provides: Name, Employee Code, Password, Role Selection
   - System creates account with `PENDING` approval status
   - User cannot login until approved

2. **Admin Approval**
   - Admin sees pending requests in dashboard
   - Can APPROVE or REJECT each request
   - Once approved, role is assigned and user can login

3. **Post-Approval Role Assignment**
   - If role is `PROGRAMME_DIRECTOR`: Admin assigns to specific programme
   - Employee can only see projects from assigned programme
   - If role is `PROJECT_DIRECTOR`: Can see all assigned projects

### Current Implementation Status:
- **Done**: RegistrationPage supports role selection
- **Done**: LoginPage handles authentication
- **To Do**: Backend API endpoints for approval workflow
- **To Do**: Database updates for role approval status

---

## 🏢 Admin Dashboard

### 📊 Overview Tab
- Pending Approvals count
- Enrolled Employees count
- Active Programmes count

### ✅ Role Approvals Tab
- List of pending role requests
- Employee name, code, requested role, submission date
- APPROVE/REJECT buttons
- Automatically moves approved users to Employee list

### 👨‍💼 Enrolled Employees Tab
- List of approved employees
- Shows: Name, Code, Assigned Role, Programme (if applicable), Join Date
- Edit button for modifying assignments
- Filter by role

### 🎯 Programmes Tab
- List of all programmes
- Shows: Programme name, assigned director, project count
- "Assign Director" button for unassigned programmes
- "Change Director" button for reassigning

**File Created**: `AdminDashboard.tsx`

---

## 🌐 Project Listing Based on User Role

### Visibility Rules:

| Role | Can See |
|------|---------|
| **Admin** | All projects in system |
| **Chairman** | All projects in system |
| **Programme Director** | Only projects in assigned programme |
| **Project Director** | Only assigned projects |

### Implementation Needed:
- Add `userRole` check in `MyProjectsPage`
- Filter `myProjects` based on role and programme assignment
- Adjust visible features based on role
- Hide/show buttons conditionally

---

## 📝 Project Approval Workflow

### Workflow Steps:

1. **Project Director Creates Project**
   - Uses AddProjectModal in MyProjectsPage
   - Selects programme and programme director
   - Submits for approval

2. **Programme Director Reviews**
   - Sees pending projects awaiting approval
   - Can approve or request changes
   - Once approved, enters execution phase

3. **Admin Oversight**
   - Admin dashboard shows all approval requests
   - Can escalate or override decisions

### Status Progression:
```
DRAFT → PENDING_APPROVAL → APPROVED → ACTIVE → COMPLETED
                            ↓
                       REJECTED (with remarks)
```

### Files Involved:
- `MyProjectsPage.tsx` - Add approval button
- `AddProjectModal.tsx` - Add approval workflow
- New: `ProjectApprovalModal.tsx` (to be created)

---

## 🗄️ Database Schema Additions Required

### User Table Updates:
```sql
ALTER TABLE users ADD COLUMN (
  role_requested VARCHAR(50),
  role_approved VARCHAR(50),
  approval_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
  approved_date TIMESTAMP NULL,
  programme_id INT FOREIGN KEY
);
```

### Project Table Updates:
```sql
ALTER TABLE projects ADD COLUMN (
  approval_status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'),
  programme_director_approval_date TIMESTAMP NULL,
  rejection_reason TEXT
);
```

### New Tables:
```sql
CREATE TABLE programmes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  programme_name VARCHAR(100),
  programme_director_id INT,
  created_date TIMESTAMP,
  FOREIGN KEY (programme_director_id) REFERENCES users(id)
);

CREATE TABLE activity_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  activity_id INT,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by INT,
  changed_at TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);
```

---

## 🔄 API Endpoints Required

### Authentication Endpoints:
```
POST   /api/auth/register          - Register with role selection
POST   /api/auth/login             - Login (check approval status)
GET    /api/auth/me                - Get current user with role
```

### Admin Endpoints:
```
GET    /api/admin/pending-approvals     - List pending role requests
POST   /api/admin/approvals/{id}/approve - Approve role request
POST   /api/admin/approvals/{id}/reject  - Reject role request
GET    /api/admin/employees              - List enrolled employees
PUT    /api/admin/employees/{id}         - Update employee assignment
GET    /api/admin/programmes             - List programmes
POST   /api/admin/programmes/{id}/director - Assign director to programme
```

### Project Endpoints:
```
GET    /api/projects                     - List projects (filtered by role)
POST   /api/projects/{id}/approve        - Submit for approval
POST   /api/projects/{id}/reject         - Reject project (director only)
```

### Status Endpoints:
```
PUT    /api/activities/{id}/status       - Update activity status
GET    /api/activities/{id}/status-history - Get status change history
```

---

## 🎨 Component Structure

### Pages Created/Modified:

```
src/components/pages/
├── LoginPage.tsx                 ✅ Existing (login only)
├── RegistrationPage.tsx          ✅ Existing (role selection added)
├── AdminDashboard.tsx            ✅ NEW
├── MyProjectsPage.tsx            ✅ Modified (role-based filtering)
├── NewProjectPage.tsx            ✅ Existing
└── ...other pages

src/components/
├── AddProjectModal.tsx           ✅ Existing (create/edit projects)
├── AddPhaseModal.tsx             ✅ Existing (create/edit phases)
├── StatusUpdationModal.tsx       ✅ Modified (activity-only updates)
├── ProjectApprovalModal.tsx      ⏳ TO CREATE
└── ...other modals
```

---

## 📊 Feature Matrix

### By Role:

#### Admin
- ✅ View dashboard overview
- ✅ Approve/reject role requests
- ✅ Manage employees
- ✅ Assign programme directors
- ✅ View all projects

#### Chairman
- ✅ View all projects
- ✅ View project details and phases
- ✅ View status reports
- ❌ Cannot approve or modify

#### Programme Director
- ✅ View assigned programme projects
- ✅ Approve project submissions
- ✅ View milestone/activity status
- ✅ Access reports for programme
- ❌ Cannot create projects

#### Project Director
- ✅ Create projects (for approval)
- ✅ Create phases/milestones
- ✅ Update activity status
- ✅ Submit for approval
- ❌ Cannot approve own projects

---

## 🚀 Implementation Roadmap

### Phase 1: Core Status Updates
- ✅ Update StatusUpdationModal (activity-only)
- ✅ Implement milestone status derivation
- ⏳ Backend API for status updates

### Phase 2: Admin Dashboard
- ✅ Create AdminDashboard component
- ⏳ Wire up to API endpoints
- ⏳ Implement approval logic
- ⏳ Programme director assignment

### Phase 3: Authentication Flow
- ⏳ Update signup to handle approvals
- ⏳ Modify login to check approval status
- ⏳ Add pending state messaging

### Phase 4: Role-Based Access
- ⏳ Implement role checks in components
- ⏳ Filter data by role/programme
- ⏳ Conditional UI rendering

### Phase 5: Project Approval
- ⏳ Create ProjectApprovalModal
- ⏳ Implement approval workflow
- ⏳ Status tracking

---

## ✨ Key Implementation Details

### StatusUpdationModal Changes:
1. Removed phase status selector
2. Made milestone status display read-only
3. Added derivation calculation function
4. Real-time updates as activities change

### AdminDashboard Features:
1. Tab-based navigation (Overview, Approvals, Employees, Programmes)
2. Pending approvals with approve/reject buttons
3. Enrolled employees list with edit capability
4. Programme management with director assignment
5. Quick statistics cards

### Role-Based Filtering:
- Check `user.role` and `user.programme_id`
- Filter project lists accordingly
- Hide admin-only features
- Show appropriate action buttons

---

## 🔗 Navigation Flow

```
Login/Register
    ↓
Admin → Admin Dashboard (Manage everything)
    ↓
Chairman → View All Projects (Read-only overview)
    ↓
Programme Director → My Projects (for assigned programme)
    ↓
Project Director → My Projects (assigned projects)
```

---

## 📚 Backend Integration Checklist

- [ ] User role approval table
- [ ] Programme director assignment
- [ ] Project approval workflow table
- [ ] Activity status history table
- [ ] API endpoints for admin operations
- [ ] API endpoints for role approvals
- [ ] API filters by user role
- [ ] Activity status update endpoints
- [ ] Project approval endpoints
- [ ] Audit logging

---

## 🎯 Next Steps

1. **Backend Development**
   - Create database tables
   - Implement API endpoints
   - Add authorization middleware

2. **Frontend Integration**
   - Connect AdminDashboard to APIs
   - Implement role-based filtering
   - Add approval workflows

3. **Testing**
   - Test each role's access
   - Verify status derivation
   - Test approval workflows

4. **Deployment**
   - Database migrations
   - API deployment
   - Frontend deployment

---

## 📞 Support & Documentation

For questions about:
- **Status updates**: See StatusUpdationModal.tsx
- **Admin operations**: See AdminDashboard.tsx
- **Project management**: See MyProjectsPage.tsx & AddProjectModal.tsx
- **Authentication**: See LoginPage.tsx & RegistrationPage.tsx

Last Updated: January 12, 2026
