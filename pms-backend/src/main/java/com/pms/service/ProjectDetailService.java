package com.pms.service;

import com.pms.dto.ProjectDetailRequest;
import com.pms.dto.ProjectDetailResponse;
import com.pms.entity.ProjectDetail;
import com.pms.repository.ProjectDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectDetailService {
    
    private final ProjectDetailRepository projectDetailRepository;
    
    // Generate project code in format: YEARP001, YEARP002, etc.
    private String generateProjectCode() {
        int currentYear = Year.now().getValue();
        String yearPrefix = currentYear + "P";
        
        // Find the maximum sequence number for this year
        int nextSequence = projectDetailRepository.findMaxSequenceByYear(yearPrefix)
                .map(max -> max + 1)
                .orElse(1);
        
        return String.format("%sP%03d", currentYear, nextSequence);
    }
    
    // Get all projects
    public List<ProjectDetailResponse> getAllProjectDetails() {
        return projectDetailRepository.findAllOrderByCodeDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get active projects only
    public List<ProjectDetailResponse> getActiveProjectDetails() {
        return projectDetailRepository.findAllActive()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get projects by Project Director
    public List<ProjectDetailResponse> getProjectDetailsByDirector(String directorId) {
        return projectDetailRepository.findByMissionProjectDirector(directorId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get projects by Programme Director
    public List<ProjectDetailResponse> getProjectDetailsByProgrammeDirector(String programmeDirectorId) {
        return projectDetailRepository.findByProgrammeDirector(programmeDirectorId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get by code
    public ProjectDetailResponse getProjectDetailByCode(String code) {
        ProjectDetail project = projectDetailRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Detail not found with code: " + code));
        return convertToResponse(project);
    }
    
    // Create new project
    @Transactional
    public ProjectDetailResponse createProjectDetail(ProjectDetailRequest request, String userId) {
        // Validation
        validateProjectDetailRequest(request);
        
        // Check if short name is unique
        if (projectDetailRepository.findByMissionProjectShortName(request.getMissionProjectShortName()).isPresent()) {
            throw new RuntimeException("Project with short name " + request.getMissionProjectShortName() + " already exists");
        }
        
        // Generate project code
        String projectCode = generateProjectCode();
        
        ProjectDetail project = ProjectDetail.builder()
                .missionProjectCode(projectCode)
                .missionProjectFullName(request.getMissionProjectFullName())
                .missionProjectShortName(request.getMissionProjectShortName())
                .missionProjectDescription(request.getMissionProjectDescription())
                .projectCategoryCode(request.getProjectCategoryCode())
                .budgetCode(request.getBudgetCode())
                .projectTypesCode(request.getProjectTypesCode())
                .sanctionedAuthority(request.getSanctionedAuthority())
                .individualCombinedSanctionCost(request.getIndividualCombinedSanctionCost())
                .sanctionedCost(request.getSanctionedCost())
                .dateOffs(request.getDateOffs())
                .durationInMonths(request.getDurationInMonths())
                .originalSchedule(request.getOriginalSchedule())
                .fsCopy(request.getFsCopy())
                .missionProjectDirector(request.getMissionProjectDirector())
                .programmeDirector(request.getProgrammeDirector())
                .cumExpUpToPrevFy(request.getCumExpUpToPrevFy())
                .curYrExp(request.getCurYrExp())
                .currentStatusPercentage(request.getCurrentStatusPercentage())
                .currentStatus(request.getCurrentStatus())
                .currentStatusRemarks(request.getCurrentStatusRemarks())
                .regStage("S1")
                .userId(userId)
                .regStatus("R")
                .regTime(LocalDateTime.now())
                .build();
        
        ProjectDetail savedProject = projectDetailRepository.save(project);
        log.info("Project Detail created successfully: {}", savedProject.getMissionProjectCode());
        
        return convertToResponse(savedProject);
    }
    
    // Update project
    @Transactional
    public ProjectDetailResponse updateProjectDetail(String code, ProjectDetailRequest request, String userId) {
        ProjectDetail project = projectDetailRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Detail not found with code: " + code));
        
        // Validation
        validateProjectDetailRequest(request);
        
        // Check if short name is already used by another project
        projectDetailRepository.findByMissionProjectShortName(request.getMissionProjectShortName())
                .ifPresent(existing -> {
                    if (!existing.getMissionProjectCode().equals(code)) {
                        throw new RuntimeException("Project with short name " + request.getMissionProjectShortName() + " already exists");
                    }
                });
        
        project.setMissionProjectFullName(request.getMissionProjectFullName());
        project.setMissionProjectShortName(request.getMissionProjectShortName());
        project.setMissionProjectDescription(request.getMissionProjectDescription());
        project.setProjectCategoryCode(request.getProjectCategoryCode());
        project.setBudgetCode(request.getBudgetCode());
        project.setProjectTypesCode(request.getProjectTypesCode());
        project.setSanctionedAuthority(request.getSanctionedAuthority());
        project.setIndividualCombinedSanctionCost(request.getIndividualCombinedSanctionCost());
        project.setSanctionedCost(request.getSanctionedCost());
        project.setDateOffs(request.getDateOffs());
        project.setDurationInMonths(request.getDurationInMonths());
        project.setOriginalSchedule(request.getOriginalSchedule());
        project.setFsCopy(request.getFsCopy());
        project.setMissionProjectDirector(request.getMissionProjectDirector());
        project.setProgrammeDirector(request.getProgrammeDirector());
        project.setCumExpUpToPrevFy(request.getCumExpUpToPrevFy());
        project.setCurYrExp(request.getCurYrExp());
        project.setCurrentStatusPercentage(request.getCurrentStatusPercentage());
        project.setCurrentStatus(request.getCurrentStatus());
        project.setCurrentStatusRemarks(request.getCurrentStatusRemarks());
        
        ProjectDetail updatedProject = projectDetailRepository.save(project);
        log.info("Project Detail updated successfully: {}", updatedProject.getMissionProjectCode());
        
        return convertToResponse(updatedProject);
    }
    
    // Delete project
    @Transactional
    public void deleteProjectDetail(String code) {
        ProjectDetail project = projectDetailRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Project Detail not found with code: " + code));
        
        projectDetailRepository.delete(project);
        log.info("Project Detail deleted: {}", code);
    }
    
    // Validation method
    private void validateProjectDetailRequest(ProjectDetailRequest request) {
        if (request.getMissionProjectFullName() == null || request.getMissionProjectFullName().trim().isEmpty()) {
            throw new RuntimeException("Project Full Name is required");
        }
        
        if (request.getMissionProjectShortName() == null || request.getMissionProjectShortName().trim().isEmpty()) {
            throw new RuntimeException("Project Short Name is required");
        }
        
        if (request.getMissionProjectDescription() == null || request.getMissionProjectDescription().trim().isEmpty()) {
            throw new RuntimeException("Project Description is required");
        }
        
        if (request.getProjectCategoryCode() == null || request.getProjectCategoryCode().trim().isEmpty()) {
            throw new RuntimeException("Project Category Code is required");
        }
        
        if (request.getBudgetCode() == null || request.getBudgetCode().trim().isEmpty()) {
            throw new RuntimeException("Budget Code is required");
        }
        
        if (request.getProjectTypesCode() == null || request.getProjectTypesCode().trim().isEmpty()) {
            throw new RuntimeException("Project Types Code is required");
        }
        
        if (request.getSanctionedAuthority() == null || request.getSanctionedAuthority().trim().isEmpty()) {
            throw new RuntimeException("Sanctioned Authority is required");
        }
        
        if (request.getIndividualCombinedSanctionCost() == null || request.getIndividualCombinedSanctionCost().trim().isEmpty()) {
            throw new RuntimeException("Individual/Combined Sanction Cost is required");
        }
        
        if (request.getSanctionedCost() == null) {
            throw new RuntimeException("Sanctioned Cost is required");
        }
        
        if (request.getDateOffs() == null) {
            throw new RuntimeException("Date of File Submission is required");
        }
        
        if (request.getOriginalSchedule() == null) {
            throw new RuntimeException("Original Schedule is required");
        }
        
        if (request.getMissionProjectDirector() == null || request.getMissionProjectDirector().trim().isEmpty()) {
            throw new RuntimeException("Mission Project Director is required");
        }
        
        if (request.getProgrammeDirector() == null || request.getProgrammeDirector().trim().isEmpty()) {
            throw new RuntimeException("Programme Director is required");
        }
        
        if (request.getCurrentStatus() == null || request.getCurrentStatus().trim().isEmpty()) {
            throw new RuntimeException("Current Status is required");
        }
    }
    
    private ProjectDetailResponse convertToResponse(ProjectDetail project) {
        return ProjectDetailResponse.builder()
                .missionProjectCode(project.getMissionProjectCode())
                .missionProjectFullName(project.getMissionProjectFullName())
                .missionProjectShortName(project.getMissionProjectShortName())
                .missionProjectDescription(project.getMissionProjectDescription())
                .projectCategoryCode(project.getProjectCategoryCode())
                .budgetCode(project.getBudgetCode())
                .projectTypesCode(project.getProjectTypesCode())
                .sanctionedAuthority(project.getSanctionedAuthority())
                .individualCombinedSanctionCost(project.getIndividualCombinedSanctionCost())
                .sanctionedCost(project.getSanctionedCost())
                .dateOffs(project.getDateOffs())
                .durationInMonths(project.getDurationInMonths())
                .originalSchedule(project.getOriginalSchedule())
                .fsCopy(project.getFsCopy())
                .missionProjectDirector(project.getMissionProjectDirector())
                .programmeDirector(project.getProgrammeDirector())
                .cumExpUpToPrevFy(project.getCumExpUpToPrevFy())
                .curYrExp(project.getCurYrExp())
                .currentStatusPercentage(project.getCurrentStatusPercentage())
                .currentStatus(project.getCurrentStatus())
                .currentStatusRemarks(project.getCurrentStatusRemarks())
                .userId(project.getUserId())
                .regStatus(project.getRegStatus())
                .regStage(project.getRegStage())
                .build();
    }
}
