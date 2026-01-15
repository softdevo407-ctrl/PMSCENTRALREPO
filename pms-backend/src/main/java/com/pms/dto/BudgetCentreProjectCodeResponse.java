package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetCentreProjectCodeResponse {
    private String centreProjectCode;
    private String centreProject;
    private String budgetCentreProjectFullName;
    private String budgetCentreProjectShortName;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    private boolean active;
}
