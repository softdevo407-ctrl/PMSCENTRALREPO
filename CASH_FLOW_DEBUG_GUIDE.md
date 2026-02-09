# Cash Flow Chart - Data Integration Debugging Guide

## What Changed

### State Management Updates
```typescript
// NEW: Enriched data state that combines actuals with project names
const [enrichedActualsData, setEnrichedActualsData] = useState<any[]>([]);

// UPDATED: Default selected project now empty (auto-selects first)
const [selectedProjectForCashFlow, setSelectedProjectForCashFlow] = useState<string>('');
```

### Data Flow Enhancement
```
1. Fetch projectActualsData from backend API
   ↓
2. Fetch allProjects from project details service
   ↓
3. NEW: Enrich actuals data by joining with project names
   ↓
4. Use enrichedActualsData in dropdown and chart
```

### New useEffect Hook
```typescript
// Enriches actuals data with project names from allProjects
useEffect(() => {
  if (projectActualsData.length > 0 && allProjects.length > 0) {
    const enriched = projectActualsData.map(actual => {
      const project = allProjects.find(p => p.missionProjectCode === actual.missionProjectCode);
      return {
        ...actual,
        projectFullName: project?.missionProjectFullName || 'Unknown Project',
        projectShortName: project?.missionProjectShortName || 'N/A'
      };
    });
    setEnrichedActualsData(enriched);
    
    // Auto-select first project
    if (!selectedProjectForCashFlow && enriched.length > 0) {
      const firstProjectCode = [...new Set(enriched.map(a => a.missionProjectCode))][0];
      setSelectedProjectForCashFlow(firstProjectCode);
    }
  }
}, [projectActualsData, allProjects]);
```

---

## Data Structure

### Before Enrichment
```json
{
  "id": 1,
  "missionProjectCode": "2025P007",
  "year": 2017,
  "planned": 221.70,
  "actuals": 152.50,
  "createdAt": "2026-01-23T11:57:28",
  "updatedAt": "2026-01-23T11:57:28"
}
```

### After Enrichment
```json
{
  "id": 1,
  "missionProjectCode": "2025P007",
  "year": 2017,
  "planned": 221.70,
  "actuals": 152.50,
  "createdAt": "2026-01-23T11:57:28",
  "updatedAt": "2026-01-23T11:57:28",
  "projectFullName": "Gaganyaan Human Space Flight Programme",
  "projectShortName": "Gaganyaan"
}
```

---

## Browser Console Debugging

### What to Check

**1. Check if projectActualsData loaded:**
```javascript
// In browser console
// Should show array of actuals
JSON.parse(sessionStorage.getItem('projectActualsData') || '[]')
```

**2. Check if allProjects loaded:**
```javascript
// Should show array of projects
console.log('All Projects:', allProjects.length)
```

**3. Check enriched data:**
```javascript
// Should show array with projectFullName added
console.log('Enriched Data:', enrichedActualsData)
```

**4. Check logs in console:**
- Look for: "✅ Enriched actuals data:"
- Look for: "📊 Fetching project actuals..."
- Look for: "✅ Project actuals loaded:"

---

## Troubleshooting Checklist

### Issue 1: No data in dropdown
**Symptoms:**
- Dropdown only shows "-- All Projects --" option
- No project options appear

**Debug Steps:**
```
1. Check console for fetch errors
   └─ If 404: Backend endpoint not working
   └─ If CORS error: Security config issue
   └─ If 401: Authentication problem

2. Check projectActualsData
   └─ Open DevTools → React Components
   └─ Find ChairmanDashboard
   └─ Check projectActualsData state
   └─ Should have array of records

3. Check allProjects
   └─ Check allProjects state
   └─ Should be populated

4. Check enrichedActualsData
   └─ Should have projectFullName field added
   └─ If empty, useEffect not running
```

**Solutions:**
- If projectActualsData empty: Check backend API
- If allProjects empty: Check project details API
- If enrichedActualsData empty: Check useEffect dependency array

---

### Issue 2: Project names showing as "Unknown"
**Symptoms:**
- Dropdown shows: "2025P007 - Unknown"
- Tooltip shows: "Unknown Project"

**Debug Steps:**
```
1. Check missionProjectCode match
   └─ projectActualsData: "2025P007"
   └─ allProjects: "2025P007"
   └─ Must be exact match (case-sensitive)

2. Check project data
   └─ Open allProjects in console
   └─ Search for missionProjectCode === "2025P007"
   └─ Check missionProjectFullName field exists

3. Check enrichment logic
   └─ allProjects.find(p => p.missionProjectCode === "2025P007")
   └─ Should return project object
```

**Solutions:**
- If codes don't match: Check database for exact values
- If field doesn't exist: Check ProjectDetailResponse interface
- If find() returns null: Add logging to debug()

---

### Issue 3: Chart data not displaying
**Symptoms:**
- "Loading Cash Flow data..." message persists
- Or chart appears empty

