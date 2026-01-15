package com.pms.repository;

import com.pms.entity.ProjectPhaseGeneric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectPhaseGenericRepository extends JpaRepository<ProjectPhaseGeneric, String> {
    
    @Query("SELECT p FROM ProjectPhaseGeneric p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProjectPhaseGeneric> findAllActive();
    
    @Query("SELECT p FROM ProjectPhaseGeneric p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProjectPhaseGeneric> findAllInactive();
    
    Optional<ProjectPhaseGeneric> findByProjectPhaseShortName(String shortName);
    
    List<ProjectPhaseGeneric> findAllByOrderByHierarchyOrderAsc();
}
