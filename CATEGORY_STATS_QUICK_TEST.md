# CategoryStatsCards - Quick Test Reference

## The Problem (BEFORE FIX)
- ❌ Category cards always showed Chairman's global data
- ❌ Directors saw wrong counts after login
- ❌ Counts were not updating to director-specific data

## The Fix Applied
1. ✅ Consolidated two conflicting useEffect hooks into one
2. ✅ Added proper role validation before API calls
3. ✅ Enhanced logging to track which endpoint is being called
4. ✅ Improved response parsing for both response formats

---

## How to Test (Step-by-Step)

### Test 1: Login as Project Director
```
Step 1: Enter employee code: PD001
Step 2: Enter password: (project director password)
Step 3: Check Browser Console (F12)
Expected Console Output:
  ✅ CategoryStatsCards: Fetching data for PROJECT_DIRECTOR with employee code: PD001
  ✅ 🔍 Fetching director category stats from URL: ...
  ✅ ✅ Raw response from backend for director: [...]
  ✅ ✅ Processed director categories: [...]
Step 4: Category cards should show PD001's project counts
Step 5: Navigate away and back, counts should remain consistent
```

### Test 2: Login as Programme Director
```
Step 1: Enter employee code: PDIR001
Step 2: Enter password: (programme director password)
Step 3: Check Browser Console (F12)
Expected Console Output:
  ✅ CategoryStatsCards: Fetching data for PROGRAMME_DIRECTOR with employee code: PDIR001
  ✅ 🔍 Fetching director category stats from URL: ...
Step 4: Category cards should show PDIR001's programme counts
Step 5: Navigate away and back, counts should remain consistent
```

### Test 3: Login as Chairman
```
Step 1: Enter employee code: CHAIRMAN
Step 2: Enter password: (chairman password)
Step 3: Check Browser Console (F12)
Expected Console Output:
  ✅ CategoryStatsCards: Fetching data for CHAIRMAN with employee code: CHAIRMAN
  ✅ Fetching global category stats for role: CHAIRMAN
  ✅ 🔍 Fetching global category stats from URL: ...
Step 4: Category cards should show global counts (all projects)
Step 5: Navigate away and back, counts should remain consistent
```

---

## Expected Results

### Project Director Dashboard
```
Category Cards Should Show:
- Only projects where user is "missionProjectDirector"
- Projects from their assigned categories
- Correct counts for: On Track, At Risk, Delayed, Completed
```

### Programme Director Dashboard
```
Category Cards Should Show:
- Only projects where user is "programmeDirector"  
- Projects from their assigned programme categories
- Correct counts for: On Track, At Risk, Delayed, Completed
```

### Chairman Dashboard
```
Category Cards Should Show:
- All projects across all categories
- Aggregated counts from entire portfolio
- Correct counts for: On Track, At Risk, Delayed, Completed
```

---

## Console Output Guide

| Log | Meaning |
|-----|---------|
| `✅ CategoryStatsCards: Fetching data for PROJECT_DIRECTOR` | Correct role detected |
| `🔍 Fetching director category stats from URL` | Calling director-specific endpoint |
| `✅ Raw response from backend for director: [...]` | Data received from backend |
| `✅ Processed director categories: [...]` | Successfully parsed response |
| `✅ Final merged stats: [...]` | Component ready to render |
| `❌ HTTP 404` | Backend endpoint not found |
| `⚠️ Unexpected response format` | Backend response format incorrect |

---

## If Tests Fail

### Symptom: Still showing Chairman data for directors
**Fix:** 
1. Check user?.role is being passed correctly
2. Verify role value is exactly "PROJECT_DIRECTOR" or "PROGRAMME_DIRECTOR"
3. Check backend endpoint is working

### Symptom: Empty counts for all roles
**Fix:**
1. Verify employee code matches backend records
2. Check if director has any projects assigned
3. Verify backend `/category-stats-by-director/{code}` endpoint returns data

### Symptom: API 404 error in console
**Fix:**
1. Verify backend has category stats endpoints
2. Check API_BASE_URL is correct (http://localhost:7080/api)
3. Verify backend service is running

### Symptom: Counts not updating when navigating
**Fix:**
1. useEffect should trigger when employeeCode changes
2. Check console for "Fetching data for..." logs
3. Verify no cache issues (clear browser cache)

---

## Performance Notes
- Component only fetches when both employeeCode AND userRole are present
- Categories list is fetched separately and merged with stats
- Empty counts are gracefully handled (shows 0 instead of error)

