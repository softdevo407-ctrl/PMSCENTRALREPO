package com.pms.controller;

import com.pms.dto.ProjectPhaseRequest;
import com.pms.dto.ProjectPhaseResponse;
import com.pms.service.ProjectPhaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/phases")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProjectPhaseController {
    private final ProjectPhaseService projectPhaseService;

    @PostMapping
    public ResponseEntity<ProjectPhaseResponse> createPhase(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectPhaseRequest request) {
        log.info("Creating phase for project: {}", projectId);
        ProjectPhaseResponse response = projectPhaseService.createPhase(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectPhaseResponse>> getPhasesByProject(
            @PathVariable Long projectId) {
        log.info("Fetching phases for project: {}", projectId);
        List<ProjectPhaseResponse> phases = projectPhaseService.getPhasesByProject(projectId);
        return ResponseEntity.ok(phases);
    }

    @GetMapping("/{phaseId}")
    public ResponseEntity<ProjectPhaseResponse> getPhaseById(
            @PathVariable Long projectId,
            @PathVariable Long phaseId) {
        log.info("Fetching phase {} for project: {}", phaseId, projectId);
        ProjectPhaseResponse phase = projectPhaseService.getPhaseById(projectId, phaseId);
        return ResponseEntity.ok(phase);
    }

    @PutMapping("/{phaseId}")
    public ResponseEntity<ProjectPhaseResponse> updatePhase(
            @PathVariable Long projectId,
            @PathVariable Long phaseId,
            @Valid @RequestBody ProjectPhaseRequest request) {
        log.info("Updating phase {} for project: {}", phaseId, projectId);
        ProjectPhaseResponse response = projectPhaseService.updatePhase(projectId, phaseId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{phaseId}")
    public ResponseEntity<Void> deletePhase(
            @PathVariable Long projectId,
            @PathVariable Long phaseId) {
        log.info("Deleting phase {} for project: {}", phaseId, projectId);
        projectPhaseService.deletePhase(projectId, phaseId);
        return ResponseEntity.noContent().build();
    }
}
