package com.pms.service;

import com.pms.dto.ProjectActualsRequest;
import com.pms.dto.ProjectActualsResponse;
import com.pms.entity.ProjectActuals;
import com.pms.entity.ProjectActualsId;
import com.pms.repository.ProjectActualsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectActualsService {
    
    private static final Logger log = LoggerFactory.getLogger(ProjectActualsService.class);
    
    @Autowired
    private ProjectActualsRepository projectActualsRepository;
    
    /**
     * Get all project actuals
     */
    public List<ProjectActualsResponse> getAllProjectActuals() {
        log.info("Fetching all project actuals");
        return projectActualsRepository.findAllOrderedByProjectAndYear().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get project actuals for a specific project code
     */
    public List<ProjectActualsResponse> getProjectActualsByCode(String missionProjectCode) {
        log.info("Fetching project actuals for code: {}", missionProjectCode);
        if (missionProjectCode == null || missionProjectCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Mission Project Code cannot be null or empty");
        }
        return projectActualsRepository.findByMissionProjectCode(missionProjectCode).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all distinct project codes with actuals data
     */
    public List<String> getDistinctProjectCodes() {
        log.info("Fetching distinct project codes with actuals");
        return projectActualsRepository.findDistinctMissionProjectCodes();
    }
    
    /**
     * Get project actuals for a specific year range
     */
    public List<ProjectActualsResponse> getProjectActualsByYearRange(Integer startYear, Integer endYear) {
        log.info("Fetching project actuals for year range: {} to {}", startYear, endYear);
        if (startYear == null || endYear == null) {
            throw new IllegalArgumentException("Start year and end year cannot be null");
        }
        if (startYear > endYear) {
            throw new IllegalArgumentException("Start year cannot be greater than end year");
        }
        return projectActualsRepository.findByYearRange(startYear, endYear).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    
    /**
     * Create or update project actuals
     */
    public ProjectActualsResponse saveProjectActuals(ProjectActualsRequest request) {
        log.info("Saving project actuals for: {} budget year {}", request.getMissionProjectCode(), request.getBudgetYear());
        validateRequest(request);
        
        ProjectActuals projectActuals = projectActualsRepository
                .findByMissionProjectCodeAndBudgetYear(request.getMissionProjectCode(), request.getBudgetYear())
                .orElse(null);
        
        if (projectActuals != null) {
            log.info("Updating existing project actuals record");
            projectActuals.setPlannedCashFlow(request.getPlannedCashFlow());
            projectActuals.setVotedGrant(request.getVotedGrant());
            projectActuals.setRevisedEstimates(request.getRevisedEstimates());
            projectActuals.setActualExpenditure(request.getActualExpenditure());
            projectActuals.setUserId(request.getUserId());
            projectActuals.setRegStatus(request.getRegStatus());
        } else {
            log.info("Creating new project actuals record");
            ProjectActualsId id = new ProjectActualsId(request.getMissionProjectCode(), request.getBudgetYear());
            projectActuals = ProjectActuals.builder()
                    .id(id)
                    .plannedCashFlow(request.getPlannedCashFlow())
                    .votedGrant(request.getVotedGrant())
                    .revisedEstimates(request.getRevisedEstimates())
                    .actualExpenditure(request.getActualExpenditure())
                    .userId(request.getUserId())
                    .regStatus(request.getRegStatus())
                    .build();
        }
        
        ProjectActuals saved = projectActualsRepository.save(projectActuals);
        log.info("Successfully saved project actuals with code: {}", saved.getMissionProjectCode());
        return convertToResponse(saved);
    }
    
    /**
     * Delete project actuals by project code and budget year
     */
    public void deleteProjectActuals(String missionProjectCode, Integer budgetYear) {
        log.info("Deleting project actuals for code: {} budget year: {}", missionProjectCode, budgetYear);
        ProjectActualsId id = new ProjectActualsId(missionProjectCode, budgetYear);
        if (!projectActualsRepository.existsById(id)) {
            throw new IllegalArgumentException("Project Actuals with code " + missionProjectCode + " and budget year " + budgetYear + " not found");
        }
        projectActualsRepository.deleteById(id);
        log.info("Successfully deleted project actuals for code: {} budget year: {}", missionProjectCode, budgetYear);
    }
    
    /**
     * Delete all project actuals for a specific project code
     */
    public void deleteByProjectCode(String missionProjectCode) {
        log.info("Deleting all project actuals for code: {}", missionProjectCode);
        List<ProjectActuals> actuals = projectActualsRepository.findByMissionProjectCode(missionProjectCode);
        if (actuals.isEmpty()) {
            throw new IllegalArgumentException("No project actuals found for code: " + missionProjectCode);
        }
        projectActualsRepository.deleteAll(actuals);
        log.info("Successfully deleted {} records for project code: {}", actuals.size(), missionProjectCode);
    }
    
    /**
     * Validate request data
     */
    private void validateRequest(ProjectActualsRequest request) {
        if (request.getMissionProjectCode() == null || request.getMissionProjectCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Mission Project Code is required");
        }
        if (request.getBudgetYear() == null || request.getBudgetYear() < 2000 || request.getBudgetYear() > 2100) {
            throw new IllegalArgumentException("Budget Year must be between 2000 and 2100");
        }
        if (request.getVotedGrant() == null) {
            throw new IllegalArgumentException("Voted Grant is required");
        }
        if (request.getRevisedEstimates() == null) {
            throw new IllegalArgumentException("Revised Estimates is required");
        }
        if (request.getActualExpenditure() == null) {
            throw new IllegalArgumentException("Actual Expenditure is required");
        }
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (request.getRegStatus() == null || request.getRegStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Registration Status is required");
        }
    }
    
    /**
     * Convert entity to response DTO
     */
    private ProjectActualsResponse convertToResponse(ProjectActuals entity) {
        return new ProjectActualsResponse(
                entity.getMissionProjectCode(),
                entity.getBudgetYear(),
                entity.getPlannedCashFlow(),
                entity.getVotedGrant(),
                entity.getRevisedEstimates(),
                entity.getActualExpenditure(),
                entity.getUserId(),
                entity.getRegStatus(),
                entity.getRegTime()
        );
    }
}
