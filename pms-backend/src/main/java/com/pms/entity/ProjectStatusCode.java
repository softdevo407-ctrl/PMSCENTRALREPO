package com.pms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "projectstatuscode", schema = "pmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectStatusCode {
    
    @Id
    @Column(name = "projectstatuscode", length = 6)
    private String projectStatusCode;
    
    @Column(name = "projectstatusfullname", nullable = false, length = 255)
    private String projectStatusFullName;
    
    @Column(name = "projectstatusshortname", nullable = false, length = 50)
    private String projectStatusShortName;
    
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
}
