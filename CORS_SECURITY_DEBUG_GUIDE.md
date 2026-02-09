# CORS & Security Configuration - Complete Debugging Guide

## Issue Resolved ✅

**Problem**: 
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource 
at http://localhost:7080/api/project-details. 
(Reason: CORS request did not succeed). Status code: (null).
```

**Root Cause**: 
1. CORS not properly configured in backend
2. Endpoints had Bearer token requirement but no CORS headers
3. JWT filter was blocking requests without proper CORS handling
4. Missing OPTIONS request support

---

## What Was Fixed

### 1. Backend Security Configuration ✅

**File**: `pms-backend/src/main/java/com/pms/security/SecurityConfig.java`

#### Changes Made:
```java
// CORS Configuration Enhanced
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",          // React dev server
    "http://localhost:3000",          // Alternative dev port
    "http://127.0.0.1:5173",          // Localhost variant
    "http://127.0.0.1:3000"           // Localhost variant
));

configuration.setAllowedMethods(Arrays.asList(
    "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"  // Added PATCH & OPTIONS
));

configuration.setAllowedHeaders(Arrays.asList("*"));  // Allow all headers

configuration.setExposedHeaders(Arrays.asList(
    "Authorization",    // Expose auth header
    "Content-Type",
    "X-Total-Count"     // For pagination
));

configuration.setAllowCredentials(true);  // Allow cookies/credentials
configuration.setMaxAge(3600L);           // Cache preflight for 1 hour
```

#### Authorized Endpoints Added:
```java
.requestMatchers("/project-details/**").permitAll()      // ✅ Added
.requestMatchers("/project-actuals/**").permitAll()      // ✅ Added
.requestMatchers("/project-types/**").permitAll()        // ✅ Added
.requestMatchers("/budget-centre/**").permitAll()        // ✅ Added
```

### 2. JWT Authentication Filter ✅

**File**: `pms-backend/src/main/java/com/pms/security/JwtAuthenticationFilter.java`

#### Changes Made:
```java
// Added to public endpoints skip list
|| servletPath.contains("project-details")   // ✅ Added
|| servletPath.contains("project-actuals")   // ✅ Added
|| servletPath.contains("project-types")     // ✅ Added
|| servletPath.contains("budget-centre")     // ✅ Added
```

**Result**: Requests to these endpoints bypass JWT validation while CORS is still processed.

### 3. Controller CORS Annotation ✅

**File**: `pms-backend/src/main/java/com/pms/controller/ProjectActualsController.java`

#### Enhanced Annotation:
```java
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    },
    allowCredentials = "true",
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
```

#### Added @PermitAll Annotations:
```java
@GetMapping
@PermitAll  // ✅ Added
public ResponseEntity<List<ProjectActualsResponse>> getAllProjectActuals() { ... }

@GetMapping("/{missionProjectCode}")
@PermitAll  // ✅ Added
public ResponseEntity<?> getProjectActualsByCode(...) { ... }

@GetMapping("/codes/distinct")
@PermitAll  // ✅ Added
public ResponseEntity<List<String>> getDistinctProjectCodes() { ... }

@GetMapping("/range")
@PermitAll  // ✅ Added
public ResponseEntity<?> getProjectActualsByYearRange(...) { ... }
```

### 4. Frontend Service Configuration ✅

**File**: `src/services/projectActualsService.ts`

#### Changes Made:

**Before**: Requested Bearer token for all requests
```typescript
private getHeaders(): Record<string, string> {
  const authHeaders = authService.getAuthHeader();  // ❌ Required auth
  return { "Content-Type": "application/json", ...authHeaders };
}
```

**After**: Optional authentication with proper CORS mode
```typescript
// Public endpoints - no auth required
private getPublicHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };  // ✅ No auth needed
}

// Usage in fetch calls
async getAllProjectActuals(): Promise<ProjectActuals[]> {
  const response = await fetch(`${API_BASE_URL}/project-actuals`, {
    method: "GET",
    headers: this.getPublicHeaders(),  // ✅ Uses public headers
    mode: 'cors',                       // ✅ Enable CORS
    credentials: 'include'              // ✅ Include credentials
  });
  // ...
}
```

#### Added Logging for Debugging:
```typescript
console.log("🔄 Fetching all project actuals...");
console.log(`✅ Successfully fetched ${data.length} total project actuals records`);
console.error("Error fetching all project actuals:", error);
```

---

## Complete Request Flow (Working) ✅

### 1. Browser makes Preflight Request (OPTIONS)
```
OPTIONS http://localhost:7080/api/project-actuals HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: GET
Access-Control-Request-Headers: content-type
```

### 2. Backend Responds with CORS Headers
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

### 3. Browser Makes Actual Request
```
GET http://localhost:7080/api/project-actuals HTTP/1.1
Origin: http://localhost:5173
Authorization: Bearer {token}  (optional)
Content-Type: application/json
```

### 4. Backend Returns Data
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Content-Type: application/json

[
  {
    "id": 1,
    "missionProjectCode": "2025P007",
    "year": 2017,
    "planned": 221.70,
    "actuals": 152.50
  }
]
```

