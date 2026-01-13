package com.pms.service;

import com.pms.dto.ProjectDefinitionRequest;
import com.pms.dto.ProjectDefinitionResponse;
import com.pms.entity.ProjectDefinition;
import com.pms.entity.User;
import com.pms.entity.ProjectStatus;
import com.pms.repository.ProjectDefinitionRepository;
import com.pms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectDefinitionService {
    private final ProjectDefinitionRepository projectDefinitionRepository;
    private final UserRepository userRepository;

    public List<ProjectDefinitionResponse> getAllProjects() {
        return projectDefinitionRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectDefinitionResponse> getProjectsByProjectDirector(Long projectDirectorId) {
        User projectDirector = userRepository.findById(projectDirectorId)
                .orElseThrow(() -> new RuntimeException("Project Director not found"));
        
        return projectDefinitionRepository.findByProjectDirector(projectDirector)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectDefinitionResponse> getProjectsByProgrammeDirector(Long programmeDirId) {
        User programmeDirector = userRepository.findById(programmeDirId)
                .orElseThrow(() -> new RuntimeException("Programme Director not found"));
        
        return projectDefinitionRepository.findByProgrammeDirector(programmeDirector)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectDefinitionResponse> getProjectsByProgrammeId(Long programmeId) {
        return projectDefinitionRepository.findByProgrammeId(programmeId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getProjectsByCategory(String category) {
        List<ProjectDefinition> projects = projectDefinitionRepository.findByCategory(category);
        
        Map<String, Object> result = new HashMap<>();
        result.put("category", category);
        result.put("total", (long) projects.size());
        result.put("onTrack", projects.stream().filter(p -> p.getStatus() == ProjectStatus.ON_TRACK).count());
        result.put("atRisk", projects.stream().filter(p -> p.getStatus() == ProjectStatus.AT_RISK).count());
        result.put("delayed", projects.stream().filter(p -> p.getStatus() == ProjectStatus.DELAYED).count());
        result.put("completed", projects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count());
        
        return result;
    }

    public List<Map<String, Object>> getAllCategoryStats() {
        String[] categories = {
            "Launch Vehicles",
            "Space Crafts",
            "Infrastructure",
            "Advanced R&D",
            "User Funded Projects"
        };
        
        return Arrays.stream(categories)
                .map(this::getProjectsByCategory)
                .collect(Collectors.toList());
    }

    public ProjectDefinitionResponse getProjectById(Long id) {
        ProjectDefinition project = projectDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToResponse(project);
    }

    @Transactional
    public ProjectDefinitionResponse createProject(ProjectDefinitionRequest request, Long projectDirectorId) {
        // Accept director IDs from request directly without validation
        User projectDirector = null;
        User programmeDirector = null;
        
        // Create User objects with IDs directly (no database lookup)
        if (request.getProjectDirectorId() != null) {
            projectDirector = new User();
            projectDirector.setId(request.getProjectDirectorId());
        }
        
        if (request.getProgrammeDirectorId() != null) {
            programmeDirector = new User();
            programmeDirector.setId(request.getProgrammeDirectorId());
        }
        
        // Parse end date
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        LocalDate endDate = LocalDate.parse(request.getEndDate(), formatter);

        ProjectDefinition project = ProjectDefinition.builder()
                .projectName(request.getProjectName())
                .shortName(request.getShortName())
                .programmeName(request.getProgrammeName())
                .programmeId(request.getProgrammeId())
                .projectType(request.getProjectType())
                .category(request.getCategory())
                .budgetCode(request.getBudgetCode())
                .leadCentre(request.getLeadCentre())
                .projectDirector(projectDirector)
                .programmeDirector(programmeDirector)
                .sanctionedAmount(request.getSanctionedAmount())
                .sanctionedDate(LocalDate.now())
                .endDate(endDate)
                .projectDocumentPath(request.getProjectDocumentPath())
                .status(ProjectStatus.ON_TRACK)
                .createdDate(LocalDateTime.now())
                .build();

        ProjectDefinition savedProject = projectDefinitionRepository.save(project);
        log.info("Project created successfully: {}", savedProject.getShortName());
        
        return convertToResponse(savedProject);
    }

    @Transactional
    public ProjectDefinitionResponse updateProject(Long id, ProjectDefinitionRequest request) {
        ProjectDefinition project = projectDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setProjectName(request.getProjectName());
        project.setShortName(request.getShortName());
        project.setProgrammeName(request.getProgrammeName());
        project.setProgrammeId(request.getProgrammeId());
        project.setProjectType(request.getProjectType());
        project.setCategory(request.getCategory());
        project.setBudgetCode(request.getBudgetCode());
        project.setLeadCentre(request.getLeadCentre());
        project.setSanctionedAmount(request.getSanctionedAmount());
        project.setProjectDocumentPath(request.getProjectDocumentPath());
        
        // Update directors from request without validation (employee directory not migrated yet)
        if (request.getProjectDirectorId() != null) {
            User projectDirector = userRepository.findById(request.getProjectDirectorId()).orElse(null);
            project.setProjectDirector(projectDirector);
        }
        
        if (request.getProgrammeDirectorId() != null) {
            User programmeDirector = userRepository.findById(request.getProgrammeDirectorId()).orElse(null);
            project.setProgrammeDirector(programmeDirector);
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        project.setEndDate(LocalDate.parse(request.getEndDate(), formatter));

        ProjectDefinition updatedProject = projectDefinitionRepository.save(project);
        log.info("Project updated successfully: {}", updatedProject.getShortName());
        
        return convertToResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        ProjectDefinition project = projectDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        projectDefinitionRepository.delete(project);
        log.info("Project deleted successfully: {}", project.getShortName());
    }

    @Transactional
    public ProjectDefinitionResponse createProjectWithFile(String projectDataJson, Long userId, String documentPath) {
        try {
            // Parse JSON to ProjectDefinitionRequest
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ProjectDefinitionRequest request = mapper.readValue(projectDataJson, ProjectDefinitionRequest.class);
            request.setProjectDocumentPath(documentPath);
            return createProject(request, userId);
        } catch (Exception e) {
            log.error("Error parsing project data", e);
            throw new RuntimeException("Error processing project data: " + e.getMessage());
        }
    }

    @Transactional
    public ProjectDefinitionResponse updateProjectWithFile(Long id, String projectDataJson, String documentPath) {
        try {
            // Parse JSON to ProjectDefinitionRequest
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ProjectDefinitionRequest request = mapper.readValue(projectDataJson, ProjectDefinitionRequest.class);
            if (documentPath != null) {
                request.setProjectDocumentPath(documentPath);
            }
            return updateProject(id, request);
        } catch (Exception e) {
            log.error("Error parsing project data", e);
            throw new RuntimeException("Error processing project data: " + e.getMessage());
        }
    }

    private ProjectDefinitionResponse convertToResponse(ProjectDefinition project) {
        return ProjectDefinitionResponse.builder()
                .id(project.getId())
                .projectName(project.getProjectName())
                .shortName(project.getShortName())
                .programmeName(project.getProgrammeName())
                .programmeId(project.getProgrammeId())
                .projectType(project.getProjectType())
                .category(project.getCategory())
                .budgetCode(project.getBudgetCode())
                .leadCentre(project.getLeadCentre())
                .projectDirectorId(project.getProjectDirector() != null ? project.getProjectDirector().getId() : null)
                .projectDirectorName(project.getProjectDirector() != null ? project.getProjectDirector().getFullName() : null)
                .programmeDirId(project.getProgrammeDirector() != null ? project.getProgrammeDirector().getId() : null)
                .programmeDirectorName(project.getProgrammeDirector() != null ? project.getProgrammeDirector().getFullName() : null)
                .sanctionedAmount(project.getSanctionedAmount())
                .revisedSanctionedAmount(project.getRevisedSanctionedAmount())
                .sanctionedDate(project.getSanctionedDate())
                .endDate(project.getEndDate())
                .revisedEndDate(project.getRevisedEndDate())
                .revisedDateRemarks(project.getRevisedDateRemarks())
                .revisedDateApprovedByChairman(project.getRevisedDateApprovedByChairman())
                .projectDocumentPath(project.getProjectDocumentPath())
                .status(project.getStatus().toString())
                .createdDate(project.getCreatedDate())
                .updatedDate(project.getUpdatedDate())
                .build();
    }
}
