package com.pms.service;

import com.pms.dto.ProjectPhaseRequest;
import com.pms.dto.ProjectPhaseResponse;
import com.pms.entity.*;
import com.pms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectPhaseService {
    private final ProjectPhaseRepository phaseRepository;
    private final PhaseMilestoneRepository milestoneRepository;
    private final MilestoneActivityRepository activityRepository;
    private final ProjectDefinitionRepository projectRepository;

    @Transactional
    public ProjectPhaseResponse createPhase(Long projectId, ProjectPhaseRequest request) {
        // Validate project exists
        ProjectDefinition project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Validate phase weight
        if (request.getPhaseWeight() < 0 || request.getPhaseWeight() > 100) {
            throw new RuntimeException("Phase weight must be between 0 and 100");
        }

        // Validate milestones
        if (request.getMilestones() == null || request.getMilestones().isEmpty()) {
            throw new RuntimeException("At least one milestone is required");
        }

        // Validate that end date is after start date for all milestones
        for (ProjectPhaseRequest.MilestoneRequest milestone : request.getMilestones()) {
            // Validate milestone dates are within project timeline
            LocalDate projectStart = project.getCreatedDate().toLocalDate();
            LocalDate projectEnd = project.getEndDate();

            if (milestone.getStartDate().isBefore(projectStart)) {
                throw new RuntimeException("Milestone start date cannot be before project start date");
            }
            if (milestone.getEndDate().isAfter(projectEnd)) {
                throw new RuntimeException("Milestone end date cannot be after project end date");
            }

            if (milestone.getEndDate().isBefore(milestone.getStartDate())) {
                throw new RuntimeException("Milestone end date must be after start date");
            }

            // Validate activities
            if (milestone.getActivities() == null || milestone.getActivities().isEmpty()) {
                throw new RuntimeException("Each milestone must have at least one activity");
            }

            // Validate activity dates and weights
            int activityWeightSum = 0;
            for (ProjectPhaseRequest.MilestoneRequest.ActivityRequest activity : milestone.getActivities()) {
                // Validate activity dates are within milestone dates
                if (activity.getStartDate().isBefore(milestone.getStartDate())) {
                    throw new RuntimeException("Activity start date cannot be before milestone start date");
                }
                if (activity.getEndDate().isAfter(milestone.getEndDate())) {
                    throw new RuntimeException("Activity end date cannot be after milestone end date");
                }
                if (activity.getEndDate().isBefore(activity.getStartDate())) {
                    throw new RuntimeException("Activity end date must be after start date");
                }

                activityWeightSum += activity.getActivityWeight();
            }

            if (activityWeightSum > 100) {
                throw new RuntimeException("Sum of activity weights cannot exceed 100");
            }
        }

        // Validate milestone weights sum
        int milestoneWeightSum = request.getMilestones().stream()
                .mapToInt(ProjectPhaseRequest.MilestoneRequest::getMilestoneWeight)
                .sum();
        if (milestoneWeightSum > 100) {
            throw new RuntimeException("Sum of milestone weights cannot exceed 100");
        }

        // Create phase
        ProjectPhase phase = ProjectPhase.builder()
                .project(project)
                .phaseName(request.getPhaseName())
                .phaseWeight(request.getPhaseWeight())
                .status("ACTIVE")
                .build();

        ProjectPhase savedPhase = phaseRepository.save(phase);
        log.info("Phase created for project {}: {}", projectId, request.getPhaseName());

        // Create milestones and activities
        List<PhaseMilestone> milestones = request.getMilestones().stream()
                .map(milestoneReq -> {
                    PhaseMilestone milestone = PhaseMilestone.builder()
                            .phase(savedPhase)
                            .milestoneName(milestoneReq.getMilestoneName())
                            .startDate(milestoneReq.getStartDate())
                            .endDate(milestoneReq.getEndDate())
                            .milestoneWeight(milestoneReq.getMilestoneWeight())
                            .status("ACTIVE")
                            .build();

                    PhaseMilestone savedMilestone = milestoneRepository.save(milestone);

                    // Create activities
                    List<MilestoneActivity> activities = milestoneReq.getActivities().stream()
                            .map(activityReq -> MilestoneActivity.builder()
                                    .milestone(savedMilestone)
                                    .activityName(activityReq.getActivityName())
                                    .activityWeight(activityReq.getActivityWeight())
                                    .startDate(activityReq.getStartDate().atStartOfDay())
                                    .endDate(activityReq.getEndDate().atStartOfDay())
                                    .description(activityReq.getDescription())
                                    .status("ACTIVE")
                                    .build())
                            .map(activityRepository::save)
                            .collect(Collectors.toList());

                    savedMilestone.setActivities(activities);
                    return savedMilestone;
                })
                .collect(Collectors.toList());

        savedPhase.setMilestones(milestones);
        return convertToResponse(savedPhase);
    }

    @Transactional(readOnly = true)
    public List<ProjectPhaseResponse> getPhasesByProject(Long projectId) {
        return phaseRepository.findByProjectId(projectId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectPhaseResponse getPhaseById(Long projectId, Long phaseId) {
        ProjectPhase phase = phaseRepository.findByIdAndProjectId(phaseId, projectId)
                .orElseThrow(() -> new RuntimeException("Phase not found"));
        return convertToResponse(phase);
    }

    @Transactional
    public ProjectPhaseResponse updatePhase(Long projectId, Long phaseId, ProjectPhaseRequest request) {
        ProjectPhase phase = phaseRepository.findByIdAndProjectId(phaseId, projectId)
                .orElseThrow(() -> new RuntimeException("Phase not found"));

        phase.setPhaseName(request.getPhaseName());
        phase.setPhaseWeight(request.getPhaseWeight());

        ProjectPhase updatedPhase = phaseRepository.save(phase);
        log.info("Phase updated: {}", phaseId);

        return convertToResponse(updatedPhase);
    }

    @Transactional
    public void deletePhase(Long projectId, Long phaseId) {
        ProjectPhase phase = phaseRepository.findByIdAndProjectId(phaseId, projectId)
                .orElseThrow(() -> new RuntimeException("Phase not found"));

        phaseRepository.delete(phase);
        log.info("Phase deleted: {}", phaseId);
    }

    private ProjectPhaseResponse convertToResponse(ProjectPhase phase) {
        return ProjectPhaseResponse.builder()
                .id(phase.getId())
                .projectId(phase.getProject().getId())
                .phaseName(phase.getPhaseName())
                .phaseWeight(phase.getPhaseWeight())
                .status(phase.getStatus())
                .createdDate(phase.getCreatedDate())
                .updatedDate(phase.getUpdatedDate())
                .milestones(phase.getMilestones() != null ? phase.getMilestones().stream()
                        .map(this::convertMilestoneToResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    private ProjectPhaseResponse.MilestoneResponse convertMilestoneToResponse(PhaseMilestone milestone) {
        return ProjectPhaseResponse.MilestoneResponse.builder()
                .id(milestone.getId())
                .phaseId(milestone.getPhase().getId())
                .milestoneName(milestone.getMilestoneName())
                .startDate(milestone.getStartDate())
                .endDate(milestone.getEndDate())
                .milestoneWeight(milestone.getMilestoneWeight())
                .status(milestone.getStatus())
                .createdDate(milestone.getCreatedDate())
                .updatedDate(milestone.getUpdatedDate())
                .activities(milestone.getActivities() != null ? milestone.getActivities().stream()
                        .map(this::convertActivityToResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    private ProjectPhaseResponse.MilestoneResponse.ActivityResponse convertActivityToResponse(MilestoneActivity activity) {
        return ProjectPhaseResponse.MilestoneResponse.ActivityResponse.builder()
                .id(activity.getId())
                .milestoneId(activity.getMilestone().getId())
                .activityName(activity.getActivityName())
                .activityWeight(activity.getActivityWeight())
                .status(activity.getStatus())
                .description(activity.getDescription())
                .createdDate(activity.getCreatedDate())
                .updatedDate(activity.getUpdatedDate())
                .build();
    }
}
