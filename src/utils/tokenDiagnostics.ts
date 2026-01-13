/**
 * Token Diagnostic Helper
 * Use this in browser console to diagnose authentication token issues
 */

export const tokenDiagnostics = {
  // Check if token exists in localStorage
  checkToken: () => {
    console.log('=== Token Diagnostics ===');
    
    // Check pms_auth_token
    const authToken = localStorage.getItem('pms_auth_token');
    console.log('Token in localStorage (pms_auth_token):', authToken ? 'EXISTS' : 'MISSING');
    if (authToken) {
      console.log('Token value:', authToken.substring(0, 20) + '...');
      console.log('Token length:', authToken.length);
    }
    
    // Check user info
    const userInfo = localStorage.getItem('pms_user_info');
    console.log('User info in localStorage:', userInfo ? 'EXISTS' : 'MISSING');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('User:', {
          id: user.id,
          name: user.fullName,
          role: user.role,
          hasToken: !!user.token
        });
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
    
    // Check generic user key
    const genericUser = localStorage.getItem('user');
    console.log('Generic user in localStorage:', genericUser ? 'EXISTS' : 'MISSING');
    
    return {
      authToken: !!authToken,
      userInfo: !!userInfo,
      genericUser: !!genericUser
    };
  },

  // Clear all auth data (for testing logout)
  clearAuth: () => {
    console.log('Clearing authentication...');
    localStorage.removeItem('pms_auth_token');
    localStorage.removeItem('pms_user_info');
    localStorage.removeItem('user');
    console.log('Authentication cleared');
  },

  // Set token manually (for testing)
  setToken: (token: string) => {
    console.log('Setting token manually...');
    localStorage.setItem('pms_auth_token', token);
    console.log('Token set');
  },

  // Check if request will have Authorization header
  checkRequestHeaders: () => {
    const token = localStorage.getItem('pms_auth_token');
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    console.log('Request headers:', headers);
    console.log('Has Authorization:', !!headers["Authorization"]);
    return headers;
  }
};

// Make it available globally in browser console
if (typeof window !== 'undefined') {
  (window as any).tokenDiagnostics = tokenDiagnostics;
  console.log('Token diagnostics available. Use: tokenDiagnostics.checkToken()');
}
