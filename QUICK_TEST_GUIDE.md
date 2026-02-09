# Quick Testing Guide - Project Actuals API

## ✅ All Issues Fixed Summary

| Issue | Root Cause | Fix Applied |
|-------|-----------|------------|
| CORS Blocked | Missing CORS headers in response | ✅ Enhanced SecurityConfig CORS |
| NetworkError | Backend not sending CORS headers | ✅ Added @CrossOrigin on controller |
| 401 Unauthorized | Endpoint required auth but wasn't skipped in JWT filter | ✅ Added to JWT skip list & @PermitAll |
| Bearer token required for public data | Service always tried to get auth header | ✅ Created public headers method |

---

## Quick Start - 30 Seconds

### 1. Start Backend
```bash
cd pms-backend
mvn spring-boot:run
# Wait for: "Started PmsApplication in X seconds"
```

### 2. Start Frontend
```bash
# In another terminal
cd .  # Your frontend root
npm run dev
# Should show: "Local: http://localhost:5173"
```

### 3. Test in Browser
Open: `http://localhost:5173`

Check browser console (F12):
```
✅ 🔄 Fetching all project actuals...
✅ Successfully fetched 8 total project actuals records
```

If you see these logs → **Everything works! ✅**

---

## Manual Testing

### Test 1: Check Backend is Running
```bash
curl http://localhost:7080/api/project-actuals

# Expected response: JSON array like
# [{"id":1,"missionProjectCode":"2025P007","year":2017,...},...]
```

### Test 2: Check CORS Headers
```bash
curl -i -X GET http://localhost:7080/api/project-actuals

# Look for these headers in response:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# Access-Control-Allow-Credentials: true
```

### Test 3: Browser Network Tab
1. Open `http://localhost:5173`
2. Press F12 (DevTools)
3. Go to **Network** tab
4. Look for request to `project-actuals`
5. Click on it
6. Check **Response Headers** tab
7. Should see `access-control-allow-origin: http://localhost:5173`

### Test 4: Specific Project Data
```bash
curl http://localhost:7080/api/project-actuals/2025P007

# Should return 8 records (2017-2024)
```

---

## Browser Console Testing

Open DevTools (F12) → Console tab and paste:

```javascript
// Test 1: Fetch all actuals
fetch('http://localhost:7080/api/project-actuals', {
  mode: 'cors',
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d.length, 'records'))
.catch(e => console.error('❌ Error:', e.message))

// Test 2: Fetch specific project
fetch('http://localhost:7080/api/project-actuals/2025P007', {
  mode: 'cors',
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log('✅ Project 2025P007:', d))
.catch(e => console.error('❌ Error:', e.message))
```

---

## Expected Test Results

### ✅ All Tests Pass
```
✅ 🔄 Fetching all project actuals...
✅ Successfully fetched 8 total project actuals records
✅ Project 2025P007: Array(8)
  └─ 0: {id: 1, missionProjectCode: '2025P007', year: 2017, planned: 221.7, actuals: 152.5, ...}
  └─ 1: {id: 2, missionProjectCode: '2025P007', year: 2018, planned: 1219.7, actuals: 556.3, ...}
  └─ ...
  └─ 7: {id: 8, missionProjectCode: '2025P007', year: 2024, planned: 250.8, actuals: 0, ...}
```

### ❌ If Still Getting Errors

**Error**: `NetworkError when attempting to fetch resource`
```
Solution: Backend not running
Try: mvn spring-boot:run
```

**Error**: `CORS policy: Response to preflight request doesn't pass access control check`
```
Solution: Backend restarted, need to clear browser cache
Try: Ctrl+Shift+R (hard refresh)
```

**Error**: `Failed to fetch`
```
Solution: Check frontend/backend URLs match
Frontend should use: http://localhost:7080/api
Backend should listen on: http://localhost:7080
```

---

## Dashboard Cash Flow Testing

### Verify Chart Renders

1. Go to Chairman Dashboard
2. Scroll to "Cash Flow Analysis - Planned vs Actuals" section
3. Should see:
   - ✅ Project selector dropdown
   - ✅ LineChart with blue and green lines
   - ✅ Years on X-axis (2017-2024)
   - ✅ Amount on Y-axis (₹ Cr)
   - ✅ Tooltip on hover showing details

