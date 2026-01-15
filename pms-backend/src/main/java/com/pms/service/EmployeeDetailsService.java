package com.pms.service;

import com.pms.dto.EmployeeDetailsRequest;
import com.pms.dto.EmployeeDetailsResponse;
import com.pms.entity.EmployeeDetails;
import com.pms.repository.EmployeeDetailsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeDetailsService {

    private final EmployeeDetailsRepository employeeDetailsRepository;

    public List<EmployeeDetailsResponse> getAllEmployeeDetails() {
        log.info("Fetching all employee details");
        return employeeDetailsRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EmployeeDetailsResponse getEmployeeDetailsByCode(String code) {
        log.info("Fetching employee details for code: {}", code);
        return employeeDetailsRepository.findById(code)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + code));
    }

    public EmployeeDetailsResponse createEmployeeDetails(EmployeeDetailsRequest request) {
        log.info("Creating employee details for code: {}", request.getEmployeeCode());
        
        EmployeeDetails employeeDetails = EmployeeDetails.builder()
                .employeeCode(request.getEmployeeCode())
                .name(request.getName())
                .presentDesignationFullName(request.getPresentDesignationFullName())
                .centre(request.getCentre())
                .userId(request.getUserId())
                .regStatus(request.getRegStatus())
                .regTime(LocalDate.now())
                .build();

        EmployeeDetails saved = employeeDetailsRepository.save(employeeDetails);
        log.info("Employee details created successfully: {}", saved.getEmployeeCode());
        return mapToResponse(saved);
    }

    public EmployeeDetailsResponse updateEmployeeDetails(String code, EmployeeDetailsRequest request) {
        log.info("Updating employee details for code: {}", code);
        
        EmployeeDetails existing = employeeDetailsRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + code));

        existing.setName(request.getName());
        existing.setPresentDesignationFullName(request.getPresentDesignationFullName());
        existing.setCentre(request.getCentre());
        existing.setUserId(request.getUserId());
        existing.setRegStatus(request.getRegStatus());

        EmployeeDetails updated = employeeDetailsRepository.save(existing);
        log.info("Employee details updated successfully: {}", updated.getEmployeeCode());
        return mapToResponse(updated);
    }

    public void deleteEmployeeDetails(String code) {
        log.info("Deleting employee details for code: {}", code);
        if (!employeeDetailsRepository.existsById(code)) {
            throw new RuntimeException("Employee not found with code: " + code);
        }
        employeeDetailsRepository.deleteById(code);
        log.info("Employee details deleted successfully: {}", code);
    }

    public List<EmployeeDetailsResponse> getEmployeeDetailsByStatus(String status) {
        log.info("Fetching employee details by status: {}", status);
        return employeeDetailsRepository.findByRegStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<EmployeeDetailsResponse> getEmployeeDetailsByCentre(String centre) {
        log.info("Fetching employee details by centre: {}", centre);
        return employeeDetailsRepository.findByCentre(centre)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deactivateEmployeeDetails(String code) {
        log.info("Deactivating employee details for code: {}", code);
        EmployeeDetails existing = employeeDetailsRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Employee not found with code: " + code));
        existing.setRegStatus("I");
        employeeDetailsRepository.save(existing);
        log.info("Employee details deactivated successfully: {}", code);
    }

    private EmployeeDetailsResponse mapToResponse(EmployeeDetails entity) {
        return EmployeeDetailsResponse.builder()
                .employeeCode(entity.getEmployeeCode())
                .name(entity.getName())
                .presentDesignationFullName(entity.getPresentDesignationFullName())
                .centre(entity.getCentre())
                .userId(entity.getUserId())
                .regStatus(entity.getRegStatus())
                .regTime(entity.getRegTime() != null ? entity.getRegTime().toString() : null)
                .build();
    }
}