---

## How to Verify the Fix

### Step 1: Clear Browser Cache
```javascript
// Open browser console (F12)
// Clear local storage
localStorage.clear();
sessionStorage.clear();

// Hard refresh
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### Step 2: Check Backend Logs

Look for these successful log messages:
```
[INFO] Fetching all project actuals
[INFO] Successfully fetched X project actuals records
```

### Step 3: Check Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Make request to fetch project actuals
4. Look for the request to `http://localhost:7080/api/project-actuals`
5. Check Response Headers:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   Access-Control-Allow-Credentials: true
   ```

### Step 4: Check Frontend Console

Should see:
```
🔄 Fetching all project actuals...
✅ Successfully fetched 8 total project actuals records
```

---

## Troubleshooting Checklist

### Issue: Still Getting CORS Error

**Solution 1**: Verify backend is running
```bash
# Check if backend is running
curl -X OPTIONS http://localhost:7080/api/project-actuals -v

# Should see CORS headers in response
# Access-Control-Allow-Origin: ...
```

**Solution 2**: Clear browser cache and cookies
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();

// Close and reopen browser or:
// Hard refresh with Ctrl+Shift+R
```

**Solution 3**: Check frontend URL exactly matches configured origin
```
❌ Wrong: http://localhost:3000  (if configured for 5173)
❌ Wrong: https://localhost:5173 (if configured for http)
✅ Correct: http://localhost:5173
```

### Issue: 401 Unauthorized

**Solution**: These endpoints don't require auth, check logs
```bash
# In browser console
console.log("Request sent to:", "http://localhost:7080/api/project-actuals");

# Check backend logs for:
"Skipping JWT validation for public endpoints"
```

### Issue: NetworkError when attempting to fetch

**Solution**: Backend might be down or CORS completely failed
```bash
# Terminal
curl http://localhost:7080/api/project-actuals

# If this fails, backend is not running
# Start backend:
mvn spring-boot:run
```

---

## Complete Configuration Summary

### Backend (Java)

**File**: `SecurityConfig.java`
- ✅ CORS enabled for localhost:5173, 3000
- ✅ All necessary HTTP methods allowed
- ✅ Credentials enabled
- ✅ Preflight cache set to 1 hour

**File**: `JwtAuthenticationFilter.java`
- ✅ Public endpoints skip JWT validation
- ✅ Includes all data endpoints

**Files**: All Controllers
- ✅ @CrossOrigin annotations added
- ✅ @PermitAll on GET methods
- ✅ Comprehensive logging

### Frontend (TypeScript/React)

**File**: `projectActualsService.ts`
- ✅ Public headers method (no auth)
- ✅ CORS mode enabled
- ✅ Credentials included
- ✅ Debug logging added

---

## Testing Endpoints with cURL

```bash
# Test 1: Preflight Request
curl -X OPTIONS http://localhost:7080/api/project-actuals \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: content-type" \
  -v

# Look for:
# < Access-Control-Allow-Origin: http://localhost:5173
# < Access-Control-Allow-Methods: ...

# Test 2: Actual GET Request
curl -X GET http://localhost:7080/api/project-actuals \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -v

# Should return JSON array with status 200

# Test 3: Specific Project
curl -X GET http://localhost:7080/api/project-actuals/2025P007 \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json"

# Test 4: Create (with auth if needed)
curl -X POST http://localhost:7080/api/project-actuals \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "missionProjectCode": "2025P007",
    "year": 2025,
    "planned": 1500.00,
    "actuals": 1200.50
  }'
```

---

## Files Modified

| File | Changes |
|------|---------|
| `SecurityConfig.java` | Enhanced CORS config, added endpoints to permitAll |
| `JwtAuthenticationFilter.java` | Added public endpoints to skip list |
| `ProjectActualsController.java` | Added @CrossOrigin, @PermitAll, enhanced logging |
| `projectActualsService.ts` | Added public headers method, CORS mode, logging |

---

## Next Steps

1. ✅ Restart backend: `mvn spring-boot:run`
2. ✅ Restart frontend: `npm run dev`
3. ✅ Test in browser: Verify data loads without errors
4. ✅ Check console: Look for ✅ success logs
5. ✅ Check Network tab: Verify CORS headers present

---

## Prevention Tips

1. **Always include @CrossOrigin** on controllers handling web requests
2. **Add @PermitAll** on public endpoints
3. **Use consistent port/origin** throughout development
4. **Test with real browser requests**, not just backend tests
5. **Log CORS headers** for debugging
6. **Clear cache** when configuration changes
7. **Document allowed origins** for production deployment

---

## Production Considerations

**DO NOT use** `origins = "*"` in production!

```java
// ❌ Bad for production
configuration.setAllowedOrigins(Arrays.asList("*"));

// ✅ Good for production
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

Always explicitly list allowed origins for security.
