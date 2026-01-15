package com.pms.controller;

import com.pms.dto.ProjectMilestoneRequest;
import com.pms.dto.ProjectMilestoneResponse;
import com.pms.service.ProjectMilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-milestones")
public class ProjectMilestoneController {
    
    @Autowired
    private ProjectMilestoneService projectMilestoneService;
    
    @GetMapping
    public ResponseEntity<List<ProjectMilestoneResponse>> getAllProjectMilestones() {
        return ResponseEntity.ok(projectMilestoneService.getAllProjectMilestones());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProjectMilestoneResponse>> getActiveProjectMilestones() {
        return ResponseEntity.ok(projectMilestoneService.getActiveProjectMilestones());
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProjectMilestoneResponse>> getInactiveProjectMilestones() {
        return ResponseEntity.ok(projectMilestoneService.getInactiveProjectMilestones());
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectMilestoneResponse> getProjectMilestoneByCode(@PathVariable String code) {
        ProjectMilestoneResponse milestone = projectMilestoneService.getProjectMilestoneByCode(code);
        return milestone != null ? ResponseEntity.ok(milestone) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<ProjectMilestoneResponse> createProjectMilestone(@RequestBody ProjectMilestoneRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(projectMilestoneService.createProjectMilestone(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectMilestoneResponse> updateProjectMilestone(@PathVariable String code, @RequestBody ProjectMilestoneRequest request) {
        try {
            return ResponseEntity.ok(projectMilestoneService.updateProjectMilestone(code, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectMilestone(@PathVariable String code) {
        try {
            projectMilestoneService.deleteProjectMilestone(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
