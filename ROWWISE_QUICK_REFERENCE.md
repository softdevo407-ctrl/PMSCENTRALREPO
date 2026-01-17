# Row-wise Configuration - Quick Reference

## What Changed?

### ✅ New Features
1. **CoreUI-style Searchable Select** - Shows all values initially, no need to type first
2. **Row-wise Display** - All details visible in one table row (no collapse)
3. **Sortable Rows** - Users can set custom sort order for each row
4. **Auto-Sorting** - Rows automatically sort by sort order value

### ❌ Removed
- Expandable/collapsible milestones
- Complex nested hierarchy
- Modal-based data entry

## How to Use

### 1. Add New Configuration
1. Fill in the form at the top:
   - **Phase**: Click dropdown → Select phase (search to filter)
   - **Milestone**: Click dropdown → Select milestone
   - **Activity**: Click dropdown → Select activity
   - **Start Date**: Pick from date picker
   - **End Date**: Pick from date picker
   - **Sort Order**: Enter custom sort order (0, 1, 2, etc.)
2. Click **Add** button
3. Row appears in table, sorted by sort order

### 2. View All Data
- All rows displayed in one table
- All columns visible:
  - Sort Order (editable)
  - Phase Name
  - Milestone Name
  - Activity Name
  - Start Date
  - End Date
  - Months (auto-calculated)
  - Delete button

### 3. Reorder Rows
- Edit the **Sort Order** value in any row
- Rows automatically re-sort
- No drag-drop needed

### 4. Delete Row
- Click trash icon on the right
- Row removed from table

## Component Files

```
src/components/
├── ProjectConfigurationMatrix.tsx  ← Main component (updated)
├── SearchableSelect.tsx             ← New reusable select
└── pages/
    └── MyProjectsPage.tsx           ← Uses ProjectConfigurationMatrix
```

## Key Features

| Feature | Behavior |
|---------|----------|
| **Dropdown** | Click to open, shows all values immediately |
| **Search** | Type in search box to filter results |
| **Selection** | Click any option or clear with X button |
| **Sorting** | Edit sort order value to reorder rows |
| **Months** | Auto-calculated from start/end dates |
| **Validation** | Error if dates invalid or fields missing |
| **Delete** | Click trash icon to remove row |

## Data Flow

```
User Input Form
    ↓
SelectPhase (CoreUI Select)
    ↓
SelectMilestone (CoreUI Select)
    ↓
SelectActivity (CoreUI Select)
    ↓
EnterDateRange (Start + End)
    ↓
SetSortOrder (Number input)
    ↓
ClickAdd
    ↓
ValidateData
    ↓
CalculateMonths
    ↓
AddToConfigurationRows
    ↓
SortRowsByOrder
    ↓
DisplayInTable
```

## Example Workflow

```
1. Form appears with empty dropdowns
2. User clicks "Phase" → sees 5 options
   Phase 1, Phase 2, Phase 3, Phase 4, Phase 5
3. User clicks "Phase 2"
4. User clicks "Milestone" → sees 8 options
   MS A, MS B, MS C, MS D, MS E, MS F, MS G, MS H
5. User types "A" → filters to "MS A"
6. User clicks "MS A"
7. User clicks "Activity" → sees all activities
8. User selects activity
9. User picks Start Date: 01/01/2024
10. User picks End Date: 03/31/2024
11. Months auto-show: 3
12. User enters Sort Order: 1
13. User clicks "Add"
14. New row appears in table:
    | 1 | Phase 2 | MS A | Activity X | 01/01/24 | 03/31/24 | 3 | 🗑️ |
15. User can add more rows
16. All rows visible at once
17. User can change sort order of any row
18. Table re-sorts automatically
```

## Dropdown Behavior

### Phase Dropdown
```
┌─────────────────────┐
│ ▼ Select Phase ✕    │  ← Click to open
├─────────────────────┤
│ 🔍 Search...        │  ← Search box appears
│ ─────────────────── │
│ Phase 1             │  ← All options visible
│ Phase 2             │
│ Phase 3             │
│ Phase 4             │
│ Phase 5             │
└─────────────────────┘
```

