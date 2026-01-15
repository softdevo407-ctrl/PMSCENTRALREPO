package com.pms.repository;

import com.pms.entity.BudgetCentreProjectCode;
import com.pms.entity.BudgetCentreProjectCodeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetCentreProjectCodeRepository extends JpaRepository<BudgetCentreProjectCode, BudgetCentreProjectCodeId> {
    
    @Query("SELECT b FROM BudgetCentreProjectCode b WHERE b.toDate IS NULL OR b.toDate > CURRENT_DATE")
    List<BudgetCentreProjectCode> findAllActive();
    
    @Query("SELECT b FROM BudgetCentreProjectCode b WHERE b.toDate IS NOT NULL AND b.toDate <= CURRENT_DATE")
    List<BudgetCentreProjectCode> findAllInactive();
    
    Optional<BudgetCentreProjectCode> findByBudgetCentreProjectShortName(String shortName);
    
    List<BudgetCentreProjectCode> findAllByOrderByCentreProjectCodeAsc();
    
    Optional<BudgetCentreProjectCode> findByCentreProjectCodeAndCentreProject(String centreProjectCode, String centreProject);
}
