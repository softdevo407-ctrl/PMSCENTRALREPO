package com.pms.service;

import com.pms.dto.AuthResponse;
import com.pms.dto.LoginRequest;
import com.pms.dto.SignupRequest;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.repository.RoleRepository;
import com.pms.repository.UserRepository;
import com.pms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Passwords do not match")
                    .build();
        }

        // Check if employee code already exists
        if (userRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Employee code already registered")
                    .build();
        }

        try {
            // Get default role (assuming "PROJECT_DIRECTOR" is the default)
            Role role = roleRepository.findByName("PROJECT_DIRECTOR")
                    .orElseThrow(() -> new RuntimeException(
                            "Default role 'PROJECT_DIRECTOR' not found. Please contact administrator."
                    ));

            // Create new user
            User user = User.builder()
                    .employeeCode(request.getEmployeeCode())
                    .fullName(request.getFullName())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .active(true)
                    .build();

            userRepository.save(user);
            log.info("User registered successfully: {}", user.getEmployeeCode());

            // Generate token
            String token = jwtUtil.generateTokenFromEmployeeCode(user.getEmployeeCode());

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .employeeCode(user.getEmployeeCode())
                    .fullName(user.getFullName())
                    .role(user.getRole().getName())
                    .success(true)
                    .message("User registered successfully")
                    .build();
        } catch (RuntimeException ex) {
            log.error("Signup error: {}", ex.getMessage());
            return AuthResponse.builder()
                    .success(false)
                    .message(ex.getMessage())
                    .build();
        }
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmployeeCode(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByEmployeeCode(request.getEmployeeCode())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(authentication);

            log.info("User logged in successfully: {}", user.getEmployeeCode());

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .employeeCode(user.getEmployeeCode())
                    .fullName(user.getFullName())
                    .role(user.getRole().getName())
                    .success(true)
                    .message("Login successful")
                    .build();
        } catch (Exception ex) {
            log.error("Login failed: {}", ex.getMessage());
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid employee code or password")
                    .build();
        }
    }
}
