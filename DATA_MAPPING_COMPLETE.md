# Complete Data Mapping - Chairman Dashboard

## Field Mapping from ProjectDetailResponse

### For Budget Calculation
```java
// From ProjectDetailResponse.java
private BigDecimal sanctionedCost;  // Used for totalBudget and line chart
private BigDecimal cumulativeExpenditureToDate;  // Used for scatter chart
private BigDecimal cumExpUpToPrevFy;  // Used for progress calculation
private String currentStatus;  // Used for status-based filtering
```

### Conversion Logic in Frontend
```tsx
// Safe BigDecimal conversion
const sanctionedCost = typeof p.sanctionedCost === 'number' 
  ? p.sanctionedCost 
  : parseFloat(String(p.sanctionedCost || 0));

// Verify finite number
return sum + (isFinite(sanctionedCost) ? sanctionedCost : 0);
```

---

## ProjectCategoryCode Mapping

### From CategoryStatsCards.tsx Reference Implementation

**Service Endpoint**: `/api/project-details/category-stats`

**Response Structure**:
```typescript
interface CategoryStats {
  projectCategoryCode: string;      // e.g., "CAT001"
  projectCategoryFullName: string;  // e.g., "Research & Development"
  projectCategoryShortName: string; // e.g., "R&D"
  projectCount: number;             // Count of projects in this category
}
```

### Mapping in ChairmanDashboard

1. **Fetch Categories**:
```tsx
const allCategories = await ProjectCategoryService.getAllProjectCategories();
const categoryMap = new Map<string, any>();
allCategories.forEach((cat) => {
  categoryMap.set(cat.projectCategoryCode, {
    code: cat.projectCategoryCode,
    fullName: cat.projectCategoryFullName
  });
});
```

2. **Fetch Category Stats**:
```tsx
const stats = await categoryStatsService.getCategoryStats();
```

3. **Display in Donut Chart**:
```tsx
categoryStats.map((cat, idx) => ({
  name: categories.get(cat.projectCategoryCode)?.fullName || cat.projectCategoryCode,
  value: cat.projectCount || 0,
  fill: colors[idx % 8]
}))
```

---

## Status Mapping

### Project Status Values (from ProjectDetailResponse.currentStatus)

```
Possible Values:
- "ON_TRACK" → Displayed as "On Track"
- "AT_RISK"  → Displayed as "At Risk"
- "DELAYED"  → Displayed as "Delayed"
- "COMPLETED" → Displayed as "Completed"
- null/undefined → Treated as "On Track" (default)
```

### Conversion Function
```tsx
const getProjectStatus = (project: ProjectDetailResponse) => {
  if (!project.currentStatus) return 'On Track';
  const status = project.currentStatus.toUpperCase();
  if (status === 'ON_TRACK') return 'On Track';
  if (status === 'AT_RISK') return 'At Risk';
  if (status === 'DELAYED') return 'Delayed';
  if (status === 'COMPLETED') return 'Completed';
  return 'On Track';
};
```

---

## Chart Data Transformation Pipeline

### 1. Bar Chart - Project Status Distribution

```
Input: allProjects (ProjectDetailResponse[])
    ↓
Filter & Count by currentStatus
    ↓
Output: [
  { status: 'On Track', count: 12 },
  { status: 'At Risk', count: 3 },
  { status: 'Delayed', count: 2 },
  { status: 'Completed', count: 5 }
]
    ↓
Render: BarChart with status labels and counts
```

### 2. Line Chart - Top 5 Projects

```
Input: allProjects (ProjectDetailResponse[])
    ↓
Sort by sanctionedCost (descending)
    ↓
Take top 5 projects
    ↓
Map to {
  name: missionProjectShortName,
  sanctioned: sanctionedCost,
  expended: cumulativeExpenditureToDate
}
    ↓
Render: LineChart with 2 lines (sanctioned vs expended)
```

### 3. Donut Chart - Categories

```
Input1: categoryStats (from backend service)
Input2: categories (Map from ProjectCategoryService)
    ↓
Map each category stat to {
  name: categories[code].fullName,
  value: projectCount,
  fill: colorFromPalette
}
    ↓
Render: PieChart (Donut) with segments per category
```

### 4. Scatter Chart - All Projects

```
Input: allProjects (ProjectDetailResponse[])
    ↓
Map each project to {
  sanctioned: sanctionedCost,
  expended: cumulativeExpenditureToDate
}
    ↓
Render: ScatterChart
  X-axis: sanctioned (Cr)
  Y-axis: expended (Cr)
  Points: One per project
```

---

## Budget Calculation Detail

### Formula
```
totalBudget = SUM(all projects.sanctionedCost)
```

### Implementation
```tsx
totalBudget: allProjects.reduce((sum, p) => {
  const sanctionedCost = typeof p.sanctionedCost === 'number' 
    ? p.sanctionedCost 
    : parseFloat(String(p.sanctionedCost || 0));
  return sum + (isFinite(sanctionedCost) ? sanctionedCost : 0);
}, 0)
```

### Display Format
```tsx
{stats.totalBudget.toFixed(2)} Cr
```

### Example
```
If projects have sanctionedCost: [100, 250, 50]
totalBudget = 100 + 250 + 50 = 400
Display: "400.00 Cr"
```

