package com.pms.repository;

import com.pms.entity.MilestoneActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MilestoneActivityRepository extends JpaRepository<MilestoneActivity, Long> {
    List<MilestoneActivity> findByMilestoneId(Long milestoneId);
    Optional<MilestoneActivity> findByIdAndMilestoneId(Long id, Long milestoneId);
}
