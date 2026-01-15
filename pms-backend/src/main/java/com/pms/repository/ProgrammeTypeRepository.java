package com.pms.repository;

import com.pms.entity.ProgrammeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammeTypeRepository extends JpaRepository<ProgrammeType, String> {
    
    @Query("SELECT p FROM ProgrammeType p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProgrammeType> findAllActive();
    
    @Query("SELECT p FROM ProgrammeType p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProgrammeType> findAllInactive();
    
    Optional<ProgrammeType> findByProgrammeTypeShortName(String shortName);
    
    List<ProgrammeType> findAllByOrderByHierarchyOrderAsc();
    
    List<ProgrammeType> findByProjectCategoryCode(String projectCategoryCode);
}
