package com.pms.repository;

import com.pms.entity.ProjectDefinition;
import com.pms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectDefinitionRepository extends JpaRepository<ProjectDefinition, Long> {
    List<ProjectDefinition> findByProjectDirector(User projectDirector);
    List<ProjectDefinition> findByProjectDirectorId(Long projectDirectorId);
    List<ProjectDefinition> findByProgrammeDirector(User programmeDirector);
    List<ProjectDefinition> findByProgrammeDirectorId(Long programmeDirectorId);
    List<ProjectDefinition> findByProgrammeId(Long programmeId);
    List<ProjectDefinition> findAll();
    Optional<ProjectDefinition> findByShortName(String shortName);
    List<ProjectDefinition> findByCategory(String category);
}
