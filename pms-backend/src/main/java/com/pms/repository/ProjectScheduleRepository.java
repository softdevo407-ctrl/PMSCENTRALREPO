package com.pms.repository;

import com.pms.entity.ProjectSchedule;
import com.pms.entity.ProjectScheduleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectScheduleRepository extends JpaRepository<ProjectSchedule, ProjectScheduleId> {
    
    @Query("SELECT ps FROM ProjectSchedule ps WHERE ps.id.missionProjectCode = :projectCode ORDER BY ps.hierarchyOrder ASC")
    List<ProjectSchedule> findByMissionProjectCode(@Param("projectCode") String projectCode);
    
    @Query("SELECT ps FROM ProjectSchedule ps WHERE ps.id.missionProjectCode = :projectCode AND ps.scheduleParentCode = :parentCode ORDER BY ps.hierarchyOrder ASC")
    List<ProjectSchedule> findByProjectCodeAndParentCode(@Param("projectCode") String projectCode, @Param("parentCode") String parentCode);
    
    @Query("SELECT ps FROM ProjectSchedule ps WHERE ps.id.missionProjectCode = :projectCode AND ps.scheduleLevel = :level ORDER BY ps.hierarchyOrder ASC")
    List<ProjectSchedule> findByProjectCodeAndLevel(@Param("projectCode") String projectCode, @Param("level") Integer level);
    
    @Query("SELECT ps FROM ProjectSchedule ps WHERE ps.id.missionProjectCode = :projectCode AND ps.statusCode = :statusCode ORDER BY ps.hierarchyOrder ASC")
    List<ProjectSchedule> findByProjectCodeAndStatus(@Param("projectCode") String projectCode, @Param("statusCode") String statusCode);
}
