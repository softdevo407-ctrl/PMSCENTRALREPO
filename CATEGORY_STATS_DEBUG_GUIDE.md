# Category Stats Debug Guide - ProjectDirectorDashboard

## Problem
Category stats are not showing up in the ProjectDirectorDashboard even though the director has projects assigned.

## Root Causes Identified and Fixed

### 1. **Frontend Issue: Wrong Service Call**
**Problem:** CategoryStatsCards was always calling the global `getCategoryStats()` endpoint instead of the director-specific endpoint when viewing a director's dashboard.

**Fix Applied:**
- Added `employeeCode` prop to `CategoryStatsCards` component
- Updated `fetchData()` to conditionally call:
  - `categoryStatsService.getCategoryStatsByDirector(employeeCode)` when employeeCode is provided
  - `projectService.getCategoryStats()` for global view
- Updated `ProjectDirectorDashboard` to pass `employeeCode={user?.employeeCode}` to CategoryStatsCards

### 2. **Backend Issue: Missing DTO**
**Problem:** No `CategoryStatDTO` class existed, causing compilation errors.

**Fix Applied:**
- Created `src/main/java/com/pms/dto/CategoryStatDTO.java` with proper fields:
  - `projectCategoryCode`
  - `projectCategoryFullName`
  - `projectCategoryShortName`
  - `projectCount`
- Added import to `ProjectDetailService`

### 3. **Backend Logic: Data Resolution Path**
**Problem:** The original implementation wasn't properly resolving categories through the programme type.

**Fix Applied:**
- Updated `getCategoryStats()` to resolve: ProjectDetail → ProgrammeType → ProjectCategory
- Updated `getCategoryStatsByDirector()` with the same resolution logic
- Both methods now:
  1. Group projects by their programme type's category code
  2. Count projects in each category
  3. Fetch full category details from ProjectCategory table
  4. Return properly structured CategoryStatDTO objects

### 4. **Data Flow in Frontend**
**Updated:** CategoryStatsCards now properly maps backend response fields:
- Backend field `projectCategoryCode` → Frontend uses for matching
- Backend field `projectCount` → Frontend displays as `total`
- Backend field `projectCategoryFullName` → Frontend displays
- Backend field `projectCategoryShortName` → Frontend stores

## Required Data Setup

For categories to appear with project counts, ensure:

1. **Projects have programmeTypeCode set**
   ```
   ProjectDetail.programmeTypeCode (must not be null)
   ```

2. **ProgrammeType has projectCategoryCode set**
   ```
   ProgrammeType.projectCategoryCode (must not be null)
   ```

3. **ProjectCategory exists**
   ```
   ProjectCategory table must have the referenced category
   ```

4. **Director Assignment**
   ```
   ProjectDetail.missionProjectDirector = user's employeeCode
   OR
   ProjectDetail.programmeDirector = user's employeeCode
   ```

## Data Flow Diagram

```
ProjectDirectorDashboard
    ↓
CategoryStatsCards (receives employeeCode prop)
    ↓
categoryStatsService.getCategoryStatsByDirector(employeeCode)
    ↓
GET /project-details/category-stats-by-director/{employeeCode}
    ↓
ProjectDetailService.getCategoryStatsByDirector()
    ├─ Finds projects where director OR programmeDirector = employeeCode
    ├─ For each project:
    │   ├─ Get project.programmeTypeCode
    │   ├─ Fetch ProgrammeType by code
    │   ├─ Get programmeType.projectCategoryCode
    │   └─ Group/count by categoryCode
    ├─ For each category:
    │   └─ Fetch ProjectCategory details
    └─ Return List<CategoryStatDTO>
    ↓
Response: { "categories": [ CategoryStatDTO[] ] }
    ↓
Frontend renders category cards with project counts
```

## Added Logging

Debug logs have been added to trace the data flow:

### Frontend (CategoryStatsCards.tsx)
```typescript
console.log('Fetching category stats for employee code:', employeeCode);
console.log('Category Stats by Director (raw):', data);
console.log('Comparing stat:', stat.projectCategoryCode, 'with category:', cat.projectCategoryCode);
console.log('Found stat for category', cat.projectCategoryCode, ':', statData);
console.log('Merged stats:', mergedStats);
```

### Frontend (categoryStatsService.ts)
```typescript
console.log('Fetching from URL:', url);
console.log('Raw response from backend:', data);
console.log('Processed categories:', result);
```

## Testing Checklist

- [ ] Director has at least one project assigned
- [ ] Project has `programmeTypeCode` value
- [ ] ProgrammeType has `projectCategoryCode` value
- [ ] ProjectCategory exists in database
- [ ] Open browser dev tools → Console
- [ ] Check logs showing:
  - Employee code being passed
  - API endpoint being called
  - Raw response from backend
  - Processed categories list
  - Merged stats with counts
- [ ] Category cards appear with project counts

## Common Issues and Solutions

### No data returned from backend
- Check if projects exist for the director
- Verify `programmeTypeCode` is not null on ProjectDetail
- Verify `projectCategoryCode` is not null on ProgrammeType

### Empty category list shown
- ProjectCategoryService may not have all categories loaded
- Check getAllProjectCategories() is returning all records

### Category counts are 0
- Projects may not be assigned to this director
- Director code may not match `missionProjectDirector` or `programmeDirector`
- ProgrammeType mapping may be incorrect
