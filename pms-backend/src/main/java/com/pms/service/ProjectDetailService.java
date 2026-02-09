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
        
        // Find all project codes for this year
        List<ProjectDetail> yearProjects = projectDetailRepository.findProjectCodesByYear(yearPrefix);
        
        int nextSequence = 1;
        if (!yearProjects.isEmpty()) {
            // Extract sequence numbers and find max
            int maxSequence = yearProjects.stream()
                    .map(p -> {
                        String code = p.getMissionProjectCode();
                        try {
                            // Code format: YEARP001 - extract the numeric part
                            String numPart = code.substring(5);
                            return Integer.parseInt(numPart);
                        } catch (Exception e) {
                            return 0;
                        }
                    })
                    .max(Integer::compareTo)
                    .orElse(0);
            nextSequence = maxSequence + 1;
        }
        
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
    
    // Helper method to check if a project is delayed (same logic as frontend)
    private boolean isProjectDelayed(ProjectDetail project) {
        try {
            // If timeOverrunApproval = 'YES' and revisedCompletionDate exists, use that instead
            java.time.LocalDate scheduleToCheck = null;
            
            if ("YES".equals(project.getTimeOverrunApproval()) && project.getRevisedCompletionDate() != null) {
                scheduleToCheck = project.getRevisedCompletionDate();
            } else if (project.getOriginalSchedule() != null) {
                scheduleToCheck = project.getOriginalSchedule();
            }
            
            if (scheduleToCheck != null) {
                java.time.LocalDate today = java.time.LocalDate.now();
                // If schedule date is less than or equal to today, it's delayed
                // Only future dates (after today) are on-track
                if (!scheduleToCheck.isAfter(today)) {
                    return true;  // delayed
                }
                return false;  // on-track
            }
        } catch (Exception e) {
            log.warn("Error checking project delay status for project {}: {}", project.getMissionProjectCode(), e.getMessage());
        }
        
        // Fallback: if durationInMonths > 0 treat as delayed (legacy behavior)
        return (project.getDurationInMonths() != null && project.getDurationInMonths() > 0);
    }

    public Object getCategoryStats() {
        // Get all categories from database
        List<ProjectCategory> allCategories = projectCategoryRepository.findAll();
        
        // Get all projects and group by category
        List<ProjectDetail> projects = projectDetailRepository.findAllOrderByCodeDesc();
        
        Map<String, List<ProjectDetail>> groupedByCategory = projects.stream()
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
                        }
                ));
        
        // Create stats for all categories, including those with no projects
        List<CategoryStatDTO> categoryStats = allCategories.stream()
                .map(category -> {
                    String categoryCode = category.getProjectCategoryCode();
                    List<ProjectDetail> categoryProjects = groupedByCategory.getOrDefault(categoryCode, List.of());
                    
                    int totalCount = categoryProjects.size();
                    
                    // Calculate On Track vs Delayed using the same logic as frontend
                    int delayedCount = (int) categoryProjects.stream()
                            .filter(this::isProjectDelayed)
                            .count();
                    int onTrackCount = totalCount - delayedCount;
                    
                    log.info("📊 Category Stats: {} - Total={}, OnTrack={}, Delayed={}", 
                            category.getProjectCategoryFullName(), totalCount, onTrackCount, delayedCount);
                    
                    // Calculate total costs
                    double totalSanctionedCost = categoryProjects.stream()
                            .mapToDouble(p -> p.getSanctionedCost() != null ? p.getSanctionedCost().doubleValue() : 0.0)
                            .sum();

                    double totalCumulativeExpenditure = categoryProjects.stream()
                            .mapToDouble(p -> p.getCumExpUpToPrevFy() != null ? p.getCumExpUpToPrevFy().doubleValue() : 0.0)
                            .sum();
                    
                    return new CategoryStatDTO(
                            categoryCode,
                            category.getProjectCategoryFullName(),
                            category.getProjectCategoryShortName(),
                            totalCount,
                            onTrackCount,
                            delayedCount,
                            totalSanctionedCost,
                            totalCumulativeExpenditure
                    );
                })
                .collect(Collectors.toList());
        
        return Map.of("categories", categoryStats);
    }
    
    public Object getCategoryStatsByDirector(String employeeCode) {
        // Get all categories from database
        List<ProjectCategory> allCategories = projectCategoryRepository.findAll();
        
        // Get projects for this director
        List<ProjectDetail> projects = projectDetailRepository.findByMissionProjectDirectorOrProgrammeDirector(employeeCode, employeeCode);
        
        Map<String, List<ProjectDetail>> groupedByCategory = projects.stream()
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
                        }
                ));
        
        // Create stats for all categories, including those with no projects for this director
        List<CategoryStatDTO> categoryStats = allCategories.stream()
                .map(category -> {
                    String categoryCode = category.getProjectCategoryCode();
                    List<ProjectDetail> categoryProjects = groupedByCategory.getOrDefault(categoryCode, List.of());
                    
                    int totalCount = categoryProjects.size();
                    
                    // Calculate On Track vs Delayed using the same logic as frontend
                    int delayedCount = (int) categoryProjects.stream()
                            .filter(this::isProjectDelayed)
                            .count();
                    int onTrackCount = totalCount - delayedCount;
                    
                    log.info("📊 Director Category Stats: {} - Total={}, OnTrack={}, Delayed={}", 
                            category.getProjectCategoryFullName(), totalCount, onTrackCount, delayedCount);
                    
                    // Calculate total costs
                    double totalSanctionedCost = categoryProjects.stream()
                            .mapToDouble(p -> p.getSanctionedCost() != null ? p.getSanctionedCost().doubleValue() : 0.0)
                            .sum();

                    double totalCumulativeExpenditure = categoryProjects.stream()
                            .mapToDouble(p -> p.getCumExpUpToPrevFy() != null ? p.getCumExpUpToPrevFy().doubleValue() : 0.0)
                            .sum();
                    
                    return new CategoryStatDTO(
                            categoryCode,
                            category.getProjectCategoryFullName(),
                            category.getProjectCategoryShortName(),
                            totalCount,
                            onTrackCount,
                            delayedCount,
                            totalSanctionedCost,
                            totalCumulativeExpenditure
                    );
                })
                .collect(Collectors.toList());
        
        return Map.of("categories", categoryStats);
    }
    
    // Get projects by programmeTypeCode - derives projects from a specific programme type
    public List<ProjectDetailResponse> getProjectDetailsByProgrammeTypeCode(String programmeTypeCode) {
        log.info("Fetching project details for programme type: {}", programmeTypeCode);
        
        // Verify that the programme type exists and get its category
        ProgrammeType programmeType = programmeTypeRepository.findById(programmeTypeCode)
                .orElseThrow(() -> new RuntimeException("Programme Type not found with code: " + programmeTypeCode));
        
        log.info("Programme Type found: {} -> Category: {}", programmeTypeCode, programmeType.getProjectCategoryCode());
        
        // Fetch all projects for this programme type
        List<ProjectDetail> projects = projectDetailRepository.findByProgrammeTypeCode(programmeTypeCode);
        
        log.info("Found {} projects for programme type: {}", projects.size(), programmeTypeCode);
        
        return projects.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get projects by projectCategoryCode - derives projects from all programme types in that category
    public List<ProjectDetailResponse> getProjectDetailsByProjectCategoryCode(String projectCategoryCode) {
        log.info("Fetching project details for project category: {}", projectCategoryCode);
        
        // Fetch all projects for this project category (via programme type mapping)
        List<ProjectDetail> projects = projectDetailRepository.findByProjectCategoryCode(projectCategoryCode);
        
        log.info("Found {} projects for project category: {}", projects.size(), projectCategoryCode);
        
        return projects.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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
                .costOverrunApproval(project.getCostOverrunApproval())
                .revisedSanctionedCost(project.getRevisedSanctionedCost())
                .timeOverrunApproval(project.getTimeOverrunApproval())
                .revisedDateOffs(project.getRevisedDateOffs())
                .revisedCompletionDate(project.getRevisedCompletionDate())
                .build();
    }
}
