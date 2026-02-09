import { authService } from './authService';

const API_BASE_URL = "http://localhost:7080/api";

/**
 * ProjectActualsRequest - Matches backend ProjectActualsRequest DTO
 * Used for creating/updating project actuals
 */
export interface ProjectActualsRequest {
  missionProjectCode: string;
  budgetYear: number;
  plannedCashFlow: number;
  votedGrant: number;
  revisedEstimates: number;
  actualExpenditure: number;
  userId: string;
  regStatus: string;
}

/**
 * ProjectActualsResponse - Matches backend ProjectActualsResponse DTO
 * Returned from API calls
 */
export interface ProjectActualsResponse {
  missionProjectCode: string;
  budgetYear: number;
  plannedCashFlow: number;
  votedGrant: number;
  revisedEstimates: number;
  actualExpenditure: number;
  userId: string;
  regStatus: string;
  regTime?: string;
}

/**
 * CashFlowData - Transformed data for charts
 */
export interface CashFlowData {
  budgetYear: number;
  plannedCashFlow: number;
  votedGrant: number;
  revisedEstimates: number;
  actualExpenditure: number;
  missionProjectCode: string;
}

/**
 * Backward compatibility alias
 */
export type ProjectActuals = ProjectActualsResponse;

class ProjectActualsService {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    // Add auth header if available (optional for public endpoints)
    try {
      const authHeaders = authService.getAuthHeader();
      return { ...headers, ...authHeaders };
    } catch (e) {
      console.warn("Auth header not available, proceeding without authentication");
      return headers;
    }
  }

  private getPublicHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
    };
  }

  /**
   * Get all project actuals
   * Mirrors: ProjectActualsService.getAllProjectActuals()
   */
  async getAllProjectActuals(): Promise<ProjectActualsResponse[]> {
    try {
      console.log("🔄 Fetching all project actuals...");
      const response = await fetch(`${API_BASE_URL}/project-actuals`, {
        method: "GET",
        headers: this.getPublicHeaders(),
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to fetch all project actuals`
        );
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.length} total project actuals records`);
      return data;
    } catch (error) {
      console.error("Error fetching all project actuals:", error);
      throw error;
    }
  }

  /**
   * Get project actuals for a specific project code
   * Mirrors: ProjectActualsService.getProjectActualsByCode(String missionProjectCode)
   */
  async getProjectActualsByCode(missionProjectCode: string): Promise<ProjectActualsResponse[]> {
    try {
      console.log(`🔄 Fetching project actuals for code: ${missionProjectCode}`);
      const response = await fetch(
        `${API_BASE_URL}/project-actuals/${missionProjectCode}`,
        {
          method: "GET",
          headers: this.getPublicHeaders(),
          mode: 'cors',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to fetch project actuals`
        );
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.length} records for project ${missionProjectCode}`);
      return data;
    } catch (error) {
      console.error("Error fetching project actuals:", error);
      throw error;
    }
  }

  /**
   * Get all distinct project codes with actuals data
   * Mirrors: ProjectActualsService.getDistinctProjectCodes()
   */
  async getDistinctProjectCodes(): Promise<string[]> {
    try {
      console.log("🔄 Fetching distinct project codes...");
      const response = await fetch(
        `${API_BASE_URL}/project-actuals/distinct/codes`,
        {
          method: "GET",
          headers: this.getPublicHeaders(),
          mode: 'cors',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to fetch distinct project codes`
        );
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.length} distinct project codes`);
      return data;
    } catch (error) {
      console.error("Error fetching distinct project codes:", error);
      throw error;
    }
  }

  /**
   * Get project actuals for a specific year range
   * Mirrors: ProjectActualsService.getProjectActualsByYearRange(Integer startYear, Integer endYear)
   */
  async getProjectActualsByYearRange(
    startYear: number,
    endYear: number
  ): Promise<ProjectActualsResponse[]> {
    try {
      console.log(
        `🔄 Fetching project actuals for year range: ${startYear} to ${endYear}`
      );
      const response = await fetch(
        `${API_BASE_URL}/project-actuals/range?startYear=${startYear}&endYear=${endYear}`,
        {
          method: "GET",
          headers: this.getPublicHeaders(),
          mode: 'cors',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to fetch project actuals by year range`
        );
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched ${data.length} records for year range ${startYear}-${endYear}`);
      return data;
    } catch (error) {
      console.error("Error fetching project actuals by year range:", error);
      throw error;
    }
  }

  /**
   * Create or update project actuals
   * Mirrors: ProjectActualsService.saveProjectActuals(ProjectActualsRequest request)
   * @param request ProjectActualsRequest with all required fields
   */
  async saveProjectActuals(request: ProjectActualsRequest): Promise<ProjectActualsResponse> {
    try {
      console.log(
        `💾 Saving project actuals for ${request.missionProjectCode}, budget year ${request.budgetYear}`
      );
      const response = await fetch(`${API_BASE_URL}/project-actuals`, {
        method: "POST",
        headers: this.getHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to save project actuals`
        );
      }

      const data = await response.json();
      console.log(
        `✅ Successfully saved project actuals for code: ${data.missionProjectCode}, budget year: ${data.budgetYear}`
      );
      return data;
    } catch (error) {
      console.error("Error saving project actuals:", error);
      throw error;
    }
  }

  /**
   * Delete project actuals by project code and budget year
   * Mirrors: ProjectActualsService.deleteProjectActuals(String missionProjectCode, Integer budgetYear)
   */
  async deleteProjectActuals(
    missionProjectCode: string,
    budgetYear: number
  ): Promise<void> {
    try {
      console.log(
        `🗑️ Deleting project actuals for code: ${missionProjectCode}, budget year: ${budgetYear}`
      );
      const response = await fetch(
        `${API_BASE_URL}/project-actuals/${missionProjectCode}/${budgetYear}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
          mode: 'cors',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to delete project actuals`
        );
      }

      console.log(
        `✅ Successfully deleted project actuals for code: ${missionProjectCode}, budget year: ${budgetYear}`
      );
    } catch (error) {
      console.error("Error deleting project actuals:", error);
      throw error;
    }
  }

  /**
   * Delete all project actuals for a specific project code
   * Mirrors: ProjectActualsService.deleteByProjectCode(String missionProjectCode)
   */
  async deleteByProjectCode(missionProjectCode: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting all project actuals for code: ${missionProjectCode}`);
      const response = await fetch(
        `${API_BASE_URL}/project-actuals/${missionProjectCode}`,
        {
          method: "DELETE",
          headers: this.getHeaders(),
          mode: 'cors',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to delete project actuals`
        );
      }

      console.log(`✅ Successfully deleted all project actuals for code: ${missionProjectCode}`);
    } catch (error) {
      console.error("Error deleting project actuals by code:", error);
      throw error;
    }
  }

  /**
   * Transform actuals data to chart format (for Cash Flow graph)
   */
  formatForCashFlow(actuals: ProjectActualsResponse[]): CashFlowData[] {
    return actuals
      .map((item) => ({
        budgetYear: item.budgetYear,
        plannedCashFlow: parseFloat(String(item.plannedCashFlow)) || 0,
        votedGrant: parseFloat(String(item.votedGrant)) || 0,
        revisedEstimates: parseFloat(String(item.revisedEstimates)) || 0,
        actualExpenditure: parseFloat(String(item.actualExpenditure)) || 0,
        missionProjectCode: item.missionProjectCode,
      }))
      .sort((a, b) => a.budgetYear - b.budgetYear);
  }

  /**
   * Backward compatibility method for old signature
   * @deprecated Use getProjectActualsByCode instead
   */
  async getProjectActuals(missionProjectCode: string): Promise<ProjectActualsResponse[]> {
    return this.getProjectActualsByCode(missionProjectCode);
  }
}

export const projectActualsService = new ProjectActualsService();
