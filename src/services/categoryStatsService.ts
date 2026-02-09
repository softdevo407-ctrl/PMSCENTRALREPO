import { authService } from './authService';

const API_BASE_URL = 'http://localhost:7080/api';

export interface CategoryStats {
  projectCategoryCode: string;
  projectCategoryFullName: string;
  projectCategoryShortName: string;
  projectCount: number;
  onTrackCount: number;
  delayedCount: number;
  totalSanctionedCost: number;
  totalCumulativeExpenditure: number;
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
      const url = `${API_BASE_URL}/project-details/category-stats`;
      console.log('🔍 Fetching global category stats from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`❌ HTTP ${response.status}: Failed to fetch global category stats`);
        return [];
      }

      const data = await response.json();
      console.log('✅ Raw response from backend (global):', data);
      
      // Handle both direct array response and wrapped response
      let categories: CategoryStats[] = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
      } else {
        console.warn('⚠️ Unexpected response format. Expected array or {categories: array}');
        return [];
      }
      
      console.log('✅ Processed global categories:', categories);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching global category stats:', error);
      return [];
    }
  }

  async getCategoryStatsByDirector(employeeCode: string): Promise<CategoryStats[]> {
    try {
      const url = `${API_BASE_URL}/project-details/category-stats-by-director/${employeeCode}`;
      console.log('🔍 Fetching director category stats from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.warn(`❌ HTTP ${response.status}: Failed to fetch category stats for director ${employeeCode}`);
        return [];
      }

      const data = await response.json();
      console.log('✅ Raw response from backend for director:', data);
      
      // Handle both direct array response and wrapped response
      let categories: CategoryStats[] = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
      } else {
        console.warn('⚠️ Unexpected response format. Expected array or {categories: array}');
        return [];
      }
      
      console.log('✅ Processed director categories:', categories);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching category stats for director:', error);
      return [];
    }
  }
}

export const categoryStatsService = new CategoryStatsService();
