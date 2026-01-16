package com.pms.repository;

import com.pms.entity.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectTypeRepository extends JpaRepository<ProjectType, String> {
    
    @Query("SELECT p FROM ProjectType p ORDER BY p.hierarchyOrder ASC")
    List<ProjectType> findAllByOrderByHierarchyOrderAsc();
    
    @Query("SELECT p FROM ProjectType p WHERE p.regStatus = 'A' AND (p.toDate IS NULL OR p.toDate >= CURRENT_DATE) ORDER BY p.hierarchyOrder ASC")
    List<ProjectType> findAllActive();
    
    @Query("SELECT p FROM ProjectType p WHERE p.regStatus != 'A' OR (p.toDate IS NOT NULL AND p.toDate < CURRENT_DATE) ORDER BY p.hierarchyOrder ASC")
    List<ProjectType> findAllInactive();
}
