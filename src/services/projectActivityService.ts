import { authService } from './authService';

export interface ProjectActivity {
  projectActivityCode: string;
  projectActivityFullName: string;
  projectActivityShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
  active: boolean;
}

export interface ProjectActivityRequest {
  projectActivityCode: string;
  projectActivityFullName: string;
  projectActivityShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

const BASE_URL = 'http://localhost:7080/api';

export class ProjectActivityService {
  static async getAllProjectActivities(): Promise<ProjectActivity[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-activities`);
      if (!response.ok) throw new Error('Failed to fetch project activities');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project activities:', error);
      throw error;
    }
  }

  static async getProjectActivityByCode(code: string): Promise<ProjectActivity> {
    try {
      const response = await fetch(`${BASE_URL}/project-activities/${code}`);
      if (!response.ok) throw new Error('Failed to fetch project activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project activity:', error);
      throw error;
    }
  }

  static async createProjectActivity(data: ProjectActivityRequest): Promise<ProjectActivity> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-activities`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create project activity');
      return await response.json();
    } catch (error) {
      console.error('Error creating project activity:', error);
      throw error;
    }
  }

  static async updateProjectActivity(code: string, data: ProjectActivityRequest): Promise<ProjectActivity> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-activities/${code}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update project activity');
      return await response.json();
    } catch (error) {
      console.error('Error updating project activity:', error);
      throw error;
    }
  }

  static async deleteProjectActivity(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-activities/${code}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete project activity');
    } catch (error) {
      console.error('Error deleting project activity:', error);
      throw error;
    }
  }

  static async deactivateProjectActivity(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/project-activities/${code}/deactivate`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) throw new Error('Failed to deactivate project activity');
    } catch (error) {
      console.error('Error deactivating project activity:', error);
      throw error;
    }
  }
}
