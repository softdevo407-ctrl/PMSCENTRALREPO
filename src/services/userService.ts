import { authService } from './authService';

export interface UserDTO {
  id: number;
  fullName: string;
  employeeCode?: string;
  role?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: UserDTO[];
}

class UserService {
  private baseUrl = 'http://localhost:8080/users';

  async getUsersByRole(role: string): Promise<UserDTO[]> {
    try {
      const header = authService.getAuthHeader();
      const response = await fetch(`${this.baseUrl}/by-role/${role}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users by role: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }

  async getProjectDirectors(): Promise<UserDTO[]> {
    return this.getUsersByRole('PROJECT_DIRECTOR');
  }

  async getProgrammeDirectors(): Promise<UserDTO[]> {
    return this.getUsersByRole('PROGRAMME_DIRECTOR');
  }

  async getAllUsers(): Promise<UserDTO[]> {
    try {
      const header = authService.getAuthHeader();
      const response = await fetch(`${this.baseUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
