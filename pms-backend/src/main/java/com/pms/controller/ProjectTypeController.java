package com.pms.controller;

import com.pms.dto.ProjectTypeRequest;
import com.pms.dto.ProjectTypeResponse;
import com.pms.service.ProjectTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/project-types")
public class ProjectTypeController {
    
    private static final Logger log = LoggerFactory.getLogger(ProjectTypeController.class);
    
    @Autowired
    private ProjectTypeService projectTypeService;
    
    @GetMapping
    public ResponseEntity<List<ProjectTypeResponse>> getAllProjectTypes() {
        log.info("Fetching all project types");
        return ResponseEntity.ok(projectTypeService.getAllProjectTypes());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProjectTypeResponse>> getActiveProjectTypes() {
        log.info("Fetching active project types");
        return ResponseEntity.ok(projectTypeService.getActiveProjectTypes());
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProjectTypeResponse>> getInactiveProjectTypes() {
        log.info("Fetching inactive project types");
        return ResponseEntity.ok(projectTypeService.getInactiveProjectTypes());
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectTypeResponse> getProjectTypeByCode(@PathVariable String code) {
        log.info("Fetching project type by code: {}", code);
        ProjectTypeResponse response = projectTypeService.getProjectTypeByCode(code);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<ProjectTypeResponse> createProjectType(
            @Valid @RequestBody ProjectTypeRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "SYSTEM";
        log.info("Creating project type: {} by user: {}", request.getProjectTypesCode(), userId);
        ProjectTypeResponse response = projectTypeService.createProjectType(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectTypeResponse> updateProjectType(
            @PathVariable String code,
            @Valid @RequestBody ProjectTypeRequest request,
            Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "SYSTEM";
        log.info("Updating project type: {} by user: {}", code, userId);
        ProjectTypeResponse response = projectTypeService.updateProjectType(code, request, userId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectType(@PathVariable String code) {
        log.info("Deleting project type: {}", code);
        projectTypeService.deleteProjectType(code);
        return ResponseEntity.noContent().build();
    }
}
