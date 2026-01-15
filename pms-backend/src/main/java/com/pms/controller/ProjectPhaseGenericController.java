package com.pms.controller;

import com.pms.dto.ProjectPhaseGenericRequest;
import com.pms.dto.ProjectPhaseGenericResponse;
import com.pms.service.ProjectPhaseGenericService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-phases-generic")
public class ProjectPhaseGenericController {
    
    @Autowired
    private ProjectPhaseGenericService projectPhaseGenericService;
    
    @GetMapping
    public ResponseEntity<List<ProjectPhaseGenericResponse>> getAllProjectPhases() {
        return ResponseEntity.ok(projectPhaseGenericService.getAllProjectPhases());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProjectPhaseGenericResponse>> getActiveProjectPhases() {
        return ResponseEntity.ok(projectPhaseGenericService.getActiveProjectPhases());
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProjectPhaseGenericResponse>> getInactiveProjectPhases() {
        return ResponseEntity.ok(projectPhaseGenericService.getInactiveProjectPhases());
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectPhaseGenericResponse> getProjectPhaseByCode(@PathVariable String code) {
        ProjectPhaseGenericResponse phase = projectPhaseGenericService.getProjectPhaseByCode(code);
        return phase != null ? ResponseEntity.ok(phase) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<ProjectPhaseGenericResponse> createProjectPhase(@RequestBody ProjectPhaseGenericRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(projectPhaseGenericService.createProjectPhase(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectPhaseGenericResponse> updateProjectPhase(@PathVariable String code, @RequestBody ProjectPhaseGenericRequest request) {
        try {
            return ResponseEntity.ok(projectPhaseGenericService.updateProjectPhase(code, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectPhase(@PathVariable String code) {
        try {
            projectPhaseGenericService.deleteProjectPhase(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
