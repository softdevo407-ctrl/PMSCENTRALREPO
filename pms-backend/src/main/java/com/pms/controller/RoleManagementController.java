package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.RegisteredEmployeeDTO;
import com.pms.dto.AssignProgrammeRequest;
import com.pms.dto.ProgrammeDTO;
import com.pms.service.RoleManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/role-management")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoleManagementController {

    @Autowired
    private RoleManagementService roleManagementService;

    /**
     * Get all registered employees with their roles and programme assignments
     * GET /api/admin/role-management/employees
     */
    @GetMapping("/employees")
    public ResponseEntity<ApiResponse> getAllEmployees() {
        try {
            List<RegisteredEmployeeDTO> employees = roleManagementService.getAllRegisteredEmployees();
            return ResponseEntity.ok(new ApiResponse(true, "Employees retrieved successfully", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage(), null));
        }
    }

    /**
     * Get all approved/active employees
     * GET /api/admin/role-management/employees/approved
     */
    @GetMapping("/employees/approved")
    public ResponseEntity<ApiResponse> getApprovedEmployees() {
        try {
            List<RegisteredEmployeeDTO> employees = roleManagementService.getApprovedEmployees();
            return ResponseEntity.ok(new ApiResponse(true, "Approved employees retrieved successfully", employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving approved employees: " + e.getMessage(), null));
        }
    }

    /**
     * Get employees by specific role
     * GET /api/admin/role-management/employees/role/{roleName}
     */
    @GetMapping("/employees/role/{roleName}")
    public ResponseEntity<ApiResponse> getEmployeesByRole(@PathVariable String roleName) {
        try {
            // Validation: Role name cannot be empty
            if (roleName == null || roleName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Role name is required", null));
            }

            List<RegisteredEmployeeDTO> employees = roleManagementService.getEmployeesByRole(roleName);
            return ResponseEntity.ok(new ApiResponse(true, "Employees by role retrieved successfully", employees));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving employees: " + e.getMessage(), null));
        }
    }

    /**
     * Get all Programme Directors
     * GET /api/admin/role-management/programme-directors
     */
    @GetMapping("/programme-directors")
    public ResponseEntity<ApiResponse> getProgrammeDirectors() {
        try {
            List<RegisteredEmployeeDTO> directors = roleManagementService.getProgrammeDirectors();
            return ResponseEntity.ok(new ApiResponse(true, "Programme Directors retrieved successfully", directors));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving Programme Directors: " + e.getMessage(), null));
        }
    }

    /**
     * Get all Project Directors
     * GET /api/admin/role-management/project-directors
     */
    @GetMapping("/project-directors")
    public ResponseEntity<ApiResponse> getProjectDirectors() {
        try {
            List<RegisteredEmployeeDTO> directors = roleManagementService.getProjectDirectors();
            return ResponseEntity.ok(new ApiResponse(true, "Project Directors retrieved successfully", directors));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving Project Directors: " + e.getMessage(), null));
        }
    }

    /**
     * Get employee by ID
     * GET /api/admin/role-management/employees/{employeeId}
     */
    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse> getEmployeeById(@PathVariable Long employeeId) {
        try {
            // Validation: Employee ID must be positive
            if (employeeId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid employee ID", null));
            }

            RegisteredEmployeeDTO employee = roleManagementService.getEmployeeById(employeeId);
            return ResponseEntity.ok(new ApiResponse(true, "Employee retrieved successfully", employee));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving employee: " + e.getMessage(), null));
        }
    }

    /**
     * Get employee by employee code
     * GET /api/admin/role-management/employees/code/{employeeCode}
     */
    @GetMapping("/employees/code/{employeeCode}")
    public ResponseEntity<ApiResponse> getEmployeeByCode(@PathVariable String employeeCode) {
        try {
            // Validation: Employee code cannot be empty
            if (employeeCode == null || employeeCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Employee code is required", null));
            }

            RegisteredEmployeeDTO employee = roleManagementService.getEmployeeByCode(employeeCode);
            return ResponseEntity.ok(new ApiResponse(true, "Employee retrieved successfully", employee));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving employee: " + e.getMessage(), null));
        }
    }

    /**
     * Assign a programme to a Programme Director
     * PUT /api/admin/role-management/employees/{employeeId}/assign-programme
     */
    @PutMapping("/employees/{employeeId}/assign-programme")
    public ResponseEntity<ApiResponse> assignProgrammeToDirector(
            @PathVariable Long employeeId,
            @RequestBody AssignProgrammeRequest request) {
        try {
            // Validation: Employee ID must be positive
            if (employeeId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid employee ID", null));
            }

            // Validation: Request body cannot be null
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Programme assignment request is required", null));
            }

            // Validation: Programme ID must be provided
            if (request.getProgrammeId() == null || request.getProgrammeId() <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Valid programme ID is required", null));
            }

            RegisteredEmployeeDTO employee = roleManagementService.assignProgrammeToDirector(employeeId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Programme assigned successfully", employee));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error assigning programme: " + e.getMessage(), null));
        }
    }

    /**
     * Delete an employee (soft delete)
     * DELETE /api/admin/role-management/employees/{employeeId}
     */
    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable Long employeeId) {
        try {
            // Validation: Employee ID must be positive
            if (employeeId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid employee ID", null));
            }

            roleManagementService.deleteEmployee(employeeId);
            return ResponseEntity.ok(new ApiResponse(true, "Employee deleted successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error deleting employee: " + e.getMessage(), null));
        }
    }

    /**
     * Validate employee code format
     * POST /api/admin/role-management/validate/employee-code
     */
    @PostMapping("/validate/employee-code")
    public ResponseEntity<ApiResponse> validateEmployeeCode(@RequestParam String employeeCode) {
        try {
            // Validation: Employee code cannot be empty
            if (employeeCode == null || employeeCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Employee code is required", false));
            }

            boolean isValid = roleManagementService.validateEmployeeCode(employeeCode);
            return ResponseEntity.ok(new ApiResponse(true, "Employee code is valid", isValid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error validating employee code: " + e.getMessage(), false));
        }
    }

    /**
     * Validate employee name format
     * POST /api/admin/role-management/validate/employee-name
     */
    @PostMapping("/validate/employee-name")
    public ResponseEntity<ApiResponse> validateEmployeeName(@RequestParam String employeeName) {
        try {
            // Validation: Employee name cannot be empty
            if (employeeName == null || employeeName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Employee name is required", false));
            }

            boolean isValid = roleManagementService.validateEmployeeName(employeeName);
            return ResponseEntity.ok(new ApiResponse(true, "Employee name is valid", isValid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error validating employee name: " + e.getMessage(), false));
        }
    }

    /**
     * Check if employee code already exists
     * GET /api/admin/role-management/check-employee-code
     */
    @GetMapping("/check-employee-code")
    public ResponseEntity<ApiResponse> checkEmployeeCodeExists(@RequestParam String employeeCode) {
        try {
            // Validation: Employee code cannot be empty
            if (employeeCode == null || employeeCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Employee code is required", false));
            }

            boolean exists = roleManagementService.employeeCodeExists(employeeCode);
            return ResponseEntity.ok(new ApiResponse(true, 
                exists ? "Employee code already exists" : "Employee code is available", exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error checking employee code: " + e.getMessage(), false));
        }
    }
}