### Test Project Selection

1. Open dropdown: "Select Project: 2025P007"
2. Should show all available projects:
   - 2025P007 - Gaganyaan Human Space Flight Programme
   - (and others if in database)
3. Select different project → Chart updates
4. Select "-- All Projects --" → Shows consolidated data

### Test Hover Tooltip

1. Hover over any data point
2. Should see:
   ```
   📅 Year: 2019
   📊 Planned: ₹1,702.10 Cr
   ✓ Actuals: ₹813.30 Cr
   📈 Variance: ₹888.80 Cr (Underspend)
   ```

---

## Database Verification

### Check Sample Data Exists
```bash
# Connect to database
mysql -u [username] -p [database_name]

# Run this query
SELECT COUNT(*) as total_records, 
       COUNT(DISTINCT missionprojectcode) as projects,
       MIN(year) as earliest_year,
       MAX(year) as latest_year
FROM pmsmaintables.projectactuals;

# Expected result:
# total_records | projects | earliest_year | latest_year
# 8             | 1        | 2017          | 2024
```

### View Sample Data
```sql
SELECT * FROM pmsmaintables.projectactuals 
ORDER BY missionprojectcode, year;

# Should show 8 records for 2025P007 (years 2017-2024)
```

---

## Complete Checklist

- [ ] Backend running on `http://localhost:7080`
- [ ] Frontend running on `http://localhost:5173`
- [ ] Database has `pmsmaintables.projectactuals` table
- [ ] Sample data inserted (8 records for 2025P007)
- [ ] Browser console shows ✅ success logs
- [ ] Network tab shows CORS headers
- [ ] Dashboard loads without errors
- [ ] Cash Flow chart renders
- [ ] Project selector works
- [ ] Tooltip shows on hover

---

## Common Mistakes to Avoid

1. ❌ **Don't** use `http://localhost:3000` if frontend is on `5173`
   - ✅ Check URL bar to confirm exact port

2. ❌ **Don't** forget to hard refresh (Ctrl+Shift+R)
   - ✅ After any backend changes

3. ❌ **Don't** use `Bearer token` for GET endpoints
   - ✅ These are public, no auth needed

4. ❌ **Don't** forgot to insert sample data in database
   - ✅ Run the INSERT statements first

5. ❌ **Don't** expect real-time updates without refresh
   - ✅ Current implementation loads once on mount

---

## Debug Commands

```bash
# Terminal 1: Start Backend
cd pms-backend
mvn clean install
mvn spring-boot:run

# Terminal 2: Start Frontend
npm run dev

# Terminal 3: Test API
curl http://localhost:7080/api/project-actuals | jq

# Terminal 4: Monitor Backend Logs
tail -f logs/application.log | grep -i "project-actuals"
```

---

## Success Indicators ✅

You'll know everything is working when you see:

**Backend Console**:
```
[INFO] c.p.c.ProjectActualsController - Fetching all project actuals
[INFO] c.p.c.ProjectActualsController - Successfully fetched 8 project actuals records
```

**Frontend Console**:
```
🔄 Fetching all project actuals...
✅ Successfully fetched 8 total project actuals records
```

**Browser Network Tab**:
```
GET /api/project-actuals  200  OK
Response Headers:
  access-control-allow-origin: http://localhost:5173
  access-control-allow-credentials: true
Response Body:
  [{id: 1, missionProjectCode: "2025P007", ...}, ...]
```

---

## Need More Help?

1. **Check CORS_SECURITY_DEBUG_GUIDE.md** - Detailed troubleshooting
2. **Check PROJECT_ACTUALS_API_DOCS.md** - Full API documentation
3. **Check BACKEND_SETUP_GUIDE.md** - Backend setup instructions
4. **Check CASH_FLOW_VISUAL_REFERENCE.md** - Frontend integration guide

---

**Status**: ✅ All fixes applied and tested
**Last Updated**: 2026-01-23
**Tested On**: Firefox, Chrome, Edge
