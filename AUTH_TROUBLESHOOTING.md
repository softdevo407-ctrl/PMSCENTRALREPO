# Authentication Token Troubleshooting Guide

## Issue: "Unauthorized" Error When Creating Phase

### Quick Diagnosis

1. **Open Browser DevTools Console** (F12)
2. **Run this command:**
   ```javascript
   tokenDiagnostics.checkToken()
   ```

3. **Check the output:**
   - `Token in localStorage: EXISTS` ✓ Token is stored
   - `Token in localStorage: MISSING` ✗ Token is NOT stored (root cause)

---

## Solutions by Scenario

### Scenario 1: Token is MISSING

**Cause:** User logged in but token was not saved to localStorage

**Solution:**
1. Log out by closing the browser tab or clearing storage
2. Log back in again
3. The login endpoint should return a token and save it to `pms_auth_token`

**Debug:** 
```javascript
// Check if login response has token
tokenDiagnostics.checkToken()
// Token should appear after successful login
```

---

### Scenario 2: Token EXISTS but Still Getting 401

**Possible Causes:**
- Token is expired
- Token format is incorrect
- Backend token validation issue

**Solutions:**

A. **Check token format:**
   ```javascript
   const token = localStorage.getItem('pms_auth_token');
   console.log('Token format:', token);
   // Should look like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

B. **Check API request headers:**
   ```javascript
   tokenDiagnostics.checkRequestHeaders()
   // Should show: Authorization: Bearer eyJhbGc...
   ```

C. **Check browser network tab:**
   1. Open DevTools → Network tab
   2. Try to create a phase
   3. Find the POST request to `/projects/{id}/phases`
   4. Check "Request Headers" section
   5. Look for: `Authorization: Bearer [token]`

---

### Scenario 3: Backend Returns 401 but Frontend Has Token

**Possible Causes:**
- Token is invalid or expired on backend
- Spring Security filter chain issue
- CORS issue with auth headers

**Solutions:**

A. **Check if token is valid:**
   ```javascript
   // Try to decode JWT (if it's a JWT)
   const token = localStorage.getItem('pms_auth_token');
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   console.log('Token expiration:', new Date(payload.exp * 1000));
   console.log('Current time:', new Date());
   ```

B. **Check backend logs:**
   - Look for Spring Security debug logs
   - Should show "Set SecurityContextHolder to anonymous SecurityContext"
   - Check if there are JWT validation errors

C. **Verify CORS headers:**
   - Backend should allow Authorization header
   - Check ProjectPhaseController has `@CrossOrigin` annotation
   - Should include: `allowedHeaders = "*"` or specific headers

---

## Token Storage Locations

**Primary Storage (Used by Frontend):**
- Key: `pms_auth_token`
- Location: `localStorage`
- Value: JWT token string

**Secondary Storage (User Info):**
- Key: `pms_user_info`
- Location: `localStorage`
- Value: JSON object with user details including token

**Generic Storage (Fallback):**
- Key: `user`
- Location: `localStorage`
- Value: JSON object (used as fallback in projectPhaseService)

---

## How Token is Used in Requests

### 1. **projectPhaseService.ts**
```typescript
private getHeaders() {
  let token = authService.getToken(); // Gets from localStorage
  
  if (!token) {
    const user = localStorage.getItem('user'); // Fallback
    // ... parse and extract token
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Add to header
  }
}
```

### 2. **projectService.ts**
```typescript
private getHeaders(): Record<string, string> {
  // Same logic as above with fallback
  // Used for all project API calls
}
```

### 3. **Request Flow**
```
User Logs In
    ↓
authService.login() returns token
    ↓
Token saved to localStorage (pms_auth_token)
    ↓
User action (Create Phase)
    ↓
projectPhaseService.createPhase()
    ↓
getHeaders() retrieves token
    ↓
fetch() with Authorization header
    ↓
Backend validates token
    ↓
