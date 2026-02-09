import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

export interface ProjectDefinitionRequest {
  projectName: string;
  shortName: string;
  programmeName: string;
  category: string;
  projectType: string;
  budgetCode: string;
  leadCentre: string;
  sanctionedAmount: number;
  endDate: string;
  programmeDirId?: number;
  programmeDirectorId?: string | number | null;
  projectDirectorId?: string | number | null;
  projectDocumentPath?: string | null;
  // Time Overrun Fields
  timeOverrunApproval?: string;
  revisedCompletionDate?: string;
  regTime?: string;
  userId?: string;
}

export interface ProjectDefinitionResponse {
  id: number;
  projectName: string;
  shortName: string;
  programmeName: string;
  programmeId?: number;
  projectType: string;
  category: string;
  budgetCode: string;
  leadCentre: string;
  projectDirectorId: number;
  projectDirectorName: string;
  programmeDirId?: number;
  programmeDirectorName?: string;
  sanctionedAmount: number;
  revisedSanctionedAmount?: number;
  sanctionedDate: string;
  endDate: string;
  revisedEndDate?: string;
  revisedDateRemarks?: string;
  revisedDateApprovedByChairman?: boolean;
  projectDocumentPath?: string;
  status: string;
  createdDate: string;
  updatedDate?: string;
  // Time Overrun Fields
  timeOverrunApproval?: string;
  revisedCompletionDate?: string;
  regTime?: string;
  userId?: string;
}

class ProjectService {
  private getHeaders(): Record<string, string> {
    // Use authService's getAuthHeader method which properly handles token retrieval
    const authHeaders = authService.getAuthHeader();
    
    return {
      "Content-Type": "application/json",
      ...authHeaders
    };
  }

  async getAllProjects(): Promise<ProjectDefinitionResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch projects`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async getProjectsByDirector(projectDirectorId: number): Promise<ProjectDefinitionResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/director/${projectDirectorId}`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch projects`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  async getProjectById(id: number): Promise<ProjectDefinitionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }

  async getProjectsByProgrammeId(programmeId: number): Promise<ProjectDefinitionResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/by-programme/${programmeId}`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects for programme");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching projects by programme:", error);
      throw error;
    }
  }

  async createProject(request: ProjectDefinitionRequest, userToken?: string, file?: File): Promise<ProjectDefinitionResponse> {
    try {
      const formData = new FormData();
      formData.append('projectData', JSON.stringify(request));
      if (file) {
        formData.append('projectDocument', file);
      }

      const token = userToken || authService.getToken();
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers,
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create project`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async updateProject(id: number, request: ProjectDefinitionRequest, file?: File): Promise<ProjectDefinitionResponse> {
    try {
      const formData = new FormData();
      formData.append('projectData', JSON.stringify(request));
      if (file) {
        formData.append('projectDocument', file);
      }

      const token = authService.getToken();
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers,
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  async getCategoryStats(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/stats/all-categories`, {
        method: "GET",
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to fetch category stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching category stats:", error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
