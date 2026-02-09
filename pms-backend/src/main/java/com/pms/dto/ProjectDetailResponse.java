package com.pms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectDetailResponse {
    private String missionProjectCode;
    private String missionProjectFullName;
    private String missionProjectShortName;
    private String missionProjectDescription;
    private String budgetCode;
    private String programmeTypeCode;
    private String projectTypesCode;
    private String leadCentreCode;
    private String sanctionedAuthority;
    private String individualCombinedSanctionCost;
    private BigDecimal sanctionedCost;
    private LocalDate dateOffs;
    private Integer durationInMonths;
    private LocalDate originalSchedule;
    private String fsCopy;
    private String missionProjectDirector;
    private String programmeDirector;
    private BigDecimal cumExpUpToPrevFy;
    private BigDecimal curYrExp;
    private BigDecimal cumulativeExpenditureToDate;
    private Integer currentStatusPercentage;
    private String currentStatus;
    private String currentStatusRemarks;
    private String userId;
    private String regStatus;
    private LocalDateTime regTime;
    private String costOverrunApproval;
    private BigDecimal revisedSanctionedCost;
    private String timeOverrunApproval;
    private LocalDate revisedDateOffs;
    private LocalDate revisedCompletionDate;
}
