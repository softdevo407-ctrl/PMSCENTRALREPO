package com.pms.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetCentreProjectCodeId implements Serializable {
    private String centreProjectCode;
    private String centreProject;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BudgetCentreProjectCodeId that = (BudgetCentreProjectCodeId) o;
        return Objects.equals(centreProjectCode, that.centreProjectCode) &&
               Objects.equals(centreProject, that.centreProject);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(centreProjectCode, centreProject);
    }
}
