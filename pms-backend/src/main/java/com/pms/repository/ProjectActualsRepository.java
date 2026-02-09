package com.pms.repository;

import com.pms.entity.ProjectActuals;
import com.pms.entity.ProjectActualsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectActualsRepository extends JpaRepository<ProjectActuals, ProjectActualsId> {
    
    /**
     * Find all project actuals for a specific project code
     */
    @Query("SELECT pa FROM ProjectActuals pa WHERE pa.id.missionProjectCode = :missionProjectCode ORDER BY pa.id.budgetYear ASC")
    List<ProjectActuals> findByMissionProjectCode(@Param("missionProjectCode") String missionProjectCode);
    
    /**
     * Find project actuals for specific project and budget year
     */
    @Query("SELECT pa FROM ProjectActuals pa WHERE pa.id.missionProjectCode = :missionProjectCode AND pa.id.budgetYear = :budgetYear")
    Optional<ProjectActuals> findByMissionProjectCodeAndBudgetYear(
        @Param("missionProjectCode") String missionProjectCode,
        @Param("budgetYear") Integer budgetYear
    );
    
    /**
     * Get all distinct project codes with actuals data
     */
    @Query("SELECT DISTINCT pa.id.missionProjectCode FROM ProjectActuals pa ORDER BY pa.id.missionProjectCode ASC")
    List<String> findDistinctMissionProjectCodes();
    
    /**
     * Find all actuals for a budget year range
     */
    @Query("SELECT pa FROM ProjectActuals pa WHERE pa.id.budgetYear BETWEEN :startYear AND :endYear ORDER BY pa.id.missionProjectCode ASC, pa.id.budgetYear ASC")
    List<ProjectActuals> findByYearRange(@Param("startYear") Integer startYear, @Param("endYear") Integer endYear);
    
    /**
     * Get all actuals ordered by project code and budget year
     */
    @Query("SELECT pa FROM ProjectActuals pa ORDER BY pa.id.missionProjectCode ASC, pa.id.budgetYear ASC")
    List<ProjectActuals> findAllOrderedByProjectAndYear();
}
