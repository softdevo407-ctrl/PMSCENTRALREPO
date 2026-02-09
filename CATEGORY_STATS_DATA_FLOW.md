# CategoryStatsCards - Data Flow Diagram

## 🎯 How It Works Now (After Fix)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER LOGIN                                    │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│              AuthService stores user data                            │
│    { employeeCode: "PD001", role: "PROJECT_DIRECTOR", ... }        │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│         Dashboard Component Renders                                  │
│    (ProjectDirectorDashboard, ProgrammeDirectorDashboard, etc)     │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│      CategoryStatsCards receives props                               │
│    {                                                                 │
│      employeeCode: "PD001",     ← FROM useAuth hook                │
│      userRole: "PROJECT_DIRECTOR", ← FROM useAuth hook             │
│      onNavigate: function        ← FROM parent component             │
│    }                                                                 │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────┐
    │   useEffect Hook Checks:               │
    │   - Is employeeCode defined?           │
    │   - Is userRole defined?               │
    │   BOTH MUST BE TRUE ✓                 │
    └────────────────┬───────────────────────┘
                     │
         ┌───────────┴────────────────┐
         ▼                            ▼
  PROJECT_DIRECTOR          CHAIRMAN / OTHER
  or PROGRAMME_DIRECTOR
         │                            │
         ▼                            ▼
   /category-stats-by-   /category-stats
   director/{empCode}    (global endpoint)
         │                            │
         └───────────────┬────────────┘
                         ▼
         ┌───────────────────────────────┐
         │  Backend Returns Categories   │
         │  [                            │
         │    {                          │
         │      projectCategoryCode,     │
         │      projectCount,            │
         │      onTrack,                 │
         │      atRisk,                  │
         │      delayed,                 │
         │      completed                │
         │    },                         │
         │    ...                        │
         │  ]                            │
         └────────────┬──────────────────┘
                      │
                      ▼
         ┌───────────────────────────────┐
         │  Component Processes Data:    │
         │  1. Fetch all categories      │
         │  2. Merge with stats          │
         │  3. Format for display        │
         └────────────┬──────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  Render Category Stats Cards         │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │ CATEGORY_1                    │ │
    │  │ Total: 5                      │ │
    │  │ On Track: 3  At Risk: 1       │ │
    │  │ Delayed: 1  Completed: 0      │ │
    │  └────────────────────────────────┘ │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │ CATEGORY_2                    │ │
    │  │ Total: 3                      │ │
    │  │ On Track: 2  At Risk: 0       │ │
    │  │ Delayed: 0  Completed: 1      │ │
    │  └────────────────────────────────┘ │
    │                                      │
    └──────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### For Project Director

```
CLIENT SIDE                           SERVER SIDE
─────────────────────────────────────────────────────

User logs in
  │
  ├─→ AuthService.login()
  │     │
  │     └─→ Backend Authentication
  │           │
  │           └─→ Returns { token, role, employeeCode, ... }
  │
  ├─→ useAuth stores data
  │
  ├─→ Dashboard renders
  │
  ├─→ CategoryStatsCards receives props
  │     │
  │     ├─→ userRole = "PROJECT_DIRECTOR" ✓
  │     └─→ employeeCode = "PD001" ✓
  │
  ├─→ useEffect triggered
  │     │
  │     └─→ Detects PROJECT_DIRECTOR
  │           │
  │           └─→ categoryStatsService.getCategoryStatsByDirector("PD001")
  │                 │
  │                 ├─→ FETCH GET /api/project-details/
  │                 │           category-stats-by-director/PD001
  │                 │
  │                 │           Backend queries:
  │                 │           SELECT * FROM project_details
  │                 │           WHERE missionProjectDirector = 'PD001'
  │                 │           GROUP BY projectCategoryCode
  │                 │
  │                 └─→ Returns [
  │                       {
  │                         projectCategoryCode: "LV",
  │                         projectCount: 5,
  │                         onTrack: 3,
  │                         atRisk: 1,
  │                         delayed: 1,
  │                         completed: 0
  │                       },
  │                       ...
  │                     ]
  │
  └─→ Component renders with PD001's stats
```

### For Chairman

```
CLIENT SIDE                           SERVER SIDE
─────────────────────────────────────────────────────

User logs in as Chairman
  │
  ├─→ AuthService.login()
  │     │
  │     └─→ Backend Authentication
  │           │
  │           └─→ Returns { token, role: "CHAIRMAN", ... }
  │
  ├─→ useAuth stores data
  │
  ├─→ ChairmanDashboard renders
  │
  ├─→ CategoryStatsCards receives props
  │     │
  │     ├─→ userRole = "CHAIRMAN" (not director)
  │     └─→ employeeCode = "CHAIRMAN"
  │
  ├─→ useEffect triggered
  │     │
  │     └─→ Detects NOT a director role
  │           │
  │           └─→ categoryStatsService.getCategoryStats() (GLOBAL)
  │                 │
  │                 ├─→ FETCH GET /api/project-details/
  │                 │           category-stats
  │                 │
  │                 │           Backend queries:
  │                 │           SELECT * FROM project_details
  │                 │           GROUP BY projectCategoryCode
  │                 │
  │                 └─→ Returns [
  │                       {
  │                         projectCategoryCode: "LV",
  │                         projectCount: 15,  ← ALL projects!
  │                         onTrack: 10,
  │                         atRisk: 3,
  │                         delayed: 2,
  │                         completed: 0
  │                       },
  │                       ...
  │                     ]
  │
  └─→ Component renders with GLOBAL stats
```

