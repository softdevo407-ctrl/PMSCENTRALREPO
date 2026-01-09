# PBEMS CoreUI Implementation Guide

## Overview

Your PBEMS system has been completely redesigned with **CoreUI-inspired professional styling**. The system now features:

✅ **Modern Start Page** - Professional landing page with trending website design  
✅ **Role-Based Sidebars** - Dynamic navigation for each role with color coding  
✅ **Enterprise Dashboards** - Professional dashboards for each role  
✅ **Reusable Forms** - CoreUI-styled form components with validation  
✅ **Responsive Design** - Mobile-friendly layouts for all screens  
✅ **Budget Dashboard** - Legacy budget management system (still available)

---

## System Architecture

### Application Modes

The system supports multiple modes that can be switched via the `App.tsx` state:

1. **START** - Initial landing page
2. **PBEMS** - Professional Enterprise Project Management System (NEW)
3. **LEGACY_PBEMS** - Original PBEMS with role selector
4. **BUDGET** - Budget Dashboard (shown in legacy mode)

---

## User Journey

### Default Flow (CoreUI)

```
START PAGE
    ↓
   "Get Started" → PBEMS MODE (Show RoleSelector)
    ↓
Select Role & User
    ↓
CoreUI Dashboard (Role-Specific)
    ↓
Sidebar Navigation
```

### Component Flow

```
App.tsx
├── appMode === 'START'
│   └── StartPage (Shows hero, features, CTA)
│
├── appMode === 'PBEMS' && !userRole
│   └── StartPage (Switches to LEGACY_PBEMS on "Get Started")
│
├── appMode === 'LEGACY_PBEMS'
│   └── RoleSelector (Traditional role selection)
│
└── appMode === 'PBEMS' && userRole
    └── CoreUIDashboardLayout
        ├── CoreUISidebar (Role-specific navigation)
        ├── ProjectDirectorDashboard (if role === 'Project Director')
        ├── ProgrammeDirectorDashboard (if role === 'Programme Director')
        └── ChairmanDashboard (if role === 'Chairman')
```

---

## Core UI Components

### 1. **StartPage.tsx**
- **Purpose**: Modern landing page
- **Features**:
  - Animated gradient background with glassmorphism
  - Hero section with value proposition
  - 3 stat cards (500+ projects, 99.9% uptime, 24/7 support)
  - 6 feature cards describing system capabilities
  - 3 role description cards
  - Professional footer with CTA buttons
  - Design inspired by Stripe, Vercel, GitHub
  
- **Props**:
  ```tsx
  interface StartPageProps {
    onGetStarted: () => void;
  }
  ```

### 2. **CoreUISidebar.tsx**
- **Purpose**: Role-aware navigation sidebar
- **Features**:
  - Role-color gradient headers (blue/purple/red)
  - Dynamic menu items per UserRole
  - Badge system for pending counts
  - User profile section with avatar
  - Settings and Logout buttons
  - Mobile responsive with toggle
  
- **Navigation Items by Role**:
  - **Project Director**: Dashboard, New Project, My Projects, Scheduling, Revisions
  - **Programme Director**: Dashboard, Assigned Projects, Monitoring, Approvals, Reports
  - **Chairman**: Dashboard, All Projects, Oversight, Approvals, Analytics

- **Color Scheme**:
  - Project Director: Blue (`from-blue-600 to-blue-700`)
  - Programme Director: Purple (`from-purple-600 to-purple-800`)
  - Chairman: Red (`from-red-600 to-red-800`)

### 3. **CoreUIForm.tsx**
- **Purpose**: Reusable form component with validation
- **Supported Field Types**: text, email, number, date, select, textarea
- **Features**:
  - Real-time validation with error indicators
  - Modal-style presentation
  - Grid layout (1 or 2 columns)
  - Loading state management
  - Submit/Cancel buttons with styling

- **Props**:
  ```tsx
  interface CoreUIFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    onCancel: () => void;
    title?: string;
    loading?: boolean;
  }
  ```

