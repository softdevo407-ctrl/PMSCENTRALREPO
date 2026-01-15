package com.pms.controller;

import com.pms.dto.ProjectActivityRequest;
import com.pms.dto.ProjectActivityResponse;
import com.pms.service.ProjectActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-activities")
public class ProjectActivityController {
    
    @Autowired
    private ProjectActivityService projectActivityService;
    
    @GetMapping
    public ResponseEntity<List<ProjectActivityResponse>> getAllProjectActivities() {
        List<ProjectActivityResponse> activities = projectActivityService.getAllProjectActivities();
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProjectActivityResponse>> getActiveProjectActivities() {
        List<ProjectActivityResponse> activities = projectActivityService.getActiveProjectActivities();
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProjectActivityResponse>> getInactiveProjectActivities() {
        List<ProjectActivityResponse> activities = projectActivityService.getInactiveProjectActivities();
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectActivityResponse> getProjectActivityByCode(@PathVariable String code) {
        ProjectActivityResponse activity = projectActivityService.getProjectActivityByCode(code);
        if (activity != null) {
            return ResponseEntity.ok(activity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<ProjectActivityResponse> createProjectActivity(@RequestBody ProjectActivityRequest request) {
        try {
            ProjectActivityResponse response = projectActivityService.createProjectActivity(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectActivityResponse> updateProjectActivity(@PathVariable String code, @RequestBody ProjectActivityRequest request) {
        try {
            ProjectActivityResponse response = projectActivityService.updateProjectActivity(code, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateProjectActivity(@PathVariable String code) {
        try {
            projectActivityService.deactivateProjectActivity(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectActivity(@PathVariable String code) {
        try {
            projectActivityService.deleteProjectActivity(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
