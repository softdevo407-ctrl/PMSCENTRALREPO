package com.pms.service;

import com.pms.entity.ProjectSchedule;
import com.pms.entity.ProjectScheduleId;
import com.pms.repository.ProjectScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectScheduleService {
    
    @Autowired
    private ProjectScheduleRepository projectScheduleRepository;
    
    @Transactional
    public ProjectSchedule saveProjectSchedule(ProjectSchedule projectSchedule) {
        if (projectSchedule.getRegTime() == null) {
            projectSchedule.setRegTime(LocalDateTime.now());
        }
        return projectScheduleRepository.save(projectSchedule);
    }
    
    @Transactional
    public ProjectSchedule updateProjectSchedule(ProjectSchedule projectSchedule) {
        Optional<ProjectSchedule> existing = projectScheduleRepository.findById(projectSchedule.getId());
        if (existing.isPresent()) {
            ProjectSchedule ps = existing.get();
            ps.setScheduleLevel(projectSchedule.getScheduleLevel());
            ps.setScheduleParentCode(projectSchedule.getScheduleParentCode());
            ps.setNumberOfDaysToRealise(projectSchedule.getNumberOfDaysToRealise());
            ps.setScheduleStartDate(projectSchedule.getScheduleStartDate());
            ps.setScheduleEndDate(projectSchedule.getScheduleEndDate());
            ps.setWeight(projectSchedule.getWeight());
            ps.setStatusCode(projectSchedule.getStatusCode());
            ps.setHierarchyOrder(projectSchedule.getHierarchyOrder());
            ps.setRemarks(projectSchedule.getRemarks());
            ps.setCompletedWeight(projectSchedule.getCompletedWeight());
            ps.setCompletedDate(projectSchedule.getCompletedDate());
            ps.setRevisedScheduleStartDate(projectSchedule.getRevisedScheduleStartDate());
            ps.setRevisedScheduleEndDate(projectSchedule.getRevisedScheduleEndDate());
            ps.setUserId(projectSchedule.getUserId());
            ps.setRegStatus(projectSchedule.getRegStatus());
            return projectScheduleRepository.save(ps);
        }
        return saveProjectSchedule(projectSchedule);
    }
    
    public Optional<ProjectSchedule> getProjectSchedule(String projectCode, String scheduleCode) {
        return projectScheduleRepository.findById(new ProjectScheduleId(projectCode, scheduleCode));
    }
    
    public List<ProjectSchedule> getSchedulesByProjectCode(String projectCode) {
        return projectScheduleRepository.findByMissionProjectCode(projectCode);
    }
    
    public List<ProjectSchedule> getSchedulesByProjectCodeAndParentCode(String projectCode, String parentCode) {
        return projectScheduleRepository.findByProjectCodeAndParentCode(projectCode, parentCode);
    }
    
    public List<ProjectSchedule> getSchedulesByProjectCodeAndLevel(String projectCode, Integer level) {
        return projectScheduleRepository.findByProjectCodeAndLevel(projectCode, level);
    }
    
    public List<ProjectSchedule> getSchedulesByProjectCodeAndStatus(String projectCode, String statusCode) {
        return projectScheduleRepository.findByProjectCodeAndStatus(projectCode, statusCode);
    }
    
    @Transactional
    public void deleteProjectSchedule(String projectCode, String scheduleCode) {
        projectScheduleRepository.deleteById(new ProjectScheduleId(projectCode, scheduleCode));
    }
    
    public boolean existsProjectSchedule(String projectCode, String scheduleCode) {
        return projectScheduleRepository.existsById(new ProjectScheduleId(projectCode, scheduleCode));
    }
}
