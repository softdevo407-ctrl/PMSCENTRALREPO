package com.pms.repository;

import com.pms.entity.ProjectPhase;
import com.pms.entity.ProjectDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectPhaseRepository extends JpaRepository<ProjectPhase, Long> {
    List<ProjectPhase> findByProject(ProjectDefinition project);
    List<ProjectPhase> findByProjectId(Long projectId);
    Optional<ProjectPhase> findByIdAndProjectId(Long id, Long projectId);
}
