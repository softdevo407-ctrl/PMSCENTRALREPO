package com.pms.service;

import com.pms.dto.PendingRoleRequestDTO;
import com.pms.dto.RegisteredEmployeeDTO;
import com.pms.dto.ApproveRoleRequest;
import com.pms.dto.RejectRoleRequest;
import com.pms.dto.ProgrammeDTO;
import com.pms.entity.User;
import com.pms.entity.Role;
import com.pms.repository.UserRepository;
import com.pms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleApprovalService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Get all pending role requests from users who have registered but not yet approved
     */
    public List<PendingRoleRequestDTO> getPendingRoleRequests() {
        return userRepository.findAll().stream()
            .filter(user -> !user.getActive())
            .map(this::convertToPendingDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get all approved employees
     */
    public List<RegisteredEmployeeDTO> getApprovedEmployees() {
        return userRepository.findAll().stream()
            .filter(User::getActive)
            .map(this::convertToApprovedDTO)
            .collect(Collectors.toList());
    }

    /**
     * Approve a pending role request
     * If Programme Director, programme assignment is required
     */
    public PendingRoleRequestDTO approvePendingRequest(Long userId, ApproveRoleRequest request) {
        // Validation 1: User exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Validation 2: User must be in pending state (not active)
        if (user.getActive()) {
            throw new IllegalArgumentException("User is already approved");
        }

        // Validation 3: If Programme Director, programme must be assigned
        if (user.getRole().getName().equalsIgnoreCase("PROGRAMME_DIRECTOR")) {
            if (request == null || request.getProgrammeId() == null || request.getProgrammeId() <= 0) {
                throw new IllegalArgumentException("Programme ID is required for Programme Director role");
            }
            // TODO: Validate programme exists and assign it
            // programme = programmeRepository.findById(request.getProgrammeId())
            //     .orElseThrow(() -> new IllegalArgumentException("Programme not found"));
            // user.setProgramme(programme);
        }

        // Approve the user
        user.setActive(true);
        user = userRepository.save(user);

        return convertToPendingDTO(user);
    }

    /**
     * Reject a pending role request
     */
    public void rejectPendingRequest(Long userId, RejectRoleRequest request) {
        // Validation 1: User exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Validation 2: User must be in pending state
        if (user.getActive()) {
            throw new IllegalArgumentException("User is already approved and cannot be rejected");
        }

        // Validation 3: Rejection reason must be provided
        if (request == null || request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

        // Mark user as inactive and store rejection reason
        user.setActive(false);
        // TODO: Add rejectionReason field to User entity
        // user.setRejectionReason(request.getRejectionReason());
        
        userRepository.save(user);
    }

    /**
     * Get all available programmes
     */
    public List<ProgrammeDTO> getAllProgrammes() {
        // Mock data for now
        List<ProgrammeDTO> programmes = new java.util.ArrayList<>();
        programmes.add(new ProgrammeDTO(1L, "GSLV"));
        programmes.add(new ProgrammeDTO(2L, "PSLV"));
        programmes.add(new ProgrammeDTO(3L, "Chandrayaan"));
        programmes.add(new ProgrammeDTO(4L, "Mangalyaan"));
        programmes.add(new ProgrammeDTO(5L, "Aditya"));
        programmes.add(new ProgrammeDTO(6L, "Artemis"));
        return programmes;
    }

    /**
     * Convert User to PendingRoleRequestDTO
     */
    private PendingRoleRequestDTO convertToPendingDTO(User user) {
        return new PendingRoleRequestDTO(
            user.getId(),
            user.getFullName(),
            user.getEmployeeCode(),
            user.getRole() != null ? user.getRole().getName() : "UNKNOWN",
            user.getCreatedAt(),
            user.getActive() ? "APPROVED" : "PENDING"
        );
    }

    /**
     * Convert User to RegisteredEmployeeDTO for approved employees
     */
    private RegisteredEmployeeDTO convertToApprovedDTO(User user) {
        RegisteredEmployeeDTO dto = new RegisteredEmployeeDTO();
        dto.setId(user.getId());
        dto.setEmployeeName(user.getFullName());
        dto.setEmployeeCode(user.getEmployeeCode());
        dto.setAssignedRole(user.getRole() != null ? user.getRole().getName() : "UNKNOWN");
        dto.setApprovalStatus("APPROVED");
        dto.setSubmissionDate(user.getCreatedAt());
        // TODO: Set programme name once Programme entity is mapped
        return dto;
    }
}
