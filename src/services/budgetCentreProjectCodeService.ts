import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

export interface BudgetCentreProjectCodeRequest {
  centreProjectCode: string;
  centreProject: string;
  budgetCentreProjectFullName: string;
  budgetCentreProjectShortName: string;
  fromDate: string;
  toDate?: string | null;
  userId: string;
  regStatus: string;
}

export interface BudgetCentreProjectCodeResponse extends BudgetCentreProjectCodeRequest {
  active: boolean;
}

class BudgetCentreProjectCodeService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      "Content-Type": "application/json",
      ...authHeaders
    };
  }

  async getAllBudgetCentreProjectCodes(): Promise<BudgetCentreProjectCodeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch budget centre project codes`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching budget centre project codes:", error);
      throw error;
    }
  }

  async getActiveBudgetCentreProjectCodes(): Promise<BudgetCentreProjectCodeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/active`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch active budget centre project codes`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching active budget centre project codes:", error);
      throw error;
    }
  }

  async getInactiveBudgetCentreProjectCodes(): Promise<BudgetCentreProjectCodeResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/inactive`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch inactive budget centre project codes`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching inactive budget centre project codes:", error);
      throw error;
    }
  }

  async getBudgetCentreProjectCodeByKey(centreProjectCode: string, centreProject: string): Promise<BudgetCentreProjectCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/${centreProjectCode}/${centreProject}`, {
        method: "GET",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch budget centre project code`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching budget centre project code:", error);
      throw error;
    }
  }

  async createBudgetCentreProjectCode(request: BudgetCentreProjectCodeRequest): Promise<BudgetCentreProjectCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes`, {
        method: "POST",
        headers: this.getHeaders(),
        
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create budget centre project code`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating budget centre project code:", error);
      throw error;
    }
  }

  async updateBudgetCentreProjectCode(centreProjectCode: string, centreProject: string, request: BudgetCentreProjectCodeRequest): Promise<BudgetCentreProjectCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/${centreProjectCode}/${centreProject}`, {
        method: "PUT",
        headers: this.getHeaders(),
        
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update budget centre project code`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating budget centre project code:", error);
      throw error;
    }
  }

  async deactivateBudgetCentreProjectCode(centreProjectCode: string, centreProject: string): Promise<BudgetCentreProjectCodeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/${centreProjectCode}/${centreProject}/deactivate`, {
        method: "PUT",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to deactivate budget centre project code`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deactivating budget centre project code:", error);
      throw error;
    }
  }

  async deleteBudgetCentreProjectCode(centreProjectCode: string, centreProject: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-centre-project-codes/${centreProjectCode}/${centreProject}`, {
        method: "DELETE",
        headers: this.getHeaders(),
        
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete budget centre project code`);
      }
    } catch (error) {
      console.error("Error deleting budget centre project code:", error);
      throw error;
    }
  }
}

export const budgetCentreProjectCodeService = new BudgetCentreProjectCodeService();
