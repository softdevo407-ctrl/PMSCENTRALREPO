# CategoryStatsCards - Bug Fix & Debugging Guide

## 🐛 Problem Summary

The CategoryStatsCards component was showing incorrect counts (displaying Chairman's data instead of director-specific data) because:

1. **Multiple useEffect hooks conflicting** - Two separate useEffect hooks were both calling fetchData, causing race conditions
2. **Missing role validation** - The component wasn't properly validating if both employeeCode and userRole were available
3. **Inconsistent response handling** - Backend response format wasn't consistently handled

## ✅ Solutions Implemented

### 1. **Consolidated useEffect Hooks**

**Before:**
```typescript
// Two separate hooks causing race conditions
useEffect(() => {
  fetchData();
}, [employeeCode, userRole]);

useEffect(() => {
  if (userRole) {
    fetchData();
  }
}, [userRole]);
```

**After:**
```typescript
// Single hook with proper dependency management
useEffect(() => {
  // Only fetch if we have all required data
  if (employeeCode && userRole) {
    console.log('CategoryStatsCards: Fetching data for', userRole, 'with employee code:', employeeCode);
    fetchData();
  }
}, [employeeCode, userRole]);
```

**Why:** This eliminates duplicate API calls and ensures data is only fetched when both required parameters are present.

---

### 2. **Enhanced Role-Based Filtering**

**Before:**
```typescript
if (employeeCode && userRole && (userRole === 'PROJECT_DIRECTOR' || userRole === 'PROGRAMME_DIRECTOR')) {
  data = await categoryStatsService.getCategoryStatsByDirector(employeeCode);
} else {
  data = await categoryStatsService.getCategoryStats();
}
```

**After:**
```typescript
if (userRole === 'PROJECT_DIRECTOR' || userRole === 'PROGRAMME_DIRECTOR') {
  console.log(`Fetching category stats for ${userRole} with employee code: ${employeeCode}`);
  data = await categoryStatsService.getCategoryStatsByDirector(employeeCode);
} else {
  console.log('Fetching global category stats for role:', userRole);
  data = await categoryStatsService.getCategoryStats();
}
```

**Why:** Clearer logic flow and explicit logging to help identify which endpoint is being called.

---

### 3. **Improved Response Handling**

**Before:**
```typescript
const statData = data?.find((stat: any) => {
  console.log('Comparing stat:', stat.projectCategoryCode, 'with category:', cat.projectCategoryCode);
  return stat.projectCategoryCode === cat.projectCategoryCode;
});
```

**After:**
```typescript
// Ensure data is an array
const statsArray = Array.isArray(data) ? data : [];

const statData = statsArray.find((stat: any) => {
  return stat.projectCategoryCode === cat.projectCategoryCode;
});
```

**Why:** Prevents runtime errors if the API returns unexpected data types.

---

### 4. **Enhanced Service Logging**

Updated `categoryStatsService.ts` with detailed logging and better response format handling:

```typescript
// Handle both direct array response and wrapped response
let categories: CategoryStats[] = [];
if (Array.isArray(data)) {
  categories = data;
} else if (data.categories && Array.isArray(data.categories)) {
  categories = data.categories;
} else {
  console.warn('⚠️ Unexpected response format. Expected array or {categories: array}');
  return [];
}
```

---

## 🔍 How to Debug Issues

### 1. **Check Browser Console for Logs**

Look for these log patterns:

```
✅ CategoryStatsCards: Fetching data for PROJECT_DIRECTOR with employee code: PD001
✅ Fetching director category stats from URL: http://localhost:7080/api/project-details/category-stats-by-director/PD001
✅ Raw response from backend for director: [...]
✅ Processed director categories: [...]
✅ Final merged stats: [...]
```

### 2. **Role-Based Expected Behavior**

| Role | Endpoint Called | Expected Behavior |
|------|-----------------|-------------------|
| `PROJECT_DIRECTOR` | `/category-stats-by-director/{employeeCode}` | Shows only this director's project counts |
| `PROGRAMME_DIRECTOR` | `/category-stats-by-director/{employeeCode}` | Shows only this director's programme counts |
| `CHAIRMAN` | `/category-stats` | Shows global counts for all projects |
| Other | `/category-stats` | Shows global counts for all projects |

### 3. **Debugging Checklist**

- [ ] Verify `user?.employeeCode` is set correctly after login
- [ ] Verify `user?.role` is set correctly (check console for "Fetching data for [ROLE]")
- [ ] Check API response format matches expected structure (array or `{categories: array}`)
- [ ] Verify backend endpoint `/project-details/category-stats-by-director/{employeeCode}` exists
- [ ] Check if director has any projects assigned (empty array means no projects)

### 4. **Testing with Different Roles**

**Test Case 1: Project Director**
```
Expected: Shows category counts for projects where this director is missionProjectDirector
Login as: PD001 / password
Check Console: "Fetching data for PROJECT_DIRECTOR with employee code: PD001"
```

**Test Case 2: Programme Director**
```
Expected: Shows category counts for projects where this director is programmeDirector
Login as: PMD001 / password
Check Console: "Fetching data for PROGRAMME_DIRECTOR with employee code: PMD001"
```

**Test Case 3: Chairman**
```
Expected: Shows global category counts (all projects)
Login as: CHAIRMAN / password
Check Console: "Fetching global category stats for role: CHAIRMAN"
```

---

## 📊 Component Data Flow

```
1. User logs in → AuthContext updates with user data (employeeCode, role)
2. Dashboard renders → CategoryStatsCards receives employeeCode and userRole props
3. useEffect triggers → Calls fetchData() with proper role validation
4. Backend API called → Returns category statistics for director or global
5. Component renders → Displays correct counts based on role
```

---

## 🚀 Key Props Required

| Prop | Type | Required | Purpose |
|------|------|----------|---------|
| `employeeCode` | string | Yes | Employee ID for director-specific queries |
| `userRole` | string | Yes | Determines which endpoint to call |
| `onNavigate` | function | Optional | Callback when category card is clicked |

---

## ⚠️ Common Issues & Solutions

### Issue 1: Showing Chairman's data for directors
**Cause:** Role not being passed correctly or undefined
**Solution:** Check useAuth hook returns correct role, verify Dashboard passes `userRole={user?.role}`

### Issue 2: Empty counts showing after login
**Cause:** Director has no projects assigned
**Solution:** Verify backend returned empty array (not an error), check project assignments

### Issue 3: API 404 error
**Cause:** Backend endpoint doesn't exist or wrong URL format
**Solution:** Verify backend has `/project-details/category-stats-by-director/{employeeCode}` endpoint

### Issue 4: Same data persisting after role change
**Cause:** useEffect dependencies not properly tracked
**Solution:** Ensure both employeeCode and userRole are in dependency array

---

## 📝 Files Modified

1. **src/components/CategoryStatsCards.tsx**
   - Consolidated useEffect hooks
   - Enhanced role-based filtering
   - Better response validation

2. **src/services/categoryStatsService.ts**
   - Added detailed console logging
   - Improved response format handling
   - Better error messages

---

## 🔗 Related Components

- **ProjectDirectorDashboard.tsx** - Passes `employeeCode={user?.employeeCode}` and `userRole={user?.role}`
- **ProgrammeDirectorDashboard.tsx** - Passes `employeeCode={user?.employeeCode}` and `userRole={user?.role}`
- **ChairmanDashboard.tsx** - Passes `employeeCode={'CHAIRMAN'}` and `userRole={'CHAIRMAN'}`

