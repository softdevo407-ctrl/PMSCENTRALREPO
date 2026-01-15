package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "programmeoffice", schema = "pmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeOffice {
    
    @Id
    @Column(name = "programmeofficecode", length = 5)
    private String programmeOfficeCode;
    
    @Column(name = "programmeofficefullname", nullable = false, length = 255)
    private String programmeOfficeFullName;
    
    @Column(name = "programmeofficeshortname", nullable = false, length = 50)
    private String programmeOfficeShortName;
    
    @Column(name = "hierarchyorder", nullable = false)
    private Integer hierarchyOrder;
    
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
