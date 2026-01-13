package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.PendingRoleRequestDTO;
import com.pms.dto.RegisteredEmployeeDTO;
import com.pms.dto.ApproveRoleRequest;
import com.pms.dto.RejectRoleRequest;
import com.pms.dto.ProgrammeDTO;
import com.pms.service.RoleApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/role-management")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RoleApprovalController {

    @Autowired
    private RoleApprovalService roleApprovalService;

    /**
     * Get all pending role requests
     * GET /api/admin/role-management/pending-requests
     */
    @GetMapping("/pending-requests")
    public ResponseEntity<ApiResponse> getPendingRoleRequests() {
        try {
            List<PendingRoleRequestDTO> pendingRequests = roleApprovalService.getPendingRoleRequests();
            return ResponseEntity.ok(new ApiResponse(true, "Pending role requests retrieved successfully", pendingRequests));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving pending requests: " + e.getMessage(), null));
        }
    }

    /**
     * Get all approved employees
     * GET /api/admin/role-management/approved-employees
     */
    @GetMapping("/approved-employees")
    public ResponseEntity<ApiResponse> getApprovedEmployees() {
        try {
            List<RegisteredEmployeeDTO> approvedEmployees = roleApprovalService.getApprovedEmployees();
            return ResponseEntity.ok(new ApiResponse(true, "Approved employees retrieved successfully", approvedEmployees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving approved employees: " + e.getMessage(), null));
        }
    }

    /**
     * Approve a pending role request
     * POST /api/admin/role-management/pending-requests/{userId}/approve
     */
    @PostMapping("/pending-requests/{userId}/approve")
    public ResponseEntity<ApiResponse> approvePendingRequest(
            @PathVariable Long userId,
            @RequestBody ApproveRoleRequest request) {
        try {
            // Validation 1: User ID must be positive
            if (userId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid user ID", null));
            }

            // Validation 2: Request body should not be null (but can have null programmeId for non-PD)
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Request body is required", null));
            }

            PendingRoleRequestDTO approvedRequest = roleApprovalService.approvePendingRequest(userId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Role request approved successfully", approvedRequest));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error approving request: " + e.getMessage(), null));
        }
    }

    /**
     * Reject a pending role request
     * POST /api/admin/role-management/pending-requests/{userId}/reject
     */
    @PostMapping("/pending-requests/{userId}/reject")
    public ResponseEntity<ApiResponse> rejectPendingRequest(
            @PathVariable Long userId,
            @RequestBody RejectRoleRequest request) {
        try {
            // Validation 1: User ID must be positive
            if (userId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid user ID", null));
            }

            // Validation 2: Request body should not be null
            if (request == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Request body is required", null));
            }

            // Validation 3: Rejection reason must be provided
            if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Rejection reason is required", null));
            }

            // Validation 4: Rejection reason must have minimum length
            if (request.getRejectionReason().trim().length() < 5) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Rejection reason must be at least 5 characters", null));
            }

            roleApprovalService.rejectPendingRequest(userId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Role request rejected successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error rejecting request: " + e.getMessage(), null));
        }
    }

    /**
     * Get all available programmes
     * GET /api/admin/role-management/programmes
     */
    @GetMapping("/programmes")
    public ResponseEntity<ApiResponse> getAllProgrammes() {
        try {
            List<ProgrammeDTO> programmes = roleApprovalService.getAllProgrammes();
            return ResponseEntity.ok(new ApiResponse(true, "Programmes retrieved successfully", programmes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving programmes: " + e.getMessage(), null));
        }
    }

    /**
     * Get programme details by ID
     * GET /api/admin/role-management/programmes/{programmeId}
     */
    @GetMapping("/programmes/{programmeId}")
    public ResponseEntity<ApiResponse> getProgrammeDetails(@PathVariable Long programmeId) {
        try {
            // Validation: Programme ID must be positive
            if (programmeId <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid programme ID", null));
            }

            // For now, returning mock programme details
            // TODO: Once Programme entity is created, fetch from database
            Map<String, Object> programmeDetails = getProgrammeDetailsMap(programmeId);
            
            if (programmeDetails == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Programme not found", null));
            }

            return ResponseEntity.ok(new ApiResponse(true, "Programme details retrieved successfully", programmeDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error retrieving programme details: " + e.getMessage(), null));
        }
    }

    /**
     * Mock method to return programme details
     * TODO: Replace with database query once Programme entity is created
     */
    private Map<String, Object> getProgrammeDetailsMap(Long programmeId) {
        Map<String, Object> details = new HashMap<>();
        
        // Mock programme data
        String[] programmeNames = {
            "GSLV", "PSLV", "SSLV", "GAGANYAAN", 
            "COMMUNICATION SATELLITES", "EARTH OBSERVATION SATELLITES",
            "SCIENCE MISSIONS", "NAVIGATION SATELLITES",
            "SPACE EXPLORATION MISSIONS", "TECHNOLOGY DEMONSTRATION MISSIONS",
            "USER FUNDED SATTELITES"
        };

        if (programmeId > 0 && programmeId <= programmeNames.length) {
            details.put("id", programmeId);
            details.put("programmeName", programmeNames[Math.toIntExact(programmeId - 1)]);
            details.put("description", "Programme for " + programmeNames[Math.toIntExact(programmeId - 1)] + " projects");
            details.put("budget", 1000000000L); // Mock budget
            details.put("status", "ACTIVE");
            details.put("totalProjects", Math.random() * 10);
            details.put("activeProjects", Math.random() * 5);
            return details;
        }
        
        return null;
    }
}
