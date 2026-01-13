package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.UserDTO;
import com.pms.entity.User;
import com.pms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> getCurrentUser(Authentication authentication) {
        String employeeCode = authentication.getName();
        User user = userRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHAIRMAN')")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", user));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", userRepository.findAll()));
    }

    @GetMapping("/by-role/{roleName}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> getUsersByRole(@PathVariable String roleName) {
        List<User> users = userRepository.findByRole_Name(roleName);
        
        // Map to response DTO to avoid sending sensitive data like passwords
        List<UserDTO> userDTOs = users.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .employeeCode(user.getEmployeeCode())
                        .role(user.getRole().getName())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", userDTOs));
    }
}
