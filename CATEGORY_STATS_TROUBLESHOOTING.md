# CategoryStatsCards - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue 1: Showing Chairman's Data for Directors ❌

**Symptoms:**
```
- Login as Project Director
- See global counts instead of director-specific counts
- Counts match Chairman's dashboard
```

**Root Causes to Check:**
1. User role not being set correctly
2. UserRole prop not being passed to CategoryStatsCards
3. Backend endpoint returning wrong data

**Debugging Steps:**

```typescript
// Step 1: Open Browser DevTools (F12)
// Step 2: Go to Console tab
// Step 3: Look for this log:

"✅ CategoryStatsCards: Fetching data for PROJECT_DIRECTOR with employee code: PD001"
// OR
"✅ Fetching global category stats for role: CHAIRMAN"

// If you see CHAIRMAN when should be PROJECT_DIRECTOR, then:
// The role value is incorrect
```

**Fix Checklist:**
- [ ] Check `useAuth` hook returns correct role
- [ ] Verify Dashboard passes `userRole={user?.role}` prop
- [ ] Confirm backend authentication returns role
- [ ] Check roles are exact: "PROJECT_DIRECTOR", "PROGRAMME_DIRECTOR", "CHAIRMAN"

**Solution Code:**
```typescript
// In Dashboard component, verify:
<CategoryStatsCards 
  onNavigate={onNavigate} 
  employeeCode={user?.employeeCode}    // ← Check this is defined
  userRole={user?.role}                 // ← Check this is "PROJECT_DIRECTOR"
/>

// Debug:
console.log('User data:', user);
console.log('Role:', user?.role);
console.log('Employee Code:', user?.employeeCode);
```

---

### Issue 2: Empty Counts (All Zeros) 🚫

**Symptoms:**
```
- All category cards show: Total: 0
- All status breakdowns show: On Track: 0, At Risk: 0, etc.
- OR Category cards don't render at all
```

**Root Causes to Check:**
1. Director has no projects assigned
2. Backend returning empty array
3. API returns 404 or error

**Debugging Steps:**

```typescript
// Step 1: Check Browser Console
// Look for these messages:

"✅ Processed director categories: []"  // Empty array = no projects found

// OR

"❌ HTTP 404: Failed to fetch category stats for director PD001"  // API error

// OR

"⚠️ Unexpected response format. Expected array or {categories: array}"  // Format issue
```

**Investigation Steps:**

1. **Check if director has projects:**
```sql
-- Run in database
SELECT * FROM project_details 
WHERE missionProjectDirector = 'PD001'
-- Should return rows if director has projects
```

2. **Check backend endpoint:**
```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:7080/api/project-details/category-stats-by-director/PD001

# Should return array or {categories: array}
```

**Solutions:**

**If Director Has No Projects:**
- This is normal - component gracefully renders nothing
- Verify director code is correct
- Assign projects to director

**If API Returns Error:**
- Check backend service is running
- Verify API_BASE_URL is correct
- Check token authentication
- Verify endpoint exists on backend

**If Response Format Unexpected:**
- Check backend returns correct structure
- Ensure response is array or `{categories: array}`

---

### Issue 3: API 404 Error 🔴

**Symptoms:**
```
Console shows: "❌ HTTP 404: Failed to fetch category stats for director PD001"
Category cards show loading spinner forever OR disappear
```

**Root Causes:**
1. Backend endpoint doesn't exist
2. Wrong URL format
3. Backend service not running

**Debugging Steps:**

```typescript
// Step 1: Check the URL being called
// Look in console for:
"🔍 Fetching director category stats from URL: http://localhost:7080/api/project-details/category-stats-by-director/PD001"

// Verify URL format is correct:
// ✅ http://localhost:7080/api/project-details/category-stats-by-director/PD001
// ❌ http://localhost:7080/api/project-details/category-statsby-director/PD001 (typo)
```

**Fix Checklist:**
- [ ] Backend service running on port 7080
- [ ] Endpoint exists: `/project-details/category-stats-by-director/{employeeCode}`
- [ ] No typos in URL
- [ ] API_BASE_URL correct in `categoryStatsService.ts`

**Verification:**
```bash
# Check if backend is running
curl http://localhost:7080/api/project-details/category-stats

# Should get 200 response with data or 401 if auth required
# NOT 404 (would mean service not running)
```

---

### Issue 4: Counts Not Updating After Role Change 🔄

**Symptoms:**
```
- Login as PD001, see their counts
- Logout and login as PDIR001
- Still see PD001's counts (not updated)
- Need to refresh page for counts to update
```

**Root Causes:**
1. useEffect dependencies not tracking role/employeeCode changes
2. Component not re-fetching when props change
3. State not being reset

**Debugging Steps:**

```typescript
// Add to component:
useEffect(() => {
  console.log('🔄 useEffect triggered with:', { employeeCode, userRole });
}, [employeeCode, userRole]);

// Should log every time these props change
// If not logging on login, props not changing
```

**Solution:**
```typescript
// Verify dependency array includes both props
useEffect(() => {
  if (employeeCode && userRole) {
    fetchData();
  }
}, [employeeCode, userRole]);  // ← Both must be here
```

