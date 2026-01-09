# PBEMS Project Structure

## Complete Directory Tree

```
f:\PBEMS\PBEMS\
├── App.tsx                                    # Main app with CoreUI mode integration
├── index.html                                 # HTML entry point
├── main.tsx                                   # React entry point
├── metadata.json                              # Project metadata
├── package.json                               # Dependencies
├── postcss.config.js                          # PostCSS config (Tailwind)
├── tailwind.config.js                         # Tailwind CSS config
├── tsconfig.json                              # TypeScript config
├── types.ts                                   # Global type definitions
├── vite.config.ts                             # Vite build config
├── COREUI_GUIDE.md                            # This guide (NEW)
│
├── src/
│   ├── index.css                              # Global styles
│   ├── main.tsx                               # React root
│   ├── types.ts                               # Budget Dashboard types
│   ├── pbemTypes.ts                           # PBEMS TypeScript types
│   ├── pbemData.ts                            # PBEMS hardcoded sample data
│   ├── geminiService.ts                       # Gemini AI service (optional)
│   │
│   └── components/
│       ├── constants.tsx                      # Shared constants
│       │
│       ├── ===== COREUI COMPONENTS (NEW) =====
│       ├── StartPage.tsx                      # Landing page with hero
│       ├── CoreUISidebar.tsx                  # Role-based sidebar nav
│       ├── CoreUIForm.tsx                     # Reusable form component
│       ├── CoreUIDashboardLayout.tsx          # Main dashboard layout
│       ├── ProjectDirectorDashboard.tsx       # PD role dashboard
│       ├── ProgrammeDirectorDashboard.tsx     # ProgrammeD role dashboard
│       ├── ChairmanDashboard.tsx              # Chairman role dashboard
│       │
│       ├── ===== ORIGINAL PBEMS COMPONENTS =====
│       ├── RoleSelector.tsx                   # Role selection UI
│       ├── PBEMSDashboard.tsx                 # Original PBEMS dashboard
│       ├── ProjectDefinitionList.tsx          # Project definitions view
│       ├── ProjectSchedulingDetail.tsx        # Phases/milestones/activities
│       │
│       └── ===== BUDGET DASHBOARD COMPONENTS =====
│           ├── Dashboard.tsx                  # Main budget dashboard
│           ├── KPI.tsx                        # KPI card component
│           ├── ProjectCard.tsx                # Project card component
│           ├── ProjectDetail.tsx              # Project detail page
│           └── Sidebar.tsx                    # Budget dashboard sidebar
```

## File Descriptions

### Core Application Files

| File | Purpose | Status |
|------|---------|--------|
| `App.tsx` | Main app component with mode switching | ✅ Updated with CoreUI |
| `main.tsx` | React app entry point | ✅ Existing |
| `index.html` | HTML shell | ✅ Existing |
| `types.ts` | Budget Dashboard types | ✅ Existing |
| `pbemTypes.ts` | PBEMS TypeScript interfaces | ✅ Complete |
| `pbemData.ts` | PBEMS hardcoded sample data | ✅ Complete |

### CoreUI Components (New - Session 2)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `StartPage.tsx` | ~350 | Professional landing page with trending design |
| `CoreUISidebar.tsx` | ~250 | Role-aware navigation sidebar |
| `CoreUIForm.tsx` | ~220 | Reusable form with validation |
| `CoreUIDashboardLayout.tsx` | ~200 | Main layout wrapper for dashboards |
| `ProjectDirectorDashboard.tsx` | ~280 | Project Director role dashboard |
| `ProgrammeDirectorDashboard.tsx` | ~220 | Programme Director role dashboard |
| `ChairmanDashboard.tsx` | ~280 | Chairman role dashboard |

### Original PBEMS Components

| Component | Purpose | Notes |
|-----------|---------|-------|
| `RoleSelector.tsx` | Role/user selection UI | Used in LEGACY_PBEMS mode |
| `PBEMSDashboard.tsx` | Original PBEMS dashboard | Superseded by CoreUI dashboards |
| `ProjectDefinitionList.tsx` | Project definitions view | Can integrate with CoreUI |
| `ProjectSchedulingDetail.tsx` | Phases/milestones/activities | Can integrate with CoreUI |

### Budget Dashboard Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `Dashboard.tsx` | Main budget dashboard | ✅ Enhanced (Message 8) |
| `KPI.tsx` | KPI card with animations | ✅ Enhanced (Message 8) |
| `ProjectCard.tsx` | Project card with gradients | ✅ Enhanced (Message 8) |
| `ProjectDetail.tsx` | Project detail page | ✅ Enhanced (Message 8) |
| `Sidebar.tsx` | Budget dashboard sidebar | ✅ Existing |

---

## Component Hierarchy

### CoreUI Mode Flow

```
App.tsx (appMode === 'PBEMS' && userRole)
└── CoreUIDashboardLayout
    ├── CoreUISidebar
    │   └── Navigation items per role
    ├── Top Navigation Bar
    │   ├── Search
    │   ├── Notifications
    │   └── User Profile
    └── Main Content
        ├── ProjectDirectorDashboard (if role === 'Project Director')
        │   ├── 5 Statistics Cards
        │   ├── Projects Table
        │   ├── Quick Action Cards
        │   └── New Project Modal
        ├── ProgrammeDirectorDashboard (if role === 'Programme Director')
        │   ├── 6 KPI Cards
        │   ├── Assigned Projects Table
        │   └── Quick Action Buttons
        └── ChairmanDashboard (if role === 'Chairman')
            ├── Executive Overview (4 cards)
            ├── KPI Section (3 cards)
            ├── Critical Issues Section
            └── Portfolio Summary Table
```

### Budget Dashboard Mode Flow

