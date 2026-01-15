package com.pms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projectdetails", schema = "bmsmaintables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetail {
    
    @Id
    @Column(name = "missionprojectcode", length = 8)
    private String missionProjectCode;
    
    @Column(name = "missionprojectfullname", nullable = false, length = 255)
    private String missionProjectFullName;
    
    @Column(name = "missionprojectshortname", nullable = false, length = 50)
    private String missionProjectShortName;
    
    @Column(name = "missionprojectdescription", nullable = false, length = 50)
    private String missionProjectDescription;
    
    @Column(name = "projectcategorycode", nullable = false, length = 5)
    private String projectCategoryCode;
    
    @Column(name = "budgetcode", nullable = false, length = 9)
    private String budgetCode;
    
    @Column(name = "projecttypescode", nullable = false, length = 5)
    private String projectTypesCode;
    
    @Column(name = "sanctionedauthority", nullable = false, length = 50)
    private String sanctionedAuthority;
    
    @Column(name = "individualcombinedsanctioncost", nullable = false, length = 2)
    private String individualCombinedSanctionCost;
    
    @Column(name = "sanctionedcost", nullable = false, precision = 12, scale = 2)
    private BigDecimal sanctionedCost;
    
    @Column(name = "dateoffs", nullable = false)
    private LocalDate dateOffs;
    
    @Column(name = "durationinmonths")
    private Integer durationInMonths;
    
    @Column(name = "originalschedule", nullable = false)
    private LocalDate originalSchedule;
    
    @Column(name = "fscopy", length = 255)
    private String fsCopy;
    
    @Column(name = "missionprojectdirector", nullable = false, length = 7)
    private String missionProjectDirector;
    
    @Column(name = "programmedirector", nullable = false, length = 7)
    private String programmeDirector;
    
    @Column(name = "cumexpuptoprevfy", precision = 12, scale = 2)
    private BigDecimal cumExpUpToPrevFy;
    
    @Column(name = "curyrexp", precision = 12, scale = 2)
    private BigDecimal curYrExp;
    
    @Column(name = "currentstatuspercentage")
    private Integer currentStatusPercentage;
    
    @Column(name = "currentstatus", nullable = false, length = 2)
    private String currentStatus;
    
    @Column(name = "currentstatusremarks", length = 255)
    private String currentStatusRemarks;
    
    @Column(name = "reviewremarks", length = 255)
    private String reviewRemarks;
    
    @Column(name = "costoverrunapproval", length = 3)
    private String costOverrunApproval;
    
    @Column(name = "timeoverrunapproval", length = 3)
    private String timeOverrunApproval;
    
    @Column(name = "costoverrunapprovalcopy", length = 255)
    private String costOverrunApprovalCopy;
    
    @Column(name = "timeoverrunapprovalcopy", length = 255)
    private String timeOverrunApprovalCopy;
    
    @Column(name = "revisedsanctionedcost", precision = 12, scale = 2)
    private BigDecimal revisedSanctionedCost;
    
    @Column(name = "reviseddateoffs")
    private LocalDate revisedDateOffs;
    
    @Column(name = "reviseddurationinmonths")
    private Integer revisedDurationInMonths;
    
    @Column(name = "revisedcompletiondate")
    private LocalDate revisedCompletionDate;
    
    @Column(name = "delayinmonths")
    private Integer delayInMonths;
    
    @Column(name = "delayremarks", length = 255)
    private String delayRemarks;
    
    @Column(name = "regstage", length = 5)
    private String regStage;
    
    @Column(name = "userid", nullable = false, length = 7)
    private String userId;
    
    @Column(name = "regstatus", nullable = false, length = 1)
    private String regStatus;
    
    @Column(name = "regtime", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regTime;
    
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
