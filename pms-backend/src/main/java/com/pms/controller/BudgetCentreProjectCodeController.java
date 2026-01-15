package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.BudgetCentreProjectCodeRequest;
import com.pms.dto.BudgetCentreProjectCodeResponse;
import com.pms.service.BudgetCentreProjectCodeService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budget-centre-project-codes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class BudgetCentreProjectCodeController {
    
    private final BudgetCentreProjectCodeService budgetCentreProjectCodeService;
    
    @GetMapping
    @PermitAll
    public ResponseEntity<List<BudgetCentreProjectCodeResponse>> getAllBudgetCentreProjectCodes() {
        log.info("Fetching all budget centre project codes");
        List<BudgetCentreProjectCodeResponse> codes = budgetCentreProjectCodeService.getAllBudgetCentreProjectCodes();
        return ResponseEntity.ok(codes);
    }
    
    @GetMapping("/active")
    @PermitAll
    public ResponseEntity<List<BudgetCentreProjectCodeResponse>> getActiveBudgetCentreProjectCodes() {
        log.info("Fetching active budget centre project codes");
        List<BudgetCentreProjectCodeResponse> codes = budgetCentreProjectCodeService.getActiveBudgetCentreProjectCodes();
        return ResponseEntity.ok(codes);
    }
    
    @GetMapping("/inactive")
    @PermitAll
    public ResponseEntity<List<BudgetCentreProjectCodeResponse>> getInactiveBudgetCentreProjectCodes() {
        log.info("Fetching inactive budget centre project codes");
        List<BudgetCentreProjectCodeResponse> codes = budgetCentreProjectCodeService.getInactiveBudgetCentreProjectCodes();
        return ResponseEntity.ok(codes);
    }
    
    @GetMapping("/{centreProjectCode}/{centreProject}")
    @PermitAll
    public ResponseEntity<BudgetCentreProjectCodeResponse> getBudgetCentreProjectCodeByKey(
            @PathVariable String centreProjectCode,
            @PathVariable String centreProject) {
        log.info("Fetching budget centre project code: {}/{}", centreProjectCode, centreProject);
        BudgetCentreProjectCodeResponse code = budgetCentreProjectCodeService.getBudgetCentreProjectCodeByKey(centreProjectCode, centreProject);
        return ResponseEntity.ok(code);
    }
    
    @PostMapping
    @PermitAll
    public ResponseEntity<BudgetCentreProjectCodeResponse> createBudgetCentreProjectCode(
            @RequestBody BudgetCentreProjectCodeRequest request) {
        log.info("Creating new budget centre project code: {}/{}", request.getCentreProjectCode(), request.getCentreProject());
        try {
            BudgetCentreProjectCodeResponse code = budgetCentreProjectCodeService.createBudgetCentreProjectCode(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(code);
        } catch (RuntimeException e) {
            log.error("Error creating budget centre project code", e);
            throw e;
        }
    }
    
    @PutMapping("/{centreProjectCode}/{centreProject}")
    @PermitAll
    public ResponseEntity<BudgetCentreProjectCodeResponse> updateBudgetCentreProjectCode(
            @PathVariable String centreProjectCode,
            @PathVariable String centreProject,
            @RequestBody BudgetCentreProjectCodeRequest request) {
        log.info("Updating budget centre project code: {}/{}", centreProjectCode, centreProject);
        try {
            BudgetCentreProjectCodeResponse code = budgetCentreProjectCodeService.updateBudgetCentreProjectCode(centreProjectCode, centreProject, request);
            return ResponseEntity.ok(code);
        } catch (RuntimeException e) {
            log.error("Error updating budget centre project code", e);
            throw e;
        }
    }
    
    @PutMapping("/{centreProjectCode}/{centreProject}/deactivate")
    @PermitAll
    public ResponseEntity<BudgetCentreProjectCodeResponse> deactivateBudgetCentreProjectCode(
            @PathVariable String centreProjectCode,
            @PathVariable String centreProject) {
        log.info("Deactivating budget centre project code: {}/{}", centreProjectCode, centreProject);
        try {
            BudgetCentreProjectCodeResponse code = budgetCentreProjectCodeService.deactivateBudgetCentreProjectCode(centreProjectCode, centreProject);
            return ResponseEntity.ok(code);
        } catch (RuntimeException e) {
            log.error("Error deactivating budget centre project code", e);
            throw e;
        }
    }
    
    @DeleteMapping("/{centreProjectCode}/{centreProject}")
    @PermitAll
    public ResponseEntity<ApiResponse> deleteBudgetCentreProjectCode(
            @PathVariable String centreProjectCode,
            @PathVariable String centreProject) {
        log.info("Deleting budget centre project code: {}/{}", centreProjectCode, centreProject);
        try {
            budgetCentreProjectCodeService.deleteBudgetCentreProjectCode(centreProjectCode, centreProject);
            return ResponseEntity.ok(new ApiResponse(true, "Budget Centre Project Code deleted successfully"));
        } catch (RuntimeException e) {
            log.error("Error deleting budget centre project code", e);
            throw e;
        }
    }
}
