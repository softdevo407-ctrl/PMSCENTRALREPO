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
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.missionProjectDirector = ?1 OR p.programmeDirector = ?2 ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findByMissionProjectDirectorOrProgrammeDirector(String directorId, String programmeDirectorId);
    
    @Query("SELECT p FROM ProjectDetail p ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findAllOrderByCodeDesc();
    
    Optional<ProjectDetail> findByMissionProjectShortName(String shortName);
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.missionProjectCode LIKE ?1% ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findProjectCodesByYear(String yearPrefix);
    
    @Query("SELECT p FROM ProjectDetail p WHERE p.programmeTypeCode = ?1 ORDER BY p.missionProjectCode DESC")
    List<ProjectDetail> findByProgrammeTypeCode(String programmeTypeCode);
    
    @Query(value = "SELECT DISTINCT pd.* FROM pmsmaintables.projectdetails pd " +
           "INNER JOIN pmsgeneric.programmetypes pt ON pd.programmetypescode = pt.programmetypescode " +
           "WHERE pt.projectcategorycode = ?1 ORDER BY pd.missionprojectcode DESC", 
           nativeQuery = true)
    List<ProjectDetail> findByProjectCategoryCode(String projectCategoryCode);
}