User can:
- Click any option to select
- Type to filter list
- Click X to clear selection
- Click outside to close

## Table Display

```
┌─────┬──────────┬──────────┬──────────┬──────────┬──────────┬────────┬─────┐
│Sort │ Phase    │Milestone │ Activity │Start Date│ End Date │Months  │ Del │
├─────┼──────────┼──────────┼──────────┼──────────┼──────────┼────────┼─────┤
│ 1   │Phase 2   │MS A      │Activity X│ 01/01/24 │ 03/31/24 │ 3 mo   │ 🗑️  │
│ 2   │Phase 1   │MS D      │Activity Y│ 02/15/24 │ 04/30/24 │ 2 mo   │ 🗑️  │
│ 3   │Phase 3   │MS F      │Activity Z│ 05/01/24 │ 08/31/24 │ 4 mo   │ 🗑️  │
└─────┴──────────┴──────────┴──────────┴──────────┴──────────┴────────┴─────┘

Users can:
✏️ Edit Sort Order (click and change number)
🗑️ Delete Row (click trash icon)
✅ View All Data (no collapse needed)
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Enter | Open dropdown (when focused on button) |
| Escape | Close dropdown |
| Arrow Down | Next option in dropdown |
| Arrow Up | Previous option in dropdown |
| Enter | Select highlighted option |
| Type | Filter options in dropdown |

## Responsive Behavior

### Desktop (1024px+)
- 8 columns in form (1 per field)
- Full-width table display
- All columns visible

### Tablet (768px - 1024px)
- 2 columns in form
- Horizontal scroll on table
- Medium-sized inputs

### Mobile (< 768px)
- 1 column in form (stacked)
- Heavy horizontal scroll on table
- Compact buttons

## Error Handling

### Missing Fields
```
⚠️ Please fill all required fields
```
Triggers if:
- Phase not selected
- Milestone not selected
- Activity not selected
- Start date not set
- End date not set

### Invalid Dates
```
⚠️ Start date cannot be after end date
```
Triggers if: `startDate > endDate`

### Success
- Row added to table
- Form cleared
- No error shown
- Rows re-sorted

## Data Stored

Each configuration row contains:
```javascript
{
  id: "1704067200000",           // Unique ID
  sortOrder: 1,                   // User-defined order
  phaseCode: "P001",              // Backend phase code
  phaseName: "Phase 1",           // Display name
  milestoneCode: "M001",          // Backend milestone code
  milestoneName: "Design",        // Display name
  activityCode: "A001",           // Backend activity code
  activityName: "Wireframes",     // Display name
  startDate: "2024-01-01",        // YYYY-MM-DD format
  endDate: "2024-01-31",          // YYYY-MM-DD format
  months: 1                       // Auto-calculated
}
```

## Backend Integration

### API Endpoints Called

1. **GET** `/api/project-phases-generic`
   - Returns all phases for dropdown
   - Called on component mount

2. **GET** `ProjectMilestoneService.getAllMilestones()`
   - Returns all milestones for dropdown
   - Called on component mount

3. **GET** `ProjectActivityService.getAllProjectActivities()`
   - Returns all activities for dropdown
   - Called on component mount

### No Persistence
Currently, data is stored in React state only:
- ✅ Add rows to display
- ✅ Delete rows from display
- ✅ Edit sort order
- ❌ Save to database (not implemented)
- ❌ Load existing configurations (not implemented)

To enable persistence, you would need to:
1. Create backend endpoint to save configuration
2. Create backend endpoint to load existing configuration
3. Call save on "Save" button click
4. Call load on component mount

## Testing Checklist

- [ ] All dropdowns open and show options
- [ ] Search filtering works in all dropdowns
- [ ] Rows display in correct sorted order
- [ ] Sort order editing re-sorts table
- [ ] Months calculate correctly
- [ ] Date validation works (start ≤ end)
- [ ] Error messages appear for missing fields
- [ ] Delete button removes correct row
- [ ] Multiple rows can be added
- [ ] Form clears after adding row
- [ ] Responsive layout on mobile/tablet
- [ ] Keyboard navigation works
- [ ] No console errors

