# Category Lookup - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROJECT DIRECTOR DASHBOARD                       │
│                    (MyProjectsPage.tsx)                             │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ├─────── On Mount
                              │
        ┌─────────────────────┼──────────────────────────┐
        │                     │                          │
        ↓                     ↓                          ↓
   ┌─────────────┐   ┌──────────────────┐    ┌─────────────────────┐
   │  Fetch      │   │ Fetch Status &   │    │ Fetch Programme     │
   │  Projects   │   │ Project Types    │    │ Types               │
   └─────────────┘   └──────────────────┘    └──────────┬──────────┘
        │                     │                         │
        │                     │                   Extract Category Codes
        │                     │                         │
        │                     │                   ┌─────▼──────────────┐
        │                     │                   │ LOOP: For each     │
        │                     │                   │ unique category    │
        │                     │                   │ code found         │
        │                     │                   └──────┬─────────────┘
        │                     │                          │
        │                     │              ┌───────────▼─────────────┐
        │                     │              │ Fetch Category by Code  │
        │                     │              │ (getProjectCategoryBy   │
        │                     │              │  Code)                  │
        │                     │              └───────────┬─────────────┘
        │                     │                          │
        └──────────┬──────────┴──────────────────────────┘
                   │
                   ↓
        ┌──────────────────────────┐
        │ Build Lookup Maps:       │
        │ - statusMap              │
        │ - typeMap                │
        │ - categoryMap            │
        └──────────┬───────────────┘
                   │
                   ↓
        ┌──────────────────────────┐
        │ Store in Component State │
        └──────────┬───────────────┘
                   │
                   ↓
        ┌──────────────────────────┐
        │ Component Re-renders     │
        │ Using Mapped Values      │
        └──────────────────────────┘
```

## Database Schema Relationships

```
┌─────────────────────────────────┐
│      ProjectDetail              │ (pmsmaintables)
├─────────────────────────────────┤
│ missionProjectCode (PK)         │
│ missionProjectFullName          │
│ programmeTypeCode (FK) ──────┐  │
│ projectCategoryCode (FK) ──┐ │  │
│ projectTypesCode            │ │  │
│ ... 30+ other fields        │ │  │
└─────────────────────────────┬─┼──┘
                              │ │
                   ┌──────────┘ │
                   │            │
                   ↓            │
┌──────────────────────────────┐│
│   ProgrammeType              ││ (pmsgeneric)
├──────────────────────────────┤│
│ programmeTypeCode (PK)       ││
│ projectCategoryCode (FK) ─┐  ││
│ programmeTypeFullName     │  ││
│ programmeTypeShortName    │  ││
│ hierarchyOrder            │  ││
│ fromDate, toDate          │  ││
│ userId, regStatus         │  ││
└────────────┬──────────────┘│ │
             │               │ │
             │ ┌─────────────┘ │
             │ │               │
             │ ↓               │
             │┌─────────────────┼─────────────────┐
             ││ ProjectCategory │                 │
             ││ (pksgeneric)    │                 │
             ││                 │                 │
             ││ projectCategory-│                 │
             ││Code (PK)        │◄────────────────┘
             ││                 │
             ││ projectCategory-│
             ││FullName        │
             ││ projectCategory-│
             ││ ShortName       │
             ││ showOnDashboard │
             ││ hierarchyOrder  │
             ││ fromDate, toDate│
             ││ userId          │
             ││ regStatus       │
             │└─────────────────┘
             │
             └─── (User selects via filter)
                  Displays full names
```

## API Call Sequence Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│ useEffect Hook Triggers (on component mount)                    │
└──────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────┐
│ API Call #1: GET /api/projects/my-projects                      │
│ Response: [ ProjectDetail, ... ]                                 │
│ Stores in: myProjects state                                      │
└──────────┬───────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ API Call #2: GET /api/project-status-codes                       │
│ Response: [ { code, fullName }, ... ]                            │
│ Builds: statusMap = { "ON_TRACK": "On Track", ... }              │
└──────────┬───────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ API Call #3: GET /api/project-types                              │
│ Response: [ { code, fullName }, ... ]                            │
│ Builds: typeMap = { "TYP02": "Technology Dev", ... }             │
└──────────┬───────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ API Call #4: GET /api/programme-types                            │
│ Response: [ { code, projectCategoryCode, fullName }, ... ]       │
│ Extracts: [ "CAT01", "CAT02", "CAT03" ] (unique codes)           │
└──────────┬───────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ API Call #5+: GET /api/project-categories/{categoryCode}         │
│ (Loop for each unique category code)                             │
│                                                                   │
│ Call #5: GET /api/project-categories/CAT01                       │
│ Response: { code: "CAT01", fullName: "Technology Dev", ... }    │
│                                                                   │
│ Call #6: GET /api/project-categories/CAT02                       │
│ Response: { code: "CAT02", fullName: "Infrastructure", ... }    │
│                                                                   │
│ Call #7: GET /api/project-categories/CAT03                       │
│ Response: { code: "CAT03", fullName: "Research", ... }           │
│                                                                   │
│ Builds: categoryMap = {                                          │
│   "CAT01": "Technology Development",                             │
│   "CAT02": "Infrastructure",                                     │
│   "CAT03": "Research"                                            │
│ }                                                                │
└──────────┬───────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ All maps stored in component state                               │
│ Component re-renders with actual names instead of codes          │
│                                                                   │
│ statusMap ──────────────────┐                                    │
│ typeMap ────────────────────┼─→ UI Display                       │
│ categoryMap ────────────────┘                                    │
└──────────────────────────────────────────────────────────────────┘
```

