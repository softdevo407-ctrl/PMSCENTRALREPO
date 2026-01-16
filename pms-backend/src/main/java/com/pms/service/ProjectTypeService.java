package com.pms.service;

import com.pms.dto.ProjectTypeRequest;
import com.pms.dto.ProjectTypeResponse;
import com.pms.entity.ProjectType;
import com.pms.repository.ProjectTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectTypeService {
    
    private static final Logger log = LoggerFactory.getLogger(ProjectTypeService.class);
    
    @Autowired
    private ProjectTypeRepository projectTypeRepository;
    
    public List<ProjectTypeResponse> getAllProjectTypes() {
        return projectTypeRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectTypeResponse> getActiveProjectTypes() {
        return projectTypeRepository.findAllActive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectTypeResponse> getInactiveProjectTypes() {
        return projectTypeRepository.findAllInactive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectTypeResponse getProjectTypeByCode(String code) {
        return projectTypeRepository.findById(code)
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    public ProjectTypeResponse createProjectType(ProjectTypeRequest request, String userId) {
        validateRequest(request);
        
        if (projectTypeRepository.existsById(request.getProjectTypesCode())) {
            throw new IllegalArgumentException("Project Type with code " + request.getProjectTypesCode() + " already exists");
        }
        
        ProjectType projectType = ProjectType.builder()
                .projectTypesCode(request.getProjectTypesCode())
                .projectTypesFullName(request.getProjectTypesFullName())
                .projectTypesShortName(request.getProjectTypesShortName())
                .hierarchyOrder(request.getHierarchyOrder())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .userId(userId)
                .regStatus("A")
                .regTime(LocalDate.now())
                .build();
        
        projectType = projectTypeRepository.save(projectType);
        log.info("Project Type created successfully: {}", request.getProjectTypesCode());
        return convertToResponse(projectType);
    }
    
    public ProjectTypeResponse updateProjectType(String code, ProjectTypeRequest request, String userId) {
        validateRequest(request);
        
        ProjectType projectType = projectTypeRepository.findById(code)
                .orElseThrow(() -> new IllegalArgumentException("Project Type not found: " + code));
        
        projectType.setProjectTypesFullName(request.getProjectTypesFullName());
        projectType.setProjectTypesShortName(request.getProjectTypesShortName());
        projectType.setHierarchyOrder(request.getHierarchyOrder());
        projectType.setFromDate(request.getFromDate());
        projectType.setToDate(request.getToDate());
        projectType.setUserId(userId);
        projectType.setRegTime(LocalDate.now());
        
        projectType = projectTypeRepository.save(projectType);
        log.info("Project Type updated successfully: {}", code);
        return convertToResponse(projectType);
    }
    
    public void deleteProjectType(String code) {
        if (!projectTypeRepository.existsById(code)) {
            throw new IllegalArgumentException("Project Type not found: " + code);
        }
        
        projectTypeRepository.deleteById(code);
        log.info("Project Type deleted successfully: {}", code);
    }
    
    private void validateRequest(ProjectTypeRequest request) {
        if (request.getProjectTypesCode() == null || request.getProjectTypesCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Project Types Code is required");
        }
        
        if (request.getProjectTypesFullName() == null || request.getProjectTypesFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project Types Full Name is required");
        }
        
        if (request.getProjectTypesShortName() == null || request.getProjectTypesShortName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project Types Short Name is required");
        }
        
        if (request.getHierarchyOrder() == null || request.getHierarchyOrder() < 0) {
            throw new IllegalArgumentException("Hierarchy Order must be non-negative");
        }
        
        if (request.getFromDate() == null) {
            throw new IllegalArgumentException("From Date is required");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new IllegalArgumentException("To Date cannot be before From Date");
        }
    }
    
    private ProjectTypeResponse convertToResponse(ProjectType projectType) {
        return new ProjectTypeResponse(
                projectType.getProjectTypesCode(),
                projectType.getProjectTypesFullName(),
                projectType.getProjectTypesShortName(),
                projectType.getHierarchyOrder(),
                projectType.getFromDate(),
                projectType.getToDate(),
                projectType.getUserId(),
                projectType.getRegStatus(),
                projectType.getRegTime()
        );
    }
}