### 4. **CoreUIDashboardLayout.tsx**
- **Purpose**: Main layout wrapper for all dashboards
- **Components**:
  - Sidebar integration with toggle
  - Top navigation with:
    - Current page title (dynamic)
    - Search bar
    - Notifications bell with counter
    - User profile dropdown
  - Main content area with scrolling
  - Role-based color accents

- **Props**:
  ```tsx
  interface CoreUIDashboardLayoutProps {
    userRole: UserRole;
    userName: string;
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
    pendingCount?: number;
    children: React.ReactNode;
  }
  ```

---

## Role-Specific Dashboards

### 1. **ProjectDirectorDashboard.tsx**
**For Users**: Project Directors who create and manage projects

**Key Metrics** (5 cards):
- Total Projects (assigned to this user)
- On Track (projects with On Track status)
- At Risk (projects with At Risk status)
- Delayed (projects with Delayed status)
- Pending Revisions (revision requests awaiting approval)

**Main Features**:
- **Your Projects Table**: Lists all assigned projects with:
  - Project Name & Short Name
  - Status badge (color-coded)
  - Budget amount
  - Progress bar (%)
  - End date
  - View button
- **Quick Action Cards**:
  - Scheduling (Create/Update phases and milestones)
  - Revisions (Manage revision requests)
  - Track Progress (View detailed progress metrics)
- **New Project Modal**:
  - Field: projectName, shortName, programmeName, budgetCode, leadCentre
  - Field: category (select), sanctionedAmount, endDate

**Data Filtering**: Only shows projects where `projectDirectorName === currentUserName`

### 2. **ProgrammeDirectorDashboard.tsx**
**For Users**: Programme Directors who monitor and approve project updates

**Key Metrics** (6 cards):
- Total Assigned Projects
- On Track (projects in assigned programmes)
- At Risk (projects with issues)
- Delayed (past deadline projects)
- Average Progress % (weighted average)
- Pending Approvals (revision requests to approve)

**Main Features**:
- **Assigned Projects Table**: Shows overview of all assigned projects with:
  - Project & Programme name
  - Project Director name
  - Status badge
  - Progress bar (%)
  - Budget
  - Review button
- **Quick Action Buttons**:
  - Review Approvals (View pending revision requests)
  - Project Monitoring (Detailed project tracking)

**Data Filtering**: Only shows projects in programmes where `programmeDirectorName === currentUserName`

### 3. **ChairmanDashboard.tsx**
**For Users**: Chairman/CEO for strategic oversight

**Executive Overview** (4 gradient cards):
- Total Projects (all system projects)
- On Track (projects with On Track status)
- At Risk (projects with At Risk status)
- Delayed (projects with Delayed status)

**KPI Section** (3 cards):
- **Total Budget**: Sum of all sanctioned amounts
- **Portfolio Progress %**: Average completion across all projects
- **Pending Approvals**: Total revision requests awaiting approval

**Critical Issues Section**:
- Highlights all At Risk & Delayed projects
- Shows project details and director names
- Escalation/Review buttons
- Red alert styling for visibility

**Portfolio Summary Table**:
- All projects visible (no filtering)
- Status with color coding
- Completion progress bars
- View/Oversight buttons

**Data Access**: Full access to ALL projects, scheduling, and revisions

---

## Enhanced Budget Dashboard Features

The legacy Budget Dashboard has been enhanced with:

### Advanced Charts
- **Bar Charts**: Gradient fills with custom color schemes
- **Pie Charts**: Improved spacing and larger radius
- **Time Period Selector**: 3M, 6M, 1Y buttons for time-based filtering

### Enhanced KPI Cards
- Animated gradient backgrounds on hover
- Trending indicators (TrendingUp icons)
- Smooth fade-in animations
- Comparison metrics ("vs last month")

### Sector Cards with Advanced Metrics
- 3-column metric boxes (Utilization, Reserve %, Risk count)
- Color-coded metrics (blue/emerald/orange)
- Detailed budget breakdown with progress bars
- Status indicator grid (On Track/Completed/At Risk)

---

## Data Models

### UserRole Enum
```tsx
type UserRole = 'Project Director' | 'Programme Director' | 'Chairman';
```

