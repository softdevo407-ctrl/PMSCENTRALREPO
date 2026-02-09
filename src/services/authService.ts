const API_BASE_URL = "http://localhost:7080/api";

export interface LoginRequest {
  employeeCode: string;
  password: string;
}

export interface CASLoginRequest {
  employeeCode: string;
}

export interface SignupRequest {
  fullName: string;
  employeeCode: string;
  password: string;
  confirmPassword: string;
  role: string;
  agreeToTerms: boolean;
  assignedProgrammeId?: number | null;
}

export interface AuthResponse {
  token: string;
  userId: number;
  employeeCode: string;
  fullName: string;
  role: string;
  assignedProgrammeId?: number | null;
  success: boolean;
  message: string;
}

export interface AuthUser {
  id: number;
  employeeCode: string;
  fullName: string;
  role: string;
  token: string;
  assignedProgrammeId?: number | null;
}

class AuthService {
  private tokenKey = "pms_auth_token";
  private userKey = "pms_user_info";

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Login failed:", text);
        return {
          success: false,
          message: "Login failed: " + response.statusText,
          token: "",
          userId: 0,
          employeeCode: "",
          fullName: "",
          role: "",
          assignedProgrammeId: null,
        };
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
        this.setUserInfo({
          id: data.userId,
          employeeCode: data.employeeCode,
          fullName: data.fullName,
          role: data.role,
          token: data.token,
          assignedProgrammeId: data.assignedProgrammeId,
        });
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
        token: "",
        userId: 0,
        employeeCode: "",
        fullName: "",
        role: "",
        assignedProgrammeId: null,
      };
    }
  }

  async loginWithCAS(employeeCode: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-cas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeCode }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("CAS Login failed:", text);
        return {
          success: false,
          message: "CAS Login failed: " + response.statusText,
          token: "",
          userId: 0,
          employeeCode: "",
          fullName: "",
          role: "",
          assignedProgrammeId: null,
        };
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
        this.setUserInfo({
          id: data.userId,
          employeeCode: data.employeeCode,
          fullName: data.fullName,
          role: data.role,
          token: data.token,
          assignedProgrammeId: data.assignedProgrammeId,
        });
      }

      return data;
    } catch (error) {
      console.error("CAS Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "CAS Login failed",
        token: "",
        userId: 0,
        employeeCode: "",
        fullName: "",
        role: "",
        assignedProgrammeId: null,
      };
    }
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Signup failed:", text);
        return {
          success: false,
          message: "Signup failed: " + response.statusText,
          token: "",
          userId: 0,
          employeeCode: "",
          fullName: "",
          role: "",
          assignedProgrammeId: null,
        };
      }

      const responseData = await response.json();

      if (responseData.success && responseData.token) {
        this.setToken(responseData.token);
        this.setUserInfo({
          id: responseData.userId,
          employeeCode: responseData.employeeCode,
          fullName: responseData.fullName,
          role: responseData.role,
          token: responseData.token,
          assignedProgrammeId: responseData.assignedProgrammeId,
        });
      }

      return responseData;
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
        token: "",
        userId: 0,
        employeeCode: "",
        fullName: "",
        role: "",
        assignedProgrammeId: null,
      };
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUserInfo(user: AuthUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUserInfo(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): AuthUser | null {
    return this.getUserInfo();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  hasRole(role: string): boolean {
    const user = this.getUserInfo();
    return user?.role.toUpperCase() === role.toUpperCase();
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUserInfo();
    return user ? roles.some(role => user.role.toUpperCase() === role.toUpperCase()) : false;
  }
}

export const authService = new AuthService();
