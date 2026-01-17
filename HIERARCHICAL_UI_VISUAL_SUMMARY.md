# Project Configuration Hierarchy - Visual UI Summary

## Component Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│  PROJECT CONFIGURATION HIERARCHY                             │
│  "My Project Name"                                           │
│  Hierarchical Phase → Milestone → Activity Configuration    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ADD NEW PHASE                              [Search phases]  │
│  ┌──────────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │  Search...   🔍  │  │ Phase Name │  │  ➕ Add Phase    │ │
│  └──────────────────┘  └────────────┘  └──────────────────┘ │
│  [Dropdown suggestions appear below search box]             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: PHASE NAME                      🗑️ Delete          │
│ ▼ 3 milestones                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ADD MILESTONE TO PHASE 1                                   │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐  │
│  │Search...  🔍 │  │Start Dt  │  │ End Dt   │  │ 0 mo. │ ├──┐
│  └──────────────┘  └──────────┘  └──────────┘  └───────┘  │  │
│  ┌────────────────────────────────────────────────────────┐ │  │
│  │ ➕ Add                                                 │ │  │
│  └────────────────────────────────────────────────────────┘ │  │
│                                                              │  │
│  MILESTONE 1: DESIGN PHASE                    🗑️ Delete     │  │
│  ▼ 3 months | 01/01/2024 - 03/31/2024                      │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ADD ACTIVITY                                           │  │
│  │  ┌──────────────┐  ┌──────────┐  ┌──────────┐ ┌────┐  │  │
│  │  │Search...  🔍 │  │Start Dt  │  │ End Dt   │ │ mo │  │  │
│  │  └──────────────┘  └──────────┘  └──────────┘ └────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ ➕ Add                                             │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ACTIVITY 1: UI MOCKUPS                      🗑️ Delete  │  │
│  │  1 month | 01/01/2024 - 01/31/2024                     │  │
│  │                                                          │  │
│  │  ACTIVITY 2: PROTOTYPE                      🗑️ Delete   │  │
│  │  2 months | 02/01/2024 - 03/31/2024                    │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  MILESTONE 2: DEVELOPMENT                     🗑️ Delete        │
│  ▼ 4 months | 04/01/2024 - 07/31/2024                         │
│  ├─────────────────────────────────────────────────────────┐   │
│  │ [Add Activity Form + Activity Rows]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ PHASE 2: PHASE NAME                              🗑️ Delete        │
│ ▶ 2 milestones                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ No phases configured yet. Add one above to get started.          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 2 phases • 5 milestones • 12 activities                          │
└──────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Phase Level (Violet)
```
Header Background: #F3E8FF (bg-violet-50)
Border Color: #DDD6FE (border-violet-200)
Text Color: #4C0519 (text-violet-900)
Button Color: #7C3AED (bg-violet-600)
```

### Milestone Level (Blue)
```
Add Form Background: #EFF6FF (bg-blue-50)
Header Background: #EFF6FF (bg-blue-50)
Border Color: #BFDBFE (border-blue-200)
Text Color: #1E3A8A (text-blue-900)
Button Color: #2563EB (bg-blue-600)
```

### Activity Level (Emerald)
```
Add Form Background: #F0FDF4 (bg-emerald-50)
Activity Row Background: #F0FDF4 (bg-emerald-50)
Border Color: #A7F3D0 (border-emerald-200)
Text Color: #065F46 (text-emerald-900)
Button Color: #059669 (bg-emerald-600)
```

## Interactive Elements

### Expand/Collapse Buttons
- **Expanded**: Shows `▼` (ChevronDown)
- **Collapsed**: Shows `▶` (ChevronRight)
- Location: Left side of each phase/milestone header
- Toggles visibility of child elements

### Add Buttons
- **Phase Level**: "➕ Add Phase" button
- **Milestone Level**: "➕ Add" button (mini)
- **Activity Level**: "➕ Add" button (mini)
- Color: Matches hierarchy level color scheme
- Disabled until all required fields filled

