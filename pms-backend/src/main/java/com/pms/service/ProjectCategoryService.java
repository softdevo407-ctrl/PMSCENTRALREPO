package com.pms.service;

import com.pms.dto.ProjectCategoryRequest;
import com.pms.dto.ProjectCategoryResponse;
import com.pms.entity.ProjectCategory;
import com.pms.repository.ProjectCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectCategoryService {
    
    @Autowired
    private ProjectCategoryRepository projectCategoryRepository;
    
    public List<ProjectCategoryResponse> getAllProjectCategories() {
        return projectCategoryRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectCategoryResponse> getActiveProjectCategories() {
        return projectCategoryRepository.findAllActive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectCategoryResponse> getInactiveProjectCategories() {
        return projectCategoryRepository.findAllInactive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectCategoryResponse getProjectCategoryByCode(String code) {
        return projectCategoryRepository.findById(code)
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    public List<ProjectCategoryResponse> getDashboardCategories() {
        return projectCategoryRepository.findByShowOnDashboard("Yes").stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectCategoryResponse createProjectCategory(ProjectCategoryRequest request) {
        validateRequest(request);
        
        ProjectCategory category = new ProjectCategory();
        category.setProjectCategoryCode(request.getProjectCategoryCode());
        category.setProjectCategoryFullName(request.getProjectCategoryFullName());
        category.setProjectCategoryShortName(request.getProjectCategoryShortName());
        category.setShowOnDashboard(request.getShowOnDashboard());
        category.setHierarchyOrder(request.getHierarchyOrder());
        category.setFromDate(request.getFromDate());
        category.setToDate(request.getToDate());
        category.setUserId(request.getUserId());
        category.setRegStatus(request.getRegStatus());
        category.setRegTime(LocalDate.now());
        
        category = projectCategoryRepository.save(category);
        return convertToResponse(category);
    }
    
    public ProjectCategoryResponse updateProjectCategory(String code, ProjectCategoryRequest request) {
        ProjectCategory category = projectCategoryRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Category not found with code: " + code));
        
        validateRequest(request);
        
        category.setProjectCategoryFullName(request.getProjectCategoryFullName());
        category.setProjectCategoryShortName(request.getProjectCategoryShortName());
        category.setShowOnDashboard(request.getShowOnDashboard());
        category.setHierarchyOrder(request.getHierarchyOrder());
        category.setFromDate(request.getFromDate());
        category.setToDate(request.getToDate());
        category.setUserId(request.getUserId());
        category.setRegStatus(request.getRegStatus());
        
        category = projectCategoryRepository.save(category);
        return convertToResponse(category);
    }
    
    public void deactivateProjectCategory(String code) {
        ProjectCategory category = projectCategoryRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Category not found with code: " + code));
        
        category.setToDate(LocalDate.now());
        projectCategoryRepository.save(category);
    }
    
    public void deleteProjectCategory(String code) {
        if (!projectCategoryRepository.existsById(code)) {
            throw new RuntimeException("Project Category not found with code: " + code);
        }
        projectCategoryRepository.deleteById(code);
    }
    
    private void validateRequest(ProjectCategoryRequest request) {
        if (request.getProjectCategoryCode() == null || request.getProjectCategoryCode().isEmpty()) {
            throw new RuntimeException("Project Category Code is required");
        }
        
        if (request.getProjectCategoryCode().length() > 5) {
            throw new RuntimeException("Project Category Code must not exceed 5 characters");
        }
        
        if (request.getProjectCategoryFullName() == null || request.getProjectCategoryFullName().isEmpty()) {
            throw new RuntimeException("Project Category Full Name is required");
        }
        
        if (request.getProjectCategoryFullName().length() > 255) {
            throw new RuntimeException("Project Category Full Name must not exceed 255 characters");
        }
        
        if (request.getProjectCategoryShortName() == null || request.getProjectCategoryShortName().isEmpty()) {
            throw new RuntimeException("Project Category Short Name is required");
        }
        
        if (request.getProjectCategoryShortName().length() > 50) {
            throw new RuntimeException("Project Category Short Name must not exceed 50 characters");
        }
        
        if (request.getShowOnDashboard() == null || request.getShowOnDashboard().isEmpty()) {
            throw new RuntimeException("Show On Dashboard is required");
        }
        
        if (!request.getShowOnDashboard().equals("Yes") && !request.getShowOnDashboard().equals("No")) {
            throw new RuntimeException("Show On Dashboard must be 'Yes' or 'No'");
        }
        
        if (request.getHierarchyOrder() == null || request.getHierarchyOrder() < 0) {
            throw new RuntimeException("Hierarchy Order must be a positive number");
        }
        
        if (request.getFromDate() == null) {
            throw new RuntimeException("From Date is required");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date must be after or equal to From Date");
        }
        
        if (request.getUserId() == null || request.getUserId().isEmpty()) {
            throw new RuntimeException("User ID is required");
        }
        
        if (request.getRegStatus() == null || request.getRegStatus().isEmpty()) {
            throw new RuntimeException("Registration Status is required");
        }
        
        if (request.getRegStatus().length() != 1) {
            throw new RuntimeException("Registration Status must be a single character");
        }
    }
    
    private ProjectCategoryResponse convertToResponse(ProjectCategory category) {
        return new ProjectCategoryResponse(
                category.getProjectCategoryCode(),
                category.getProjectCategoryFullName(),
                category.getProjectCategoryShortName(),
                category.getShowOnDashboard(),
                category.getHierarchyOrder(),
                category.getFromDate(),
                category.getToDate(),
                category.getUserId(),
                category.getRegStatus(),
                category.isActive()
        );
    }
}
