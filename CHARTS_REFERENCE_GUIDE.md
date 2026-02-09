# Chairman Dashboard - Chart Implementation Reference

## All Charts Summary

### 1. Bar Chart - Project Status Distribution
**Location**: Top-left chart  
**Type**: React Bar Chart (Recharts)  
**Title**: "Project Status Distribution"  

**Data Source**:
```tsx
data={[
  { status: 'On Track', count: stats.onTrack },
  { status: 'At Risk', count: stats.atRisk },
  { status: 'Delayed', count: stats.delayed },
  { status: 'Completed', count: stats.completed },
]}
```

**Calculation**:
- `stats.onTrack`: Count of projects where `currentStatus === 'ON_TRACK'`
- `stats.atRisk`: Count of projects where `currentStatus === 'AT_RISK'`
- `stats.delayed`: Count of projects where `currentStatus === 'DELAYED'`
- `stats.completed`: Count of projects where `currentStatus === 'COMPLETED'`

**Real-Time**: ✅ Yes - Updated whenever `allProjects` changes

---

### 2. Line Chart - Expenditure Trend
**Location**: Top-right chart  
**Type**: React Line Chart (Recharts)  
**Title**: "Expenditure Trend (Top 5 Projects)"  

**Data Source**:
```tsx
data={allProjects
  .sort((a, b) => {
    const aCost = typeof a.sanctionedCost === 'number' ? a.sanctionedCost : parseFloat(String(a.sanctionedCost || 0));
    const bCost = typeof b.sanctionedCost === 'number' ? b.sanctionedCost : parseFloat(String(b.sanctionedCost || 0));
    return bCost - aCost;
  })
  .slice(0, 5)
  .map((p) => ({
    name: p.missionProjectShortName?.substring(0, 10) || 'Project',
    sanctioned: typeof p.sanctionedCost === 'number' ? p.sanctionedCost : parseFloat(String(p.sanctionedCost || 0)),
    expended: typeof p.cumulativeExpenditureToDate === 'number' ? p.cumulativeExpenditureToDate : parseFloat(String(p.cumulativeExpenditureToDate || 0)),
  }))
}
```

**Data Points**:
- **name**: Project short name (first 10 chars) - used as X-axis label
- **sanctioned**: Sanctioned Cost (Cr) - Purple line
- **expended**: Cumulative Expenditure to Date (Cr) - Green line

**Filtering**: Top 5 projects by sanctioned cost (descending)

**Real-Time**: ✅ Yes - Recalculated whenever `allProjects` changes

---

### 3. Donut Chart - Categories Distribution
**Location**: Bottom-left chart  
**Type**: React Pie/Donut Chart (Recharts)  
**Title**: "Categories Distribution"  

**Data Source**:
```tsx
data={categoryStats.map((cat, idx) => ({
  name: categories.get(cat.projectCategoryCode)?.fullName || cat.projectCategoryCode,
  value: cat.projectCount || 0,
  fill: ['#10b981', '#f97316', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][idx % 8]
}))}
```

**Data Points**:
- **name**: Category full name (from `categories` Map)
- **value**: Project count for this category (from `categoryStats`)
- **fill**: Color (8-color rotation)

**Source Services**:
1. `ProjectCategoryService.getAllProjectCategories()` - Gets all category info including full names
2. `categoryStatsService.getCategoryStats()` - Gets project counts per category

**Chart Properties**:
- `innerRadius={60}` - Creates donut effect
- `outerRadius={100}` - Sets outer size
- `paddingAngle={2}` - Space between segments

**Real-Time**: ✅ Yes - Fetched on component mount, updates with data

---

### 4. Scatter Chart - Project Performance
**Location**: Bottom-right chart  
**Type**: React Scatter Chart (Recharts)  
**Title**: "Project Performance"  

