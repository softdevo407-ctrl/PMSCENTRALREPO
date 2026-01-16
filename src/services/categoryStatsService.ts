import { authService } from './authService';

const API_BASE_URL = 'http://localhost:7080/api';

export interface CategoryStats {
  projectCategoryCode: string;
  projectCategoryFullName: string;
  projectCategoryShortName: string;
  projectCount: number;
}

export interface CategoryStatsResponse {
  categories: CategoryStats[];
  totalProjects: number;
}

class CategoryStatsService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeader();
    
    return {
      'Content-Type': 'application/json',
      ...authHeaders
    };
  }

  async getCategoryStats(): Promise<CategoryStats[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/project-details/category-stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch category stats, returning empty array`);
        return [];
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching category stats:', error);
      // Return empty array instead of throwing - allows UI to handle gracefully
      return [];
    }
  }

  async getCategoryStatsByDirector(employeeCode: string): Promise<CategoryStats[]> {
    try {
      const url = `${API_BASE_URL}/project-details/category-stats-by-director/${employeeCode}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`HTTP ${response.status}: Failed to fetch category stats for director`);
        return [];
      }

      const data = await response.json();
      console.log('Raw response from backend:', data);
      const result = data.categories || [];
      console.log('Processed categories:', result);
      return result;
    } catch (error) {
      console.error('Error fetching category stats for director:', error);
      return [];
    }
  }
}

export const categoryStatsService = new CategoryStatsService();
