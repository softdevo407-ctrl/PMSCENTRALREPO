package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDefinitionResponse {
    private Long id;
    private String projectName;
    private String shortName;
    private String programmeName;
    private Long programmeId;
    private String projectType;
    private String category;
    private String budgetCode;
    private String leadCentre;
    private Long projectDirectorId;
    private String projectDirectorName;
    private Long programmeDirId;
    private String programmeDirectorName;
    private Long sanctionedAmount;
    private Long revisedSanctionedAmount;
    private LocalDate sanctionedDate;
    private LocalDate endDate;
    private LocalDate revisedEndDate;
    private String revisedDateRemarks;
    private Boolean revisedDateApprovedByChairman;
    private String status;
    private String projectDocumentPath;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    
    // Time Overrun Fields
    private String timeOverrunApproval;
    private LocalDate revisedCompletionDate;
    private String userId;
    private LocalDateTime regTime;
}
