import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

export interface ProgrammeOfficeRequest {
  programmeOfficeCode: string;
  programmeOfficeFullName: string;
  programmeOfficeShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate?: string | null;
  userId: string;
  regStatus: string;
}

export interface ProgrammeOfficeResponse extends ProgrammeOfficeRequest {
  active: boolean;
}

class ProgrammeOfficeService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      "Content-Type": "application/json",
      ...authHeaders
    };
  }

  async getAllProgrammeOffices(): Promise<ProgrammeOfficeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch programme offices`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching programme offices:", error);
      throw error;
    }
  }

  async getActiveProgrammeOffices(): Promise<ProgrammeOfficeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/active`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch active programme offices`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching active programme offices:", error);
      throw error;
    }
  }

  async getInactiveProgrammeOffices(): Promise<ProgrammeOfficeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/inactive`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch inactive programme offices`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching inactive programme offices:", error);
      throw error;
    }
  }

  async getProgrammeOfficeByCode(code: string): Promise<ProgrammeOfficeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/${code}`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch programme office`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching programme office:", error);
      throw error;
    }
  }

  async createProgrammeOffice(request: ProgrammeOfficeRequest): Promise<ProgrammeOfficeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices`, {
        method: "POST",
        headers: this.getHeaders(),
        
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create programme office`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating programme office:", error);
      throw error;
    }
  }

  async updateProgrammeOffice(code: string, request: ProgrammeOfficeRequest): Promise<ProgrammeOfficeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/${code}`, {
        method: "PUT",
        headers: this.getHeaders(),
        
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update programme office`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating programme office:", error);
      throw error;
    }
  }

  async deactivateProgrammeOffice(code: string): Promise<ProgrammeOfficeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/${code}/deactivate`, {
        method: "PUT",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to deactivate programme office`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deactivating programme office:", error);
      throw error;
    }
  }

  async deleteProgrammeOffice(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/programme-offices/${code}`, {
        method: "DELETE",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete programme office`);
      }
    } catch (error) {
      console.error("Error deleting programme office:", error);
      throw error;
    }
  }
}

export const programmeOfficeService = new ProgrammeOfficeService();
