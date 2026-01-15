import { authService } from './authService';

export interface ProjectCategory {
  projectCategoryCode: string;
  projectCategoryFullName: string;
  projectCategoryShortName: string;
  showOnDashboard: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
  active: boolean;
}

export interface ProjectCategoryRequest {
  projectCategoryCode: string;
  projectCategoryFullName: string;
  projectCategoryShortName: string;
  showOnDashboard: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

const BASE_URL = 'http://localhost:7080/api';

export class ProjectCategoryService {
  static async getAllProjectCategories(): Promise<ProjectCategory[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-categories`);
      if (!response.ok) throw new Error('Failed to fetch project categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project categories:', error);
      throw error;
    }
  }

  static async getProjectCategoryByCode(code: string): Promise<ProjectCategory> {
    try {
      const response = await fetch(`${BASE_URL}/project-categories/${code}`);
      if (!response.ok) throw new Error('Failed to fetch project category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project category:', error);
      throw error;
    }
  }

  static async getDashboardCategories(): Promise<ProjectCategory[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-categories/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard categories:', error);
      throw error;
    }
  }

  static async createProjectCategory(data: ProjectCategoryRequest): Promise<ProjectCategory> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to create project category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating project category:', error);
      throw error;
    }
  }

  static async updateProjectCategory(code: string, data: ProjectCategoryRequest): Promise<ProjectCategory> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-categories/${code}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update project category');
      return await response.json();
    } catch (error) {
      console.error('Error updating project category:', error);
      throw error;
    }
  }

  static async deleteProjectCategory(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-categories/${code}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete project category');
    } catch (error) {
      console.error('Error deleting project category:', error);
      throw error;
    }
  }

  static async deactivateProjectCategory(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-categories/${code}/deactivate`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) throw new Error('Failed to deactivate project category');
    } catch (error) {
      console.error('Error deactivating project category:', error);
      throw error;
    }
  }
}
