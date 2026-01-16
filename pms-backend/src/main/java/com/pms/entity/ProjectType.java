package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "projecttypes", schema = "pmsgeneric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectType {
    
    @Id
    @Column(name = "projecttypescode", length = 5)
    private String projectTypesCode;
    
    @Column(name = "projecttypesfullname", length = 255, nullable = false)
    private String projectTypesFullName;
    
    @Column(name = "projecttypesshortname", length = 50, nullable = false)
    private String projectTypesShortName;
    
    @Column(name = "hierarchyorder", nullable = false)
    private Integer hierarchyOrder;
    
    @Column(name = "fromdate", nullable = false)
    private LocalDate fromDate;
    
    @Column(name = "todate")
    private LocalDate toDate;
    
    @Column(name = "userid", length = 7, nullable = false)
    private String userId;
    
    @Column(name = "regstatus", length = 1, nullable = false)
    private String regStatus;
    
    @Column(name = "regtime")
    private LocalDate regTime;
}
