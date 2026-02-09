package com.pms.controller;

import com.pms.dto.ProjectActualsRequest;
import com.pms.dto.ProjectActualsResponse;
import com.pms.service.ProjectActualsService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/project-actuals")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"}, 
             allowCredentials = "true", 
             allowedHeaders = "*",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ProjectActualsController {
    
    private static final Logger log = LoggerFactory.getLogger(ProjectActualsController.class);
    
    @Autowired
    private ProjectActualsService projectActualsService;
    
    /**
     * Get all project actuals
     */
    @GetMapping
    @PermitAll
    public ResponseEntity<List<ProjectActualsResponse>> getAllProjectActuals() {
        log.info("Fetching all project actuals");
        try {
            List<ProjectActualsResponse> actuals = projectActualsService.getAllProjectActuals();
            log.info("Successfully fetched {} project actuals records", actuals.size());
            return ResponseEntity.ok(actuals);
        } catch (Exception e) {
            log.error("Error fetching all project actuals", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get project actuals by project code
     */
    @GetMapping("/{missionProjectCode}")
    @PermitAll
    public ResponseEntity<?> getProjectActualsByCode(@PathVariable String missionProjectCode) {
        log.info("Fetching project actuals for code: {}", missionProjectCode);
        try {
            List<ProjectActualsResponse> actuals = projectActualsService.getProjectActualsByCode(missionProjectCode);
            if (actuals.isEmpty()) {
                log.warn("No project actuals found for code: {}", missionProjectCode);
                return ResponseEntity.ok(actuals);
            }
            log.info("Successfully fetched {} records for project: {}", actuals.size(), missionProjectCode);
            return ResponseEntity.ok(actuals);
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Error fetching project actuals for code: {}", missionProjectCode, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get all distinct project codes with actuals
     */
    @GetMapping("/codes/distinct")
    @PermitAll
    public ResponseEntity<List<String>> getDistinctProjectCodes() {
        log.info("Fetching distinct project codes");
        try {
            List<String> codes = projectActualsService.getDistinctProjectCodes();
            log.info("Successfully fetched {} distinct project codes", codes.size());
            return ResponseEntity.ok(codes);
        } catch (Exception e) {
            log.error("Error fetching distinct project codes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get project actuals by year range
     */
    @GetMapping("/range")
    @PermitAll
    public ResponseEntity<?> getProjectActualsByYearRange(
            @RequestParam Integer startYear,
            @RequestParam Integer endYear) {
        log.info("Fetching project actuals for year range: {} to {}", startYear, endYear);
        try {
            List<ProjectActualsResponse> actuals = projectActualsService.getProjectActualsByYearRange(startYear, endYear);
            log.info("Successfully fetched {} records for year range", actuals.size());
            return ResponseEntity.ok(actuals);
        } catch (IllegalArgumentException e) {
            log.error("Invalid year range: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Error fetching project actuals for year range", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Create or update project actuals
     */
    @PostMapping
    public ResponseEntity<?> saveProjectActuals(@Valid @RequestBody ProjectActualsRequest request) {
        log.info("Saving project actuals: {}", request.toString());
        try {
            ProjectActualsResponse response = projectActualsService.saveProjectActuals(request);
            log.info("Successfully saved project actuals with code: {}", response.getMissionProjectCode());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("Error saving project actuals", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Delete project actuals by project code and budget year
     */
    @DeleteMapping("/{missionProjectCode}/{budgetYear}")
    public ResponseEntity<?> deleteProjectActuals(@PathVariable String missionProjectCode, @PathVariable Integer budgetYear) {
        log.info("Deleting project actuals for code: {} budget year: {}", missionProjectCode, budgetYear);
        try {
            projectActualsService.deleteProjectActuals(missionProjectCode, budgetYear);
            log.info("Successfully deleted project actuals for code: {} budget year: {}", missionProjectCode, budgetYear);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("Error: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            log.error("Error deleting project actuals", e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Delete all project actuals for a specific project code
     */
    @DeleteMapping("/code/{missionProjectCode}")
    public ResponseEntity<?> deleteByProjectCode(@PathVariable String missionProjectCode) {
        log.info("Deleting all project actuals for code: {}", missionProjectCode);
        try {
            projectActualsService.deleteByProjectCode(missionProjectCode);
            log.info("Successfully deleted all project actuals for code: {}", missionProjectCode);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("Error: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            log.error("Error deleting project actuals for code: {}", missionProjectCode, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