---

## KPI Stats Calculation

```tsx
const stats = {
  // Count of all projects
  total: allProjects.length,
  
  // Count where currentStatus === 'ON_TRACK'
  onTrack: allProjects.filter((p) => getProjectStatus(p) === 'On Track').length,
  
  // Count where currentStatus === 'AT_RISK'
  atRisk: allProjects.filter((p) => getProjectStatus(p) === 'At Risk').length,
  
  // Count where currentStatus === 'DELAYED'
  delayed: allProjects.filter((p) => getProjectStatus(p) === 'Delayed').length,
  
  // Count where currentStatus === 'COMPLETED'
  completed: allProjects.filter((p) => getProjectStatus(p) === 'Completed').length,
  
  // Sum of all sanctionedCost values
  totalBudget: allProjects.reduce((sum, p) => {
    const sanctionedCost = typeof p.sanctionedCost === 'number' 
      ? p.sanctionedCost 
      : parseFloat(String(p.sanctionedCost || 0));
    return sum + (isFinite(sanctionedCost) ? sanctionedCost : 0);
  }, 0),
  
  // Average of all project progress percentages
  avgCompletion: Math.round(
    allProjects.reduce((sum, p) => sum + computeProgress(p), 0) /
      (allProjects.length || 1)
  ),
  
  // Count of pending revisions
  pendingApprovals: allRevisions.filter((r) => r.status === 'PENDING').length,
};
```

---

## Data Freshness

**On Component Mount**:
1. `fetchAllProjects()` - Gets all ProjectDetailResponse objects
2. `fetchCategoryData()` - Gets categories and category stats

**Update Trigger**: Manual refresh only (no auto-refresh currently)

**Caching Strategy**: None (fresh data on each mount)

---

## Null/Undefined Handling

| Field | Handling | Default |
|-------|----------|---------|
| sanctionedCost | Parse or 0 | 0 |
| cumulativeExpenditureToDate | Parse or 0 | 0 |
| currentStatus | Uppercase comparison | "On Track" |
| missionProjectShortName | substring(0, 10) or "Project" | "Project" |
| projectCategoryCode | Use as-is or "Unassigned" | "Unassigned" |
| projectCount | Use or 0 | 0 |

---

## Backend Service Integration

### Services Used

1. **projectDetailService**
   - Method: `getAllProjectDetails()`
   - Returns: `ProjectDetailResponse[]`
   - Used for: All dashboard data

2. **categoryStatsService**
   - Method: `getCategoryStats()`
   - Returns: `CategoryStats[]`
   - Used for: Donut chart categories

3. **ProjectCategoryService**
   - Method: `getAllProjectCategories()`
   - Returns: Category objects with code + names
   - Used for: Category label mapping

### API Endpoints

```
GET /api/project-details/all
→ Returns: ProjectDetailResponse[]

GET /api/project-details/category-stats
→ Returns: CategoryStats[]

GET /api/project-categories
→ Returns: ProjectCategory[]
```

---

## Example Data Flow

### Scenario: 3 Projects in System

**Project 1**:
```
missionProjectCode: "PROJ001"
sanctionedCost: 100.00
cumulativeExpenditureToDate: 75.50
currentStatus: "ON_TRACK"
projectCategoryCode: "CAT001"
```

**Project 2**:
```
missionProjectCode: "PROJ002"
sanctionedCost: 250.00
cumulativeExpenditureToDate: 250.00
currentStatus: "COMPLETED"
projectCategoryCode: "CAT001"
```

**Project 3**:
```
missionProjectCode: "PROJ003"
sanctionedCost: 50.00
cumulativeExpenditureToDate: 15.30
currentStatus: "AT_RISK"
projectCategoryCode: "CAT002"
```

### Resulting Stats
```
Total: 3
OnTrack: 1 (Project 1)
AtRisk: 1 (Project 3)
Delayed: 0
Completed: 1 (Project 2)
TotalBudget: 400.00 Cr (100 + 250 + 50)
```

### Chart Data

**Bar Chart**:
```
On Track: 1
At Risk: 1
Delayed: 0
Completed: 1
```

**Line Chart (Top 5)**:
```
[
  { name: "PROJ002...", sanctioned: 250, expended: 250 },
  { name: "PROJ001...", sanctioned: 100, expended: 75.5 },
  { name: "PROJ003...", sanctioned: 50, expended: 15.3 }
]
```

**Donut Chart**:
```
[
  { name: "Category 1", value: 2 },  // CAT001: 2 projects
  { name: "Category 2", value: 1 }   // CAT002: 1 project
]
```

**Scatter Chart**:
```
[
  { sanctioned: 100, expended: 75.5 },
  { sanctioned: 250, expended: 250 },
  { sanctioned: 50, expended: 15.3 }
]
```

---

## Validation Rules

1. ✅ Sanctioned cost must be positive number
2. ✅ Expended amount must be ≤ sanctioned cost
3. ✅ Status must be one of 4 valid values
4. ✅ Category code must exist in category master
5. ✅ Project count must be ≥ 0

---

**Last Updated**: Current Implementation  
**Data Sources**: All Real from Backend  
**Format**: Original Crores (Cr) - No Conversion  
**Charts**: 4 React Charts (Recharts) - 100% Real Data
