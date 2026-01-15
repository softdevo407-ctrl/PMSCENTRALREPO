import { authService } from './authService';

export interface SanctioningAuthorityResponse {
  sanctioningAuthorityCode: string;
  sanctioningAuthorityFullName: string;
  sanctioningAuthorityShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
  regTime: string | null;
  active: boolean;
}

export interface SanctioningAuthorityRequest {
  sanctioningAuthorityCode: string;
  sanctioningAuthorityFullName: string;
  sanctioningAuthorityShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

const API_BASE_URL = "http://localhost:7080/api";

class SanctioningAuthorityService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      "Content-Type": "application/json",
      ...authHeaders
    };
  }

  async getAllSanctioningAuthorities(): Promise<SanctioningAuthorityResponse[]> {
    try {
      console.log('Fetching sanctioning authorities from:', `${API_BASE_URL}/sanctioning-authorities`);
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Failed to fetch sanctioning authorities`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Sanctioning authorities loaded:', data);
      return data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error fetching sanctioning authorities:", errorMsg);
      throw new Error(errorMsg || 'Failed to fetch sanctioning authorities');
    }
  }

  async getActiveSanctioningAuthorities(): Promise<SanctioningAuthorityResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities/active`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Failed to fetch active sanctioning authorities`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Response is not JSON
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("Error fetching active sanctioning authorities:", errorMsg);
      throw new Error(errorMsg || 'Failed to fetch active sanctioning authorities');
    }
  }

  async getSanctioningAuthorityByCode(code: string): Promise<SanctioningAuthorityResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities/${code}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch sanctioning authority`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sanctioning authority:", error);
      throw error;
    }
  }

  async createSanctioningAuthority(request: SanctioningAuthorityRequest): Promise<SanctioningAuthorityResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create sanctioning authority`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating sanctioning authority:", error);
      throw error;
    }
  }

  async updateSanctioningAuthority(code: string, request: SanctioningAuthorityRequest): Promise<SanctioningAuthorityResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities/${code}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update sanctioning authority`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating sanctioning authority:", error);
      throw error;
    }
  }

  async deactivateSanctioningAuthority(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities/${code}/deactivate`, {
        method: "PUT",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to deactivate sanctioning authority`);
      }
    } catch (error) {
      console.error("Error deactivating sanctioning authority:", error);
      throw error;
    }
  }

  async deleteSanctioningAuthority(code: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctioning-authorities/${code}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete sanctioning authority`);
      }
    } catch (error) {
      console.error("Error deleting sanctioning authority:", error);
      throw error;
    }
  }
}

export const sanctioningAuthorityService = new SanctioningAuthorityService();
