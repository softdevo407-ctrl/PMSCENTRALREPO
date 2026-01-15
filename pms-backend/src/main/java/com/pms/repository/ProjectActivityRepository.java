package com.pms.repository;

import com.pms.entity.ProjectActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectActivityRepository extends JpaRepository<ProjectActivity, String> {
    
    @Query("SELECT p FROM ProjectActivity p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProjectActivity> findAllActive();
    
    @Query("SELECT p FROM ProjectActivity p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProjectActivity> findAllInactive();
    
    Optional<ProjectActivity> findByProjectActivityShortName(String shortName);
    
    List<ProjectActivity> findAllByOrderByHierarchyOrderAsc();
}
