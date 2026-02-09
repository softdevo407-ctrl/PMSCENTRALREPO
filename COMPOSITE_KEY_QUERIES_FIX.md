# Composite Key Query Fix - Complete

## Problem
After implementing composite key (missionProjectCode, year), JPQL queries were failing because they tried to access `pa.year` and `pa.missionProjectCode` directly. With embedded IDs, these must be accessed via `pa.id.year` and `pa.id.missionProjectCode`.

Error: `Error interpreting query [SELECT pa FROM ProjectActuals pa WHERE pa.year BETWEEN...]`

## Solution Implemented

### 1. Updated ProjectActualsRepository.java
Changed all @Query methods to use composite key path:
- ❌ `pa.missionProjectCode` → ✅ `pa.id.missionProjectCode`
- ❌ `pa.year` → ✅ `pa.id.year`

**Updated Queries:**
- `findByMissionProjectCode`: Now uses `pa.id.missionProjectCode` and orders by `pa.id.year`
- `findByMissionProjectCodeAndYear`: Uses both `pa.id.missionProjectCode` and `pa.id.year`
- `findDistinctMissionProjectCodes`: Selects `pa.id.missionProjectCode`
- `findByYearRange`: Uses `pa.id.year BETWEEN` and orders by both composite key fields
- `findAllOrderedByProjectAndYear`: Orders by `pa.id.missionProjectCode` then `pa.id.year`

**Updated JpaRepository Generic:**
- ❌ `JpaRepository<ProjectActuals, Long>` 
- ✅ `JpaRepository<ProjectActuals, ProjectActualsId>`

### 2. Updated ProjectActualsService.java
- **Removed**: `getProjectActualsById(Long id)` - no longer applicable with composite key
- **Removed**: `deleteProjectActuals(Long id)` method
- **Added**: `deleteProjectActuals(String missionProjectCode, Integer year)` - deletes specific year
  - Creates `ProjectActualsId id = new ProjectActualsId(code, year)`
  - Uses `projectActualsRepository.deleteById(id)`

### 3. Updated ProjectActualsController.java
- **Removed**: `@PutMapping("/{id}")` - update endpoint using old Long ID
- **Removed**: `@DeleteMapping("/{id}")` - delete by Long ID endpoint
- **Updated**: `@DeleteMapping("/{missionProjectCode}/{year}")` - new delete endpoint
  - Takes two path variables: project code and year
  - Calls updated service method

## API Changes

### Before (Old Endpoint - Removed)
```
DELETE /api/project-actuals/{id}  ❌ REMOVED
PUT    /api/project-actuals/{id}  ❌ REMOVED
```

### After (New Endpoint)
```
DELETE /api/project-actuals/{missionProjectCode}/{year}
```

Example:
```
DELETE /api/project-actuals/2025P007/2017  ← Delete 2025P007's 2017 data
```

## Database Verification
Confirmed database has all 8 years correctly:
```
missionprojectcode | year | planned | actuals
2025P007           | 2017 |  221.70 |  152.50
2025P007           | 2018 | 1219.70 |  556.30
2025P007           | 2019 | 1702.10 |  813.30
2025P007           | 2020 | 1868.30 |  740.70
2025P007           | 2021 | 1513.70 |  238.20
2025P007           | 2022 |  975.10 |  118.40
2025P007           | 2023 |  488.00 |  118.00
2025P007           | 2024 |  250.80 |    0.00
```

## Files Modified
✅ ProjectActualsRepository.java - All @Query methods updated
✅ ProjectActualsService.java - Delete method updated
✅ ProjectActualsController.java - Delete endpoint updated

## Expected Result
✅ Backend compiles without errors
✅ All 8 years of data returned from database
✅ Chart displays all years (2017-2024) instead of duplicates
✅ Frontend receives proper JSON with all year records

## Testing Steps
1. `mvn clean compile` - verify no compilation errors
2. `mvn spring-boot:run` - start backend
3. Open browser DevTools → Network tab
4. Select project in Cash Flow chart dropdown
5. Verify network response has 8 records with different years
6. Chart should render all 8 data points
