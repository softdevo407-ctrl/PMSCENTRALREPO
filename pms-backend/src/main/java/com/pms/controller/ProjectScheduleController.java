package com.pms.controller;

import com.pms.entity.ProjectSchedule;
import com.pms.entity.ProjectScheduleId;
import com.pms.service.ProjectScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/project-schedules")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProjectScheduleController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectScheduleController.class);
    
    @Autowired
    private ProjectScheduleService projectScheduleService;
    
    @PostMapping("/save")
    public ResponseEntity<?> saveProjectSchedule(@RequestBody ProjectSchedule projectSchedule) {
        try {
            ProjectSchedule saved = projectScheduleService.saveProjectSchedule(projectSchedule);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving project schedule: " + e.getMessage());
        }
    }
    
    @PostMapping("/update")
    public ResponseEntity<?> updateProjectSchedule(@RequestBody ProjectSchedule projectSchedule) {
        try {
            ProjectSchedule updated = projectScheduleService.updateProjectSchedule(projectSchedule);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating project schedule: " + e.getMessage());
        }
    }
    
    @GetMapping("/{projectCode}/{scheduleCode}")
    public ResponseEntity<?> getProjectSchedule(@PathVariable String projectCode, @PathVariable String scheduleCode) {
        try {
            Optional<ProjectSchedule> schedule = projectScheduleService.getProjectSchedule(projectCode, scheduleCode);
            if (schedule.isPresent()) {
                return ResponseEntity.ok(schedule.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching project schedule: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-project/{projectCode}")
    public ResponseEntity<?> getSchedulesByProjectCode(@PathVariable String projectCode) {
        try {
            logger.info("Fetching schedules for project code: {}", projectCode);
            List<ProjectSchedule> schedules = projectScheduleService.getSchedulesByProjectCode(projectCode);
            logger.info("Found {} schedules for project code: {}", schedules.size(), projectCode);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            logger.error("Error fetching schedules for project code: {}", projectCode, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching schedules: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-parent/{projectCode}/{parentCode}")
    public ResponseEntity<?> getSchedulesByProjectCodeAndParentCode(
            @PathVariable String projectCode,
            @PathVariable String parentCode) {
        try {
            List<ProjectSchedule> schedules = projectScheduleService.getSchedulesByProjectCodeAndParentCode(projectCode, parentCode);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching schedules: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-level/{projectCode}/{level}")
    public ResponseEntity<?> getSchedulesByProjectCodeAndLevel(
            @PathVariable String projectCode,
            @PathVariable Integer level) {
        try {
            List<ProjectSchedule> schedules = projectScheduleService.getSchedulesByProjectCodeAndLevel(projectCode, level);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching schedules: " + e.getMessage());
        }
    }
    
    @GetMapping("/by-status/{projectCode}/{statusCode}")
    public ResponseEntity<?> getSchedulesByProjectCodeAndStatus(
            @PathVariable String projectCode,
            @PathVariable String statusCode) {
        try {
            List<ProjectSchedule> schedules = projectScheduleService.getSchedulesByProjectCodeAndStatus(projectCode, statusCode);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching schedules: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{projectCode}/{scheduleCode}")
    public ResponseEntity<?> deleteProjectSchedule(
            @PathVariable String projectCode,
            @PathVariable String scheduleCode) {
        try {
            projectScheduleService.deleteProjectSchedule(projectCode, scheduleCode);
            return ResponseEntity.ok("Project schedule deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting project schedule: " + e.getMessage());
        }
    }
    
    @GetMapping("/exists/{projectCode}/{scheduleCode}")
    public ResponseEntity<?> existsProjectSchedule(
            @PathVariable String projectCode,
            @PathVariable String scheduleCode) {
        try {
            boolean exists = projectScheduleService.existsProjectSchedule(projectCode, scheduleCode);
            return ResponseEntity.ok(new ExistsResponse(exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error checking project schedule: " + e.getMessage());
        }
    }
    
    // Inner class for exists response
    static class ExistsResponse {
        public boolean exists;
        
        public ExistsResponse(boolean exists) {
            this.exists = exists;
        }
        
        public boolean isExists() {
            return exists;
        }
        
        public void setExists(boolean exists) {
            this.exists = exists;
        }
    }
}