### Delete Buttons
- `🗑️` icon (Trash2 from lucide-react)
- Located on the right side of each row
- Red hover state: `hover:bg-red-100 text-red-500`
- Removes element and all children

### Search Inputs
- 🔍 Search icon inside text field
- Real-time filtering as user types
- Dropdown suggestions appear below input
- Selected item shows highlighted badge

### Date Inputs
- Native HTML5 date picker
- Format: YYYY-MM-DD (browser handles localization)
- Validates start date ≤ end date

### Month Display
- Read-only field
- Shows calculated months automatically
- Updates on date change

## Responsive Design

### Desktop (MD breakpoint 768px+)
- Grid layout: 5 columns for milestone/activity forms
  - Column 1: Search dropdown (250px min)
  - Column 2: Start Date (120px)
  - Column 3: End Date (120px)
  - Column 4: Months display (80px)
  - Column 5: Add button (100px)

### Mobile (< 768px)
- Stack all form elements vertically
- Full width search box
- Stacked date inputs
- Full width add button
- Slightly reduced font sizes for activity level

## Data Flow

### Phase Selection
```
User types in search → 
Filter phases in real-time → 
Show dropdown suggestions → 
User clicks phase → 
Selected phase shows as badge → 
User clicks "Add Phase" → 
New PhaseRow created & shown
```

### Milestone Addition
```
User focuses on milestone search → 
Filter milestones in real-time → 
Show dropdown suggestions → 
User selects milestone → 
User enters start date → 
User enters end date → 
Months auto-calculate → 
User clicks "Add" → 
New MilestoneRow created under phase → 
Milestone expands automatically
```

### Activity Addition
```
User focuses on activity search → 
Filter activities in real-time → 
Show dropdown suggestions → 
User selects activity → 
User enters start date → 
User enters end date → 
Months auto-calculate → 
User clicks "Add" → 
New ActivityRow created under milestone
```

## Error States

### Validation Error Alert
```
┌─────────────────────────────────────────────────────┐
│ ⚠️  [Error message text]                            │
└─────────────────────────────────────────────────────┘
Background: #FEF2F2 (red-50)
Border-Left: 4px solid #EF4444 (border-red-500)
```

### Error Messages
- "Please select a phase"
- "Please select milestone and enter dates"
- "Please select activity and enter dates"
- "Start date cannot be after end date"

## Statistics Footer

```
┌────────────────────────────────────────────┐
│ 2 phases • 5 milestones • 12 activities    │
└────────────────────────────────────────────┘
Background: #F9FAFB (bg-gray-50)
Border-Top: 1px solid #E5E7EB (border-gray-200)
Text: #374151 (text-gray-700)
```

## Accessibility Features

- Semantic HTML: `<button>`, `<input>`, `<div>` with proper roles
- Color-not-only indicators: Uses icons and text labels
- Focus states: `focus:ring-2 focus:ring-{color}-500`
- Keyboard navigation: All buttons are tab-accessible
- Search shortcuts: Type to search in dropdowns
- Clear labels: Placeholder text and explicit headers

## State Management Visualization

```
phaseRows: [
  {
    id: "1704067200000",
    phaseCode: "P001",
    phaseName: "Design Phase",
    isExpanded: true,
    milestones: [
      {
        id: "1704067201000",
        milestoneCode: "M001",
        milestoneName: "UI Mockups",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        months: 1,
        isExpanded: true,
        activities: [
          {
            id: "1704067202000",
            activityCode: "A001",
            activityName: "Create Wireframes",
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            months: 0
          }
        ]
      }
    ]
  }
]
```

## Performance Characteristics

- **Rendering**: O(n) where n = total number of phases + milestones + activities
- **Search**: O(n) linear search with string matching
- **Month Calculation**: O(1) - constant time math operation
- **Add/Delete**: O(n) - tree traversal to find parent element
- **Expansion**: O(1) - boolean toggle on found element

## Browser Requirements

- ES6+ support (arrow functions, destructuring)
- HTML5 Date input support
- CSS Grid support
- React 18+ (hooks: useState, useEffect, useMemo)

