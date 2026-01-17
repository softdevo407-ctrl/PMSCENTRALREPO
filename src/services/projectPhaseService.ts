import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

export interface ProjectPhaseRequest {
  phaseName: string;
  phaseWeight: number;
  milestones: MilestoneRequest[];
}

export interface MilestoneRequest {
  id?: number;
  milestoneName: string;
  startDate: string; // ISO date format
  endDate: string;   // ISO date format
  revisedEndDate?: string;
  milestoneWeight: number;
  milestoneOrder?: number;
  activities: ActivityRequest[];
}

export interface ActivityRequest {
  id?: number;
  activityName: string;
  activityWeight: number;
  description?: string;
  startDate: string; // ISO date format
  endDate: string;   // ISO date format
  revisedEndDate?: string;
}

export interface ProjectPhaseResponse {
  id: number;
  phaseName: string;
  phaseWeight: number;
  status: string;
  createdDate: string;
  updatedDate?: string;
  milestones?: MilestoneResponse[];
}

export interface MilestoneResponse {
  id: number;
  phaseId: number;
  milestoneName: string;
  startDate: string;
  endDate: string;
  revisedEndDate?: string;
  milestoneWeight: number;
  milestoneOrder: number;
  status: string;
  createdDate: string;
  updatedDate?: string;
  activities?: ActivityResponse[];
}

export interface ActivityResponse {
  id: number;
  milestoneId: number;
  activityName: string;
  activityWeight: number;
  status: string;
  description?: string;
  startDate: string;
  endDate: string;
  revisedEndDate?: string;
  createdDate: string;
  updatedDate?: string;
}

class ProjectPhaseService {
  private getHeaders() {
    // Get token from authService first, fallback to localStorage
    let token = authService.getToken();
    
    // If no token from authService, try to get it from localStorage directly
    if (!token) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          token = userData.token;
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn('No JWT token found for API request');
    }
    
    return headers;
  }

  async createPhase(request: ProjectPhaseRequest): Promise<ProjectPhaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-phases-generic`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create phase`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating phase:", error);
      throw error;
    }
  }

  async getPhasesByProject(): Promise<ProjectPhaseResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-phases-generic`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch phases");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching phases:", error);
      throw error;
    }
  }

  async getPhaseById(phaseId: number): Promise<ProjectPhaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-phases-generic/${phaseId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch phase");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching phase:", error);
      throw error;
    }
  }

  async updatePhase(phaseId: number, request: ProjectPhaseRequest): Promise<ProjectPhaseResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-phases-generic/${phaseId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update phase`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating phase:", error);
      throw error;
    }
  }

  async deletePhase(phaseId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-phases-generic/${phaseId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete phase");
      }
    } catch (error) {
      console.error("Error deleting phase:", error);
      throw error;
    }
  }
}

export const projectPhaseService = new ProjectPhaseService();
