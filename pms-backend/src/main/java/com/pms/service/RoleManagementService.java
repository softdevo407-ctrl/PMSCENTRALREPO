package com.pms.service;

import com.pms.dto.RegisteredEmployeeDTO;
import com.pms.dto.AssignProgrammeRequest;
import com.pms.dto.ProgrammeDTO;
import com.pms.entity.User;
import com.pms.entity.Role;
import com.pms.repository.UserRepository;
import com.pms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Get all registered employees with their roles and programme assignments
     */
    public List<RegisteredEmployeeDTO> getAllRegisteredEmployees() {
        return userRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get all registered and approved employees
     */
    public List<RegisteredEmployeeDTO> getApprovedEmployees() {
        return userRepository.findAll().stream()
            .filter(user -> user.getActive())
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get employees by specific role
     */
    public List<RegisteredEmployeeDTO> getEmployeesByRole(String roleName) {
        Optional<Role> role = roleRepository.findByName(roleName);
        if (role.isEmpty()) {
            throw new IllegalArgumentException("Role not found: " + roleName);
        }

        return userRepository.findAll().stream()
            .filter(user -> user.getRole().getName().equalsIgnoreCase(roleName))
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get all Programme Directors
     */
    public List<RegisteredEmployeeDTO> getProgrammeDirectors() {
        return getEmployeesByRole("PROGRAMME_DIRECTOR");
    }

    /**
     * Get all Project Directors
     */
    public List<RegisteredEmployeeDTO> getProjectDirectors() {
        return getEmployeesByRole("PROJECT_DIRECTOR");
    }

    /**
     * Get employee by ID
     */
    public RegisteredEmployeeDTO getEmployeeById(Long employeeId) {
        User user = userRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));
        return convertToDTO(user);
    }

    /**
     * Get employee by employee code
     */
    public RegisteredEmployeeDTO getEmployeeByCode(String employeeCode) {
        User user = userRepository.findByEmployeeCode(employeeCode)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found with code: " + employeeCode));
        return convertToDTO(user);
    }

    /**
     * Delete an employee
     */
    public void deleteEmployee(Long employeeId) {
        User user = userRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));
        
        // Soft delete - mark as inactive
        user.setActive(false);
        userRepository.save(user);
    }

    /**
     * Assign a programme to a Programme Director
     */
    public RegisteredEmployeeDTO assignProgrammeToDirector(Long employeeId, AssignProgrammeRequest request) {
        // Validation 1: Employee exists
        User user = userRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        // Validation 2: Employee is a Programme Director
        if (!user.getRole().getName().equalsIgnoreCase("PROGRAMME_DIRECTOR")) {
            throw new IllegalArgumentException("Employee is not a Programme Director. Current role: " + user.getRole().getName());
        }

        // Validation 3: Employee is active/approved
        if (!user.getActive()) {
            throw new IllegalArgumentException("Employee is not active. Please approve the employee first.");
        }

        // Validation 4: Programme ID is provided
        if (request.getProgrammeId() == null || request.getProgrammeId() <= 0) {
            throw new IllegalArgumentException("Valid programme ID is required");
        }

        // TODO: Fetch programme from database and set it
        // For now, we store the programme ID
        // user.setProgrammeId(request.getProgrammeId());
        
        user = userRepository.save(user);
        return convertToDTO(user);
    }

    /**
     * Get all available programmes
     */
    public List<ProgrammeDTO> getAllProgrammes() {
        // TODO: Implement once Programme entity is created
        // Mock data for now
        List<ProgrammeDTO> programmes = new java.util.ArrayList<>();
        programmes.add(new ProgrammeDTO(1L, "GSLV"));
        programmes.add(new ProgrammeDTO(2L, "PSLV"));
        programmes.add(new ProgrammeDTO(3L, "Chandrayaan"));
        programmes.add(new ProgrammeDTO(4L, "Mangalyaan"));
        return programmes;
    }

    /**
     * Validate role assignment request
     */
    public void validateRoleAssignment(String roleName) {
        Optional<Role> role = roleRepository.findByName(roleName);
        if (role.isEmpty()) {
            throw new IllegalArgumentException("Invalid role: " + roleName);
        }
    }

    /**
     * Validate employee code format
     */
    public boolean validateEmployeeCode(String employeeCode) {
        if (employeeCode == null || employeeCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Employee code cannot be empty");
        }
        
        if (employeeCode.length() < 3) {
            throw new IllegalArgumentException("Employee code must be at least 3 characters");
        }
        
        if (!employeeCode.matches("^[A-Z0-9]+$")) {
            throw new IllegalArgumentException("Employee code can only contain uppercase letters and numbers");
        }
        
        return true;
    }

    /**
     * Validate employee name
     */
    public boolean validateEmployeeName(String employeeName) {
        if (employeeName == null || employeeName.trim().isEmpty()) {
            throw new IllegalArgumentException("Employee name cannot be empty");
        }
        
        if (employeeName.length() < 3) {
            throw new IllegalArgumentException("Employee name must be at least 3 characters");
        }
        
        if (!employeeName.matches("^[a-zA-Z\\s]+$")) {
            throw new IllegalArgumentException("Employee name can only contain letters and spaces");
        }
        
        return true;
    }

    /**
     * Check if employee code already exists
     */
    public boolean employeeCodeExists(String employeeCode) {
        return userRepository.existsByEmployeeCode(employeeCode);
    }

    /**
     * Convert User entity to RegisteredEmployeeDTO
     */
    private RegisteredEmployeeDTO convertToDTO(User user) {
        RegisteredEmployeeDTO dto = new RegisteredEmployeeDTO();
        dto.setId(user.getId());
        dto.setEmployeeName(user.getFullName());
        dto.setEmployeeCode(user.getEmployeeCode());
        dto.setAssignedRole(user.getRole() != null ? user.getRole().getName() : "UNKNOWN");
        dto.setApprovalStatus(user.getActive() ? "APPROVED" : "PENDING");
        dto.setSubmissionDate(user.getCreatedAt());
        // TODO: Set programme name once Programme entity is mapped
        return dto;
    }
}
