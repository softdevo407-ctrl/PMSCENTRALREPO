package com.pms.service;

import com.pms.dto.ProjectActivityRequest;
import com.pms.dto.ProjectActivityResponse;
import com.pms.entity.ProjectActivity;
import com.pms.repository.ProjectActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectActivityService {
    
    @Autowired
    private ProjectActivityRepository projectActivityRepository;
    
    public List<ProjectActivityResponse> getAllProjectActivities() {
        return projectActivityRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectActivityResponse> getActiveProjectActivities() {
        return projectActivityRepository.findAllActive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectActivityResponse> getInactiveProjectActivities() {
        return projectActivityRepository.findAllInactive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectActivityResponse getProjectActivityByCode(String code) {
        return projectActivityRepository.findById(code)
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    public ProjectActivityResponse createProjectActivity(ProjectActivityRequest request) {
        validateRequest(request);
        
        ProjectActivity activity = new ProjectActivity();
        activity.setProjectActivityCode(request.getProjectActivityCode());
        activity.setProjectActivityFullName(request.getProjectActivityFullName());
        activity.setProjectActivityShortName(request.getProjectActivityShortName());
        activity.setHierarchyOrder(request.getHierarchyOrder());
        activity.setFromDate(request.getFromDate());
        activity.setToDate(request.getToDate());
        activity.setUserId(request.getUserId());
        activity.setRegStatus(request.getRegStatus());
        activity.setRegTime(LocalDate.now());
        
        activity = projectActivityRepository.save(activity);
        return convertToResponse(activity);
    }
    
    public ProjectActivityResponse updateProjectActivity(String code, ProjectActivityRequest request) {
        ProjectActivity activity = projectActivityRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Activity not found with code: " + code));
        
        validateRequest(request);
        
        activity.setProjectActivityFullName(request.getProjectActivityFullName());
        activity.setProjectActivityShortName(request.getProjectActivityShortName());
        activity.setHierarchyOrder(request.getHierarchyOrder());
        activity.setFromDate(request.getFromDate());
        activity.setToDate(request.getToDate());
        activity.setUserId(request.getUserId());
        activity.setRegStatus(request.getRegStatus());
        
        activity = projectActivityRepository.save(activity);
        return convertToResponse(activity);
    }
    
    public void deactivateProjectActivity(String code) {
        ProjectActivity activity = projectActivityRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Activity not found with code: " + code));
        
        activity.setToDate(LocalDate.now());
        projectActivityRepository.save(activity);
    }
    
    public void deleteProjectActivity(String code) {
        if (!projectActivityRepository.existsById(code)) {
            throw new RuntimeException("Project Activity not found with code: " + code);
        }
        projectActivityRepository.deleteById(code);
    }
    
    private void validateRequest(ProjectActivityRequest request) {
        if (request.getProjectActivityCode() == null || request.getProjectActivityCode().isEmpty()) {
            throw new RuntimeException("Project Activity Code is required");
        }
        
        if (request.getProjectActivityCode().length() > 5) {
            throw new RuntimeException("Project Activity Code must not exceed 5 characters");
        }
        
        if (request.getProjectActivityFullName() == null || request.getProjectActivityFullName().isEmpty()) {
            throw new RuntimeException("Project Activity Full Name is required");
        }
        
        if (request.getProjectActivityFullName().length() > 255) {
            throw new RuntimeException("Project Activity Full Name must not exceed 255 characters");
        }
        
        if (request.getProjectActivityShortName() == null || request.getProjectActivityShortName().isEmpty()) {
            throw new RuntimeException("Project Activity Short Name is required");
        }
        
        if (request.getProjectActivityShortName().length() > 50) {
            throw new RuntimeException("Project Activity Short Name must not exceed 50 characters");
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
    
    private ProjectActivityResponse convertToResponse(ProjectActivity activity) {
        return new ProjectActivityResponse(
                activity.getProjectActivityCode(),
                activity.getProjectActivityFullName(),
                activity.getProjectActivityShortName(),
                activity.getHierarchyOrder(),
                activity.getFromDate(),
                activity.getToDate(),
                activity.getUserId(),
                activity.getRegStatus(),
                activity.isActive()
        );
    }
}
