package com.pms.repository;

import com.pms.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectCategoryRepository extends JpaRepository<ProjectCategory, String> {
    
    @Query("SELECT p FROM ProjectCategory p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProjectCategory> findAllActive();
    
    @Query("SELECT p FROM ProjectCategory p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProjectCategory> findAllInactive();
    
    Optional<ProjectCategory> findByProjectCategoryShortName(String shortName);
    
    List<ProjectCategory> findAllByOrderByHierarchyOrderAsc();
    
    List<ProjectCategory> findByShowOnDashboard(String showOnDashboard);
}
