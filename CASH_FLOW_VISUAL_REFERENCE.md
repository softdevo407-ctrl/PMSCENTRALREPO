# Cash Flow Chart - Visual Reference & Usage Guide

## Chart Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ 💰 CASH FLOW ANALYSIS - PLANNED VS ACTUALS                      │
│ [Select Project Dropdown: 2025P007]                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ₹ Cr │     ●                                                    │
│       │    / \     ●                    ●                       │
│  1500 │   /   \   / \                  / \                      │
│       │  /     \ /   \        ●       /   \                     │
│  1200 │ /       ●     \      / \     /     \                    │
│       │/               \    /   \   /       \                   │
│   900 │                 \  /     \ /         ●                  │
│       │                  \/       ●           \                 │
│   600 │                          / \           \  ●             │
│       │                         /   \           \/              │
│   300 │   ●                    /     \         /  \             │
│       │  / \                  /       ●       /    ●            │
│     0 │ /   ●________________/               /                  │
│       ├──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴─────────────┤
│      2017 2018 2019 2020 2021 2022 2023 2024      Year        │
│                                                                  │
│  ──● Blue Line: Planned Amount                                 │
│  ──● Green Line: Actuals Amount                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Features & Functionality

### 1. Project Selection
```
Select Project: [Dropdown ▼]
  - -- All Projects --
  - 2025P007 - Gaganyaan Human Space Flight Programme
  - 2025P008 - Chandrayaan-3 Lunar Mission
  - (Other available projects)
```

When selected:
- Chart filters to show only that project's data
- Years from database displayed on X-axis
- Planned vs Actuals comparison shown

### 2. Interactive Tooltip (Hover)
```
┌─────────────────────────────────────┐
│ 📅 Year: 2019                       │
│                                     │
│ 📊 Planned: ₹1,702.10 Cr           │
│ ✓ Actuals: ₹813.30 Cr              │
│ 📈 Variance: ₹888.80 Cr (Underspend)│
└─────────────────────────────────────┘
```

### 3. Data Format from Database

**Table**: `projectactuals`

| Column | Type | Example |
|--------|------|---------|
| missionprojectcode | VARCHAR(50) | 2025P007 |
| year | INTEGER | 2019 |
| planned | NUMERIC(18,2) | 1702.10 |
| actuals | NUMERIC(18,2) | 813.30 |
| created_at | TIMESTAMP | 2026-01-23 11:57:28 |
| updated_at | TIMESTAMP | 2026-01-23 11:57:28 |

### 4. Chart Behavior

**Single Project Mode** (dropdown != empty):
```typescript
Data filtered for: missionprojectcode = selectedProjectForCashFlow
Sorted by: year (ascending)
Display: All years with data for that project
```

**All Projects Mode** (dropdown = empty):
```typescript
Data includes: All projects
Sorted by: year (ascending)
Display: Consolidated yearly data across all projects
```

### 5. Variance Calculation

```
Variance = Planned - Actuals

If Variance >= 0: 
  → Underspend (Red flag) - Spending less than planned
If Variance < 0:
  → Overspend (Blue flag) - Spending more than planned
```

## Component Integration

```
ChairmanDashboard
├── KPI Cards (Total, On Track, Delayed, Budget)
├── CategoryStatsCards
└── NEW! Cash Flow Chart Section
    ├── Project Selector
    ├── LineChart
    │   ├── Line 1: Planned Amount (Blue, #3b82f6)
    │   ├── Line 2: Actuals Amount (Green, #16a34a)
    │   ├── Tooltip
    │   └── Legend
    └── Grid Background
```

## Styling Reference

**Container**:
- Background: Green gradient (`from-green-100/80 to-slate-100/80`)
- Border: Green (`border-2 border-green-300/60`)
- Padding: Responsive (`p-2 md:p-3`)

**Lines**:
- Planned: Blue (#3b82f6), 3px width
- Actuals: Green (#16a34a), 3px width
- Dots: 5px radius, interactive on hover (7px)

**Tooltip**:
- Background: Green-100 (`bg-green-100/95`)
- Border: Green-700 (`border border-green-700`)
- Text: Bold font (font-semibold/font-black)

**Axes**:
- Font: Bold, fontSize 13-14px
- Color: Slate-700 (#4b5563)
- X-Axis label: "Year"
- Y-Axis label: "Amount (₹ Cr)"

## API Service Methods

### Get All Project Actuals
```typescript
const actuals = await projectActualsService.getAllProjectActuals();
// Returns: ProjectActuals[]
```

### Get Specific Project Actuals
```typescript
const projectActuals = await projectActualsService.getProjectActuals('2025P007');
// Returns: ProjectActuals[]
```

### Save Project Actuals
```typescript
const saved = await projectActualsService.saveProjectActuals(
  missionProjectCode: '2025P007',
  year: 2025,
  planned: 1500.00,
  actuals: 1200.50
);
// Returns: ProjectActuals (with timestamps)
```

### Format Data for Chart
```typescript
const chartData = projectActualsService.formatForCashFlow(actuals);
// Automatically:
// - Sorts by year
// - Converts string numbers to parseFloat
// - Returns CashFlowData[]
```

## Performance Notes

✓ **Data Loading**: Fetched once on component mount via `useEffect`
✓ **Filtering**: Client-side filtering on dropdown change (no API call)
✓ **Rendering**: Recharts `ResponsiveContainer` handles responsive design
✓ **Memory**: Data cached in component state for fast filtering

## Browser Compatibility

- ✓ Chrome/Edge (Latest)
- ✓ Firefox (Latest)
- ✓ Safari (Latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. If no data in database for a project, tooltip shows 0
2. Variance calculation assumes complete planned vs actuals data
3. All projects view may become crowded with many projects
4. Past years may have more complete data than future years

## Future Enhancements

- [ ] Year-by-year comparison view
- [ ] Download chart as PNG/PDF
- [ ] Budget utilization percentage overlay
- [ ] Milestone tracking on chart
- [ ] Cumulative vs Annual view toggle
- [ ] Forecasting projection lines