### Sample Data
The system includes hardcoded data with:
- **3 Complete Projects** (each with full hierarchy):
  - Phases (Planning, Integration, Testing, Deployment)
  - Milestones (with dates and completion %)
  - Activities (with dependencies and status)
- **5 Sample Users**:
  - 2 Project Directors
  - 2 Programme Directors
  - 1 Chairman
- **Revision Requests** (with approval workflows)

---

## Navigation Example

### Switching Pages Within a Role

```tsx
// In App.tsx
const [currentPage, setCurrentPage] = useState('dashboard');

// Sidebar calls onNavigate
<CoreUISidebar onNavigate={setCurrentPage} />

// Dashboard layout uses currentPage to show content
{currentPage === 'dashboard' && <ProjectDirectorDashboard />}
{currentPage === 'my-projects' && <MyProjectsPage />}
{currentPage === 'scheduling' && <ProjectSchedulingPage />}
```

---

## Customization Guide

### Change Start Page Text
Edit `src/components/StartPage.tsx` - Look for hardcoded text in JSX

### Change Color Scheme
Sidebar colors are defined in `src/components/CoreUISidebar.tsx`:
```tsx
const bgGradient = userRole === 'Project Director' 
  ? 'from-blue-600 to-blue-700'
  : userRole === 'Programme Director'
  ? 'from-purple-600 to-purple-800'
  : 'from-red-600 to-red-800';
```

### Add New Navigation Items
Edit `src/components/CoreUISidebar.tsx` - Update the `getSidebarItems()` function

### Create New Dashboard Pages
1. Create new component: `src/components/MyProjectsPage.tsx`
2. Add to App.tsx render:
   ```tsx
   {currentPage === 'my-projects' && <MyProjectsPage />}
   ```
3. Add sidebar navigation item pointing to 'my-projects'

---

## Quick Start

### For Users
1. **App loads** → See beautiful Start Page
2. **Click "Get Started"** → See Role Selector
3. **Select Role & User** → Enter CoreUI Dashboard
4. **Use Sidebar** → Navigate between pages
5. **Create Projects** → Use "New Project" form
6. **Manage Revisions** → Via "Revisions" page
7. **Logout** → Return to Start Page

### For Developers
1. Check `App.tsx` for main flow logic
2. Look at `CoreUISidebar.tsx` for role-based navigation
3. Edit individual dashboard components for features
4. Use `CoreUIForm.tsx` for new data entry forms
5. Extend `StartPage.tsx` for custom hero content

---

## Technical Details

### Dependencies Used
- **React 19.2.3** with TypeScript 5.8.2
- **Tailwind CSS 3.4.0** for styling
- **Lucide React 0.562.0** for icons
- **Recharts 3.6.0** for charts

### Responsive Breakpoints
- **Mobile**: `<768px` (grid-cols-1)
- **Tablet**: `≥768px` (grid-cols-2)
- **Desktop**: `≥1024px` (grid-cols-3+)

### Animation Classes
- `animate-in` - Fade in effect
- `hover:scale-110` - Scale on hover
- `transition-all` - Smooth transitions
- `group-hover:` - Group hover effects

---

## Troubleshooting

### Dashboard Not Loading
- Check `userRole` and `currentUserName` are set
- Verify App.tsx appMode is 'PBEMS'
- Check browser console for errors

### Forms Not Submitting
- Verify all required fields have values
- Check validation errors (red icons)
- Ensure onSubmit handler is connected

### Sidebar Not Showing
- Check `CoreUIDashboardLayout` is rendered
- Verify `userRole` prop is passed correctly
- Check that CoreUISidebar component exists

---

## Next Steps

To extend the system:
1. **Add More Pages**: Create page components and add sidebar navigation
2. **Connect Backend**: Replace SAMPLE_DATA with API calls
3. **Add Workflows**: Implement revision request approval flow
4. **Real-time Updates**: Add WebSocket for live notifications
5. **Export Features**: Add PDF/Excel export for reports
6. **Analytics**: Create advanced analytics dashboard for Chairman

