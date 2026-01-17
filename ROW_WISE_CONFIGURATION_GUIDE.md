# Row-Wise Configuration Entry - Implementation Guide

## Overview
Created a new row-wise data entry component `ProjectConfigurationRowWise` that displays Phase → Milestone → Activity configuration in a clean tabular format with inline editing, sorting order, and full CRUD operations.

## Layout

```
┌──────────────┬─────────────────────────────────────────┬─────────────────────┬───────────┬─────────────┐
│ Phase        │ Milestone (Months)                      │ Activity (Dates)    │ Sort      │ Actions     │
│              │                                         │                     │ Order     │             │
├──────────────┼─────────────────────────────────────────┼─────────────────────┼───────────┼─────────────┤
│ Phase 1      │ Milestone A                             │ Activity 1          │ 1         │ [Edit][Del] │
│              │ 6 months | 01/01/2026 → 30/06/2026      │ 15/01/2026 - 30/01/ │           │             │
├──────────────┼─────────────────────────────────────────┼─────────────────────┼───────────┼─────────────┤
│ Phase 1      │ Milestone B                             │ Activity 2          │ 2         │ [Edit][Del] │
│              │ 4 months | 01/07/2026 → 31/10/2026      │ 01/07/2026 - 15/07/ │           │             │
├──────────────┼─────────────────────────────────────────┼─────────────────────┼───────────┼─────────────┤
│ Phase 2      │ Milestone C                             │ Activity 3          │ 3         │ [Edit][Del] │
│              │ 8 months | 01/11/2026 → 30/06/2027      │ 01/11/2026 - 30/11/ │           │             │
├──────────────┼─────────────────────────────────────────┼─────────────────────┼───────────┼─────────────┤
│ [Dropdown]   │ [Dropdown]                              │ [Dropdown]          │ [#]       │ [+ Add Row] │
│ Select Phase │ Select Milestone                        │ Select Activity     │ Sort Ord  │             │
└──────────────┴─────────────────────────────────────────┴─────────────────────┴───────────┴─────────────┘
```

## Component Structure

### File: `/src/components/ProjectConfigurationRowWise.tsx`

**Main Component**: `ProjectConfigurationRowWise`
- Props: `projectName: string`
- Displays configuration in row-wise tabular format

### Interfaces

```typescript
interface RowData {
  id: string;                    // Unique row identifier
  phaseCode: string;             // Selected phase code
  phaseName: string;             // Phase name
  milestoneCode: string;         // Selected milestone code
  milestoneName: string;         // Milestone name
  milestoneMonths: number;       // Auto-calculated months between dates
  milestoneStartDate: string;    // Milestone start date
  milestoneEndDate: string;      // Milestone end date
  activityCode: string;          // Selected activity code
  activityName: string;          // Activity name
  activityStartDate: string;     // Activity start date
  activityEndDate: string;       // Activity end date
  sortOrder: number;             // User-defined sort order (1, 2, 3, etc.)
  isEditing?: boolean;           // Edit mode toggle
}
```

## Features

### 1. **Row-Wise Display**
- Each row combines Phase + Milestone + Activity data
- All details visible at a glance
- Clean, organized tabular layout

### 2. **Sorting Order**
- Editable numeric sort order field (1, 2, 3, 4, 5, 6, etc.)
- User can set any order they want
- Rows displayed in sort order sequence
- Edit the sort order to reorder rows

### 3. **Milestone Details**
- **Months**: Auto-calculated from start and end dates
- **Start Date**: From milestone start date
- **End Date**: From milestone end date
- All displayed in milestone column

### 4. **Activity Details**
- **Start Date**: From activity start date
- **End Date**: From activity end date
- Displayed in activity column

### 5. **Inline Editing**
- Click "Edit" button to enter edit mode
- All fields become editable (except code)
- Phase, Milestone, Activity are dropdowns
- Sort order is numeric input
- Click "Save" to commit changes or "Cancel" to discard

### 6. **Add New Row**
- Bottom row with green background for adding new entries
- Dropdown to select Phase, Milestone, Activity
- Numeric input for sort order
- Click "Add" button to add row to table
- Form resets after adding

### 7. **Delete Row**
- Click "Delete" button to remove row
- Row immediately removed from table
- No confirmation (can add back if needed)

