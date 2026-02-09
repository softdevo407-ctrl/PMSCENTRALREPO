package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projectactuals", schema = "pmsmaintables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectActuals {
    
    @EmbeddedId
    private ProjectActualsId id;
    
    @Column(name = "plannedcashflow", precision = 18, scale = 2)
    private BigDecimal plannedCashFlow;
    
    @Column(name = "votedgrant", precision = 18, scale = 2)
    private BigDecimal votedGrant;
    
    @Column(name = "revisedestimates", precision = 18, scale = 2)
    private BigDecimal revisedEstimates;
    
    @Column(name = "actualexpenditure", precision = 18, scale = 2)
    private BigDecimal actualExpenditure;
    
    @Column(name = "userid", length = 7, nullable = false)
    private String userId;
    
    @Column(name = "regstatus", length = 1, nullable = false)
    private String regStatus;
    
    @Column(name = "regtime", nullable = false, updatable = false)
    private LocalDateTime regTime;
    
    // Convenience getters for id components
    public String getMissionProjectCode() {
        return id != null ? id.getMissionProjectCode() : null;
    }
    
    public Integer getBudgetYear() {
        return id != null ? id.getBudgetYear() : null;
    }
    
    @PrePersist
    protected void onCreate() {
        if (regTime == null) {
            regTime = LocalDateTime.now();
        }
    }
}

