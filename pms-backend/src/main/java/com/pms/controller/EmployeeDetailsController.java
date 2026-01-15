package com.pms.controller;

import com.pms.dto.EmployeeDetailsRequest;
import com.pms.dto.EmployeeDetailsResponse;
import com.pms.service.EmployeeDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee-details")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class EmployeeDetailsController {

    private final EmployeeDetailsService employeeDetailsService;

    @GetMapping
    public ResponseEntity<List<EmployeeDetailsResponse>> getAllEmployeeDetails() {
        log.info("Fetching all employee details");
        List<EmployeeDetailsResponse> employees = employeeDetailsService.getAllEmployeeDetails();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{code}")
    public ResponseEntity<EmployeeDetailsResponse> getEmployeeDetailsByCode(@PathVariable String code) {
        log.info("Fetching employee details for code: {}", code);
        EmployeeDetailsResponse employee = employeeDetailsService.getEmployeeDetailsByCode(code);
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<EmployeeDetailsResponse> createEmployeeDetails(
            @Valid @RequestBody EmployeeDetailsRequest request) {
        log.info("Creating employee details for code: {}", request.getEmployeeCode());
        EmployeeDetailsResponse response = employeeDetailsService.createEmployeeDetails(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{code}")
    public ResponseEntity<EmployeeDetailsResponse> updateEmployeeDetails(
            @PathVariable String code,
            @Valid @RequestBody EmployeeDetailsRequest request) {
        log.info("Updating employee details for code: {}", code);
        EmployeeDetailsResponse response = employeeDetailsService.updateEmployeeDetails(code, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteEmployeeDetails(@PathVariable String code) {
        log.info("Deleting employee details for code: {}", code);
        employeeDetailsService.deleteEmployeeDetails(code);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<EmployeeDetailsResponse>> getEmployeeDetailsByStatus(@PathVariable String status) {
        log.info("Fetching employee details by status: {}", status);
        List<EmployeeDetailsResponse> employees = employeeDetailsService.getEmployeeDetailsByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/by-centre/{centre}")
    public ResponseEntity<List<EmployeeDetailsResponse>> getEmployeeDetailsByCentre(@PathVariable String centre) {
        log.info("Fetching employee details by centre: {}", centre);
        List<EmployeeDetailsResponse> employees = employeeDetailsService.getEmployeeDetailsByCentre(centre);
        return ResponseEntity.ok(employees);
    }

    @PatchMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateEmployeeDetails(@PathVariable String code) {
        log.info("Deactivating employee details for code: {}", code);
        employeeDetailsService.deactivateEmployeeDetails(code);
        return ResponseEntity.noContent().build();
    }
}