### 8. **Data Loading**
- Fetches phases from `/api/project-phases-generic`
- Fetches milestones from ProjectMilestoneService
- Fetches activities from ProjectActivityService
- Auto-populates dropdowns with available options

## State Management

```typescript
const [phases, setPhases] = useState<PhaseData[]>([]);        // All phases
const [rows, setRows] = useState<RowData[]>([]);              // Table rows
const [milestones, setMilestones] = useState<ProjectMilestone[]>([]); // All milestones
const [activities, setActivities] = useState<ProjectActivity[]>([]); // All activities
const [loading, setLoading] = useState(false);                 // Loading state
const [error, setError] = useState<string | null>(null);       // Error messages
const [editingRowId, setEditingRowId] = useState<string | null>(null); // Current edit row
const [editingRow, setEditingRow] = useState<RowData | null>(null);    // Edit data
const [newRow, setNewRow] = useState<RowData>({...});          // New row form
```

## Core Methods

### `fetchAllData()`
- Fetches phases, milestones, and activities from APIs
- Builds combined rows
- Handles loading and error states

### `buildRows(phases, milestones, activities)`
- Combines all phases, milestones, and activities
- Creates one row per combination
- Auto-assigns sort order
- Sorts by sortOrder ascending

### `calculateMonths(fromDate, toDate)`
- Calculates number of months between two dates
- Returns 0 if toDate is null

### `handleAddRow()`
- Validates form (phase, milestone, activity, dates)
- Adds row to table
- Resets form

### `handleEditRow(row)`
- Sets row in edit mode
- Copies row data to editing state

### `handleSaveRow(row)`
- Updates row in table
- Exits edit mode
- Clears edit state

### `handleDeleteRow(rowId)`
- Removes row from table
- Updates state

### `handleCancelEdit()`
- Exits edit mode without saving
- Clears editing state

## Sorting Example

**User enters sort orders**:
```
Row 1: Sort Order = 3
Row 2: Sort Order = 1  
Row 3: Sort Order = 4
Row 4: Sort Order = 2
```

**Display order** (sorted by sortOrder):
```
1. Row 2 (order 1)
2. Row 4 (order 2)
3. Row 1 (order 3)
4. Row 3 (order 4)
```

User can edit sort orders anytime to change display sequence.

## Colors & Styling

- **Header**: Indigo gradient (from-indigo-600 to-indigo-800)
- **Table Header**: Indigo background (bg-indigo-50)
- **Add Row**: Emerald background (bg-emerald-50/30)
- **Edit Mode**: Indigo highlight (bg-indigo-50)
- **Edit Button**: Blue (bg-blue-500)
- **Save Button**: Green (bg-green-500)
- **Delete Button**: Red (bg-red-500)
- **Cancel Button**: Gray (bg-gray-500)
- **Add Button**: Emerald (bg-emerald-600)

## Integration

**Updated**: `/src/components/pages/MyProjectsPage.tsx`
- Import changed to `ProjectConfigurationRowWise`
- Configure button displays inline row-wise configuration
- "Close Configuration" button to hide

**Usage**:
```tsx
import { ProjectConfigurationRowWise } from '../ProjectConfigurationRowWise';

// In JSX:
{isConfigurationPanelOpen && selectedProjectData && (
  <div className="mt-8">
    <ProjectConfigurationRowWise
      projectName={selectedProjectData.missionProjectFullName}
    />
  </div>
)}
```

## Features Completed

✅ Row-wise data entry layout (Phase | Milestone | Activity columns)
✅ Milestone details: months, start date, end date
✅ Activity details: start date, end date
✅ Sorting order field (editable numeric input)
✅ Edit functionality - inline editing of all fields
✅ Delete functionality - remove rows
✅ Add new row - with dropdowns and sort order
✅ Auto-calculate milestone months
✅ API integration - fetch phases, milestones, activities
✅ Dropdown selection for Phase, Milestone, Activity
✅ Error handling with alert display
✅ Loading state
✅ Beautiful UI with color coding
✅ Footer showing counts

## Browser Compatibility
- Chrome, Firefox, Safari, Edge
- Modern browsers with ES6+
- Mobile responsive (horizontal scroll)

## Performance
- Single data fetch on component load
- Efficient filtering and mapping
- Minimal re-renders with controlled state
