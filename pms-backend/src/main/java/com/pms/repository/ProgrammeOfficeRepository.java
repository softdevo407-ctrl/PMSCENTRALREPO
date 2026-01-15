package com.pms.repository;

import com.pms.entity.ProgrammeOffice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgrammeOfficeRepository extends JpaRepository<ProgrammeOffice, String> {
    
    @Query("SELECT p FROM ProgrammeOffice p WHERE p.toDate IS NULL OR p.toDate > CURRENT_DATE")
    List<ProgrammeOffice> findAllActive();
    
    @Query("SELECT p FROM ProgrammeOffice p WHERE p.toDate IS NOT NULL AND p.toDate <= CURRENT_DATE")
    List<ProgrammeOffice> findAllInactive();
    
    Optional<ProgrammeOffice> findByProgrammeOfficeShortName(String shortName);
    
    List<ProgrammeOffice> findAllByOrderByHierarchyOrderAsc();
}