```
App.tsx (appMode === 'BUDGET')
└── <div className="flex">
    ├── Sidebar
    │   └── Budget navigation items
    └── Main Content
        ├── Dashboard (currentView === 'DASHBOARD')
        │   ├── KPI Section
        │   ├── Charts Section
        │   └── Sector Cards
        ├── Category Detail (currentView === 'CATEGORY_DETAIL')
        │   └── Projects Grid
        └── Project Detail (currentView === 'PROJECT_DETAIL')
            └── Project Information
```

---

## Data Flow

### User Authentication Flow

```
START PAGE
    ↓
User clicks "Get Started"
    ↓
App switches to PBEMS mode
    ↓
RoleSelector appears (if no role selected)
    ↓
User selects role & name
    ↓
App stores: userRole, currentUserName
    ↓
CoreUIDashboardLayout renders with appropriate dashboard
```

### Navigation Flow

```
CoreUISidebar
    ↓
User clicks navigation item
    ↓
onNavigate(page) called
    ↓
setCurrentPage(page) updates state
    ↓
CoreUIDashboardLayout checks currentPage
    ↓
Renders appropriate component
```

### Form Submission Flow

```
User clicks "New Project"
    ↓
Modal opens with CoreUIForm
    ↓
User fills in fields
    ↓
Validation runs on each field
    ↓
User clicks Submit
    ↓
onSubmit handler processes data
    ↓
Data added to SAMPLE_PROJECT_DEFINITIONS
    ↓
Dashboard updates and re-renders
```

---

## State Management

### App.tsx State Variables

```tsx
// Modes
const [appMode, setAppMode] = useState<AppMode>('START');
// Options: 'START', 'PBEMS', 'LEGACY_PBEMS', 'BUDGET'

// PBEMS User Info
const [userRole, setUserRole] = useState<UserRole | null>(null);
const [currentUserName, setCurrentUserName] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState('dashboard');

// Budget Dashboard
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentView, setCurrentView] = useState<View>('DASHBOARD');
const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
```

---

## Sample Data Structure

### User Roles
```tsx
type UserRole = 'Project Director' | 'Programme Director' | 'Chairman';
```

### Available Users (from pbemData.ts)

**Project Directors:**
- Alice Johnson
- Bob Smith

**Programme Directors:**
- Carol Davis
- David Wilson

**Chairman:**
- Emma Thompson

### Sample Projects

Each project includes:
- Project Definition (name, budget, director, dates)
- Project Scheduling (phases with milestones and activities)
- Revision Requests (approval workflows)

---

## Configuration Files

### tailwind.config.js
- Configured for gradient utilities
- Custom animations (fade-in, scale-110)
- Color palette optimized for CoreUI

### tsconfig.json
- Strict mode enabled for type safety
- React 19 JSX transform
- Module resolution for ESM

### vite.config.ts
- React plugin configured
- Port 5173 for development
- Fast refresh enabled

---

## Key Design Patterns

### 1. Role-Based Rendering
```tsx
{currentPage === 'dashboard' && userRole === 'Project Director' && (
  <ProjectDirectorDashboard {...props} />
)}
```

### 2. Sidebar Item Mapping
```tsx
const getSidebarItems = (): SidebarItem[] => {
  if (userRole === 'Project Director') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
      // ... more items
    ];
  }
  // Handle other roles
};
```

### 3. Data Filtering by Role
```tsx
const myProjects = SAMPLE_PROJECT_DEFINITIONS.filter(
  p => p.projectDirectorName === userName
);
```

### 4. Statistics Calculation
```tsx
const stats = {
  total: assignedProjects.length,
  onTrack: assignedProjects.filter(p => p.status === 'On Track').length,
  // ... more stats
};
```

---

## CSS Classes Used

### Gradients
```
from-blue-600 to-blue-700          # Project Director
from-purple-600 to-purple-800      # Programme Director
from-red-600 to-red-800            # Chairman
```

### Animations
```
animate-in                         # Fade in
group-hover:scale-110             # Scale on hover
transition-all                     # Smooth transitions
hover:shadow-lg                    # Shadow on hover
```

### Responsive
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3    # Responsive grid
hidden sm:block                               # Hide on mobile
```

---

## Import Statements Guide

### From pbemTypes.ts
```tsx
import { UserRole, ProjectStatus, ... } from './pbemTypes';
```

### From pbemData.ts
```tsx
import { 
  SAMPLE_PROJECT_DEFINITIONS,
  SAMPLE_PROJECT_SCHEDULING,
  SAMPLE_REVISION_REQUESTS,
  SAMPLE_USERS 
} from './pbemData';
```

### From lucide-react
```tsx
import { 
  Bell, Menu, LogOut, Settings, Plus,
  LayoutGrid, Briefcase, CheckCircle,
  AlertCircle, TrendingUp, ...
} from 'lucide-react';
```

---

## Extending the System

### Add a New Dashboard Page

1. Create `src/components/MyNewPage.tsx`:
```tsx
interface MyNewPageProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const MyNewPage: React.FC<MyNewPageProps> = ({ userName, onNavigate }) => {
  return <div>New Page Content</div>;
};

export default MyNewPage;
```

2. Add to App.tsx:
```tsx
{currentPage === 'my-new-page' && (
  <MyNewPage userName={currentUserName} onNavigate={setCurrentPage} />
)}
```

3. Add sidebar item in CoreUISidebar.tsx:
```tsx
{
  id: 'my-new-page',
  label: 'My New Page',
  icon: YourIcon,
  badge: someCount
}
```

---

## Performance Tips

1. **Memoize Components**: Use `React.memo()` for large lists
2. **Lazy Load**: Use `React.lazy()` for page components
3. **Optimize Renders**: Track `currentPage` changes carefully
4. **Tailwind Purging**: All classes are static, no runtime issues

---

