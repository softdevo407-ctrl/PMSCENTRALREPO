import { authService } from './authService';

export interface ProgrammeType {
  programmeTypeCode: string;
  projectCategoryCode: string;
  programmeTypeFullName: string;
  programmeTypeShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
  active: boolean;
}

export interface ProgrammeTypeRequest {
  programmeTypeCode: string;
  projectCategoryCode: string;
  programmeTypeFullName: string;
  programmeTypeShortName: string;
  hierarchyOrder: number;
  fromDate: string;
  toDate: string | null;
  userId: string;
  regStatus: string;
}

const BASE_URL = 'http://localhost:7080/api';

export class ProgrammeTypeService {
  static async getAllProgrammeTypes(): Promise<ProgrammeType[]> {
    try {
      const response = await fetch(`${BASE_URL}/programme-types`);
      if (!response.ok) throw new Error('Failed to fetch programme types');
      return await response.json();
    } catch (error) {
      console.error('Error fetching programme types:', error);
      throw error;
    }
  }

  static async getProgrammeTypeByCode(code: string): Promise<ProgrammeType> {
    try {
      const response = await fetch(`${BASE_URL}/programme-types/${code}`);
      if (!response.ok) throw new Error('Failed to fetch programme type');
      return await response.json();
    } catch (error) {
      console.error('Error fetching programme type:', error);
      throw error;
    }
  }

  static async createProgrammeType(data: ProgrammeTypeRequest): Promise<ProgrammeType> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/programme-types`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create programme type');
      return await response.json();
    } catch (error) {
      console.error('Error creating programme type:', error);
      throw error;
    }
  }

  static async updateProgrammeType(code: string, data: ProgrammeTypeRequest): Promise<ProgrammeType> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/programme-types/${code}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update programme type');
      return await response.json();
    } catch (error) {
      console.error('Error updating programme type:', error);
      throw error;
    }
  }

  static async deleteProgrammeType(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/programme-types/${code}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete programme type');
    } catch (error) {
      console.error('Error deleting programme type:', error);
      throw error;
    }
  }

  static async deactivateProgrammeType(code: string): Promise<void> {
    try {
      const headers: HeadersInit = {
        ...authService.getAuthHeader(),
      };

      const response = await fetch(`${BASE_URL}/programme-types/${code}/deactivate`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) throw new Error('Failed to deactivate programme type');
    } catch (error) {
      console.error('Error deactivating programme type:', error);
      throw error;
    }
  }
}
