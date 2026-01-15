import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

export interface ProjectDetailRequest {
  missionProjectFullName: string;
  missionProjectShortName: string;
  missionProjectDescription: string;
  projectCategoryCode: string;
  budgetCode: string;
  projectTypesCode: string;
  sanctionedAuthority: string;
  individualCombinedSanctionCost: string;
  sanctionedCost: number;
  dateOffs: string;
  durationInMonths?: number | null;
  originalSchedule: string;
  fsCopy?: string | null;
  missionProjectDirector: string;
  programmeDirector: string;
  cumExpUpToPrevFy?: number | null;
  curYrExp?: number | null;
  currentStatusPercentage?: number | null;
  currentStatus: string;
  currentStatusRemarks?: string | null;
}

export interface ProjectDetailResponse extends ProjectDetailRequest {
  missionProjectCode: string;
  userId: string;
  regStatus: string;
  regStage: string;
}

class ProjectDetailService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      "Content-Type": "application/json",
      ...authHeaders
    };
  }

  async getAllProjectDetails(): Promise<ProjectDetailResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch project details`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  }

  async getActiveProjectDetails(): Promise<ProjectDetailResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/active`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch active project details`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching active project details:", error);
      throw error;
    }
  }

  async getProjectDetailsByDirector(directorId: string): Promise<ProjectDetailResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/by-director/${directorId}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch project details`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  }

  async getProjectDetailByCode(code: string): Promise<ProjectDetailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/${code}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch project detail`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching project detail:", error);
      throw error;
    }
  }

  async createProjectDetail(request: ProjectDetailRequest): Promise<ProjectDetailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create project detail`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating project detail:", error);
      throw error;
    }
  }

  async updateProjectDetail(code: string, request: ProjectDetailRequest): Promise<ProjectDetailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/${code}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update project detail`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating project detail:", error);
      throw error;
    }
  }

  async deleteProjectDetail(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/${code}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete project detail`);
      }
    } catch (error) {
      console.error("Error deleting project detail:", error);
      throw error;
    }
  }
}

export const projectDetailService = new ProjectDetailService();