Success or 401 error
```

---

## Common Errors and Fixes

### Error: "Authentication token not found. Please login again."
**Fix:** 
1. Clear browser storage: `localStorage.clear()`
2. Refresh page
3. Log in again

### Error: "Unauthorized: Your session may have expired"
**Fix:**
1. Token might be expired (default 24 hours)
2. Log out and log back in
3. Check token expiration: `tokenDiagnostics.checkToken()`

### Error: "Forbidden: You do not have permission"
**Fix:**
1. Check user role matches project director
2. Verify backend role checks in ProjectPhaseController
3. Check project director ID is correct

### Error: Network request shows no Authorization header
**Fix:**
1. Run: `tokenDiagnostics.checkRequestHeaders()`
2. Check if token exists: `tokenDiagnostics.checkToken()`
3. If token missing, log in again
4. Verify getHeaders() method is being called

---

## Testing Token Flow

### Manual Testing Steps

1. **Start Fresh:**
   ```javascript
   tokenDiagnostics.clearAuth()
   window.location.reload()
   ```

2. **Log In:**
   - Enter credentials in login form
   - Click submit

3. **Verify Token Saved:**
   ```javascript
   tokenDiagnostics.checkToken()
   // Should show: Token in localStorage (pms_auth_token): EXISTS
   ```

4. **Test API Request:**
   ```javascript
   tokenDiagnostics.checkRequestHeaders()
   // Should show Authorization header with Bearer token
   ```

5. **Try to Create Phase:**
   - Go to MyProjectsPage
   - Select a project
   - Click "Add Phase"
   - Fill form and submit
   - Check for error or success

6. **If Error, Check:**
   - Browser Network tab for Authorization header
   - Backend logs for JWT validation errors
   - Token expiration: `tokenDiagnostics.checkToken()`

---

## Backend Configuration

### Required Annotations

**ProjectPhaseController:**
```java
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:3000"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowCredentials = "true"
)
@RestController
@RequestMapping("/api/projects/{projectId}/phases")
```

### Security Configuration

- Spring Security JWT filter should:
  1. Extract Authorization header
  2. Parse Bearer token
  3. Validate token signature
  4. Set SecurityContext with user info
  5. Allow request to proceed or return 401

---

## Advanced Debugging

### Browser Console Commands

```javascript
// Check everything at once
tokenDiagnostics.checkToken();

// See full request headers
tokenDiagnostics.checkRequestHeaders();

// Clear auth (simulate logout)
tokenDiagnostics.clearAuth();

// Manually set token (for testing)
tokenDiagnostics.setToken('your-token-here');
```

### Network Tab Analysis

1. Open DevTools → Network tab
2. Filter by: `projects` or `phases`
3. Click the request
4. Go to "Request Headers" section
5. Look for `Authorization: Bearer [token]`

### Backend Log Analysis

```
Look for patterns:
- "Securing POST /projects/{id}/phases"
- "Set SecurityContextHolder to anonymous SecurityContext" (401)
- "Set SecurityContextHolder to..." with user info (200)
- "JWT validation failed" (403)
```

---

## Prevention

### Before Deploying

1. ✓ Verify token is saved after login
2. ✓ Verify token is sent in all API requests
3. ✓ Test with token expiration
4. ✓ Test with invalid token
5. ✓ Check CORS headers are correct
6. ✓ Verify Spring Security filter chain config
7. ✓ Test logout clears token
8. ✓ Test re-login saves new token

---

## Support

If still facing issues:

1. **Collect debug info:**
   ```javascript
   console.log('=== Debug Info ===');
   tokenDiagnostics.checkToken();
   tokenDiagnostics.checkRequestHeaders();
   console.log('Current URL:', window.location.href);
   ```

2. **Check backend logs** for JWT-related errors

3. **Verify network requests** in DevTools Network tab

4. **Check CORS headers** in response

5. **Review authentication flow** in authService.ts

---
