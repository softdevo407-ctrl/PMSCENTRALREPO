import { authService } from './authService';

export interface ProjectSchedule {
  id: {
    missionProjectCode: string;
    scheduleCode: string;
  };
  scheduleLevel: number;
  scheduleParentCode?: string;
  numberOfDaysToRealise?: number;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  weight?: number;
  statusCode?: string;
  hierarchyOrder: number;
  remarks?: string;
  completedWeight?: number;
  completedDate?: string;
  revisedScheduleStartDate?: string;
  revisedScheduleEndDate?: string;
  userId: string;
  regStatus: string;
  regTime?: string;
}

const BASE_URL = 'http://localhost:7080/api';

export class ProjectScheduleService {
  static async saveProjectSchedule(projectSchedule: ProjectSchedule): Promise<ProjectSchedule> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(projectSchedule)
      });
      
      if (!response.ok) throw new Error('Failed to save project schedule');
      return await response.json();
    } catch (error) {
      console.error('Error saving project schedule:', error);
      throw error;
    }
  }

  static async updateProjectSchedule(projectSchedule: ProjectSchedule): Promise<ProjectSchedule> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(projectSchedule)
      });
      
      if (!response.ok) throw new Error('Failed to update project schedule');
      return await response.json();
    } catch (error) {
      console.error('Error updating project schedule:', error);
      throw error;
    }
  }

  static async getProjectSchedule(projectCode: string, scheduleCode: string): Promise<ProjectSchedule> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/${projectCode}/${scheduleCode}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch project schedule');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project schedule:', error);
      throw error;
    }
  }

  static async getSchedulesByProjectCode(projectCode: string): Promise<ProjectSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/by-project/${projectCode}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) {
        // Handle 404 as empty array (no data found)
        if (response.status === 404) {
          return [];
        }
        const errorData = await response.text();
        throw new Error(`API Error ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching project schedules:', error);
      // Return empty array on error instead of throwing to allow UI to show empty state
      return [];
    }
  }

  static async getSchedulesByProjectCodeAndParentCode(projectCode: string, parentCode: string): Promise<ProjectSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/by-parent/${projectCode}/${parentCode}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch project schedules');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project schedules:', error);
      throw error;
    }
  }

  static async getSchedulesByProjectCodeAndLevel(projectCode: string, level: number): Promise<ProjectSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/by-level/${projectCode}/${level}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch project schedules');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project schedules:', error);
      throw error;
    }
  }

  static async getSchedulesByProjectCodeAndStatus(projectCode: string, statusCode: string): Promise<ProjectSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/by-status/${projectCode}/${statusCode}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch project schedules');
      return await response.json();
    } catch (error) {
      console.error('Error fetching project schedules:', error);
      throw error;
    }
  }

  static async deleteProjectSchedule(projectCode: string, scheduleCode: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/${projectCode}/${scheduleCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete project schedule');
    } catch (error) {
      console.error('Error deleting project schedule:', error);
      throw error;
    }
  }

  static async existsProjectSchedule(projectCode: string, scheduleCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/project-schedules/exists/${projectCode}/${scheduleCode}`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to check project schedule existence');
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking project schedule existence:', error);
      throw error;
    }
  }
}

export const projectScheduleService = new ProjectScheduleService();
