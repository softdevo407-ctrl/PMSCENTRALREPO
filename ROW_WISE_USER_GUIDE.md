# Row-Wise Configuration - User Guide

## Overview
A clean, intuitive interface for users to manually build phase-milestone-activity configurations one row at a time.

## How It Works

### **Step 1: Start Empty**
- No pre-populated data
- Table shows "No configurations yet. Add one below to get started."
- User manually selects and adds each row

### **Step 2: Select Phase, Milestone, Activity**
User fills the "Add New Configuration" section:
1. **Phase Dropdown** - Select which phase
2. **Milestone Dropdown** - Select which milestone (auto-shows months & dates)
3. **Activity Dropdown** - Select which activity (auto-shows dates)
4. **Sort Order** - Enter number (1, 2, 3, 4, 5, 6... any order)

### **Step 3: Add Row**
- Click "Add Row" button
- Row appears in table sorted by Sort Order
- Form resets for next entry

### **Example Workflow**

```
User adds rows in this order:
1. Phase 1 → Milestone A → Activity 1 → Sort Order: 3
2. Phase 1 → Milestone B → Activity 2 → Sort Order: 1
3. Phase 2 → Milestone C → Activity 3 → Sort Order: 2

Display order (sorted by Sort Order):
Row 1: Phase 1 → Milestone B → Activity 2 (Sort 1)
Row 2: Phase 2 → Milestone C → Activity 3 (Sort 2)
Row 3: Phase 1 → Milestone A → Activity 1 (Sort 3)
```

## Features

### **Add Row**
- Select Phase, Milestone, Activity from dropdowns
- Enter sort order (1, 2, 3, 4, 5, etc.)
- Click "Add Row" button
- Row added and displays in sort order

### **Edit Row**
- Click "Edit" button on any row
- Dropdowns become editable
- Sort order becomes editable
- Click "Save" to save changes or "Cancel" to discard

### **Delete Row**
- Click "Delete" button
- Row immediately removed from table

### **Automatic Display**
- Rows always displayed in Sort Order sequence
- If you set orders as 5, 1, 3, 2, 4 → displays as 1, 2, 3, 4, 5
- Edit sort order to reorder rows

## Column Breakdown

| Column | Content | Edit Mode |
|--------|---------|-----------|
| **Phase** | Phase name | Dropdown select |
| **Milestone** | Milestone name, months, dates | Dropdown select |
| **Activity** | Activity name, dates | Dropdown select |
| **Sort Order** | Numeric order (1, 2, 3...) | Numeric input |
| **Actions** | Edit / Delete buttons | Save / Cancel buttons |

## Milestone Column Details
Shows:
- **Name**: Milestone full name
- **Months**: Auto-calculated from start/end dates
- **Dates**: Start date → End date

Example: `Milestone A | 6 months | 01/01/2026 - 30/06/2026`

## Activity Column Details
Shows:
- **Name**: Activity full name
- **Dates**: Start date - End date

Example: `Activity 1 | 15/01/2026 - 30/01/2026`

## User Interface

### **Add New Configuration Section** (Green background)
```
┌─────────────┬────────────────┬────────────────┬──────────────┬─────────────┐
│ Phase [DD]  │ Milestone [DD] │ Activity [DD]  │ Sort Order[#]│ [+ Add Row] │
│ Select P... │ Select M...    │ Select A...    │ 1            │             │
└─────────────┴────────────────┴────────────────┴──────────────┴─────────────┘
```

### **Configuration Rows** (White background)
```
┌─────────────┬──────────────────────────────────┬──────────────────┬──────┬────────────────────────┐
│ Phase 1     │ Milestone A                       │ Activity 1       │ 1    │ [Edit] [Delete]        │
│             │ 6 months | 01/01-30/06            │ 15/01-30/01      │      │                        │
├─────────────┼──────────────────────────────────┼──────────────────┼──────┼────────────────────────┤
│ Phase 2     │ Milestone B                       │ Activity 2       │ 2    │ [Edit] [Delete]        │
│             │ 4 months | 01/07-31/10            │ 01/07-15/07      │      │                        │
└─────────────┴──────────────────────────────────┴──────────────────┴──────┴────────────────────────┘
```

## Sorting Order Examples

### Example 1: Sequential
```
User enters: 1, 2, 3, 4, 5
Display: 1, 2, 3, 4, 5 (same order)
```

### Example 2: Out of Order
```
User enters: 3, 1, 4, 2, 5
Display: 1, 2, 3, 4, 5 (auto-sorted)
```

### Example 3: Custom Order
```
User enters: 5, 3, 1, 4, 2
Display: 1, 2, 3, 4, 5 (auto-sorted)

To show as 5, 3, 1, 4, 2:
User should enter: 4, 3, 1, 2, 5
Display: 1, 2, 3, 4, 5 (based on values)
```

**Note**: Always sorted by numeric order from lowest to highest.

## Colors & Icons

- **Header**: Indigo gradient
- **Add Section**: Green background (emerald)
- **Edit Mode**: Indigo highlight
- **Buttons**:
  - Edit: Blue
  - Delete: Red
  - Save: Green
  - Cancel: Gray
  - Add Row: Emerald

## Footer Stats
Shows:
- Total rows added
- Available phases
- Available milestones
- Available activities

## Data Flow

1. User loads configuration screen → Empty table
2. User selects dropdowns and sort order
3. Click "Add Row" → Row added, sorted by order
4. User can Edit/Delete existing rows
5. All changes immediate (no save button needed yet)

## Notes
- No API save implemented yet (data stays in memory)
- Each row selection is independent
- Sort order determines display sequence
- Can duplicate same phase/milestone/activity if needed
- Editing a row updates it in place
