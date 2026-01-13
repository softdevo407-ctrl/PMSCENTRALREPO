package com.pms.repository;

import com.pms.entity.PhaseMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhaseMilestoneRepository extends JpaRepository<PhaseMilestone, Long> {
    List<PhaseMilestone> findByPhaseId(Long phaseId);
    Optional<PhaseMilestone> findByIdAndPhaseId(Long id, Long phaseId);
}
