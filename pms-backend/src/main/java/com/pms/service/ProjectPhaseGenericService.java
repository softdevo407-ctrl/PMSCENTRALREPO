package com.pms.service;

import com.pms.dto.ProjectPhaseGenericRequest;
import com.pms.dto.ProjectPhaseGenericResponse;
import com.pms.entity.ProjectPhaseGeneric;
import com.pms.repository.ProjectPhaseGenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectPhaseGenericService {
    
    @Autowired
    private ProjectPhaseGenericRepository projectPhaseGenericRepository;
    
    public List<ProjectPhaseGenericResponse> getAllProjectPhases() {
        return projectPhaseGenericRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<ProjectPhaseGenericResponse> getActiveProjectPhases() {
        return projectPhaseGenericRepository.findAllActive().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<ProjectPhaseGenericResponse> getInactiveProjectPhases() {
        return projectPhaseGenericRepository.findAllInactive().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public ProjectPhaseGenericResponse getProjectPhaseByCode(String code) {
        return projectPhaseGenericRepository.findById(code)
                .map(this::convertToResponse).orElse(null);
    }
    
    public ProjectPhaseGenericResponse createProjectPhase(ProjectPhaseGenericRequest request) {
        validateRequest(request);
        ProjectPhaseGeneric phase = new ProjectPhaseGeneric();
        phase.setProjectPhaseCode(request.getProjectPhaseCode());
        phase.setProjectPhaseFullName(request.getProjectPhaseFullName());
        phase.setProjectPhaseShortName(request.getProjectPhaseShortName());
        phase.setHierarchyOrder(request.getHierarchyOrder());
        phase.setFromDate(request.getFromDate());
        phase.setToDate(request.getToDate());
        phase.setUserId(request.getUserId());
        phase.setRegStatus(request.getRegStatus());
        phase.setRegTime(LocalDate.now());
        phase = projectPhaseGenericRepository.save(phase);
        return convertToResponse(phase);
    }
    
    public ProjectPhaseGenericResponse updateProjectPhase(String code, ProjectPhaseGenericRequest request) {
        ProjectPhaseGeneric phase = projectPhaseGenericRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Phase not found"));
        validateRequest(request);
        phase.setProjectPhaseFullName(request.getProjectPhaseFullName());
        phase.setProjectPhaseShortName(request.getProjectPhaseShortName());
        phase.setHierarchyOrder(request.getHierarchyOrder());
        phase.setFromDate(request.getFromDate());
        phase.setToDate(request.getToDate());
        phase.setUserId(request.getUserId());
        phase.setRegStatus(request.getRegStatus());
        phase = projectPhaseGenericRepository.save(phase);
        return convertToResponse(phase);
    }
    
    public void deleteProjectPhase(String code) {
        if (!projectPhaseGenericRepository.existsById(code)) {
            throw new RuntimeException("Project Phase not found");
        }
        projectPhaseGenericRepository.deleteById(code);
    }
    
    private void validateRequest(ProjectPhaseGenericRequest request) {
        if (request.getProjectPhaseCode() == null || request.getProjectPhaseCode().isEmpty() || 
            request.getProjectPhaseFullName() == null || request.getProjectPhaseFullName().isEmpty() ||
            request.getProjectPhaseShortName() == null || request.getProjectPhaseShortName().isEmpty() ||
            request.getHierarchyOrder() == null || request.getFromDate() == null ||
            request.getUserId() == null || request.getUserId().isEmpty() ||
            request.getRegStatus() == null || request.getRegStatus().isEmpty()) {
            throw new RuntimeException("Required fields are missing");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date must be after or equal to From Date");
        }
    }
    
    private ProjectPhaseGenericResponse convertToResponse(ProjectPhaseGeneric phase) {
        return new ProjectPhaseGenericResponse(
                phase.getProjectPhaseCode(),
                phase.getProjectPhaseFullName(),
                phase.getProjectPhaseShortName(),
                phase.getHierarchyOrder(),
                phase.getFromDate(),
                phase.getToDate(),
                phase.getUserId(),
                phase.getRegStatus(),
                phase.isActive()
        );
    }
}
