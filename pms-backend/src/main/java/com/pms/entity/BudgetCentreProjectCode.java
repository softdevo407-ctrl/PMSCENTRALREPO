package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgetcentreprojectcodes", schema = "bmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(BudgetCentreProjectCodeId.class)
public class BudgetCentreProjectCode {
    
    @Id
    @Column(name = "centreprojectcode", length = 2)
    private String centreProjectCode;
    
    @Id
    @Column(name = "centreproject", length = 1)
    private String centreProject;
    
    @Column(name = "budgetcentreprojectfullname", nullable = false, length = 255)
    private String budgetCentreProjectFullName;
    
    @Column(name = "budgetcentresprojecthortname", nullable = false, length = 20)
    private String budgetCentreProjectShortName;
    
    @Column(name = "fromdate", nullable = false)
    private LocalDate fromDate;
    
    @Column(name = "todate")
    private LocalDate toDate;
    
    @Column(name = "userid", nullable = false, length = 7)
    private String userId;
    
    @Column(name = "regstatus", nullable = false, length = 1)
    private String regStatus;
    
    @Column(name = "regtime")
    private LocalDate regTime;
    
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
    
    @Transient
    public boolean isActive() {
        return this.toDate == null || this.toDate.isAfter(LocalDate.now());
    }
}