**Debug Steps:**
```
1. Check selectedProjectForCashFlow
   └─ Should not be empty or undefined
   └─ Should match one of the missionProjectCode values

2. Check enrichedActualsData filtering
   └─ enrichedActualsData.filter(a => a.missionProjectCode === selectedProjectForCashFlow)
   └─ Should return array of records
   └─ If empty, code doesn't match

3. Check data transformation
   └─ .map(a => ({ year, planned, actuals, projectName }))
   └─ Should have all required fields

4. Check chart data structure
   └─ Each record needs: year, planned, actuals
   └─ All must be numbers
```

**Solutions:**
- Verify selectedProjectForCashFlow value
- Check filter conditions
- Ensure all fields are properly mapped
- Check parseFloat() conversions

---

## Manual Testing Steps

### Step 1: Backend API Test
```bash
# Test project actuals endpoint
curl -X GET http://localhost:7080/api/project-actuals \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return:
# [
#   {
#     "id": 1,
#     "missionProjectCode": "2025P007",
#     "year": 2017,
#     "planned": 221.70,
#     "actuals": 152.50,
#     ...
#   }
# ]
```

### Step 2: Frontend Data Load
```javascript
// In browser console
// Manually test the service
const projectActualsService = require('../services/projectActualsService').projectActualsService;
projectActualsService.getAllProjectActuals().then(data => {
  console.log('Actuals:', data);
  console.log('Count:', data.length);
  console.log('First record:', data[0]);
});
```

### Step 3: Project Details Test
```bash
# Test project details endpoint
curl -X GET http://localhost:7080/api/project-details \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should include records with matching missionProjectCode
# and missionProjectFullName field
```

### Step 4: Enrichment Test
```javascript
// In browser console, after data loads
// Check if enrichment happened
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  // Use React DevTools
  // Find ChairmanDashboard component
  // Check enrichedActualsData in state
}
```

---

## Console Logs to Monitor

### Expected Logs (Success Path)
```
1. "📊 Fetching project actuals..."
2. "✅ Project actuals loaded: [Array of records]"
3. "✅ Enriched actuals data: [Array with projectFullName]"
4. Chart renders with data
5. Dropdown shows projects with names
```

### Error Logs to Watch For
```
"Error fetching project actuals: TypeError: NetworkError when attempting to fetch resource"
└─ CORS or network issue

"Error fetching projects: TypeError: Failed to fetch"
└─ Backend unreachable

"Project actuals not an array: null/undefined"
└─ API returning wrong format

"Enriched actuals data: []"
└─ No matches between codes
```

---

## Network Tab Inspection

### Check Project Actuals Request
1. Open DevTools → Network tab
2. Filter by "project-actuals"
3. Look for GET request to `http://localhost:7080/api/project-actuals`
4. Check:
   - Status: Should be 200 OK
   - Headers: Content-Type should be application/json
   - Response: Should be JSON array
   - Size: Should match expected data

### Check Project Details Request
1. Filter by "project-details"
2. Look for GET request to `http://localhost:7080/api/project-details`
3. Check:
   - Status: 200 OK
   - Response includes: missionProjectCode, missionProjectFullName
   - Records match: actuals missionProjectCode

---

## Performance Monitoring

### Component Load Time
```javascript
// In console, after page loads
performance.getEntriesByName('ChairmanDashboard');
```

### Data Processing Time
```javascript
// Added to useEffect
const start = performance.now();
// ... enrichment code ...
const end = performance.now();
console.log(`Enrichment took ${end - start}ms`);
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on /project-actuals | Endpoint not created | Check backend controller exists |
| CORS error | Security config | Verify CORS in SecurityConfig |
| 401 Unauthorized | No auth header | Check authService.getAuthHeader() |
| No project names | Code mismatch | Compare missionProjectCode values |
| Empty chart | selectedProjectForCashFlow empty | Check auto-selection logic |
| "Unknown Project" | Project not found | Check database for matching codes |
| Slow loading | Too much data | Add pagination/filtering |

---

## Production Debugging

### Enable Debug Mode
```typescript
// Add to start of component
const DEBUG = true;

const logDebug = (label: string, data: any) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${label}:`, data);
  }
};
```

### Performance Optimization
```typescript
// Use useMemo for expensive operations
const projectCodeSet = useMemo(() => 
  new Set(enrichedActualsData.map(a => a.missionProjectCode)),
  [enrichedActualsData]
);
```

---

## Getting Help

If data is still not loading:

1. **Gather Information:**
   - Browser console errors (full text)
   - Network tab requests/responses
   - Backend logs
   - Database query results

2. **Check:**
   - Backend API is running
   - Database has records
   - CORS is configured
   - Authentication is valid

3. **Verify:**
   - missionProjectCode format matches exactly
   - No extra spaces or case differences
   - All required fields present in API responses
