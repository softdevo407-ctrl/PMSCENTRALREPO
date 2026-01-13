# Quick Start Guide - Updated Authentication System

## Prerequisites
- PostgreSQL running on localhost:5432
- Database `pms` created with credentials: postgres/postgres

## Starting the Application

### 1. Start Backend (Terminal 1)
```bash
cd F:\PBEMS\pms-backend
java -jar target/pms-backend-1.0.0.jar
```
**Expected**: Server starts on http://localhost:7080/api
- Check: http://localhost:7080/api/auth/health

### 2. Start Frontend (Terminal 2)
```bash
cd F:\PBEMS
npm run dev
```
**Expected**: Frontend runs on http://localhost:5173

## Testing Workflow

### Create a Test User (Registration)
1. Open http://localhost:5173
2. Click "Sign Up" or "Get Started"
3. Fill in form:
   - Full Name: `Test User`
   - Employee Code: `TEST001`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
   - **Select Role**: `Project Director` (or other role)
4. Check "I agree to..."
5. Click "Create Account"
6. **Expected**: After 3 seconds, dashboard loads automatically
   - NO page refresh needed
   - Correct dashboard displays for selected role

### Login with Existing User
1. Click "Sign In"
2. Enter credentials:
   - Employee Code: `TEST001`
   - Password: `Test@123`
3. Click "Sign In"
4. **Expected**: Dashboard loads immediately
   - NO page refresh needed
   - Correct dashboard displays based on user's role

### Verify Persistence (Refresh Test)
1. After login, press F5 or refresh page
2. **Expected**: Dashboard remains displayed
   - User still logged in
   - No redirect to login page

## Database Test Data

The following roles are available for selection:
- `PROJECT_DIRECTOR` - Displays Project Director Dashboard
- `PROGRAMME_DIRECTOR` - Displays Programme Director Dashboard
- `CHAIRMAN` - Displays Chairman Dashboard

## Troubleshooting

### Dashboard Not Loading After Login?
1. **Check Browser Console** (F12 → Console tab)
   - Look for any JavaScript errors
   - Check Network tab for failed API calls

2. **Verify Backend is Running**
   ```bash
   curl http://localhost:7080/api/auth/health
   ```
   Should return: `{"success":true,"message":"Backend is running"}`

3. **Check localStorage**
   - F12 → Application → LocalStorage → http://localhost:5173
   - Should have `pms_auth_token` and `pms_user_info`

4. **Clear Cache and Retry**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Close and reopen browser tab
   - Try login again

### Role Selection Not Appearing in Registration?
1. Make sure using latest frontend code (npm run dev)
2. Check browser console for errors
3. Verify role dropdown renders with options:
   - Project Director
   - Programme Director
   - Chairman

### Backend Errors?
1. Check application.properties for database connection:
   - URL: jdbc:postgresql://localhost:5432/pms
   - Username: postgres
   - Password: postgres

2. Check database has roles table:
   ```sql
   SELECT * FROM roles;
   ```
   Should show 4 roles

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{employeeCode, password}`
  
- `POST /api/auth/signup` - User registration
  - Body: `{fullName, employeeCode, password, confirmPassword, role}`
  
- `GET /api/auth/health` - Health check

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Redirecting in 3 seconds" stuck | Wait 3 seconds OR check browser console for errors |
| Dashboard not showing after login | Refresh page OR check localStorage is enabled |
| Role dropdown empty in registration | Backend might not have roles - check database |
| "Invalid role" error | Make sure role exists in database roles table |
| CORS error | Check backend CORS config for localhost:5173 |

## Key Changes Summary

✅ Registration now includes role selection
✅ Dashboard loads immediately after login (no refresh needed)
✅ All three roles supported with proper dashboards
✅ Auth state persists across page refreshes
✅ Automatic initialization from localStorage on app startup

## Next Steps

1. Build and deploy backend: `mvn package -DskipTests`
2. Build frontend: `npm run build`
3. Test all three roles thoroughly
4. Deploy to production when ready
