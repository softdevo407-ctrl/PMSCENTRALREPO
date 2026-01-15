package com.pms.repository;

import com.pms.entity.ProjectDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectDetailRepository extends JpaRepository<ProjectDetail, String> {
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.regStatus = 'R' ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findAllActive();
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.missionProjectDirector = ?1 ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findByMissionProjectDirector(String directorId);
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.programmeDirector = ?1 ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findByProgrammeDirector(String programmeDirectorId);
    
    @Query("SELECT p FROM ProjectDetail p ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findAllOrderByCodeDesc();
    
    Optional<ProjectDetail> findByMissionProjectShortName(String shortName);
    
    @Query("SELECT MAX(CAST(SUBSTRING(p.missionProjectCode, 6) AS integer)) FROM ProjectDetail p WHERE p.missionProjectCode LIKE ?1%")
    Optional<Integer> findMaxSequenceByYear(String yearPrefix);
}
