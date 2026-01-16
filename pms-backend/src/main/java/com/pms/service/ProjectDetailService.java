package com.pms.service;

import com.pms.dto.CategoryStatDTO;
import com.pms.dto.ProjectDetailRequest;
import com.pms.dto.ProjectDetailResponse;
import com.pms.entity.ProjectDetail;
import com.pms.entity.ProgrammeType;
import com.pms.entity.ProjectCategory;
import com.pms.repository.ProjectDetailRepository;
import com.pms.repository.ProgrammeTypeRepository;
import com.pms.repository.ProjectCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectDetailService {
    
    private final ProjectDetailRepository projectDetailRepository;
    private final ProgrammeTypeRepository programmeTypeRepository;
    private final ProjectCategoryRepository projectCategoryRepository;
    
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
    
    // Get projects by Project Director OR Programme Director (for logged-in director)
    public List<ProjectDetailResponse> getProjectDetailsByDirectorOrProgrammeDirector(String employeeCode) {
        return projectDetailRepository.findByMissionProjectDirectorOrProgrammeDirector(employeeCode, employeeCode)
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
    
    // Create new project - auto-populate userId, regStatus, regTime
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
                .budgetCode(request.getBudgetCode())
                .programmeTypeCode(request.getProgrammeTypeCode())
                .projectTypesCode(request.getProjectTypesCode())
                .leadCentreCode(request.getLeadCentreCode())
                .sanctionedAuthority(request.getSanctionedAuthority())
                .individualCombinedSanctionCost(request.getIndividualCombinedSanctionCost())
                .sanctionedCost(request.getSanctionedCost())
                .dateOffs(request.getDateOffs())
                .durationInMonths(request.getDurationInMonths())
                .originalSchedule(request.getOriginalSchedule())
                .fsCopy(request.getFsCopy())
                .missionProjectDirector(request.getMissionProjectDirector())
                .programmeDirector(request.getProgrammeDirector())
                .userId(userId)  // Auto-populate with current user
                .regStatus("R")   // Auto-populate with "R"
                .regTime(LocalDateTime.now())  // Auto-populate with current time
                .build();
        
        ProjectDetail savedProject = projectDetailRepository.save(project);
        log.info("Project Detail created successfully: {} by user: {}", savedProject.getMissionProjectCode(), userId);
        
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
        
        ProjectDetail updatedProject = projectDetailRepository.save(project);
        log.info("Project Detail updated successfully: {} by user: {}", updatedProject.getMissionProjectCode(), userId);
        
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
    }
    
    public Object getCategoryStats() {
        List<ProjectDetail> projects = projectDetailRepository.findAllOrderByCodeDesc();
        
        Map<String, CategoryStatDTO> categoryStats = projects.stream()
                .collect(Collectors.groupingBy(
                        project -> {
                            // Get programme type for this project
                            if (project.getProgrammeTypeCode() != null) {
                                ProgrammeType programmeType = programmeTypeRepository.findById(project.getProgrammeTypeCode()).orElse(null);
                                if (programmeType != null && programmeType.getProjectCategoryCode() != null) {
                                    return programmeType.getProjectCategoryCode();
                                }
                            }
                            return "UNKNOWN";
                        },
                        Collectors.counting()
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            String categoryCode = entry.getKey();
                            long count = entry.getValue();
                            
                            // Fetch category details
                            ProjectCategory category = null;
                            if (!categoryCode.equals("UNKNOWN")) {
                                category = projectCategoryRepository.findById(categoryCode).orElse(null);
                            }
                            
                            return new CategoryStatDTO(
                                    categoryCode,
                                    category != null ? category.getProjectCategoryFullName() : "Unknown",
                                    category != null ? category.getProjectCategoryShortName() : "UNK",
                                    (int) count
                            );
                        }
                ));
        
        return Map.of("categories", categoryStats.values());
    }
    
    public Object getCategoryStatsByDirector(String employeeCode) {
        List<ProjectDetail> projects = projectDetailRepository.findByMissionProjectDirectorOrProgrammeDirector(employeeCode, employeeCode);
        
        Map<String, CategoryStatDTO> categoryStats = projects.stream()
                .collect(Collectors.groupingBy(
                        project -> {
                            // Get programme type for this project
                            if (project.getProgrammeTypeCode() != null) {
                                ProgrammeType programmeType = programmeTypeRepository.findById(project.getProgrammeTypeCode()).orElse(null);
                                if (programmeType != null && programmeType.getProjectCategoryCode() != null) {
                                    return programmeType.getProjectCategoryCode();
                                }
                            }
                            return "UNKNOWN";
                        },
                        Collectors.counting()
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            String categoryCode = entry.getKey();
                            long count = entry.getValue();
                            
                            // Fetch category details
                            ProjectCategory category = null;
                            if (!categoryCode.equals("UNKNOWN")) {
                                category = projectCategoryRepository.findById(categoryCode).orElse(null);
                            }
                            
                            return new CategoryStatDTO(
                                    categoryCode,
                                    category != null ? category.getProjectCategoryFullName() : "Unknown",
                                    category != null ? category.getProjectCategoryShortName() : "UNK",
                                    (int) count
                            );
                        }
                ));
        
        return Map.of("categories", categoryStats.values());
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class CategoryStatDTO {
        private String projectCategoryCode;
        private String projectCategoryFullName;
        private String projectCategoryShortName;
        private int projectCount;
    }
    
    private ProjectDetailResponse convertToResponse(ProjectDetail project) {
        // Calculate cumulative expenditure (previous FY + current year)
        java.math.BigDecimal cumulativeExpenditureToDate = java.math.BigDecimal.ZERO;
        if (project.getCumExpUpToPrevFy() != null) {
            cumulativeExpenditureToDate = cumulativeExpenditureToDate.add(project.getCumExpUpToPrevFy());
        }
        if (project.getCurYrExp() != null) {
            cumulativeExpenditureToDate = cumulativeExpenditureToDate.add(project.getCurYrExp());
        }
        
        return ProjectDetailResponse.builder()
                .missionProjectCode(project.getMissionProjectCode())
                .missionProjectFullName(project.getMissionProjectFullName())
                .missionProjectShortName(project.getMissionProjectShortName())
                .missionProjectDescription(project.getMissionProjectDescription())
                .budgetCode(project.getBudgetCode())
                .programmeTypeCode(project.getProgrammeTypeCode())
                .projectTypesCode(project.getProjectTypesCode())
                .leadCentreCode(project.getLeadCentreCode())
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
                .cumulativeExpenditureToDate(cumulativeExpenditureToDate)
                .currentStatusPercentage(project.getCurrentStatusPercentage())
                .currentStatus(project.getCurrentStatus())
                .currentStatusRemarks(project.getCurrentStatusRemarks())
                .userId(project.getUserId())
                .regStatus(project.getRegStatus())
                .regTime(project.getRegTime())
                .build();
    }
}
