import { authService } from './authService';

const API_BASE_URL = 'http://localhost:7080/api';

export interface ProjectTypeRequest {
  projectTypesCode: string;
  projectTypesFullName: string;
  projectTypesShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate?: string;
}

export interface ProjectTypeResponse extends ProjectTypeRequest {
  userId?: string;
  regStatus?: string;
  regTime?: string;
}

class ProjectTypeService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      'Content-Type': 'application/json',
      ...authHeaders
    };
  }

  async getAllProjectTypes(): Promise<ProjectTypeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch project types`);
        return [];
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching project types:', error);
      return [];
    }
  }

  async getActiveProjectTypes(): Promise<ProjectTypeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types/active`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch active project types`);
        return [];
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching active project types:', error);
      return [];
    }
  }

  async getInactiveProjectTypes(): Promise<ProjectTypeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types/inactive`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch inactive project types`);
        return [];
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching inactive project types:', error);
      return [];
    }
  }

  async getProjectTypeByCode(code: string): Promise<ProjectTypeResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types/${code}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch project type by code`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching project type by code:', error);
      return null;
    }
  }

  async createProjectType(request: ProjectTypeRequest): Promise<ProjectTypeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create project type (HTTP ${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating project type:', error);
      throw error;
    }
  }

  async updateProjectType(code: string, request: ProjectTypeRequest): Promise<ProjectTypeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types/${code}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update project type (HTTP ${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating project type:', error);
      throw error;
    }
  }

  async deleteProjectType(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-types/${code}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete project type (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('Error deleting project type:', error);
      throw error;
    }
  }
}

export const projectTypeService = new ProjectTypeService();
