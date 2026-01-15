package com.pms.service;

import com.pms.dto.ProjectMilestoneRequest;
import com.pms.dto.ProjectMilestoneResponse;
import com.pms.entity.ProjectMilestone;
import com.pms.repository.ProjectMilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectMilestoneService {
    
    @Autowired
    private ProjectMilestoneRepository projectMilestoneRepository;
    
    public List<ProjectMilestoneResponse> getAllProjectMilestones() {
        return projectMilestoneRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<ProjectMilestoneResponse> getActiveProjectMilestones() {
        return projectMilestoneRepository.findAllActive().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public List<ProjectMilestoneResponse> getInactiveProjectMilestones() {
        return projectMilestoneRepository.findAllInactive().stream()
                .map(this::convertToResponse).collect(Collectors.toList());
    }
    
    public ProjectMilestoneResponse getProjectMilestoneByCode(String code) {
        return projectMilestoneRepository.findById(code)
                .map(this::convertToResponse).orElse(null);
    }
    
    public ProjectMilestoneResponse createProjectMilestone(ProjectMilestoneRequest request) {
        validateRequest(request);
        ProjectMilestone milestone = new ProjectMilestone();
        milestone.setProjectMilestoneCode(request.getProjectMilestoneCode());
        milestone.setProjectMilestoneFullName(request.getProjectMilestoneFullName());
        milestone.setProjectMilestoneShortName(request.getProjectMilestoneShortName());
        milestone.setHierarchyOrder(request.getHierarchyOrder());
        milestone.setFromDate(request.getFromDate());
        milestone.setToDate(request.getToDate());
        milestone.setUserId(request.getUserId());
        milestone.setRegStatus(request.getRegStatus());
        milestone.setRegTime(LocalDate.now());
        milestone = projectMilestoneRepository.save(milestone);
        return convertToResponse(milestone);
    }
    
    public ProjectMilestoneResponse updateProjectMilestone(String code, ProjectMilestoneRequest request) {
        ProjectMilestone milestone = projectMilestoneRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Milestone not found"));
        validateRequest(request);
        milestone.setProjectMilestoneFullName(request.getProjectMilestoneFullName());
        milestone.setProjectMilestoneShortName(request.getProjectMilestoneShortName());
        milestone.setHierarchyOrder(request.getHierarchyOrder());
        milestone.setFromDate(request.getFromDate());
        milestone.setToDate(request.getToDate());
        milestone.setUserId(request.getUserId());
        milestone.setRegStatus(request.getRegStatus());
        milestone = projectMilestoneRepository.save(milestone);
        return convertToResponse(milestone);
    }
    
    public void deleteProjectMilestone(String code) {
        if (!projectMilestoneRepository.existsById(code)) {
            throw new RuntimeException("Project Milestone not found");
        }
        projectMilestoneRepository.deleteById(code);
    }
    
    private void validateRequest(ProjectMilestoneRequest request) {
        if (request.getProjectMilestoneCode() == null || request.getProjectMilestoneCode().isEmpty() || 
            request.getProjectMilestoneFullName() == null || request.getProjectMilestoneFullName().isEmpty() ||
            request.getProjectMilestoneShortName() == null || request.getProjectMilestoneShortName().isEmpty() ||
            request.getHierarchyOrder() == null || request.getFromDate() == null ||
            request.getUserId() == null || request.getUserId().isEmpty() ||
            request.getRegStatus() == null || request.getRegStatus().isEmpty()) {
            throw new RuntimeException("Required fields are missing");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date must be after or equal to From Date");
        }
    }
    
    private ProjectMilestoneResponse convertToResponse(ProjectMilestone milestone) {
        return new ProjectMilestoneResponse(
                milestone.getProjectMilestoneCode(),
                milestone.getProjectMilestoneFullName(),
                milestone.getProjectMilestoneShortName(),
                milestone.getHierarchyOrder(),
                milestone.getFromDate(),
                milestone.getToDate(),
                milestone.getUserId(),
                milestone.getRegStatus(),
                milestone.isActive()
        );
    }
}
