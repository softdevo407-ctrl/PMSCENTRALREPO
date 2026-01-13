package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.ProjectDefinitionRequest;
import com.pms.dto.ProjectDefinitionResponse;
import com.pms.entity.User;
import com.pms.repository.UserRepository;
import com.pms.service.ProjectDefinitionService;
import com.pms.service.FileUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProjectDefinitionController {
    private final ProjectDefinitionService projectDefinitionService;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String employeeCode = authentication.getName();
            return userRepository.findByEmployeeCode(employeeCode)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<List<ProjectDefinitionResponse>> getAllProjects() {
        log.info("Fetching all projects");
        List<ProjectDefinitionResponse> projects = projectDefinitionService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/director/{projectDirectorId}")
    public ResponseEntity<List<ProjectDefinitionResponse>> getProjectsByDirector(
            @PathVariable Long projectDirectorId) {
        log.info("Fetching projects for project director: {}", projectDirectorId);
        List<ProjectDefinitionResponse> projects = projectDefinitionService.getProjectsByProjectDirector(projectDirectorId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/programme/{programmeDirId}")
    public ResponseEntity<List<ProjectDefinitionResponse>> getProjectsByProgrammeDirector(
            @PathVariable Long programmeDirId) {
        log.info("Fetching projects for programme director: {}", programmeDirId);
        List<ProjectDefinitionResponse> projects = projectDefinitionService.getProjectsByProgrammeDirector(programmeDirId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/by-programme/{programmeId}")
    public ResponseEntity<List<ProjectDefinitionResponse>> getProjectsByProgrammeId(
            @PathVariable Long programmeId) {
        log.info("Fetching projects for programme: {}", programmeId);
        List<ProjectDefinitionResponse> projects = projectDefinitionService.getProjectsByProgrammeId(programmeId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDefinitionResponse> getProjectById(@PathVariable Long id) {
        log.info("Fetching project with id: {}", id);
        ProjectDefinitionResponse project = projectDefinitionService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getProjectsByCategory(@PathVariable String category) {
        log.info("Fetching project stats for category: {}", category);
        Map<String, Object> stats = projectDefinitionService.getProjectsByCategory(category);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/all-categories")
    public ResponseEntity<List<Map<String, Object>>> getAllCategoryStats() {
        log.info("Fetching stats for all categories");
        List<Map<String, Object>> stats = projectDefinitionService.getAllCategoryStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<ProjectDefinitionResponse> createProject(
            @RequestParam("projectData") String projectDataJson,
            @RequestParam(value = "projectDocument", required = false) MultipartFile projectDocument) {
        try {
            log.info("Creating new project with file upload");
            User currentUser = getCurrentUser();
            
            // Handle file upload
            String documentPath = null;
            if (projectDocument != null && !projectDocument.isEmpty()) {
                documentPath = fileUploadService.saveFile(projectDocument);
                log.info("Project document uploaded: {}", documentPath);
            }
            
            ProjectDefinitionResponse project = projectDefinitionService.createProjectWithFile(
                    projectDataJson, currentUser.getId(), documentPath);
            return ResponseEntity.status(HttpStatus.CREATED).body(project);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDefinitionResponse> updateProject(
            @PathVariable Long id,
            @RequestParam("projectData") String projectDataJson,
            @RequestParam(value = "projectDocument", required = false) MultipartFile projectDocument) {
        try {
            log.info("Updating project with id: {}", id);
            
            // Handle file upload
            String documentPath = null;
            if (projectDocument != null && !projectDocument.isEmpty()) {
                documentPath = fileUploadService.saveFile(projectDocument);
                log.info("Project document updated: {}", documentPath);
            }
            
            ProjectDefinitionResponse project = projectDefinitionService.updateProjectWithFile(
                    id, projectDataJson, documentPath);
            return ResponseEntity.ok(project);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProject(@PathVariable Long id) {
        log.info("Deleting project with id: {}", id);
        projectDefinitionService.deleteProject(id);
        return ResponseEntity.ok(new ApiResponse(true, "Project deleted successfully"));
    }
}
