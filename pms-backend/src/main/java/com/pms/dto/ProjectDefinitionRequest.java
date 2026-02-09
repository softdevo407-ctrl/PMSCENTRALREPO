package com.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDefinitionRequest {
    @NotBlank(message = "Project name is required")
    private String projectName;

    @NotBlank(message = "Short name is required")
    private String shortName;

    @NotBlank(message = "Programme name is required")
    private String programmeName;

    private Long programmeId;

    private String projectType;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Budget code is required")
    private String budgetCode;

    @NotBlank(message = "Lead centre is required")
    private String leadCentre;

    @Positive(message = "Sanctioned amount must be positive")
    private Long sanctionedAmount;

    @NotBlank(message = "End date is required")
    private String endDate;

    private Long programmeDirId;

    private Long programmeDirectorId;

    private Long projectDirectorId;

    private String projectDocumentPath;

    // Time Overrun Fields
    private String timeOverrunApproval;

    private String revisedCompletionDate;

    private String userId;

    private String regTime;
}
