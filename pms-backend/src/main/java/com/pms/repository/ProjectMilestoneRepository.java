package com.pms.repository;

import com.pms.entity.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, String> {
    
    @Query("SELECT p FROM ProjectMilestone p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProjectMilestone> findAllActive();
    
    @Query("SELECT p FROM ProjectMilestone p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProjectMilestone> findAllInactive();
    
    Optional<ProjectMilestone> findByProjectMilestoneShortName(String shortName);
    
    List<ProjectMilestone> findAllByOrderByHierarchyOrderAsc();
}
