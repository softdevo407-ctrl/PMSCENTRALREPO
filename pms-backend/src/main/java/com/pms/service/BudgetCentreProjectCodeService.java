package com.pms.service;

import com.pms.dto.BudgetCentreProjectCodeRequest;
import com.pms.dto.BudgetCentreProjectCodeResponse;
import com.pms.entity.BudgetCentreProjectCode;
import com.pms.entity.BudgetCentreProjectCodeId;
import com.pms.repository.BudgetCentreProjectCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BudgetCentreProjectCodeService {
    
    private final BudgetCentreProjectCodeRepository budgetCentreProjectCodeRepository;
    
    // Get all budget centre project codes
    public List<BudgetCentreProjectCodeResponse> getAllBudgetCentreProjectCodes() {
        return budgetCentreProjectCodeRepository.findAllByOrderByCentreProjectCodeAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get only active codes
    public List<BudgetCentreProjectCodeResponse> getActiveBudgetCentreProjectCodes() {
        return budgetCentreProjectCodeRepository.findAllActive()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get only inactive codes
    public List<BudgetCentreProjectCodeResponse> getInactiveBudgetCentreProjectCodes() {
        return budgetCentreProjectCodeRepository.findAllInactive()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get by composite key (centreProjectCode + centreProject)
    public BudgetCentreProjectCodeResponse getBudgetCentreProjectCodeByKey(String centreProjectCode, String centreProject) {
        BudgetCentreProjectCode code = budgetCentreProjectCodeRepository
                .findByCentreProjectCodeAndCentreProject(centreProjectCode, centreProject)
                .orElseThrow(() -> new RuntimeException("Budget Centre Project Code not found with code: " + centreProjectCode + " and project: " + centreProject));
        return convertToResponse(code);
    }
    
    // Create new budget centre project code
    @Transactional
    public BudgetCentreProjectCodeResponse createBudgetCentreProjectCode(BudgetCentreProjectCodeRequest request) {
        // Validation
        validateBudgetCentreProjectCodeRequest(request);
        
        // Check if code already exists
        BudgetCentreProjectCodeId id = new BudgetCentreProjectCodeId(request.getCentreProjectCode(), request.getCentreProject());
        if (budgetCentreProjectCodeRepository.existsById(id)) {
            throw new RuntimeException("Budget Centre Project Code with code " + request.getCentreProjectCode() + " and project " + request.getCentreProject() + " already exists");
        }
        
        // Check if short name is unique
        if (budgetCentreProjectCodeRepository.findByBudgetCentreProjectShortName(request.getBudgetCentreProjectShortName()).isPresent()) {
            throw new RuntimeException("Budget Centre Project Code with short name " + request.getBudgetCentreProjectShortName() + " already exists");
        }
        
        BudgetCentreProjectCode code = BudgetCentreProjectCode.builder()
                .centreProjectCode(request.getCentreProjectCode())
                .centreProject(request.getCentreProject())
                .budgetCentreProjectFullName(request.getBudgetCentreProjectFullName())
                .budgetCentreProjectShortName(request.getBudgetCentreProjectShortName())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .userId(request.getUserId())
                .regStatus(request.getRegStatus())
                .regTime(LocalDate.now())
                .build();
        
        BudgetCentreProjectCode savedCode = budgetCentreProjectCodeRepository.save(code);
        log.info("Budget Centre Project Code created successfully: {}/{}", savedCode.getCentreProjectCode(), savedCode.getCentreProject());
        
        return convertToResponse(savedCode);
    }
    
    // Update budget centre project code
    @Transactional
    public BudgetCentreProjectCodeResponse updateBudgetCentreProjectCode(String centreProjectCode, String centreProject, BudgetCentreProjectCodeRequest request) {
        BudgetCentreProjectCode code = budgetCentreProjectCodeRepository
                .findByCentreProjectCodeAndCentreProject(centreProjectCode, centreProject)
                .orElseThrow(() -> new RuntimeException("Budget Centre Project Code not found with code: " + centreProjectCode + " and project: " + centreProject));
        
        // Validation
        validateBudgetCentreProjectCodeRequest(request);
        
        // Check if short name is already used by another code
        budgetCentreProjectCodeRepository.findByBudgetCentreProjectShortName(request.getBudgetCentreProjectShortName())
                .ifPresent(existing -> {
                    if (!existing.getCentreProjectCode().equals(centreProjectCode) || !existing.getCentreProject().equals(centreProject)) {
                        throw new RuntimeException("Budget Centre Project Code with short name " + request.getBudgetCentreProjectShortName() + " already exists");
                    }
                });
        
        code.setBudgetCentreProjectFullName(request.getBudgetCentreProjectFullName());
        code.setBudgetCentreProjectShortName(request.getBudgetCentreProjectShortName());
        code.setFromDate(request.getFromDate());
        code.setToDate(request.getToDate());
        code.setUserId(request.getUserId());
        code.setRegStatus(request.getRegStatus());
        
        BudgetCentreProjectCode updatedCode = budgetCentreProjectCodeRepository.save(code);
        log.info("Budget Centre Project Code updated successfully: {}/{}", updatedCode.getCentreProjectCode(), updatedCode.getCentreProject());
        
        return convertToResponse(updatedCode);
    }
    
    // Deactivate budget centre project code (set toDate)
    @Transactional
    public BudgetCentreProjectCodeResponse deactivateBudgetCentreProjectCode(String centreProjectCode, String centreProject) {
        BudgetCentreProjectCode code = budgetCentreProjectCodeRepository
                .findByCentreProjectCodeAndCentreProject(centreProjectCode, centreProject)
                .orElseThrow(() -> new RuntimeException("Budget Centre Project Code not found with code: " + centreProjectCode + " and project: " + centreProject));
        
        code.setToDate(LocalDate.now());
        BudgetCentreProjectCode deactivated = budgetCentreProjectCodeRepository.save(code);
        
        log.info("Budget Centre Project Code deactivated: {}/{}", centreProjectCode, centreProject);
        return convertToResponse(deactivated);
    }
    
    // Delete budget centre project code
    @Transactional
    public void deleteBudgetCentreProjectCode(String centreProjectCode, String centreProject) {
        BudgetCentreProjectCode code = budgetCentreProjectCodeRepository
                .findByCentreProjectCodeAndCentreProject(centreProjectCode, centreProject)
                .orElseThrow(() -> new RuntimeException("Budget Centre Project Code not found with code: " + centreProjectCode + " and project: " + centreProject));
        
        budgetCentreProjectCodeRepository.delete(code);
        log.info("Budget Centre Project Code deleted: {}/{}", centreProjectCode, centreProject);
    }
    
    // Validation method
    private void validateBudgetCentreProjectCodeRequest(BudgetCentreProjectCodeRequest request) {
        if (request.getCentreProjectCode() == null || request.getCentreProjectCode().trim().isEmpty()) {
            throw new RuntimeException("Centre Project Code is required");
        }
        
        if (request.getCentreProjectCode().length() > 2) {
            throw new RuntimeException("Centre Project Code cannot exceed 2 characters");
        }
        
        if (request.getCentreProject() == null || request.getCentreProject().trim().isEmpty()) {
            throw new RuntimeException("Centre Project is required");
        }
        
        if (request.getCentreProject().length() > 1) {
            throw new RuntimeException("Centre Project must be a single character");
        }
        
        if (request.getBudgetCentreProjectFullName() == null || request.getBudgetCentreProjectFullName().trim().isEmpty()) {
            throw new RuntimeException("Budget Centre Project Full Name is required");
        }
        
        if (request.getBudgetCentreProjectShortName() == null || request.getBudgetCentreProjectShortName().trim().isEmpty()) {
            throw new RuntimeException("Budget Centre Project Short Name is required");
        }
        
        if (request.getFromDate() == null) {
            throw new RuntimeException("From Date is required");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date cannot be before From Date");
        }
        
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new RuntimeException("User ID is required");
        }
        
        if (request.getRegStatus() == null || request.getRegStatus().trim().isEmpty()) {
            throw new RuntimeException("Registration Status is required");
        }
        
        if (!request.getRegStatus().matches("[A-Za-z]")) {
            throw new RuntimeException("Registration Status must be a single character");
        }
    }
    
    private BudgetCentreProjectCodeResponse convertToResponse(BudgetCentreProjectCode code) {
        return BudgetCentreProjectCodeResponse.builder()
                .centreProjectCode(code.getCentreProjectCode())
                .centreProject(code.getCentreProject())
                .budgetCentreProjectFullName(code.getBudgetCentreProjectFullName())
                .budgetCentreProjectShortName(code.getBudgetCentreProjectShortName())
                .fromDate(code.getFromDate())
                .toDate(code.getToDate())
                .userId(code.getUserId())
                .regStatus(code.getRegStatus())
                .active(code.isActive())
                .build();
    }
}
