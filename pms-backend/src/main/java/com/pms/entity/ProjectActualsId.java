package com.pms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite ID for ProjectActuals entity
 * Uniquely identifies a record by project code + year combination
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectActualsId implements Serializable {
    
    @Column(name = "missionprojectcode", length = 50, nullable = false)
    private String missionProjectCode;
    
    @Column(name = "budgetyear", nullable = false)
    private Integer budgetYear;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectActualsId that = (ProjectActualsId) o;
        return Objects.equals(missionProjectCode, that.missionProjectCode) &&
               Objects.equals(budgetYear, that.budgetYear);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(missionProjectCode, budgetYear);
    }
}
