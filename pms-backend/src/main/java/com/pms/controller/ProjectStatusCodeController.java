package com.pms.controller;

import com.pms.dto.ProjectStatusCodeRequest;
import com.pms.dto.ProjectStatusCodeResponse;
import com.pms.service.ProjectStatusCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-status-codes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProjectStatusCodeController {
    
    private final ProjectStatusCodeService projectStatusCodeService;
    
    @GetMapping
    public ResponseEntity<List<ProjectStatusCodeResponse>> getAllProjectStatusCodes() {
        log.info("Fetching all project status codes");
        return ResponseEntity.ok(projectStatusCodeService.getAllProjectStatusCodes());
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectStatusCodeResponse> getProjectStatusCodeByCode(@PathVariable String code) {
        log.info("Fetching project status code by code: {}", code);
        return ResponseEntity.ok(projectStatusCodeService.getProjectStatusCodeByCode(code));
    }
    
    @PostMapping
    public ResponseEntity<ProjectStatusCodeResponse> createProjectStatusCode(@RequestBody ProjectStatusCodeRequest request) {
        log.info("Creating new project status code");
        return ResponseEntity.status(HttpStatus.CREATED).body(projectStatusCodeService.createProjectStatusCode(request));
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectStatusCodeResponse> updateProjectStatusCode(
            @PathVariable String code,
            @RequestBody ProjectStatusCodeRequest request) {
        log.info("Updating project status code: {}", code);
        return ResponseEntity.ok(projectStatusCodeService.updateProjectStatusCode(code, request));
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectStatusCode(@PathVariable String code) {
        log.info("Deleting project status code: {}", code);
        projectStatusCodeService.deleteProjectStatusCode(code);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateProjectStatusCode(@PathVariable String code) {
        log.info("Deactivating project status code: {}", code);
        projectStatusCodeService.deactivateProjectStatusCode(code);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<ProjectStatusCodeResponse>> getProjectStatusCodesByStatus(@PathVariable String status) {
        log.info("Fetching project status codes by status: {}", status);
        return ResponseEntity.ok(projectStatusCodeService.getProjectStatusCodesByStatus(status));
    }
}