**Data Source**:
```tsx
data={allProjects.map((p) => ({
  sanctioned: typeof p.sanctionedCost === 'number' ? p.sanctionedCost : parseFloat(String(p.sanctionedCost || 0)),
  expended: typeof p.cumulativeExpenditureToDate === 'number' ? p.cumulativeExpenditureToDate : parseFloat(String(p.cumulativeExpenditureToDate || 0)),
}))}
```

**Data Points** (each dot represents one project):
- **X-axis** (sanctioned): Sanctioned Cost in Crores
- **Y-axis** (expended): Cumulative Expenditure in Crores

**Visual Analysis**:
- Points below diagonal = Under budget
- Points on diagonal = On budget
- Points above diagonal = Over budget
- Cluster patterns = Budget utilization trends

**Real-Time**: ✅ Yes - Includes all projects from `allProjects`

---

## KPI Cards (Non-Chart)

### Budget Card - Top Right
**Display**: `{stats.totalBudget.toFixed(2)} Cr`

**Calculation**:
```tsx
totalBudget: allProjects.reduce((sum, p) => {
  const sanctionedCost = typeof p.sanctionedCost === 'number' 
    ? p.sanctionedCost 
    : parseFloat(String(p.sanctionedCost || 0));
  return sum + (isFinite(sanctionedCost) ? sanctionedCost : 0);
}, 0)
```

**Key Points**:
- Sum of ALL project `sanctionedCost` values
- Already in Crores (no conversion needed)
- BigDecimal safe conversion
- Displayed with "Cr" suffix

---

## Color Assignments

| Chart | Color | Usage |
|-------|-------|-------|
| Bar | Blue (#3b82f6) | Project count bars |
| Line (Sanctioned) | Purple (#8b5cf6) | Sanctioned cost line |
| Line (Expended) | Green (#10b981) | Expended amount line |
| Donut | 8-color rotation | Each category segment |
| Scatter | Purple (#8b5cf6) | Project points |

---

## Data Flow Diagram

```
Backend Services
    ↓
projectDetailService.getAllProjectDetails()
    ↓
allProjects (array of ProjectDetailResponse)
    ├─→ Bar Chart (count by status)
    ├─→ Line Chart (top 5 by cost)
    ├─→ Scatter Chart (all projects)
    └─→ KPI Stats (aggregations)

categoryStatsService.getCategoryStats()
    ↓
categoryStats (array of CategoryStats)
    ↓
ProjectCategoryService.getAllProjectCategories()
    ↓
categories (Map of category info)
    ↓
Donut Chart (categories + counts + names)
```

---

## Responsive Behavior

All charts use `<ResponsiveContainer width="100%" height={300}>` which means:
- **Width**: Fills parent container (100%)
- **Height**: Fixed 300px per chart
- **Grid**: 2 columns on desktop → 1 column on mobile
- **Charts Stack**: Vertically on mobile

---

## Error Handling

1. **No Categories**: Donut chart renders empty if `categoryStats` is empty
2. **No Projects**: Line chart shows empty if `allProjects` is empty
3. **Invalid Numbers**: BigDecimal conversion handles non-numeric values
4. **Null Safety**: All optional fields checked with `||` operators

---

## Performance Notes

1. **Line Chart**: Limited to top 5 projects (prevents performance degradation)
2. **Scatter Chart**: Includes all projects (manageable size for visualization)
3. **Donut Chart**: Dynamically sized based on category count
4. **Bar Chart**: Fixed 4 bars (status types), minimal overhead

---

## Testing Checklist

- [ ] Verify all projects are included in scatter chart
- [ ] Verify top 5 projects sorted correctly by sanctioned cost
- [ ] Verify donut shows all categories from backend
- [ ] Verify budget shows "Cr" suffix
- [ ] Verify bar chart counts match KPI cards
- [ ] Verify charts responsive on mobile/tablet
- [ ] Verify tooltips show correct values
- [ ] Verify loading state while fetching data
- [ ] Verify error state with retry button
- [ ] Verify BigDecimal conversion works correctly

