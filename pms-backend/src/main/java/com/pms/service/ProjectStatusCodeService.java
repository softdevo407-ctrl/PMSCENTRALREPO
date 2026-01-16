package com.pms.service;

import com.pms.dto.ProjectStatusCodeRequest;
import com.pms.dto.ProjectStatusCodeResponse;
import com.pms.entity.ProjectStatusCode;
import com.pms.repository.ProjectStatusCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectStatusCodeService {
    
    private final ProjectStatusCodeRepository projectStatusCodeRepository;
    
    public List<ProjectStatusCodeResponse> getAllProjectStatusCodes() {
        log.debug("Fetching all project status codes");
        return projectStatusCodeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public ProjectStatusCodeResponse getProjectStatusCodeByCode(String code) {
        log.debug("Fetching project status code: {}", code);
        return projectStatusCodeRepository.findById(code)
                .map(this::toResponse)
                .orElseThrow(() -> {
                    log.error("Project status code not found: {}", code);
                    return new RuntimeException("Project status code not found: " + code);
                });
    }
    
    public ProjectStatusCodeResponse createProjectStatusCode(ProjectStatusCodeRequest request) {
        log.info("Creating new project status code: {}", request.getProjectStatusCode());
        
        if (projectStatusCodeRepository.existsById(request.getProjectStatusCode())) {
            log.error("Project status code already exists: {}", request.getProjectStatusCode());
            throw new RuntimeException("Project status code already exists: " + request.getProjectStatusCode());
        }
        
        ProjectStatusCode entity = ProjectStatusCode.builder()
                .projectStatusCode(request.getProjectStatusCode())
                .projectStatusFullName(request.getProjectStatusFullName())
                .projectStatusShortName(request.getProjectStatusShortName())
                .hierarchyOrder(request.getHierarchyOrder())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .userId(request.getUserId())
                .regStatus(request.getRegStatus())
                .regTime(request.getRegTime())
                .build();
        
        ProjectStatusCode saved = projectStatusCodeRepository.save(entity);
        log.info("Project status code created successfully: {}", saved.getProjectStatusCode());
        return toResponse(saved);
    }
    
    public ProjectStatusCodeResponse updateProjectStatusCode(String code, ProjectStatusCodeRequest request) {
        log.info("Updating project status code: {}", code);
        
        ProjectStatusCode entity = projectStatusCodeRepository.findById(code)
                .orElseThrow(() -> {
                    log.error("Project status code not found for update: {}", code);
                    return new RuntimeException("Project status code not found: " + code);
                });
        
        entity.setProjectStatusFullName(request.getProjectStatusFullName());
        entity.setProjectStatusShortName(request.getProjectStatusShortName());
        entity.setHierarchyOrder(request.getHierarchyOrder());
        entity.setFromDate(request.getFromDate());
        entity.setToDate(request.getToDate());
        entity.setUserId(request.getUserId());
        entity.setRegStatus(request.getRegStatus());
        entity.setRegTime(request.getRegTime());
        
        ProjectStatusCode updated = projectStatusCodeRepository.save(entity);
        log.info("Project status code updated successfully: {}", code);
        return toResponse(updated);
    }
    
    public void deleteProjectStatusCode(String code) {
        log.info("Deleting project status code: {}", code);
        
        if (!projectStatusCodeRepository.existsById(code)) {
            log.error("Project status code not found for deletion: {}", code);
            throw new RuntimeException("Project status code not found: " + code);
        }
        
        projectStatusCodeRepository.deleteById(code);
        log.info("Project status code deleted successfully: {}", code);
    }
    
    public List<ProjectStatusCodeResponse> getProjectStatusCodesByStatus(String status) {
        log.debug("Fetching project status codes by status: {}", status);
        return projectStatusCodeRepository.findByRegStatus(status)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public void deactivateProjectStatusCode(String code) {
        log.info("Deactivating project status code: {}", code);
        
        ProjectStatusCode entity = projectStatusCodeRepository.findById(code)
                .orElseThrow(() -> {
                    log.error("Project status code not found for deactivation: {}", code);
                    return new RuntimeException("Project status code not found: " + code);
                });
        
        entity.setRegStatus("0");
        projectStatusCodeRepository.save(entity);
        log.info("Project status code deactivated successfully: {}", code);
    }
    
    private ProjectStatusCodeResponse toResponse(ProjectStatusCode entity) {
        return ProjectStatusCodeResponse.builder()
                .projectStatusCode(entity.getProjectStatusCode())
                .projectStatusFullName(entity.getProjectStatusFullName())
                .projectStatusShortName(entity.getProjectStatusShortName())
                .hierarchyOrder(entity.getHierarchyOrder())
                .fromDate(entity.getFromDate())
                .toDate(entity.getToDate())
                .userId(entity.getUserId())
                .regStatus(entity.getRegStatus())
                .regTime(entity.getRegTime())
                .build();
    }
}
