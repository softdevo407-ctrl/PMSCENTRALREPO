# Date Validation and Database Migration Fix - January 12, 2026

## Issues Fixed

### 1. Database Migration Error
**Problem:** Column "end_date" does not exist in milestone_activities table
**Root Cause:** Migration V005 had incorrect syntax with DEFAULT CURRENT_TIMESTAMP causing Flyway to skip the migration

**Solution:**
- Fixed migration to add columns without defaults first
- Then populated existing rows with default values
- Made columns NOT NULL after population
- Added constraints for date validation

### 2. Date Selection Without Restrictions
**Problem:** Users could select any date without being restricted to valid ranges
**Solution:** Added min/max constraints to all date inputs

## Frontend Changes

### AddPhaseModal.tsx

#### New Helper Function
```typescript
const formatDateForInput = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}
```

#### Milestone Date Inputs
**Restrictions:**
- min: Project start date
- max: Project end date
- disabled: While project data is loading
- Shows "Loading project timeline..." message when disabled

#### Activity Date Inputs
**Restrictions:**
- min: Milestone start date
- max: Milestone end date
- disabled: Until milestone dates are set
- Shows "Set milestone dates first" message when disabled
- Only enabled after user sets milestone dates

### ProjectPhasesPanel.tsx

#### Activity Display Enhancement
Now displays activity dates:
```
Activity Name
Description (if available)
[Weight %] [Start Date - End Date]
```

Calendar icon shows date range for better visibility

## Backend Changes

### Database Migration V005 (add_activity_dates.sql)

**Step 1:** Add columns without constraints
```sql
ALTER TABLE milestone_activities
ADD COLUMN start_date TIMESTAMP,
ADD COLUMN end_date TIMESTAMP;
```

**Step 2:** Populate with existing data
```sql
UPDATE milestone_activities 
SET start_date = created_date, end_date = created_date 
WHERE start_date IS NULL;
```

**Step 3:** Add NOT NULL constraints
```sql
ALTER TABLE milestone_activities
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL;
```

**Step 4:** Add validation constraints
```sql
ALTER TABLE milestone_activities
ADD CONSTRAINT chk_activity_dates CHECK (end_date > start_date);
```

## User Experience Improvements

### 1. Progressive Disclosure
- Project data loads first
- Milestone dates become available once project loads
- Activity dates become available once milestone dates are set

### 2. Clear Feedback
- "Loading project timeline..." - while fetching project
- "Set milestone dates first" - while milestone dates are empty
- Date fields are visually disabled (grayed out) when not available

### 3. Prevented Invalid Selections
- Date pickers enforce min/max automatically
- Users cannot select dates outside valid ranges
- Browser prevents invalid date entry

### 4. Visual Consistency
- Disabled fields have gray background and not-allowed cursor
- Helpful messages guide users to complete previous steps
- Calendar icon in activity display shows date range

## Validation Flow (Frontend to Backend)

```
User Fills Form
    ↓
Milestone dates limited by project timeline (min/max)
    ↓
Activity dates limited by milestone timeline (min/max)
    ↓
Form submission triggers backend validation
    ↓
Backend re-validates all dates against project timeline
    ↓
Database constraints enforce end_date > start_date
```

## Testing Checklist

**Milestone Dates:**
- [ ] Can select dates within project timeline
- [ ] Cannot select dates before project start
- [ ] Cannot select dates after project end
- [ ] Date picker min/max attributes work

**Activity Dates:**
- [ ] Activity date fields disabled until milestone dates set
- [ ] Once milestone dates set, activity dates enabled
- [ ] Can select dates within milestone timeline
- [ ] Cannot select dates outside milestone dates
- [ ] "Set milestone dates first" message visible when disabled

**Display:**
- [ ] Activity dates display correctly in ProjectPhasesPanel
- [ ] Date range shows with calendar icon
- [ ] Dates format correctly (MM/DD/YYYY)

**Database:**
- [ ] Migration V005 runs without errors
- [ ] Existing milestone_activities updated with default dates
- [ ] Cannot insert activities with end_date before start_date
- [ ] Cannot insert activities with invalid weights

## Notes

- All date validation happens client-side (UX) and server-side (security)
- Database migration handles existing data gracefully
- User cannot bypass date restrictions through form submission
- Dates are stored as TIMESTAMP in database (includes time component)
- Frontend converts to date-only format (YYYY-MM-DD) for input display

## Files Modified

### Frontend
- `src/components/AddPhaseModal.tsx` - Added date restrictions and formatting
- `src/components/ProjectPhasesPanel.tsx` - Display activity dates

### Backend
- `src/main/resources/db/migration/V005__add_activity_dates.sql` - Fixed migration
