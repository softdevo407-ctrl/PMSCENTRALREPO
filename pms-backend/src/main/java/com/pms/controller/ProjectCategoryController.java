package com.pms.controller;

import com.pms.dto.ProjectCategoryRequest;
import com.pms.dto.ProjectCategoryResponse;
import com.pms.service.ProjectCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/project-categories")
public class ProjectCategoryController {
    
    @Autowired
    private ProjectCategoryService projectCategoryService;
    
    @GetMapping
    public ResponseEntity<List<ProjectCategoryResponse>> getAllProjectCategories() {
        List<ProjectCategoryResponse> categories = projectCategoryService.getAllProjectCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProjectCategoryResponse>> getActiveProjectCategories() {
        List<ProjectCategoryResponse> categories = projectCategoryService.getActiveProjectCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProjectCategoryResponse>> getInactiveProjectCategories() {
        List<ProjectCategoryResponse> categories = projectCategoryService.getInactiveProjectCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<List<ProjectCategoryResponse>> getDashboardCategories() {
        List<ProjectCategoryResponse> categories = projectCategoryService.getDashboardCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProjectCategoryResponse> getProjectCategoryByCode(@PathVariable String code) {
        ProjectCategoryResponse category = projectCategoryService.getProjectCategoryByCode(code);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<ProjectCategoryResponse> createProjectCategory(@RequestBody ProjectCategoryRequest request) {
        try {
            ProjectCategoryResponse response = projectCategoryService.createProjectCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProjectCategoryResponse> updateProjectCategory(@PathVariable String code, @RequestBody ProjectCategoryRequest request) {
        try {
            ProjectCategoryResponse response = projectCategoryService.updateProjectCategory(code, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateProjectCategory(@PathVariable String code) {
        try {
            projectCategoryService.deactivateProjectCategory(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProjectCategory(@PathVariable String code) {
        try {
            projectCategoryService.deleteProjectCategory(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
