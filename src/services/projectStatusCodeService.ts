const API_BASE_URL = "http://localhost:7080/api";

export interface ProjectStatusCodeRequest {
  projectStatusCode: string;
  projectStatusFullName: string;
  projectStatusShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate?: string;
  userId: string;
  regStatus: string;
  regTime?: string;
}

export interface ProjectStatusCodeResponse {
  projectStatusCode: string;
  projectStatusFullName: string;
  projectStatusShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate?: string;
  userId: string;
  regStatus: string;
  regTime?: string;
}

export const projectStatusCodeService = {
  async getAllProjectStatusCodes(): Promise<ProjectStatusCodeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch project status codes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching project status codes:", error);
      throw error;
    }
  },

  async getProjectStatusCodeByCode(code: string): Promise<ProjectStatusCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes/${code}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch project status code: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching project status code:", error);
      throw error;
    }
  },

  async createProjectStatusCode(request: ProjectStatusCodeRequest): Promise<ProjectStatusCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to create project status code: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating project status code:", error);
      throw error;
    }
  },

  async updateProjectStatusCode(code: string, request: ProjectStatusCodeRequest): Promise<ProjectStatusCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes/${code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`Failed to update project status code: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating project status code:", error);
      throw error;
    }
  },

  async deleteProjectStatusCode(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes/${code}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete project status code: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting project status code:", error);
      throw error;
    }
  },

  async deactivateProjectStatusCode(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes/${code}/deactivate`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`Failed to deactivate project status code: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deactivating project status code:", error);
      throw error;
    }
  },

  async getProjectStatusCodesByStatus(status: string): Promise<ProjectStatusCodeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-status-codes/by-status/${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch project status codes by status: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching project status codes by status:", error);
      throw error;
    }
  },
};
