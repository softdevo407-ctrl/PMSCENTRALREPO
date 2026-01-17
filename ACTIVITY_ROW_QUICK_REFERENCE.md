# Quick Reference: Activity Row Visibility Feature

## What Changed?

### Before
- ❌ Add activity row always visible (cluttered interface)
- ❌ Dates shown vertically (hard to read together)
- ❌ No constraint on milestone dates

### After  
- ✅ Add row hidden by default, shown with "+" button
- ✅ Dates shown side-by-side with highlighting
- ✅ Milestone dates constrained to project date range

---

## User Workflow

```
1. User sees milestone with existing activities
2. User clicks "+" button
3. Add activity row appears with form fields
4. User fills in: Activity name, Start date, End date, Sort order
5. User clicks "Save"
6. Activity is added and row HIDES automatically
7. To add more → Click "+" again
```

## For Developers

### State Variable
```typescript
const [visibleAddRowMilestone, setVisibleAddRowMilestone] = useState<Set<string>>(new Set());
```

### Toggle Logic
```typescript
// Show add row
setVisibleAddRowMilestone(prev => {
  const newSet = new Set(prev);
  newSet.add(milestone.id);
  return newSet;
});

// Hide add row (after save)
setVisibleAddRowMilestone(prev => {
  const newSet = new Set(prev);
  newSet.delete(milestone.id);
  return newSet;
});
```

### Conditional Rendering
```typescript
// Show + button when add row is hidden
{!visibleAddRowMilestone.has(milestone.id) && <tr>...</tr>}

// Show add row only when visible
{visibleAddRowMilestone.has(milestone.id) && <tr>...</tr>}
```

### Date Constraints
```typescript
// In MyProjectsPage.tsx
<input
  type="date"
  min={selectedProjectData?.dateOffs}          // Sanctioned
  max={selectedProjectData?.originalSchedule}  // Schedule
/>

// Pass to ProjectMatrix
projectStartDate={selectedProjectData?.dateOffs}
projectEndDate={selectedProjectData?.originalSchedule}
```

---

## UI Components

### Plus Button Row
- Appears when add row is hidden
- Single row with centered button
- Subtle styling (light border, hover effect)
- Icon + "Add Activity" text

### Add Activity Row
- Appears when + clicked
- Contains form with: sort order, activity select, dates
- Save button (emerald) + Delete button (trash)
- Delete allows removing empty row without saving

### Date Display
```
[🗓️ 2026-01-01] → [🗓️ 2026-02-01]

Blue background for start
Arrow separator
Emerald background for end
```

---

## Validation Rules

### Activity Dates
- Must be between milestone start and end dates
- Both dates constrained with HTML5 min/max

### Milestone Dates
- Must be between project sanctioned and schedule dates
- Both dates constrained with HTML5 min/max
- Date range shown in tooltip on hover

---

## Key Functions Modified

### `handleAddActivitySubmit()`
```typescript
// After adding activity:
setVisibleAddRowMilestone(prev => {
  const newSet = new Set(prev);
  newSet.delete(milestoneId);  // Hide the row
  return newSet;
});
```

---

## Files Changed

| File | Changes |
|------|---------|
| ProjectConfigurationMatrix.tsx | Added state, plus button, conditional rendering, date display format |
| MyProjectsPage.tsx | Added min/max constraints, pass dates to ProjectMatrix |

---

## Testing Scenarios

✅ Add first activity → row hides after save  
✅ Click + again → new row appears  
✅ Click + then trash → row deletes without saving  
✅ Try invalid dates → browser prevents selection  
✅ Dates display correctly side-by-side  
✅ Edit activity → dates show in single-line format  

---

## Performance Impact

- Minimal: One additional Set state (O(1) lookups)
- No additional API calls
- No performance degradation
- Same component re-render count

---

## Accessibility

- Plus button has title tooltip
- Date inputs have title showing valid range
- Delete button has clear icon and tooltip
- Form fields have clear labels
- Keyboard navigation works (tab through fields)

---

## Browser Compatibility

- HTML5 date input with min/max: Supported in all modern browsers
- Set data structure: Supported in all browsers supporting ES6
- CSS features used: Flex, grid, transitions (all modern)

