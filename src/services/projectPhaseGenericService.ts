import { authService } from './authService';

export interface ProjectPhaseGenericRequest {
  projectPhaseCode: string;
  projectPhaseFullName: string;
  projectPhaseShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

export interface ProjectPhaseGeneric extends ProjectPhaseGenericRequest {
  active: boolean;
}

export class ProjectPhaseGenericService {
  private static readonly BASE_URL = 'http://localhost:7080/api/project-phases-generic';

  static async getAllPhases(): Promise<ProjectPhaseGeneric[]> {
    try {
      const response = await fetch(ProjectPhaseGenericService.BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching phases: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching phases:', error);
      throw error;
    }
  }

  static async getActivePhases(): Promise<ProjectPhaseGeneric[]> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching active phases: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching active phases:', error);
      throw error;
    }
  }

  static async getInactivePhases(): Promise<ProjectPhaseGeneric[]> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/inactive`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching inactive phases: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching inactive phases:', error);
      throw error;
    }
  }

  static async getPhaseByCode(code: string): Promise<ProjectPhaseGeneric> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching phase: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching phase:', error);
      throw error;
    }
  }

  static async createPhase(data: ProjectPhaseGenericRequest): Promise<ProjectPhaseGeneric> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error creating phase: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating phase:', error);
      throw error;
    }
  }

  static async updatePhase(code: string, data: ProjectPhaseGenericRequest): Promise<ProjectPhaseGeneric> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error updating phase: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating phase:', error);
      throw error;
    }
  }

  static async deletePhase(code: string): Promise<void> {
    try {
      const response = await fetch(`${ProjectPhaseGenericService.BASE_URL}/${code}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() && { Authorization: `Bearer ${authService.getToken()}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error deleting phase: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting phase:', error);
      throw error;
    }
  }
}
