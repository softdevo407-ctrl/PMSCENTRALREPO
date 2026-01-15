import { authService } from './authService';

export interface ProjectMilestoneRequest {
  projectMilestoneCode: string;
  projectMilestoneFullName: string;
  projectMilestoneShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

export interface ProjectMilestone extends ProjectMilestoneRequest {
  active: boolean;
}

export class ProjectMilestoneService {
  private static readonly BASE_URL = 'http://localhost:7080/api/project-milestones';

  static async getAllMilestones(): Promise<ProjectMilestone[]> {
    try {
      const response = await fetch(ProjectMilestoneService.BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching milestones: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  }

  static async getActiveMilestones(): Promise<ProjectMilestone[]> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching active milestones: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching active milestones:', error);
      throw error;
    }
  }

  static async getInactiveMilestones(): Promise<ProjectMilestone[]> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/inactive`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching inactive milestones: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inactive milestones:', error);
      throw error;
    }
  }

  static async getMilestoneByCode(code: string): Promise<ProjectMilestone> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching milestone: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching milestone:', error);
      throw error;
    }
  }

  static async createMilestone(data: ProjectMilestoneRequest): Promise<ProjectMilestone> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error creating milestone: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  }

  static async updateMilestone(code: string, data: ProjectMilestoneRequest): Promise<ProjectMilestone> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error updating milestone: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  static async deleteMilestone(code: string): Promise<void> {
    try {
      const response = await fetch(`${ProjectMilestoneService.BASE_URL}/${code}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error deleting milestone: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  }
}
