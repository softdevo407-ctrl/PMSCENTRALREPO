const API_BASE_URL = "http://localhost:7080/api";

export interface EmployeeDetailsRequest {
  employeeCode: string;
  name: string;
  presentDesignationFullName: string;
  centre: string;
  userId: string;
  regStatus: string;
  regTime?: string;
}

export interface EmployeeDetailsResponse {
  employeeCode: string;
  name: string;
  presentDesignationFullName: string;
  centre: string;
  userId: string;
  regStatus: string;
  regTime?: string;
}

class EmployeeDetailsService {
  async getAllEmployeeDetails(): Promise<EmployeeDetailsResponse[]> {
    const response = await fetch(`${API_BASE_URL}/employee-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to fetch employee details:", error);
      throw new Error("Failed to fetch employee details");
    }

    return await response.json();
  }

  async getEmployeeDetailsByCode(code: string): Promise<EmployeeDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/employee-details/${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employee details");
    }

    return await response.json();
  }

  async createEmployeeDetails(request: EmployeeDetailsRequest): Promise<EmployeeDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/employee-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to create employee details:", error);
      throw new Error("Failed to create employee details");
    }

    return await response.json();
  }

  async updateEmployeeDetails(
    code: string,
    request: EmployeeDetailsRequest
  ): Promise<EmployeeDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/employee-details/${code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to update employee details:", error);
      throw new Error("Failed to update employee details");
    }

    return await response.json();
  }

  async deleteEmployeeDetails(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employee-details/${code}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to delete employee details:", error);
      throw new Error("Failed to delete employee details");
    }
  }

  async getEmployeeDetailsByStatus(status: string): Promise<EmployeeDetailsResponse[]> {
    const response = await fetch(`${API_BASE_URL}/employee-details/by-status/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employee details by status");
    }

    return await response.json();
  }

  async getEmployeeDetailsByCentre(centre: string): Promise<EmployeeDetailsResponse[]> {
    const response = await fetch(`${API_BASE_URL}/employee-details/by-centre/${centre}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employee details by centre");
    }

    return await response.json();
  }

  async deactivateEmployeeDetails(code: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employee-details/${code}/deactivate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to deactivate employee details:", error);
      throw new Error("Failed to deactivate employee details");
    }
  }
}

export const employeeDetailsService = new EmployeeDetailsService();
