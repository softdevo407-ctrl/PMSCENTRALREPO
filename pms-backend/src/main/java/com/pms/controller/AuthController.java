package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.AuthResponse;
import com.pms.dto.CASLoginRequest;
import com.pms.dto.LoginRequest;
import com.pms.dto.SignupRequest;
import com.pms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request for employee code: {}", request.getEmployeeCode());
        AuthResponse response = authService.signup(request);
        return response.getSuccess()
                ? ResponseEntity.status(HttpStatus.CREATED).body(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for employee code: {}", request.getEmployeeCode());
        AuthResponse response = authService.login(request);
        return response.getSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/login-cas")
    public ResponseEntity<AuthResponse> loginWithCAS(@Valid @RequestBody CASLoginRequest request) {
        log.info("CAS Login request for employee code: {}", request.getEmployeeCode());
        AuthResponse response = authService.loginWithCAS(request.getEmployeeCode());
        return response.getSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> health() {
        return ResponseEntity.ok(new ApiResponse(true, "Backend is running"));
    }
}