---

### Issue 5: Incorrect Response Format ⚠️

**Symptoms:**
```
Console shows: "⚠️ Unexpected response format. Expected array or {categories: array}"
Category counts remain at 0
Component doesn't render category cards
```

**Root Causes:**
1. Backend returns unexpected structure
2. Response format changed
3. Error response sent instead of data

**Debugging Steps:**

```typescript
// Check what backend actually returns
// Add to console:
fetch('http://localhost:7080/api/project-details/category-stats-by-director/PD001', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
.then(r => r.json())
.then(d => console.log('Response format:', d))

// Check the output structure
```

**Expected Formats:**

**Format 1: Direct Array**
```json
[
  {
    "projectCategoryCode": "LV",
    "projectCount": 5,
    "onTrack": 3,
    "atRisk": 1,
    "delayed": 1,
    "completed": 0
  }
]
```

**Format 2: Wrapped Response**
```json
{
  "categories": [
    {
      "projectCategoryCode": "LV",
      "projectCount": 5,
      "onTrack": 3,
      "atRisk": 1,
      "delayed": 1,
      "completed": 0
    }
  ]
}
```

**Fix:**
- Update backend to return one of these formats
- OR update service to parse your custom format

---

### Issue 6: Component Not Rendering At All ⚫

**Symptoms:**
```
- Category cards section completely missing
- No cards displayed
- No error in console
```

**Root Causes:**
1. `loading || error || stats.length === 0` condition is true
2. Props not being passed
3. Component mounted but data fetch failed

**Debugging Steps:**

```typescript
// Check what render condition prevents rendering:
if (loading || error || stats.length === 0) {
  return null;  // ← Component doesn't render
}

// Add logging to see which condition:
console.log('Load state:', { loading, error, statsLength: stats.length });

// If logs don't appear, component props might be wrong
```

**Fix Steps:**
1. Verify `employeeCode` prop is defined
2. Verify `userRole` prop is defined
3. Check browser console for error logs
4. Verify backend is returning data (not empty array)

---

### Issue 7: Multiple Fetch Calls (Performance) ⚡

**Symptoms:**
```
Console shows same endpoint called multiple times
Network tab shows duplicate requests
API rate limiting errors
```

**Root Causes:**
1. Multiple useEffect hooks both calling fetchData() (FIXED in update)
2. Component re-mounting multiple times
3. State updates causing cascading renders

**Verification:**
```typescript
// After our fix, should only see ONE set of logs:
// ✅ CategoryStatsCards: Fetching data for PROJECT_DIRECTOR...
// ✅ 🔍 Fetching director category stats from URL...

// NOT multiple "Fetching data" logs
```

**If Still Occurs:**
- Check no other component also calls categoryStatsService
- Verify no wrapper components force re-mount
- Use React DevTools Profiler to check renders

---

## 🎯 Quick Diagnostic Checklist

Use this when something isn't working:

```
Basic Checks:
- [ ] Backend service running (http://localhost:7080)
- [ ] User logged in with correct role
- [ ] Browser console shows no JS errors
- [ ] Network tab shows successful API calls (200 status)

Data Checks:
- [ ] Console shows "Fetching data for [ROLE]" log
- [ ] Backend returns data (not empty array)
- [ ] Response format matches expected structure
- [ ] employeeCode matches database records

UI Checks:
- [ ] Category cards visible (not hidden by render condition)
- [ ] Cards show correct counts
- [ ] Counts match backend query results
- [ ] Clicking card navigates correctly

State Checks:
- [ ] useEffect triggers when props change
- [ ] State updates reflected in UI
- [ ] No infinite loops in console
- [ ] No duplicate fetch calls
```

---

## 📞 When All Else Fails

1. **Clear Browser Cache**
   - Open DevTools → Application → Storage → Clear All

2. **Restart Backend**
   - Stop and restart your backend service
   - Verify it's running on correct port

3. **Check Database**
   ```sql
   SELECT COUNT(*) FROM project_details WHERE missionProjectDirector = 'PD001';
   ```

4. **Verify Token/Auth**
   - Logout and login fresh
   - Check token in browser storage (Application tab)

5. **Review Logs**
   - Check backend logs for errors
   - Check browser console for all errors
   - Check network tab for failed requests

6. **Review Changes**
   - Verify code changes were applied correctly
   - Check file timestamps (should be recent)
   - Re-read fix documentation

---

## 📊 Decision Tree

```
Are counts correct?
  ├─ YES → ✅ Working as intended
  └─ NO → Continue below

Is it showing wrong role's data?
  ├─ YES (Chairman when should be Director)
  │   └─ Issue 1: Check role prop being passed
  └─ NO → Continue below

Are counts all zeros?
  ├─ YES
  │   └─ Issue 2: Check director has projects
  └─ NO → Continue below

Are category cards missing entirely?
  ├─ YES
  │   └─ Issue 6: Check props are defined
  └─ NO → Continue below

Is API returning 404?
  ├─ YES
  │   └─ Issue 3: Check backend endpoint exists
  └─ NO → Continue below

See Issue 5: Check response format from backend
```

