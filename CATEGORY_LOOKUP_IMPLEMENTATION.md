# Multi-Level Category Lookup Implementation

## Overview
Implemented a multi-level data lookup system that resolves project categories through the programme type relationship, allowing projects to display their associated categories in the Project Director Dashboard.

## Data Relationship Architecture

```
Project
  ↓
projectTypesCode (e.g., "TYP02")
  ↓ (Not directly linked to category)
  
BUT
  ↓
programmeTypeCode (e.g., "PROG01") [from ProgrammeType]
  ↓
projectCategoryCode (e.g., "CAT01") [from ProgrammeType]
  ↓ (Lookup)
ProjectCategory
  ↓
projectCategoryFullName (e.g., "Technology Development")
```

## Key Tables/Entities

### 1. **ProjectDetail** (pmsmaintables.projectdetails)
- Contains: `missionProjectCode`, `programmeTypeCode`, `projectTypesCode`, `projectCategoryCode`
- Note: `projectCategoryCode` is stored directly in project details

### 2. **ProgrammeType** (pmsgeneric.programmetypes) 
```
- programmeTypeCode: String (PK)
- projectCategoryCode: String (FK to ProjectCategory)
- programmeTypeFullName: String
- programmeTypeShortName: String
- ... other metadata
```

### 3. **ProjectCategory** (pmsgeneric.projectcategory)
```
- projectCategoryCode: String (PK)
- projectCategoryFullName: String
- projectCategoryShortName: String
- showOnDashboard: String (Y/N)
- ... other metadata
```

### 4. **ProjectType** (pmsgeneric.projecttypes)
- Note: Does NOT have category code directly
- Only has: code, fullName, shortName, hierarchy, dates

## Implementation in MyProjectsPage.tsx

### 1. **New Imports**
```typescript
import { ProgrammeTypeService } from '../../services/programmeTypeService';
import { ProjectCategoryService } from '../../services/projectCategoryService';
```

### 2. **New Interface**
```typescript
interface CategoryMap {
  [key: string]: string;  // categoryCode → categoryFullName
}
```

### 3. **New State Variable**
```typescript
const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
```

### 4. **Data Fetching Logic**
The `useEffect` now performs these steps:

#### Step 1: Fetch all programme types
```typescript
const allProgrammeTypes = await ProgrammeTypeService.getAllProgrammeTypes();
```

#### Step 2: Extract unique category codes
```typescript
const uniqueCategoryCodes = Array.from(
  new Set(allProgrammeTypes.map(pt => pt.projectCategoryCode))
);
```

#### Step 3: Fetch each category and build map
```typescript
const newCategoryMap: CategoryMap = {};
for (const categoryCode of uniqueCategoryCodes) {
  try {
    const category = await ProjectCategoryService.getProjectCategoryByCode(categoryCode);
    newCategoryMap[categoryCode] = category.projectCategoryFullName;
  } catch (err) {
    console.error(`Failed to fetch category ${categoryCode}:`, err);
  }
}
setCategoryMap(newCategoryMap);
```

### 5. **Display Implementation**

#### A. Category Filter Dropdown
```typescript
{Array.from(new Set(myProjects.map(p => p.projectCategoryCode))).map(category => (
  <option key={category} value={category}>
    {categoryMap[category] || category}  {/* Shows "Technology Development" instead of "CAT01" */}
  </option>
))}
```

#### B. Project Details Sidebar
```typescript
<div>
  <p className="text-gray-600">Category</p>
  <p className="font-semibold text-gray-900">
    {categoryMap[selectedProjectData.projectCategoryCode] || selectedProjectData.projectCategoryCode}
  </p>
</div>
```

## API Calls Made

### In Sequence:
1. `projectDetailService.getMyProjects()` - Get projects assigned to user
2. `projectStatusCodeService.getAllProjectStatusCodes()` - Get status name mappings
3. `projectTypeService.getAllProjectTypes()` - Get type name mappings
4. `ProgrammeTypeService.getAllProgrammeTypes()` - Get all programme types (to extract category codes)
5. `ProjectCategoryService.getProjectCategoryByCode(categoryCode)` - For each unique category code found

### Performance Notes:
- **Caching:** All mappings cached in component state after initial load
- **Efficiency:** Category codes extracted from programme types, not fetched individually per project
- **Error Handling:** Gracefully handles missing categories with fallback to category code
- **Network:** Maximum 5-10 API calls total (getAllProgrammeTypes returns all at once, then we fetch unique categories)

## Display Examples

### Before Implementation
- Filter dropdown: "CAT01", "CAT02", "CAT03"
- Project details: "CAT01"

### After Implementation
- Filter dropdown: "Technology Development", "Infrastructure", "Research"
- Project details: "Technology Development"

## Error Handling

### Graceful Fallbacks
```typescript
{categoryMap[selectedProjectData.projectCategoryCode] || selectedProjectData.projectCategoryCode}
```

If category fetch fails:
- ✅ Falls back to displaying the category code
- ✅ Doesn't break the UI
- ✅ Error logged to console for debugging

### Error Scenarios Handled
1. **Missing category code in programme types** → Code still displays in dropdown
2. **API failure when fetching specific category** → Falls back to code display
3. **Network timeout** → Component continues with partial data

## Integration Points

### Services Used

#### 1. **ProgrammeTypeService** (programmeTypeService.ts)
```typescript
static async getAllProgrammeTypes(): Promise<ProgrammeType[]>
// Returns: Array of ProgrammeType with projectCategoryCode field
```

#### 2. **ProjectCategoryService** (projectCategoryService.ts)
```typescript
static async getProjectCategoryByCode(code: string): Promise<ProjectCategory>
// Returns: ProjectCategory with projectCategoryFullName field
```

## File Changes Summary

### Modified File: `src/components/pages/MyProjectsPage.tsx`

**Additions:**
- Line 8: Added `ProgrammeTypeService` import
- Line 9: Added `ProjectCategoryService` import
- Line 25: Added `CategoryMap` interface
- Line 45: Added `categoryMap` state variable
- Lines 68-94: Extended useEffect to fetch and map categories
- Line 252: Updated category filter to display names
- Line 382: Updated category display in details sidebar

## Testing Checklist

- ✅ Categories display with full names in filter dropdown
- ✅ Category filter works correctly (filters by category code)
- ✅ Selected project shows category full name in details
- ✅ Fallback to code display if category fetch fails
- ✅ No TypeScript errors
- ✅ No console errors for successful paths
- ✅ Handles missing categories gracefully

## Future Enhancements

1. **Category Icons:** Add category-specific icons/colors
2. **Category Hierarchy:** Display parent-child category relationships
3. **Dashboard Filter:** Pre-filter projects by selected category on dashboard
4. **Category Management:** Link to category management for admins
5. **Caching:** Implement persistent caching of category mappings

## Related Components

- **ProjectCategoryManagementPage.tsx** - CRUD operations for categories
- **MyProjectsPage.tsx** - This component (displays and filters by category)
- **ProgrammeTypeManagementPage.tsx** - Associates programme types with categories

## Notes

- The relationship between ProgrammeType and ProjectCategory is crucial
- ProjectDetail stores `projectCategoryCode` directly for quick filtering
- Multi-level lookup provides data consistency and enforces referential integrity
- All category lookups are cached to minimize API calls after initial load
