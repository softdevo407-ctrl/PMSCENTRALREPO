# 🧪 Backend Testing & Validation Guide

## ✅ Pre-Deployment Checklist

### Step 1: Clean Build
```bash
cd f:\21012026\19102026\pms-backend
mvn clean compile
```

**Expected Output:**
```
BUILD SUCCESS
Total time: X.XXs
```

---

### Step 2: Package Build
```bash
mvn clean package -DskipTests
```

**Expected Output:**
```
BUILD SUCCESS
```

---

### Step 3: Start Application
```bash
java -jar target/pms-backend-0.0.1-SNAPSHOT.jar
```

**Expected Output in Console:**
```
2026-01-22 10:30:45.123 INFO  [main] Started ProjectDetailApplication in X.XXs
2026-01-22 10:30:45.456 INFO  [main] Tomcat started on port(s): 7080
```

**Key Indicators (Should NOT see):**
```
❌ UnsatisfiedDependencyException
❌ BeanCreationException
❌ Constructor threw exception
```

---

## 🧪 API Testing

### Test 1: Health Check
```bash
curl -X GET http://localhost:7080/api/project-details
```

**Expected Response:**
```json
[
  {
    "missionProjectCode": "2026P001",
    "missionProjectFullName": "...",
    ...
  }
]
```

---

### Test 2: Category Stats (Global)
```bash
curl -X GET http://localhost:7080/api/project-details/category-stats
```

**Expected Response:**
```json
{
  "categories": [
    {
      "projectCategoryCode": "LV",
      "projectCategoryFullName": "Launch Vehicles",
      "projectCategoryShortName": "LV",
      "projectCount": 5,
      "onTrackCount": 3,
      "delayedCount": 2,
      "totalSanctionedCost": 500000000,
      "totalCumulativeExpenditure": 250000000
    }
  ]
}
```

---

### Test 3: Category Stats by Director
```bash
curl -X GET http://localhost:7080/api/project-details/category-stats-by-director/EMP001
```

**Expected Response:** Similar to Test 2, filtered for director

---

### Test 4: Create Project
```bash
curl -X POST http://localhost:7080/api/project-details \
  -H "Content-Type: application/json" \
  -d '{
    "missionProjectFullName": "Test Project",
    "missionProjectShortName": "TP",
    "durationInMonths": 12,
    "sanctionedCost": 100000000
  }'
```

**Expected Response:**
```json
{
  "missionProjectCode": "2026P004",  // ✅ Auto-generated
  "missionProjectFullName": "Test Project",
  ...
}
```

---

## 📋 Data Validation

### Check Generated Codes
```sql
-- Run this in your database
SELECT missionProjectCode, missionProjectFullName 
FROM project_detail 
WHERE missionProjectCode LIKE '2026P%' 
ORDER BY missionProjectCode DESC;
```

**Expected Format:**
```
2026P004
2026P003
2026P002
2026P001
```

---

### Check Category Stats Data
```sql
-- Verify costs are being captured
SELECT 
  pc.project_category_code,
  COUNT(pd.mission_project_code) as count,
  SUM(pd.sanctioned_cost) as total_sanctioned,
  SUM(pd.cumulative_expenditure_to_date) as total_expended
FROM project_detail pd
JOIN programme_type pt ON pd.programme_type_code = pt.programme_type_code
JOIN project_category pc ON pt.project_category_code = pc.project_category_code
GROUP BY pc.project_category_code;
```

---

## 🔍 Log Monitoring

### Look for Success Indicators
```
✅ ProjectDetailService initialized
✅ ProjectDetailController initialized
✅ categoryStatsService bean created
✅ All repositories initialized
```

### Look for Error Indicators
```
❌ Error creating bean
❌ Failed to instantiate
❌ Constructor threw exception
❌ Unresolved compilation
```

---

## 🚀 Frontend Testing

After backend is running, test the CategoryStatsCards component:

```bash
cd f:\21012026\19102026

# Start Vite dev server
npm run dev
```

**Expected in Browser Console:**
```
✅ Fetching global category stats from URL: http://localhost:7080/api/project-details/category-stats
✅ Raw response from backend: {...}
✅ Processed global categories: [...]
```

---

## 📊 Performance Validation

### Code Generation Performance
```java
// Should complete in < 50ms per request
Time taken: ~5-10ms for generateProjectCode()
```

### Stats Query Performance
```java
// Should complete in < 200ms per category stat
Time taken: ~50-100ms for getCategoryStats()
```

---

## ✨ What Should Work Now

- [x] Application starts without bean errors
- [x] All repositories properly initialized
- [x] Project codes generated with correct format (YEARP###)
- [x] Category stats return with all 8 fields
- [x] On Track/Delayed counts calculated correctly
- [x] Costs displayed in Crores format
- [x] Frontend receives data and renders cards
- [x] Responsive UI works on all devices

---

## 🆘 Troubleshooting

### If application won't start:

1. **Check Java version:**
   ```bash
   java -version
   # Should be Java 11 or higher
   ```

2. **Check port availability:**
   ```bash
   # Windows
   netstat -ano | findstr :7080
   
   # If used, kill the process:
   taskkill /PID <PID> /F
   ```

3. **Check database connectivity:**
   - Verify database is running
   - Verify connection string in `application.properties`
   - Test database connection directly

4. **Clean and rebuild:**
   ```bash
   mvn clean install -DskipTests
   ```

### If stats endpoint returns empty:

1. Verify projects exist in database
2. Verify projects have category/programme type
3. Check database transaction log
4. Run test query from Data Validation section

---

## 🎯 Success Criteria

✅ All tests pass
✅ No console errors
✅ Category stats display correctly
✅ Frontend renders cards
✅ UI is responsive
✅ No database errors

**If all above pass → READY FOR PRODUCTION** 🚀

---

## 📞 Support

If issues persist:
1. Check `BEAN_ERROR_DEBUG_FIX.md` for details
2. Review error logs line by line
3. Verify database schema matches expected structure
4. Check for typos in repository method names
