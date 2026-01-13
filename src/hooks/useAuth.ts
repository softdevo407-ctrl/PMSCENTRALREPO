import { useState, useCallback, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';

export interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (employeeCode: string, password: string) => Promise<boolean>;
  signup: (fullName: string, employeeCode: string, password: string, confirmPassword: string, role: string, assignedProgrammeId?: number | null) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    const savedToken = authService.getToken();
    if (savedUser) setUser(savedUser);
    if (savedToken) setToken(savedToken);
  }, []);

  const login = useCallback(async (employeeCode: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ employeeCode, password });
      
      if (response.success) {
        const userData: AuthUser = {
          id: response.userId,
          employeeCode: response.employeeCode,
          fullName: response.fullName,
          role: response.role,
          token: response.token,
          assignedProgrammeId: response.assignedProgrammeId,
        };
        setUser(userData);
        setToken(response.token);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    fullName: string,
    employeeCode: string,
    password: string,
    confirmPassword: string,
    role: string,
    assignedProgrammeId?: number | null
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({
        fullName,
        employeeCode,
        password,
        confirmPassword,
        role,
        agreeToTerms: true,
        assignedProgrammeId,
      });

      if (response.success) {
        const userData: AuthUser = {
          id: response.userId,
          employeeCode: response.employeeCode,
          fullName: response.fullName,
          role: response.role,
          token: response.token,
          assignedProgrammeId: response.assignedProgrammeId,
        };
        setUser(userData);
        setToken(response.token);
        return true;
      } else {
        setError(response.message || 'Signup failed');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return user ? user.role.toUpperCase() === role.toUpperCase() : false;
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return user ? roles.some(role => user.role.toUpperCase() === role.toUpperCase()) : false;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
  };
};