---

## ⚙️ Component State Machine

```
┌─────────────────────────────────────────────────────────┐
│              INITIAL STATE                              │
│  stats: []                                              │
│  categories: Map {}                                     │
│  loading: true                                          │
│  error: null                                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ useEffect Hook Triggered     │
        │ Check: employeeCode && role  │
        │ IF TRUE → call fetchData()   │
        │ IF FALSE → wait              │
        └──────────┬───────────────────┘
                   │
        ┌──────────┴─────────────────┐
        │ YES                        │ NO
        ▼                            ▼
   Fetch API              Component remains
   setLoading(true)       waiting for props
        │                            │
        ▼                            ▼
   Parse Response         (employeeCode or role
   Merge Stats            gets set later)
   setStats(merged)            │
   setLoading(false)           │
        │                      │
        ▼                      ▼
   ┌─────────────────────────────────┐
   │      READY STATE                │
   │  stats: [CategoryStat, ...]     │
   │  categories: Map {code: info}   │
   │  loading: false                 │
   │  error: null                    │
   │                                 │
   │  Component renders cards ✓      │
   └─────────────────────────────────┘
```

---

## 🔍 Data Structure

### CategoryStat Interface
```typescript
interface CategoryStat {
  category: string;        // e.g., "LV" (Launch Vehicles)
  total: number;           // e.g., 5 projects
  onTrack: number;         // e.g., 3 on track
  atRisk: number;          // e.g., 1 at risk
  delayed: number;         // e.g., 1 delayed
  completed: number;       // e.g., 0 completed
}
```

### Example Data After Merge
```typescript
[
  {
    category: "LV",
    total: 5,
    onTrack: 3,
    atRisk: 1,
    delayed: 1,
    completed: 0
  },
  {
    category: "SAT_COMM",
    total: 3,
    onTrack: 2,
    atRisk: 0,
    delayed: 0,
    completed: 1
  },
  {
    category: "INFRA",
    total: 2,
    onTrack: 2,
    atRisk: 0,
    delayed: 0,
    completed: 0
  }
]
```

---

## 🎨 UI Rendering Flow

```
Component receives merged stats array
            │
            ▼
    ┌───────────────────────┐
    │ For each CategoryStat │
    │ Create Card component │
    └───────┬───────────────┘
            │
            ▼
    ┌─────────────────────────────────────┐
    │ Card Header:                        │
    │ - Category full name                │
    │ - Icon (rotated)                    │
    │ - Gradient background (rotated)     │
    └───────┬─────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────────┐
    │ Card Body:                          │
    │ - Total count (large)               │
    │ - Status breakdown:                 │
    │   • On Track: X                     │
    │   • At Risk: X                      │
    │   • Delayed: X                      │
    │   • Completed: X                    │
    └───────┬─────────────────────────────┘
            │
            ▼
    ┌─────────────────────────────────────┐
    │ Card Interaction:                   │
    │ - Clickable if total > 0            │
    │ - Calls onNavigate('my-projects',   │
    │   categoryCode)                     │
    │ - Dimmed if total = 0               │
    └─────────────────────────────────────┘
```

---

## 🔐 Authorization Flow

```
Login
  │
  ├─→ Check credentials
  │
  ├─→ Return user with ROLE
  │
  ├─→ useAuth hook stores:
  │     - employeeCode
  │     - role (PROJECT_DIRECTOR, PROGRAMME_DIRECTOR, CHAIRMAN, etc)
  │
  ├─→ Dashboard passes both to CategoryStatsCards
  │
  ├─→ CategoryStatsCards checks role:
  │
  │   ┌─────────────────────────────────────┐
  │   │ if role = PROJECT_DIRECTOR:         │
  │   │   API call: /category-stats-by-     │
  │   │   director/{employeeCode}           │
  │   │   Returns: Director's projects only │
  │   │                                     │
  │   │ if role = PROGRAMME_DIRECTOR:       │
  │   │   API call: /category-stats-by-     │
  │   │   director/{employeeCode}           │
  │   │   Returns: Programme projects only  │
  │   │                                     │
  │   │ else (CHAIRMAN or other):           │
  │   │   API call: /category-stats         │
  │   │   Returns: ALL projects             │
  │   └─────────────────────────────────────┘
  │
  └─→ Component renders based on role-specific data ✓
```

---

## 📊 Summary Table

| Role | Endpoint Called | Data Returned | Use Case |
|------|-----------------|---------------|----------|
| PROJECT_DIRECTOR | `/category-stats-by-director/{empCode}` | Director's projects | View your assigned projects |
| PROGRAMME_DIRECTOR | `/category-stats-by-director/{empCode}` | Programme projects | View your programme projects |
| CHAIRMAN | `/category-stats` | All projects | View entire portfolio |

