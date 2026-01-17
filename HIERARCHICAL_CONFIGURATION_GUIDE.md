# Project Configuration Hierarchy - Implementation Guide

## Overview

`ProjectConfigurationHierarchy` is a hierarchical, step-by-step configuration interface for building Phase → Milestone → Activity structures. Users build configurations in "batches" where each batch consists of one phase with multiple milestones and multiple activities per milestone.

## Component Architecture

### File Location
```
/src/components/ProjectConfigurationHierarchy.tsx
```

### Key Features

1. **Hierarchical Structure**
   - Phase → Milestones → Activities (tree-like organization)
   - Expandable/collapsible sections for better UX
   - Visual hierarchy with color coding (violet for phases, blue for milestones, emerald for activities)

2. **Step-by-Step Building**
   - Add Phase first (top-level row)
   - Add Milestones under each phase (with date ranges)
   - Add Activities under each milestone (with date ranges)
   - Support unlimited milestones per phase
   - Support unlimited activities per milestone
   - Can add multiple phase "batches"

3. **Auto-Calculation**
   - Automatically calculates number of months from start and end dates
   - Formula: `months = (end.year - start.year) * 12 + (end.month - start.month)`
   - Real-time calculation as dates change

4. **Searchable Dropdowns**
   - Phase selection with real-time search
   - Milestone selection with real-time search
   - Activity selection with real-time search
   - Filtered suggestions as user types

5. **Full CRUD Operations**
   - Add: Phases, Milestones, Activities
   - Delete: Any level (phase, milestone, activity)
   - Inline date editing
   - Auto-expand on addition

6. **Beautiful UI Design**
   - Color-coded sections (violet, blue, emerald)
   - Responsive grid layout
   - Gradient header with project name
   - Icon-based actions (Plus, Delete, Collapse/Expand)
   - Footer showing statistics (phases, milestones, activities count)
   - Error alerts for validation

## Data Model

### PhaseRow
```typescript
{
  id: string;                        // Unique identifier
  phaseCode: string;                 // Backend phase code
  phaseName: string;                 // Display name
  milestones: MilestoneRow[];        // Associated milestones
  isExpanded: boolean;               // Expansion state
}
```

### MilestoneRow
```typescript
{
  id: string;                        // Unique identifier
  milestoneCode: string;             // Backend milestone code
  milestoneName: string;             // Display name
  startDate: string;                 // YYYY-MM-DD format
  endDate: string;                   // YYYY-MM-DD format
  months: number;                    // Auto-calculated
  activities: ActivityRow[];         // Associated activities
  isExpanded: boolean;               // Expansion state
}
```

### ActivityRow
```typescript
{
  id: string;                        // Unique identifier
  activityCode: string;              // Backend activity code
  activityName: string;              // Display name
  startDate: string;                 // YYYY-MM-DD format
  endDate: string;                   // YYYY-MM-DD format
  months: number;                    // Auto-calculated
}
```

## UI Layout

### Phase Section
- **Header Row**: Collapse/Expand button → Phase Name → "X milestones" → Delete button
- **Content**: Add Milestone form + Existing milestone rows

### Milestone Section
- **Header Row**: Collapse/Expand button → Milestone Name → Date range → Months → Delete button
- **Content**: Add Activity form + Existing activity rows

### Activity Section
- **Display**: Activity Name → Date range → Months → Delete button

## Usage Example

```typescript
import { ProjectConfigurationHierarchy } from '../components/ProjectConfigurationHierarchy';

export const MyProjectsPage = () => {
  return (
    <ProjectConfigurationHierarchy 
      projectName="My Project Name" 
    />
  );
};
```

## Workflow

1. **User selects Phase** → Creates new phase row
2. **User adds Milestones** → Shows blue section under phase
   - Enter milestone dropdown
   - Select start date
   - Select end date
   - Months auto-calculate
   - Click "Add" → Milestone row appears
3. **User adds Activities** → Shows emerald section under milestone
   - Enter activity dropdown
   - Select start date
   - Select end date
   - Months auto-calculate
   - Click "Add" → Activity row appears
4. **User adds another Milestone** → Same as step 2
5. **User adds another Phase** → Repeats the entire cycle

## API Integration

### Data Sources

**Phases**: `http://localhost:7080/api/project-phases-generic`
- Returns array of phases with code and full name
- Generic API (no project-specific filtering)

**Milestones**: `ProjectMilestoneService.getAllMilestones()`
- Returns array of ProjectMilestone objects
- Uses Bearer token authentication

**Activities**: `ProjectActivityService.getAllProjectActivities()`
- Returns array of ProjectActivity objects
- Uses Bearer token authentication

### Authentication
- Reads Bearer token from localStorage
- Passes token in Authorization header

## Validation Rules

1. Phase must be selected before adding
2. Milestone must be selected before adding
3. Activity must be selected before adding
4. Start date cannot be after end date
5. Both dates must be provided for milestone and activity

## Color Scheme

| Element | Background | Border | Text |
|---------|-----------|--------|------|
| Phase Header | bg-violet-50 | border-violet-200 | text-violet-900 |
| Phase Add Form | bg-blue-50 | border-blue-200 | text-blue-900 |
| Milestone Header | bg-blue-50 | border-blue-200 | text-blue-900 |
| Activity Form | bg-emerald-50 | border-emerald-200 | text-emerald-900 |
| Activity Display | bg-emerald-50 | border-emerald-200 | text-emerald-900 |

## State Management

The component uses React hooks for state:
- `phaseRows`: Array of phase rows with nested milestones and activities
- `phases`, `milestones`, `activities`: Fetched reference data
- `loading`, `error`: Loading and error states
- Various selection states for dropdowns
- Search states for filtering dropdowns

## File Changes

### Modified Files

**[MyProjectsPage.tsx](MyProjectsPage.tsx)**
- Changed import from `ProjectConfigurationRowWise` to `ProjectConfigurationHierarchy`
- Updated component usage from `<ProjectConfigurationRowWise>` to `<ProjectConfigurationHierarchy>`
- No changes to component props or integration logic

### Deleted Files

**ProjectConfigurationRowWise.tsx** (replaced by new hierarchical component)

## Statistics Footer

The footer displays real-time counts:
- Number of phases
- Number of milestones (across all phases)
- Number of activities (across all milestones)

## Browser Compatibility

- React 18+
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support for arrow functions and destructuring

## Known Limitations

- Currently displays in memory (not persisted to backend)
- No edit capability for milestone/activity details after creation (delete and recreate)
- All selections based on dropdown data fetched at component mount
- No keyboard navigation shortcuts

## Future Enhancements

1. Add inline edit capability for dates and selections
2. Implement backend persistence
3. Add drag-drop reordering
4. Add batch export/import
5. Add validation against project timeline
6. Add activity dependency management
7. Add resource allocation section
8. Add budget allocation per activity