## UI Component Tree

```
MyProjectsPage
├── Portfolio Overview Cards (Total Projects, On Track, At Risk, Budget)
│
├── Main Grid (3-column layout)
│   │
│   ├── Projects List (2/3 width)
│   │   ├── Filter Section
│   │   │   ├── Status Filter
│   │   │   │   └─ Direct hardcoded options
│   │   │   │
│   │   │   ├── Programme Type Filter
│   │   │   │   └─ Uses: typeMap[type] || type
│   │   │   │
│   │   │   └── Category Filter
│   │   │       └─ Uses: categoryMap[category] || category ⭐
│   │   │
│   │   └── Projects Cards (filtered list)
│   │       ├── Status Badge
│   │       │   └─ Uses: statusMap[status] || getStatusLabel()
│   │       ├── Project Title
│   │       ├── Project Type Name
│   │       │   └─ Uses: typeMap[type] || type
│   │       ├── Financial Grid
│   │       └── Date Grid
│   │
│   └── Details Sidebar (1/3 width)
│       ├── Project Details Card
│       │   ├── Project Code
│       │   ├── Full Name
│       │   ├── Budget Code
│       │   └── Category ⭐
│       │       └─ Uses: categoryMap[code] || code
│       │
│       ├── Phases Panel
│       ├── Budget Breakup
│       └── Action Buttons
│
└── Modals
    ├── AddPhaseModal
    ├── AddProjectDefinitionModal
    └── StatusUpdationModal
```

## State Management

```
┌──────────────────────────────────────┐
│     Component State Variables        │
├──────────────────────────────────────┤
│ myProjects: ProjectDetailResponse[]  │
│ loading: boolean                     │
│ error: string | null                 │
│ selectedProject: string | null       │
│ filterStatus: string                 │
│ filterType: string                   │
│ filterCategory: string               │
│                                      │
│ statusMap: StatusMap {               │
│   [code: string]: name               │
│ } ⭐ Maps status codes to names      │
│                                      │
│ typeMap: TypeMap {                   │
│   [code: string]: name               │
│ } ⭐ Maps type codes to names        │
│                                      │
│ categoryMap: CategoryMap {            │
│   [code: string]: name               │
│ } ⭐ Maps category codes to names    │
│                                      │
│ ... other state variables            │
└──────────────────────────────────────┘
```

## Data Transformation Pipeline

```
Raw API Response               Transformed for UI
─────────────────────────────────────────────────────

Project {                      Project {
  code: "PROJ001"                code: "PROJ001"
  name: "...",                   name: "...",
  currentStatus: "ON_TRACK"  →   currentStatus: "On Track" (via statusMap)
  projectTypesCode: "TYP02"      projectType: "Technology Dev" (via typeMap)
  projectCategoryCode: "CAT01"   category: "Technology Development" (via categoryMap)
}                            }
```

## Error Handling Flow

```
Component Mounts
      │
      ├─ Try: Fetch Projects
      │  ├─ Success: Store in myProjects
      │  └─ Fail: Set error, show error message
      │
      ├─ Try: Fetch Status Codes
      │  ├─ Success: Build statusMap
      │  └─ Fail: Continue (partial functionality)
      │
      ├─ Try: Fetch Project Types
      │  ├─ Success: Build typeMap
      │  └─ Fail: Continue (partial functionality)
      │
      ├─ Try: Fetch Programme Types
      │  ├─ Success: Extract category codes
      │  └─ Fail: Set error, abort
      │
      └─ For each category code:
         ├─ Try: Fetch Category
         │  ├─ Success: Add to categoryMap
         │  └─ Fail: Skip, log error, continue
         │         (Category code will display as fallback)
         │
         └─ Finally: Render UI with available data

UI Always Shows:
┌─────────────────────────────────────────┐
│ categoryMap[code] || code               │
│                                         │
│ ✅ Shows name if available              │
│ ✅ Falls back to code if not available  │
│ ✅ Never breaks, never shows blank      │
└─────────────────────────────────────────┘
```

## Performance Characteristics

```
Metric              Value           Notes
─────────────────────────────────────────────────────────
First Load Time     ~2-3 seconds    4-5 API calls sequential
                                    
API Calls           4-5 total       Depends on unique categories
Memory Usage        <100KB          Small maps of codes/names
Cache Strategy      In-memory       Per session
Cache Hit Rate      ~100%           After initial load
Lookup Time         O(1)            Object key lookup
Re-renders          1               After all data loaded
Network Traffic     ~50-200KB       Depends on response sizes

Optimization:
- Caching prevents repeated API calls
- Unique category extraction minimizes lookups
- Fallback ensures no broken UI
```

## Integration Points Summary

```
MyProjectsPage
    ├─ Imports: ProgrammeTypeService ──────┬──→ getAllProgrammeTypes()
    ├─ Imports: ProjectCategoryService ────┼──→ getProjectCategoryByCode(code)
    ├─ Uses: projectDetailService ────────┐│
    ├─ Uses: projectStatusCodeService ──┐ ││
    └─ Uses: projectTypeService ────┐   │ ││
                                    │   │ ││
                                    ↓   ↓ ↓↓
                            🔄 Lookup Maps Built
                                    ↓
                            📊 UI Updated with Names
```
