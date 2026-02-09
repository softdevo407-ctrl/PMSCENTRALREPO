package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.ProjectDetailRequest;
import com.pms.dto.ProjectDetailResponse;
import com.pms.service.ProjectDetailService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-details")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProjectDetailController {
    
    private final ProjectDetailService projectDetailService;
    
    @GetMapping
    @PermitAll
    public ResponseEntity<List<ProjectDetailResponse>> getAllProjectDetails() {
        log.info("Fetching all project details");
        List<ProjectDetailResponse> projects = projectDetailService.getAllProjectDetails();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/active")
    @PermitAll
    public ResponseEntity<List<ProjectDetailResponse>> getActiveProjectDetails() {
        log.info("Fetching active project details");
        List<ProjectDetailResponse> projects = projectDetailService.getActiveProjectDetails();
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/by-director/{directorId}")
    @PermitAll
    public ResponseEntity<List<ProjectDetailResponse>> getProjectDetailsByDirector(
            @PathVariable String directorId) {
        log.info("Fetching project details for director: {}", directorId);
        List<ProjectDetailResponse> projects = projectDetailService.getProjectDetailsByDirector(directorId);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/by-programme-director/{programmeDirectorId}")
    @PermitAll
    public ResponseEntity<List<ProjectDetailResponse>> getProjectDetailsByProgrammeDirector(
            @PathVariable String programmeDirectorId) {
        log.info("Fetching project details for programme director: {}", programmeDirectorId);
        List<ProjectDetailResponse> projects = projectDetailService.getProjectDetailsByProgrammeDirector(programmeDirectorId);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDetailResponse>> getMyProjects(Authentication authentication) {
        String employeeCode = authentication != null ? authentication.getName() : "";
        log.info("Fetching projects for user: {} (as project or programme director)", employeeCode);
        List<ProjectDetailResponse> projects = projectDetailService.getProjectDetailsByDirectorOrProgrammeDirector(employeeCode);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/category-stats")
    @PermitAll
    public ResponseEntity<?> getCategoryStats() {
        log.info("Fetching category statistics");
        return ResponseEntity.ok(projectDetailService.getCategoryStats());
    }
    
    @GetMapping("/category-stats-by-director/{employeeCode}")
    @PermitAll
    public ResponseEntity<?> getCategoryStatsByDirector(@PathVariable String employeeCode) {
        log.info("Fetching category statistics for director: {}", employeeCode);
        return ResponseEntity.ok(projectDetailService.getCategoryStatsByDirector(employeeCode));
    }

    @GetMapping("/by-category/{categoryCode}")
    @PermitAll
    public ResponseEntity<List<ProjectDetailResponse>> getProjectDetailsByProjectCategoryCode(
            @PathVariable String categoryCode) {
        log.info("Fetching project details for category: {}", categoryCode);
        List<ProjectDetailResponse> projects = projectDetailService.getProjectDetailsByProjectCategoryCode(categoryCode);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/{code}")
    @PermitAll
    public ResponseEntity<ProjectDetailResponse> getProjectDetailByCode(@PathVariable String code) {
        log.info("Fetching project detail with code: {}", code);
        ProjectDetailResponse project = projectDetailService.getProjectDetailByCode(code);
        return ResponseEntity.ok(project);
    }
    
    @PostMapping
    @PermitAll
    public ResponseEntity<ProjectDetailResponse> createProjectDetail(
            @RequestBody ProjectDetailRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "SYSTEM";
        log.info("Creating new project detail by user: {}", userId);
        try {
            ProjectDetailResponse project = projectDetailService.createProjectDetail(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);
        } catch (RuntimeException e) {
            log.error("Error creating project detail", e);
            throw e;
        }
    }
    
    @PutMapping("/{code}")
    @PermitAll
    public ResponseEntity<ProjectDetailResponse> updateProjectDetail(
            @PathVariable String code,
            @RequestBody ProjectDetailRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "SYSTEM";
        log.info("Updating project detail: {} by user: {}", code, userId);
        try {
            ProjectDetailResponse project = projectDetailService.updateProjectDetail(code, request, userId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            log.error("Error updating project detail", e);
            throw e;
        }
    }
    
    @DeleteMapping("/{code}")
    @PermitAll
    public ResponseEntity<ApiResponse> deleteProjectDetail(@PathVariable String code) {
        log.info("Deleting project detail: {}", code);
        try {
            projectDetailService.deleteProjectDetail(code);
            return ResponseEntity.ok(new ApiResponse(true, "Project Detail deleted successfully"));
        } catch (RuntimeException e) {
            log.error("Error deleting project detail", e);
            throw e;
        }
    }
}
